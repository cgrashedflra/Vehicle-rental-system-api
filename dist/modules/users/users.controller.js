"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const users_service_1 = require("./users.service");
const sendResponse_1 = require("../../utils/sendResponse");
const getUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await users_service_1.userServices.getUsers();
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "Users retrieved successfully",
        data: result
    });
});
const updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await users_service_1.userServices.updateUser(req.params.userId, req.body, req.user);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "User updated successfully",
        data: result
    });
});
const deleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await users_service_1.userServices.deleteUser(req.params.userId);
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "User deleted successfully"
    });
});
exports.userControllers = {
    getUsers,
    updateUser,
    deleteUser
};
