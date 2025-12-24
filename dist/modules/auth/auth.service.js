"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const DB_1 = require("../../config/DB");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = require("../../utils/ApiError");
const validateEmail_1 = require("../../utils/validateEmail");
const registerUser = async (payload) => {
    const { name, email, password, phone, role } = payload;
    if (!name || !email || !password || !phone || !role) {
        throw new ApiError_1.ApiError(400, "Name, valid email, password, phone and role are required");
    }
    if (!(0, validateEmail_1.validateEmail)(email)) {
        throw new ApiError_1.ApiError(400, "Invalid email format");
    }
    const existingUser = await DB_1.pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existingUser.rows.length > 0) {
        throw new ApiError_1.ApiError(409, "Email already registered");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 8);
    const result = await DB_1.pool.query(`
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
    `, [name, email, hashedPassword, phone, role]);
    return result.rows[0];
};
const loginUser = async (email, password) => {
    if (!(0, validateEmail_1.validateEmail)(email)) {
        throw new ApiError_1.ApiError(400, "Invalid email format");
    }
    const result = await DB_1.pool.query(`SELECT * FROM users WHERE email=$1`, [
        email,
    ]);
    if (result.rows.length === 0) {
        throw new ApiError_1.ApiError(401, "Invalid email or password");
    }
    const user = result.rows[0];
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match) {
        throw new ApiError_1.ApiError(401, "Invalid email or password");
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, config_1.default.jwtSecret, {
        expiresIn: "7d",
    });
    const { password: hashedPassword, created_at, updated_at, ...userWithoutSensitiveData } = user;
    return { token, user: userWithoutSensitiveData };
};
exports.authServices = {
    registerUser,
    loginUser
};
