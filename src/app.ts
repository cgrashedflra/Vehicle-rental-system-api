import express, { Request, Response } from "express";
import initDB from "./config/DB";
import logger from "./middlewares/logger";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/users.routes";
import cronRoutes from "./modules/internals/cron.routes";


const app = express();

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logger middleware
app.use(logger);

// "/" -> localhost:6780/
app.get("/", (req: Request, res: Response) => {
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
app.use("/api/v1/auth", authRoutes);

// //users RUD
app.use("/api/v1/users", userRoutes);

//vehicles CRUD
app.use("/api/v1/vehicles", vehicleRoutes);

//bookings CRU
app.use("/api/v1/bookings", bookingRoutes);

// system automated booking status updater
app.use("/internal/cron", cronRoutes);

// app.ts
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.use(globalErrorHandler);



export default app;