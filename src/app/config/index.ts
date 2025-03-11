import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 5000,
  databaseURL: process.env.MONGODB_URL,
  defaultPassword: process.env.DEFAULT_PASSWORD,
  bcryptSaltRounds: Number(process.env.SALT) || 10,
  node_env: process.env.NODE_ENV,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
  jwtAccessExpiration: process.env.JWT_ACCESS_EXPIRATION,
};
