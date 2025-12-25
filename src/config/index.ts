import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

interface AppConfig {
  connection_str: string;
  port: number;
  jwtSecret: string;
  cron_Secret: string;
}

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const config: AppConfig = {
  connection_str: getEnv("CONNECTION_STR"),
  port: Number(getEnv("PORT")),
  jwtSecret: getEnv("JWT_SECRET"),
  cron_Secret: getEnv("CRON_SECRET"),
};

export default config;
