import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET } from "../constants/security.constant.js";

export const needSignin = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        // 인증 정보가 아예 없는 경우
        if (!authorizationHeader) {
            return res.status(400).json({
                ok: false,
                message: "인증정보가 없습니다.",
            });
        }

        const [tokenType, accessToken] = authorizationHeader?.split(" ");

        // 토큰형식이 일치하지 않는 경우
        if (tokenType !== "Bearer") {
            return res.status(400).json({
                ok: false,
                message: "지원하지 않는 인증방식입니다.",
            });
        }

        if (!accessToken) {
            if (!authorizationHeader) {
                return res.status(400).json({
                    ok: false,
                    message: "AccessToken이 없습니다.",
                });
            }
        }

        const decodedPayload = jwt.verify(accessToken, JWT_ACCESS_TOKEN_SECRET);

        console.log({ decodedPayload });

        // 유효기간이 지난 경우
        // 검증에 실패한 경우

        // 일치 하는 userId가 없는 경우
        next();
    } catch (error) {
        next(error);
    }
};
