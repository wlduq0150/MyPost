import { Router } from "express";
import db from "../models/index.js";
const { User } = db;
const authRouter = Router();

// 회원가입 /api/auth/signup
authRouter.post("/signup", async (req, res) => {
    const { email, name, birth, myIntro, password, passwordCofirm } = req.body;
    // 이메일 정보가 없는 경우
    if (!email) {
        return res.status(400).json({
            ok: false,
            message: "이메일 입력이 필요합니다.",
        });
    }

    if (!name) {
        return res.status(400).json({
            ok: false,
            message: "이름 입력이 필요합니다.",
        });
    }

    if (!birth) {
        return res.status(400).json({
            ok: false,
            message: "생년월일의 입력이 필요합니다.",
        });
    }

    if (!password) {
        return res.status(400).json({
            ok: false,
            message: "비밀번호 입력이 필요합니다.",
        });
    }

    if (!password) {
        return res.status(400).json({
            ok: false,
            message: "비밀번호 입력이 필요합니다.",
        });
    }

    const newUser = (await User.create({ email, name, birth, myIntro, password })).toJSON();
    delete newUser.password;
    console.log({ newUser: newUser.toJSON() });

    return res.status(201).json({
        ok: true,
        message: "회원가입에 성공하였습니다.",
        data: newUser,
    });
});

// 로그인/api/auth/signin
authRouter.post("/signin", async (req, res) => {});

export { authRouter };
