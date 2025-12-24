"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const DB_1 = require("../../config/DB");
const ApiError_1 = require("../../utils/ApiError");
const getUsers = async () => {
    const result = await DB_1.pool.query(`SELECT id, name, email, phone, role FROM users ORDER BY id DESC`);
    return result.rows;
};
const updateUser = async (id, payload, user) => {
    const targetId = Number(id);
    if (!Number.isInteger(targetId) || targetId <= 0) {
        throw new ApiError_1.ApiError(400, "Invalid id");
    }
    if (user.role === "customer" && user.id !== targetId) {
        throw new ApiError_1.ApiError(403, "Forbidden");
    }
    if (user.role === "customer" && payload.role === "admin") {
        throw new ApiError_1.ApiError(403, "You cannot promote yourself");
    }
    const { name, email, phone, role } = payload;
    const result = await DB_1.pool.query(`
    UPDATE users
    SET
      name  = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      role  = COALESCE($4, role)
    WHERE id = $5
    RETURNING id, name, email, phone, role;
    `, [name, email, phone, role, id]);
    if (result.rowCount === 0) {
        throw new ApiError_1.ApiError(404, "Account not found");
    }
    return result.rows[0];
};
const deleteUser = async (id) => {
    const activeBooking = await DB_1.pool.query(`
    SELECT 1
    FROM bookings
    WHERE customer_id = $1
      AND status = 'active'
    LIMIT 1
    `, [id]);
    if (activeBooking.rows.length > 0) {
        throw new ApiError_1.ApiError(409, "Cannot delete user with active booking");
    }
    const result = await DB_1.pool.query(`
    DELETE FROM users
    WHERE id = $1
    RETURNING id, email
    `, [id]);
    if (result.rowCount === 0) {
        throw new ApiError_1.ApiError(404, "Account not found");
    }
};
exports.userServices = {
    getUsers,
    updateUser,
    deleteUser
};
