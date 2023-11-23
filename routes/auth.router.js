import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../models/index.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import {
    PASSWORD_SALT_ROUNDS,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN_SECONDS,
    generateRandomToken,
} from "../constants/security.constant.js";
const { User } = db;
const authRouter = Router();
const datePattern = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
// 회원가입 /api/auth/signup
authRouter.post("/signup", async (req, res, next) => {
    try {
        const { email, name, myIntro, password, passwordConfirm, birth } = req.body;

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
                message: "생년월일 입력이 필요합니다.",
            });
        }

        if (!datePattern.test(birth)) {
            return res.status(400).json({
                ok: false,
                message: "생년월일을 잘못 입력하셨습니다.",
            });
        }
        if (!password) {
            return res.status(400).json({
                ok: false,
                message: "비밀번호 입력이 필요합니다.",
            });
        }

        if (!passwordConfirm) {
            return res.status(400).json({
                ok: false,
                message: "비밀번호 확인 입력이 필요합니다.",
            });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({
                ok: false,
                message: "입력한 비밀번호가 서로 일치하지 않습니다.",
            });
        }
        if (password.length < 7) {
            return res.status(400).json({
                ok: false,
                message: "비밀번호는 최소 7자리 이상입니다.",
            });
        }

        let emailValidationRegex = new RegExp("[a-z0-9._]+@[a-z]+.[a-z]{2,3}");
        const isValidEmail = emailValidationRegex.test(email);

        if (!isValidEmail) {
            return res.status(400).json({
                ok: false,
                message: "올바른 이메일 형식이 아닙니다.",
            });
        }

        const existedUser = await User.findOne({ where: { email } });

        if (existedUser) {
            return res.status(409).json({
                ok: false,
                message: "이미 가입된 이메일입니다.",
            });
        }

        const hashedPassword = bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS);

        const newUser = (
            await User.create({
                email,
                name,
                birth,
                myIntro,
                password: hashedPassword,
                refreshToken: null,
            })
        ).toJSON();
        delete newUser.password;

        return res.status(201).json({
            ok: true,
            message: "회원가입에 성공하였습니다.",
            data: newUser,
        });
    } catch (error) {
        next(error);
    }
});

// 로그인/api/auth/signin
authRouter.post("/signin", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                ok: false,
                message: "이메일 입력이 필요합니다.",
            });
        }

        if (!password) {
            return res.status(400).json({
                ok: false,
                message: "비밀번호 입력이 필요합니다.",
            });
        }

        const user = (await User.findOne({ where: { email } }))?.toJSON();
        const hashedPassword = user?.password;

        const isPasswordMatched = bcrypt.compareSync(password, hashedPassword);

        const isCorrectUser = user && isPasswordMatched;

        if (!isCorrectUser) {
            return res.status(401).json({
                ok: false,
                message: "일치하는 인증 정보가 없습니다.",
            });
        }

        const accessToken = jwt.sign({ userId: user.id }, JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
        });

        const refreshToken = generateRandomToken();

        // refreshToken을 데이터베이스에 저장합니다.
        await User.update(
            {
                refreshToken,
                refreshExpiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000), // 현재 시간에서 7일 후를 계산하여 저장
            },
            { where: { id: user.id } }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
        });
        console.log(refreshToken);
        return res.status(200).json({
            ok: true,
            message: "로그인에 성공하였습니다.",
            data: { accessToken, refreshToken },
        });
    } catch (error) {
        next(error);
    }
});

export { authRouter };
