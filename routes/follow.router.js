import express from "express";
import db from "../models/index.js";
import User from "../models/users.model.js";
import Follow from "../models/follows.model.js";
import { needSignin } from "../middlewares/accesstoken-need-signin.middleware.js";

const router = express.Router();

// todo: 인증 추가
// 팔로우
router.post("/follow/:followeeId", needSignin, async (req, res, next) => {
    const { id: userId } = res.locals.user;
    const followeeId = +req.params.followeeId;
    if (userId === followeeId)
        return res.status(400).json({ ok: false, message: "자신을 팔로우할 수 없습니다." });
    const existFollowee = await User.findOne({ where: { id: followeeId } });
    if (!existFollowee)
        return res.status(400).json({ ok: false, message: "존재하지 않는 사용자입니다." });
    const existFollow = await Follow.findOne({ where: { followerId: userId, followeeId } });
    if (existFollow)
        return res.status(400).json({ ok: false, message: "이미 팔로우한 사용자입니다." });
    try {
        await db.sequelize.transaction(async (t) => {
            await Follow.create({ followerId: userId, followeeId }, { transaction: t });
            await existFollowee.update(
                { followers: existFollowee.followers + 1 },
                { transaction: t }
            );
        });
        res.status(201).json({ ok: true, message: "해당 사용자를 팔로우했습니다." });
    } catch (e) {
        console.log(e);
        next(e);
    }
});

// 언팔로우
router.delete("/follow/:followeeId", needSignin, async (req, res, next) => {
    const { id: userId } = res.locals.user;
    const followeeId = +req.params.followeeId;
    const existFollow = await Follow.findOne({ where: { followerId: userId, followeeId } });
    if (!existFollow)
        return res.status(400).json({ ok: false, message: "팔로우하지 않은 사용자입니다." });
    try {
        await db.sequelize.transaction(async (t) => {
            await existFollow.destroy({ transaction: t });
            const existFollowee = await User.findOne(
                { where: { id: followeeId } },
                { transaction: t }
            );
            if (existFollowee)
                await existFollowee.update(
                    { followers: existFollowee.followers - 1 },
                    { transaction: t }
                );
        });
        res.status(201).json({ ok: true, message: "해당 사용자를 언팔로우했습니다." });
    } catch (e) {
        console.log(e);
        next(e);
    }
});

export default router;
