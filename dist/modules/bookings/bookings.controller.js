"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingControllers = void 0;
const bookings_service_1 = require("./bookings.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
// booking creator 
const createBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await bookings_service_1.bookingServices.createBooking(req.body, req.user);
    const { booking, vehicle } = result;
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: "Booking created successfully",
        data: {
            ...booking,
            vehicle,
        },
    });
});
//get all bookings or own bookings
const getBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await bookings_service_1.bookingServices.getAllBookings(req.user);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "Bookings retrieved successfully",
        data: result,
    });
});
// update booking by admin or cancel booking by owner
const updateBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    console.log(req.user);
    if (req.user?.role === "admin") {
        const result = await bookings_service_1.bookingServices.adminUpdateBooking(req.params.bookingId, req.body);
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            message: "Booking marked as returned. Vehicle is now available",
            data: result,
        });
    }
    const result = await bookings_service_1.bookingServices.cancelBookingByOwner(req.params.bookingId, req.user?.id, req.body);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "Booking cancelled successfully",
        data: result,
    });
});
exports.bookingControllers = {
    createBooking,
    getBooking,
    updateBooking
};
