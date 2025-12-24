import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import { UserPayload } from "../../types/payload types/Users.types";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  
  const user = await authServices.registerUser(req.body as UserPayload);

  return sendResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: user,
  });
});


const loginUser = catchAsync(async (req: Request, res: Response) => {

  const {email, password } = req.body;

      const result = await authServices.loginUser(email, password);

      return sendResponse(res, {
      statusCode: 200,
      message: "login successful",
      data: result,
    });
});

export const authControllers = {
    registerUser,
    loginUser
};