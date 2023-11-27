import jwt from "jsonwebtoken";
import {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN,
    issueRefreshToken,
} from "../constants/security.constant.js";
import db from "../models/index.js";

const { User } = db;

export const refreshTokenMiddleware = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    //  혹시 모를 예외 사항이 있을 수 있다 생각한다.
    // 요청자 측에서 전달 받은 쿠키에 refresh token이 존재하지 않을 경우
    if (!refreshToken) {
        return res.status(401).json({
            ok: false,
            message: "refresh token이 제공되지 않았습니다.",
        });
    }

    try {
        const refreshTokenVerified = jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET);
        // refresh token이 유효하면 데이터베이스에서 해당 유저 정보 가져오기

        const user = await User.findOne({ where: { refreshTokenVerified } });
        console.log(user);
        if (!user) {
            return res.status(401).json({
                ok: false,
                message: "유효하지 않은 보안 인증입니다.",
            });
        }
        // 만약

        // 새로운 액세스 토큰 생성
        const newAccessToken = jwt.sign({ userId: user.id }, JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
        });
        // 리프레시 토큰 및 만료 시간 업데이트
        // 다시 생성된 refresh token을 랜덤한 값으로 다시 재설정
        const newRefreshToken = issueRefreshToken(user.id);
        // mySQL에 DB안에 있는 해당 user id를 찾아 refresh token 속성값으로 만료기간과 함께 재생성
        // 그리고 이 옵션값과 같은 refreshExpiresAt에 해당하는 값은 MySQL DB에 나타내 줄 필요 없음
        // 이것 또한 NodeJS 숙련추차 개인프로잭트 해설 보안적인 요소가 영상에 나와 있으며
        // 이를 반영하여 옵션값과 같은 속성값으로 설정
        // 그뿐만 아니라 지금 이 코드 구조상 이 방법이 최적의 방법이라고 생각한다.

        await User.update(
            { refreshToken: newRefreshToken },
            { where: { id: user.id }, fields: ["refreshToken"] }
        );

        // Access token이 업데이트된 토큰으로 쿠키 업데이트
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
        });

        // refresh token이 업데이트된 토큰으로 쿠키 업데이트
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
        });
        /*    const newCookieWithoutPassword = { ...user.toJSON() };
        delete newCookieWithoutPassword.password; */

        res.status(200).json({
            ok: true,
            message: "쿠키가 재생성 되었습니다.",
            data: { newcookie: newAccessToken, newRefreshToken },
        });

        next();
    } catch (error) {
        next(error);
    }
};
