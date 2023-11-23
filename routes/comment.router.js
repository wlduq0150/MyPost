import express from "express";
import Sequelize from "sequelize";
import * as configEX from "../config/config.js";
const env = process.env.NODE_ENV || "development";
const config = configEX[env];
import User from "../models/users.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import CommentLike from "../models/commentLikes.model.js";

const router = express.Router();

// todo: 인증 집어넣기

// 포스트의 전체 댓글 보기
router.get("/comments", async (req, res) => {
    const { postId } = req.query;
    const existPost = await Post.findOne({ where: { id: postId } });
    if (!existPost) return res.status(404).json({ ok: false, message: "해당 포스트가 없습니다." });
    const postComments = await Comment.findAll({ where: { postId } });
    res.status(200).json({ postComments });
});

// 댓글 생성
router.post("/comments", async (req, res) => {
    const { content } = req.body;
    const { postId } = req.query;
    const existPost = await Post.findOne({ where: { id: postId } });
    if (!existPost) return res.status(404).json({ ok: false, message: "해당 포스트가 없습니다." });
    const userId = 5; // 인증 넣고 수정
    await Comment.create({ userId, postId, content });
    res.status(201).json({ ok: true, message: "댓글이 등록되었습니다." });
});

// 댓글 수정
router.put("/comments/:commentId", async (req, res) => {
    const { content } = req.body;
    console.log(content);
    const { commentId } = req.params;
    const existComment = await Comment.findOne({ where: { id: commentId } });
    if (!existComment) return res.status(404).json({ ok: false, message: "해당 댓글이 없습니다." });
    const userId = 1; // 인증 넣고 수정
    if (existComment.userId !== userId)
        return res.status(401).json({ ok: false, message: "수정 권한이 없습니다." });
    await existComment.update({ content });
    res.status(201).json({ ok: true, message: "댓글이 수정되었습니다." });
});

// 댓글 삭제
router.delete("/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const existComment = await Comment.findOne({ where: { id: commentId } });
    if (!existComment) return res.status(404).json({ ok: false, message: "해당 댓글이 없습니다." });
    const userId = 3; // 인증 넣고 수정
    if (existComment.userId !== userId)
        return res.status(401).json({ ok: false, message: "삭제 권한이 없습니다." });
    await existComment.destroy();
    res.status(204).json();
});

export default router;
