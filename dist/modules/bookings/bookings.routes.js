"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bookings_controller_1 = require("./bookings.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)("admin", "customer"), bookings_controller_1.bookingControllers.createBooking);
router.get("/", (0, auth_1.default)("admin", "customer"), bookings_controller_1.bookingControllers.getBooking);
router.put("/:bookingId", (0, auth_1.default)("admin", "customer"), bookings_controller_1.bookingControllers.updateBooking);
exports.bookingRoutes = router;
