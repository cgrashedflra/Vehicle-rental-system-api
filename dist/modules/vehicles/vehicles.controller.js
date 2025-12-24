"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const vehicles_service_1 = require("./vehicles.service");
// create or add a new vehicle
const createVehicle = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const result = await vehicles_service_1.vehiclesServices.createVehicle(payload);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: "Vehicle created successfully",
        data: result.rows[0],
    });
});
// get all vehicles
const getVehicles = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await vehicles_service_1.vehiclesServices.getVehicles();
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "Vehicles retrieved successfully",
        data: result.rows,
    });
});
// get single vehicle by id
const getSingleVehicle = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await vehicles_service_1.vehiclesServices.getSingleVehicle(req.params.vehicleId);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "Vehicles retrieved successfully",
        data: result.rows[0]
    });
});
//update vehicle
const updateVehicle = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await vehicles_service_1.vehiclesServices.updateVehicle(req.params.vehicleId, req.body);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "Vehicles updated successfully",
        data: result.rows[0]
    });
});
// delete vehicles
const deleteVehicle = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await vehicles_service_1.vehiclesServices.deleteVehicle(req.params.vehicleId);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "Vehicles deleted successfully",
    });
});
exports.vehicleControllers = {
    createVehicle,
    getVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
};
