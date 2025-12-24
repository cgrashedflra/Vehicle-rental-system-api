import Express, { Request, Response } from "express";
import { userControllers } from "./users.controller";
import auth from "../../middlewares/auth";

const router = Express.Router();

router.get("/", auth("admin"), userControllers.getUsers);

router.put("/:userId", auth("admin", "customer"),userControllers.updateUser);

router.delete("/:userId", auth("admin"), userControllers.deleteUser);

export const userRoutes = router;