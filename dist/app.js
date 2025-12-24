"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./middlewares/logger"));
const vehicles_routes_1 = require("./modules/vehicles/vehicles.routes");
const bookings_routes_1 = require("./modules/bookings/bookings.routes");
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const auth_routes_1 = require("./modules/auth/auth.routes");
const users_routes_1 = require("./modules/users/users.routes");
const cron_routes_1 = __importDefault(require("./modules/internals/cron.routes"));
const app = (0, express_1.default)();
// parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// logger middleware
app.use(logger_1.default);
// "/" -> localhost:6780/
app.get("/", (req, res) => {
    res.json({
        message: "API is running",
        version: "1.0",
        routes: [
            "/api/v1/auth",
            "/api/v1/users",
            "/api/v1/vehicles",
            "/api/v1/bookings"
        ]
    });
});
//auth routes CR
app.use("/api/v1/auth", auth_routes_1.authRoutes);
// //users RUD
app.use("/api/v1/users", users_routes_1.userRoutes);
//vehicles CRUD
app.use("/api/v1/vehicles", vehicles_routes_1.vehicleRoutes);
//bookings CRU
app.use("/api/v1/bookings", bookings_routes_1.bookingRoutes);
// system automated booking status updater
app.use("/internal/cron", cron_routes_1.default);
// app.ts
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    });
});
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
