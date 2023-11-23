import jwt from "jsonwebtoken";
import {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN_SECONDS,
} from "../constants/security.constant.js";
import db from "../models/index.js";

const { User } = db;

export const refreshTokenMiddleware = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            ok: false,
            message: "리프레시 토큰이 제공되지 않았습니다.",
        });
    }

    try {
        // 리프레시 토큰의 유효성만을 검사
        jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET);

        // 리프레시 토큰이 유효하면 데이터베이스에서 해당 유저 정보 가져오기
        const user = await User.findOne({ where: { refreshToken } });

        if (!user) {
            return res.status(401).json({
                ok: false,
                message: "유효하지 않은 리프레시 토큰입니다.",
            });
        }

        // 새로운 액세스 토큰 생성
        const newAccessToken = jwt.sign({ userId: user.id }, JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
        });

        // 업데이트된 토큰으로 쿠키 업데이트
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
        });

        // 리프레시 토큰 및 만료 시간 업데이트
        const newRefreshToken = generateRandomToken();
        await User.update(
            {
                refreshToken: newRefreshToken,
                refreshExpiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000),
            },
            { where: { id: user.id } }
        );

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
        });

        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: "유효하지 않은 리프레시 토큰입니다.",
        });
    }
};
