import express from "express";
import { authControllers } from "./auth.controller";
const router = express.Router();

router.post("/signup", authControllers.registerUser);

router.post("/signin", authControllers.loginUser);

export const authRoutes = router;
