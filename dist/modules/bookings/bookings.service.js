"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingServices = void 0;
const DB_1 = require("../../config/DB");
const ApiError_1 = require("../../utils/ApiError");
// creating a booking
const createBooking = async (payload, user) => {
    const { vehicle_id, rent_start_date, rent_end_date, customer_id } = payload;
    if (user.role !== "admin" && user.id !== customer_id) {
        throw new ApiError_1.ApiError(403, "Forbidden, please try enter your own valid id");
    }
    const diffDays = (start, end) => {
        const days = (new Date(end).getTime() - new Date(start).getTime()) / 86400000;
        return Math.ceil(days);
    };
    const totalDays = diffDays(rent_start_date, rent_end_date);
    if (totalDays <= 0) {
        throw new ApiError_1.ApiError(400, "Invalid rental date range");
    }
    const client = await DB_1.pool.connect();
    try {
        await client.query("BEGIN");
        const vehicleRes = await client.query(`
      SELECT vehicle_name, daily_rent_price, availability_status
      FROM vehicles
      WHERE id = $1
      FOR UPDATE
      `, [vehicle_id]);
        if (vehicleRes.rowCount === 0) {
            throw new ApiError_1.ApiError(404, "Vehicle not found");
        }
        const vehicle = vehicleRes.rows[0];
        if (vehicle.availability_status !== "available") {
            throw new ApiError_1.ApiError(400, "Vehicle is not available");
        }
        const totalPrice = totalDays * vehicle.daily_rent_price;
        const bookingRes = await client.query(`
      INSERT INTO bookings (
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status
      )
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING id, 
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status
      `, [
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            totalPrice,
        ]);
        await client.query(`
      UPDATE vehicles
      SET availability_status = 'booked'
      WHERE id = $1
      `, [vehicle_id]);
        await client.query("COMMIT");
        return {
            booking: bookingRes.rows[0],
            vehicle: {
                vehicle_name: vehicle.vehicle_name,
                daily_rent_price: vehicle.daily_rent_price,
            },
        };
    }
    catch (error) {
        await client.query("ROLLBACK");
        if (error instanceof ApiError_1.ApiError) {
            throw error;
        }
        throw new ApiError_1.ApiError(500, "Booking failed");
    }
    finally {
        client.release();
    }
};
// getting all bookings list
const getAllBookings = async (user) => {
    const isAdmin = user.role === "admin";
    const query = `
    SELECT 
      b. id, 
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
      json_build_object(
        'name', u.name,
        'email', u.email
      ) AS customer,
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number,
        'type', v.type  -- We fetch 'type' here and filter it in JS if needed
      ) AS vehicle
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ${isAdmin ? "" : "WHERE b.customer_id = $1"}
  `;
    const values = isAdmin ? [] : [user.id];
    const { rows: bookings } = await DB_1.pool.query(query, values);
    return bookings.map((booking) => {
        if (isAdmin) {
            const { type, ...vehicleWithoutType } = booking.vehicle;
            return {
                ...booking,
                vehicle: vehicleWithoutType,
            };
        }
        else {
            const { customer, customer_id, ...customerView } = booking;
            return customerView;
        }
    });
};
//update bookings
const adminUpdateBooking = async (bookingId, payload) => {
    if (payload.status !== "returned") {
        throw new ApiError_1.ApiError(400, "Admin can only set booking status to returned");
    }
    const client = await DB_1.pool.connect();
    try {
        await client.query("BEGIN");
        const bookingRes = await client.query(`
      SELECT id, vehicle_id, status
      FROM bookings
      WHERE id = $1
      FOR UPDATE
      `, [bookingId]);
        if (bookingRes.rows.length === 0) {
            throw new ApiError_1.ApiError(404, "Booking not found");
        }
        if (bookingRes.rows[0].status !== "active") {
            throw new ApiError_1.ApiError(400, "Only active bookings can be returned");
        }
        const updatedBookingRes = await client.query(`
      UPDATE bookings
      SET status = 'returned'
      WHERE id = $1
      RETURNING id, 
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status
      `, [bookingId]);
        const vehicle = await client.query(`
      UPDATE vehicles
      SET availability_status = 'available'
      WHERE id = $1
      RETURNING availability_status
      `, [bookingRes.rows[0].vehicle_id]);
        await client.query("COMMIT");
        return {
            booking: updatedBookingRes.rows[0],
            vehicle: vehicle.rows[0]
        };
    }
    catch (error) {
        await client.query("ROLLBACK");
        if (error instanceof ApiError_1.ApiError) {
            throw error;
        }
        throw new ApiError_1.ApiError(500, "Failed to update booking");
    }
    finally {
        client.release();
    }
};
// cancel boooking by customer/owner.
const cancelBookingByOwner = async (bookingId, userId, payload) => {
    if (payload.status !== "cancelled") {
        throw new ApiError_1.ApiError(400, "Invalid request body. You can only cancel the booking.");
    }
    const client = await DB_1.pool.connect();
    try {
        await client.query("BEGIN");
        const bookingRes = await client.query(`
      SELECT id, customer_id, vehicle_id, status, rent_start_date
      FROM bookings
      WHERE id = $1
      FOR UPDATE
      `, [bookingId]);
        if (bookingRes.rowCount === 0) {
            throw new ApiError_1.ApiError(404, "Booking not found");
        }
        const booking = bookingRes.rows[0];
        if (userId !== booking.customer_id) {
            throw new ApiError_1.ApiError(403, "You do not own this booking");
        }
        if (booking.status !== "active" ||
            new Date(booking.rent_start_date) <= new Date()) {
            throw new ApiError_1.ApiError(400, "Only active bookings that have not started can be cancelled");
        }
        const updatedBookingRes = await client.query(`
      UPDATE bookings
      SET status = 'cancelled'
      WHERE id = $1 
      RETURNING id, 
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status
      `, [bookingId]);
        await client.query(`
      UPDATE vehicles
      SET availability_status = 'available'
      WHERE id = $1
      `, [booking.vehicle_id]);
        await client.query("COMMIT");
        return updatedBookingRes.rows[0];
    }
    catch (error) {
        await client.query("ROLLBACK");
        if (error instanceof ApiError_1.ApiError) {
            throw error;
        }
        throw new ApiError_1.ApiError(500, "Failed to cancel booking");
    }
    finally {
        client.release();
    }
};
exports.bookingServices = {
    createBooking,
    getAllBookings,
    adminUpdateBooking,
    cancelBookingByOwner
};
