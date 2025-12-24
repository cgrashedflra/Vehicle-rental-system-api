import { Request, Response } from "express";
import { bookingServices } from "./bookings.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

// booking creator 
const createBooking = catchAsync(async (req: Request, res: Response) => {

  const result = await bookingServices.createBooking(req.body, req.user!);

  const { booking, vehicle } = result;

  return sendResponse(res, {
    statusCode: 201,
    message: "Booking created successfully",
    data: {
      ...booking,
      vehicle,
    },
  });
});

//get all bookings or own bookings
const getBooking = catchAsync(async (req: Request, res: Response) => {

    const result = await bookingServices.getAllBookings(req.user!);

    return sendResponse(res, {
      statusCode: 200,
      message: "Bookings retrieved successfully",
      data: result,
    });
  
});

// update booking by admin or cancel booking by owner
const updateBooking = catchAsync(async (req: Request, res: Response) => {
console.log(req.user)
  if (req.user?.role === "admin") {
    const result = await bookingServices.adminUpdateBooking(req.params.bookingId as string, req.body);
    return sendResponse(res, {
      statusCode: 200,
      message: "Booking marked as returned. Vehicle is now available",
      data: result,
    });
  }

  const result = await bookingServices.cancelBookingByOwner(req.params.bookingId as string, req.user?.id as number, req.body);

  return sendResponse(res, {
      statusCode: 200,
      message: "Booking cancelled successfully",
      data: result,
    });
 
  
});

export const bookingControllers = {
  createBooking,
  getBooking,
  updateBooking
};
