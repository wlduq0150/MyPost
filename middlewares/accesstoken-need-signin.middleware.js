import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET } from "../constants/security.constant.js";
import { refreshTokenMiddleware } from "./refreshtoken-access-reissuance.js";
import db from "../models/index.js";
const { User } = db;
export const needSignin = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    // 인증 정보가 아예 없는 경우
    if (!authorizationHeader) {
        return res.status(401).json({
            ok: false,
            message: "인증정보가 없습니다.",
        });
    }

    const [tokenType, accessToken] = authorizationHeader?.split(" ");

    // 토큰형식이 일치하지 않는 경우
    if (tokenType !== "Bearer") {
        return res.status(401).json({
            ok: false,
            message: "지원하지 않는 인증방식입니다.",
        });
    }

    if (!accessToken) {
        return res.status(400).json({
            ok: false,
            message: "AccessToken이 없습니다.",
        });
    }

    try {
        const accessTokenFromCookie = req.cookies.accessToken;
        const decodedPayload = jwt.verify(accessTokenFromCookie, JWT_ACCESS_TOKEN_SECRET);
        const { userId } = decodedPayload;

        // 일치 하는 userId가 없는 경우
        const user = (await User.findByPk(userId)).toJSON();

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: "존재하지 않는 사용자입니다.",
            });
        }

        delete user.password;
        res.locals.user = user;

        next();
    } catch (error) {
        let statusCode = 401;
        switch (error.message) {
            // 유효기간이 지난 경우
            case "jwt expired":
                await refreshTokenMiddleware(req, res, next);
                break;
            // 검증에 실패한 경우
            case "invalid signature":
                return res.status(statusCode).json({
                    ok: false,
                    message: "유효하지 않는 인증 정보입니다.",
                });
                break;
            default:
                next(error);
                break;
        }
    }
};
