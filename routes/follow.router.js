import express from "express";
import db from "../models/index.js";
import User from "../models/users.model.js";
import Post from "../models/posts.model.js";
import Follow from "../models/follows.model.js";
import { needSignin } from "../middlewares/accesstoken-need-signin.middleware.js";

const router = express.Router();

// 팔로우한 목록 보기
router.get("/user/:userId/followList", async (req, res) => {
	const {userId} = req.params
	const followList = await Follow.findAll({ where: {followerId: userId}})
	res.status(200).json({ ok: true, message: "팔로우 목록입니다.", followList})
})

// 내가 팔로우한 사람들의 포스트만 보기
router.get("/posts/follow/only", needSignin, async (req,res) => {
	const { id: userId } = res.locals.user;
	const followList = await Follow.findAll({ where: {followerId: userId}, raw: true})
	const followPost = await Post.findAll({where: {userId: followList.map(row => row.followeeId)}, raw:true})
	res.status(200).json({ ok: true, message: "팔로우한 사용자들의 포스트 목록입니다.", followPost})
})

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
