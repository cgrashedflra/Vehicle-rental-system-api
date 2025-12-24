"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehiclesServices = void 0;
const DB_1 = require("../../config/DB");
const ApiError_1 = require("../../utils/ApiError");
const createVehicle = async (payload) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    if (!vehicle_name || !type || !registration_number || !daily_rent_price || !availability_status) {
        throw new ApiError_1.ApiError(400, "Vehicle name, type, registration number, daily rent price and availability status are required to Create or add a new vehicle to the database");
    }
    const result = await DB_1.pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES($1, $2, $3, $4, $5)
     RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
    return result;
};
const getVehicles = async () => {
    const result = await DB_1.pool.query(`
    SELECT id,
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status
    FROM vehicles ORDER BY id DESC`);
    return result;
};
const getSingleVehicle = async (id) => {
    const result = await DB_1.pool.query(`SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
        throw new ApiError_1.ApiError(404, "vehicle not found");
    }
    return result;
};
const updateVehicle = async (id, payload) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result = await DB_1.pool.query(` UPDATE vehicles SET 
      vehicle_name        = COALESCE($1, vehicle_name),
      type                = COALESCE($2, type),
      registration_number = COALESCE($3, registration_number),
      daily_rent_price    = COALESCE($4, daily_rent_price),
      availability_status = COALESCE($5, availability_status)
      WHERE id = $6
      RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status;`, [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
        id
    ]);
    if (result.rowCount === 0) {
        throw new ApiError_1.ApiError(404, "vehicle not found");
    }
    return result;
};
const deleteVehicle = async (id) => {
    const result = await DB_1.pool.query(`DELETE FROM vehicles WHERE id = $1  RETURNING *`, [id]);
    if (result.rowCount === 0) {
        throw new ApiError_1.ApiError(404, "vehicle not found");
    }
    return result.rows[0];
};
exports.vehiclesServices = {
    createVehicle,
    getVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
};
