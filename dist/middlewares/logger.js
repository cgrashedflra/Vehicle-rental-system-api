"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = (req, res, next) => {
    const startTime = Date.now();
    res.on("finish", () => {
        if (process.env.NODE_ENV !== "production") {
            const duration = Date.now() - startTime;
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
        }
    });
    next();
};
exports.default = logger;
