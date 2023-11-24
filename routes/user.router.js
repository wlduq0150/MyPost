import express from "express";
import { needSignin } from "../middlewares/accesstoken-need-signin.middleware.js";
import { refreshTokenMiddleware } from "../middlewares/refreshtoken-access-reissuance.js";
import User from "../models/users.model.js";

const userRouter = express.Router();

// 본인 프로필 조회
userRouter.get("/user/me", needSignin, refreshTokenMiddleware, async (req, res, next) => {
    const userId = 1;

    const user = res.locals.user;

    if (!user) {
        return res.status(404).json({
            ok: false,
            message: "존재하지 않는 유저입니다.",
        });
    }

    return res.status(200).json({
        ok: true,
        message: "프로필 조회가 완료되었습니다",
        data: user,
    });
});

// 사용자 프로필 상세 조회
userRouter.get("/user/:userId", async (req, res, next) => {
    const userId = parseInt(req.params.userId);

    const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ["password", "birth"] },
    });

    if (!user) {
        return res.status(404).json({
            ok: false,
            message: "존재하지 않는 유저입니다.",
        });
    }

    return res.status(200).json({
        ok: true,
        message: "프로필 조회가 완료되었습니다",
        data: user,
    });
});

// 본인 프로필 수정
userRouter.patch("/user/me", needSignin, async (req, res, next) => {
    const userId = 1;

    const user = await User.findOne({
        where: { id: userId },
    });

    if (!user) {
        return res.status(404).json({
            ok: false,
            message: "존재하지 않는 유저입니다.",
        });
    }

    if ("email" in req.body) {
        const emailUser = await User.findOne({ where: { email: req.body.email } });

        if (emailUser) {
            return res.status(409).json({
                ok: false,
                message: "이미 존재하는 이메일입니다.",
            });
        }
    }

    await user.update({
        ...req.body,
    });

    return res.status(200).json({
        ok: true,
        message: "프로필이 성공적으로 수정되었습니다.",
    });
});

export default userRouter;
