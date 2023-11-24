import "dotenv/config";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
export const PASSWORD_SALT_ROUNDS = Number.parseInt(process.env.PASSWORD_SALT_ROUNDS, 10);
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
export const JWT_ACCESS_TOKEN_EXPIRES_IN = "12h";
export const JWT_REFRESH_TOKEN_EXPIRES_IN = "7d";

export const issueRefreshToken = async (userId) => {
    const { User } = db;
    const refreshToken = jwt.sign({}, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
    });

    // DB에 refreshToken 저장
    await User.update({ refreshToken }, { where: { id: userId } });

    return refreshToken;
};
