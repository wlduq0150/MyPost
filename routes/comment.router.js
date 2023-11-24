import express from "express";
import Sequelize from "sequelize";
import User from "../models/users.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import CommentLike from "../models/commentLikes.model.js";
import { needSignin } from "../middlewares/accesstoken-need-signin.middleware.js";

const router = express.Router();

// 포스트의 전체 댓글 보기
router.get("/comments", async (req, res) => {
    const { postId } = req.query;
    const existPost = await Post.findOne({ where: { id: postId } });
    if (!existPost) return res.status(404).json({ ok: false, message: "해당 포스트가 없습니다." });
    const postComments = await Comment.findAll({ where: { postId } });
    res.status(200).json({ postComments });
});

// 댓글 생성
router.post("/comments", needSignin, async (req, res) => {
    const { content } = req.body;
    const { postId } = req.query;
    const existPost = await Post.findOne({ where: { id: postId } });
    if (!existPost) return res.status(404).json({ ok: false, message: "해당 포스트가 없습니다." });
    const { id: userId } = res.locals.user;
    await Comment.create({ userId, postId, content });
    res.status(201).json({ ok: true, message: "댓글이 등록되었습니다." });
});

// 댓글 수정
router.put("/comments/:commentId", needSignin, async (req, res) => {
    const { content } = req.body;
    const { commentId } = req.params;
    const existComment = await Comment.findOne({ where: { id: commentId } });
    if (!existComment) return res.status(404).json({ ok: false, message: "해당 댓글이 없습니다." });
    const { id: userId } = res.locals.user;
    if (existComment.userId !== userId)
        return res.status(401).json({ ok: false, message: "수정 권한이 없습니다." });
    await existComment.update({ content });
    res.status(201).json({ ok: true, message: "댓글이 수정되었습니다." });
});

// 댓글 삭제
router.delete("/comments/:commentId", needSignin, async (req, res) => {
    const { commentId } = req.params;
    const existComment = await Comment.findOne({ where: { id: commentId } });
    if (!existComment) return res.status(404).json({ ok: false, message: "해당 댓글이 없습니다." });
    const { id: userId } = res.locals.user;
    if (existComment.userId !== userId)
        return res.status(401).json({ ok: false, message: "삭제 권한이 없습니다." });
    await existComment.destroy();
    res.status(204).json();
});

export default router;
