"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const auth_service_1 = require("./auth.service");
const registerUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await auth_service_1.authServices.registerUser(req.body);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: "User registered successfully",
        data: user,
    });
});
const loginUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email, password } = req.body;
    const result = await auth_service_1.authServices.loginUser(email, password);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "login successful",
        data: result,
    });
});
exports.authControllers = {
    registerUser,
    loginUser
};
