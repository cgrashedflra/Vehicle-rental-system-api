import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userServices } from "./users.service";
import { sendResponse } from "../../utils/sendResponse";


const getUsers = catchAsync( async (req: Request, res: Response) => {
    const result = await userServices.getUsers();
   return sendResponse(res, {
       statusCode: 200,
       message: "Users retrieved successfully",
       data: result
   });
});

const updateUser = catchAsync( async (req: Request, res: Response) => {

     const result = await userServices.updateUser(req.params.userId as string, req.body, req.user!);
    
     
        return sendResponse(res, {
          statusCode: 200,
          message: "User updated successfully",
          data: result
          })
      
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {

    await userServices.deleteUser(req.params.userId as string);

    return sendResponse(res, {
    statusCode: 200,
    message: "User deleted successfully"
  });
  
});

export const userControllers = {
    getUsers,
    updateUser,
    deleteUser
};