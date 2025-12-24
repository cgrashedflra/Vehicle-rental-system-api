import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { ApiError } from "../utils/ApiError";

const auth = (...roles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "You are not Authorized")
    }

    const token = authHeader.split(" ")[1];

    let decoded: jwt.JwtPayload;

    try {
      decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as unknown as jwt.JwtPayload;
    } catch {
      throw new ApiError(401, "Invalid or expired token")
    }

    if (!decoded.id || !decoded.role) {
      return sendResponse(res, {
        statusCode: 401,
        message: "Invalid token payload",
      });
    }
    req.user = {
      id: decoded.id as number,
      role: decoded.role as "customer" | "admin",
    };

    if (roles.length && !roles.includes(req.user.role)) {
      return sendResponse(res, {
        statusCode: 403,
        message: "Access denied",
      });
    }

    next();
  });
};

export default auth;

