import Express from "express";
import { bookingControllers } from "./bookings.controller";
import auth from "../../middlewares/auth";

const router = Express.Router();

router.post("/",auth("admin", "customer"), bookingControllers.createBooking);

router.get("/", auth("admin", "customer"), bookingControllers.getBooking);

router.put("/:bookingId", auth("admin", "customer"), bookingControllers.updateBooking);

export const bookingRoutes = router;