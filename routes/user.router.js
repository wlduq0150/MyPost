import express from "express";
import User from "../models/users.model.js";

const userRouter = express.Router();

// 프로필 조회
userRouter.get("/user/profile", async (req, res, next) => {
    const loginUser = 1;
    const userId = parseInt(req.query.userId);
    const exclude = [];

    if (loginUser !== userId) {
        exclude.push("password", "birth");
    }

    const user = await User.findOne({ 
        where: { id: userId },
        attributes: { exclude }
    });

    if (!user) {
        return res.status(404).json({
            ok: false,
            message: "존재하지 않는 유저입니다."
        });
    }

    return res.status(200).json({
        ok: true,
        message: "프로필 조회가 완료되었습니다",
        data: user
    });
});

// 프로필 수정
userRouter.patch("/user/profile", async (req, res, next) => {
    const loginUser = 1;

    const userId = parseInt(req.query.userId);

    if (loginUser !== userId) {
        return res.status(401).json({
            ok: false,
            message: "편집 권한이 없습니다."
        });
    }

    const user = await User.findOne({ 
        where: { id: userId },
    });

    if (!user) {
        return res.status(404).json({
            ok: false,
            message: "존재하지 않는 유저입니다."
        });
    }

    await user.update({
        ...req.body
    });

    return res.status(200).json({
        ok: true,
        message: "프로필이 성공적으로 수정되었습니다."
    });
});

export default userRouter;