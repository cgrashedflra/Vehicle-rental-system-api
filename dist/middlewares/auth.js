"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const ApiError_1 = require("../utils/ApiError");
const auth = (...roles) => {
    return (0, catchAsync_1.catchAsync)(async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError_1.ApiError(401, "You are not Authorized");
        }
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        }
        catch {
            throw new ApiError_1.ApiError(401, "Invalid or expired token");
        }
        if (!decoded.id || !decoded.role) {
            return (0, sendResponse_1.sendResponse)(res, {
                statusCode: 401,
                message: "Invalid token payload",
            });
        }
        req.user = {
            id: decoded.id,
            role: decoded.role,
        };
        if (roles.length && !roles.includes(req.user.role)) {
            return (0, sendResponse_1.sendResponse)(res, {
                statusCode: 403,
                message: "Access denied",
            });
        }
        next();
    });
};
exports.default = auth;
