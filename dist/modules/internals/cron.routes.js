"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DB_1 = require("../../config/DB");
const config_1 = __importDefault(require("../../config"));
const router = (0, express_1.Router)();
router.post("/booking-status", async (req, res) => {
    if (req.headers["x-secret"] !== config_1.default.cron_Secret) {
        return res.sendStatus(401);
    }
    const result = await DB_1.pool.query(`
    UPDATE bookings
    SET status = 'returned'
    WHERE rent_end_date <= NOW()
    AND status = 'active';
  `);
    console.log("Updated rows:", result.rowCount);
    res.sendStatus(200);
});
exports.default = router;
