import "dotenv/config";

export const PASSWORD_SALT_ROUNDS = Number.parseInt(process.env.PASSWORD_SALT_ROUNDS, 10);
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
export const JWT_ACCESS_TOKEN_EXPIRES_IN = "12h";
export const JWT_REFRESH_TOKEN_EXPIRES_IN = "7d";
