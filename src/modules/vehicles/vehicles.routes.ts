import Express, { Request, Response } from "express";
import { vehicleControllers } from "./vehicles.controller";
import auth from "../../middlewares/auth";

const router = Express.Router();

router.post("/",auth("admin"), vehicleControllers.createVehicle);

router.get("/", vehicleControllers.getVehicles);

router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

router.put("/:vehicleId", auth("admin"), vehicleControllers.updateVehicle);

router.delete("/:vehicleId", auth("admin"), vehicleControllers.deleteVehicle) ;

export const vehicleRoutes = router;