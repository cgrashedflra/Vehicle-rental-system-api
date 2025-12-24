import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { vehiclesServices } from "./vehicles.service";
import { Request, Response } from "express";

// create or add a new vehicle
const createVehicle = catchAsync(async (req: Request, res: Response) => {

    const payload = req.body;

    const result = await vehiclesServices.createVehicle(payload);

    return sendResponse(res, {
        statusCode: 201,
        message: "Vehicle created successfully",
        data: result.rows[0],
    });
});

// get all vehicles
const getVehicles = catchAsync(async (req: Request, res: Response) => {

    const result = await vehiclesServices.getVehicles();

    return sendResponse(res, {
        statusCode: 200,
        message: "Vehicles retrieved successfully",
        data: result.rows,
    });
});

// get single vehicle by id
const getSingleVehicle = catchAsync(async (req: Request, res: Response) => {

    const result = await vehiclesServices.getSingleVehicle(req.params.vehicleId as string);
return sendResponse(res, {
            statusCode: 200,
            message: "Vehicles retrieved successfully",
            data: result.rows[0]
        });
});

//update vehicle
const updateVehicle = catchAsync(async (req: Request, res: Response) => {

    const result = await vehiclesServices.updateVehicle(req.params.vehicleId as string, req.body);

        return sendResponse(res, {
            statusCode: 200,
            message: "Vehicles updated successfully",
            data: result.rows[0]
        });
});

// delete vehicles
const deleteVehicle = catchAsync(async (req: Request, res: Response) => {

    await vehiclesServices.deleteVehicle(req.params.vehicleId as string);

        return sendResponse(res, {
            statusCode: 200,
            message: "Vehicles deleted successfully",
        });
    }
)
 
export const vehicleControllers = {
createVehicle,
getVehicles,
getSingleVehicle,
updateVehicle,
deleteVehicle
};