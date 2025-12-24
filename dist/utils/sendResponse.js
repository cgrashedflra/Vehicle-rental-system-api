"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, payload) => {
    res.status(payload.statusCode || 200).json({
        success: payload.success ?? true,
        message: payload.message,
        ...(payload.data !== undefined && { data: payload.data }),
    });
};
exports.sendResponse = sendResponse;
