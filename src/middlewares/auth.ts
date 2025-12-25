import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { ApiError } from "../utils/ApiError";

type Role = "customer" | "admin";

interface DecodedToken {
  id: number;
  role: Role;
}

const auth = (...roles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "You are not authorized");
    }

    const tokenPart = authHeader.split(" ")[1];
    if (!tokenPart) {
      throw new ApiError(401, "Token missing");
    }

    const token: string = tokenPart;

    let decoded: DecodedToken;

    try {
      const result = jwt.verify(token, config.jwtSecret);

      if (typeof result === "string") {
        throw new ApiError(401, "Invalid token");
      }

      decoded = {
        id: result.id as number,
        role: result.role as Role,
      };
    } catch {
      throw new ApiError(401, "Invalid or expired token");
    }

    req.user = decoded;

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
