import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../models/index.js";
import { PASSWORD_SALT_ROUNDS } from "../constants/security.constant.js";
const { User } = db;
const authRouter = Router();

// 회원가입 /api/auth/signup
authRouter.post("/signup", async (req, res) => {
    try {
        const { email, name, birth, myIntro, password, passwordConfirm } = req.body;
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

        if (!Date(birth)) {
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
        const isValidEamil = emailValidationRegex.test(email);

        if (!isValidEamil) {
            return res.status(400).json({
                ok: false,
                message: "올바른 이메일 형식이 아닙니다.",
            });
        }

        const existedUser = await User.findOne({ where: { email } });

        if (existedUser) {
            return res.status(400).json({
                ok: false,
                message: "이미 가입된 이메일입니다.",
            });
        }

        const hashedPassword = bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS);

        const newUser = (
            await User.create({ email, name, birth, myIntro, password: hashedPassword })
        ).toJSON();
        delete newUser.password;
        console.log({ newUser: newUser.toJSON() });

        return res.status(201).json({
            ok: true,
            message: "회원가입에 성공하였습니다.",
            data: newUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요",
        });
    }
});

// 로그인/api/auth/signin
authRouter.post("/signin", async (req, res) => {});

export { authRouter };
