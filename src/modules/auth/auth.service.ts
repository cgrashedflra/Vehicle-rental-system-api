import { pool } from "../../config/DB";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { ApiError } from "../../utils/ApiError";
import { validateEmail } from "../../utils/validateEmail";
import { UserPayload } from "../../types/payload types/Users.types";

const registerUser = async (payload: UserPayload) => {
  const { name, email, password, phone, role } = payload;

  if (!name || !email || !password || !phone || !role) {
    throw new ApiError(400, "Name, valid email, password, phone and role are required");
  }


  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new ApiError(409, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
    `,
    [name, email, hashedPassword, phone, role]
  );

  return result.rows[0];
};

const loginUser = async (email: string, password: string) => {

  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new ApiError(401, "Invalid email or password");
  }
  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );

  const { password: hashedPassword, created_at, updated_at, ...userWithoutSensitiveData } = user;

  return { token, user: userWithoutSensitiveData };
};

export const authServices = {
  registerUser,
  loginUser
};