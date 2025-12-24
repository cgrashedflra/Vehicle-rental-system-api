"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const vehicles_controller_1 = require("./vehicles.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)("admin"), vehicles_controller_1.vehicleControllers.createVehicle);
router.get("/", vehicles_controller_1.vehicleControllers.getVehicles);
router.get("/:vehicleId", vehicles_controller_1.vehicleControllers.getSingleVehicle);
router.put("/:vehicleId", (0, auth_1.default)("admin"), vehicles_controller_1.vehicleControllers.updateVehicle);
router.delete("/:vehicleId", (0, auth_1.default)("admin"), vehicles_controller_1.vehicleControllers.deleteVehicle);
exports.vehicleRoutes = router;
