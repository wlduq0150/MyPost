import express from "express";
import db from "../models/index.js";
import User from "../models/users.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import PostLike from "../models/postLikes.model.js";
import CommentLike from "../models/commentLikes.model.js";
import { needSignin } from "../middlewares/accesstoken-need-signin.middleware.js";

const likeRouter = express.Router();

likeRouter.put("/comments/:commentId/like", needSignin, async (req, res, next) => {
    const { id: userId } = res.locals.user;

    const { commentId } = req.params;

    const t = await db.sequelize.transaction();

    try {
        // 댓글 존재 확인
        const comment = await Comment.findOne({
            where: { id: commentId },
            transaction: t,
        });

        if (!comment) {
            throw new Error("Not Found");
        }

        let { likes } = comment;

        // 댓글 좋아요 여부 확인 및 업데이트
        const commentLike = await CommentLike.findOne({
            where: { userId, commentId },
            transaction: t,
        });

        if (!commentLike) {
            await CommentLike.create({
                userId,
                commentId
            }, {
                transaction: t
            });

            likes += 1;
        } else {
            await CommentLike.destroy({
                where: { id: commentId, userId }
            }, {
                transaction: t
            });

            likes -= 1;
        }

        // 댓글 좋아요 카운트
        await Comment.update({
            likes,
        }, {
            where: { id: commentId },
            transaction: t
        });

        // 트랜잭션 커밋
        await t.commit();

    } catch (e) {
        console.log(e);
        // 트랜잭션 롤백
        await t.rollback();
        
        if (e.message === "Unauthorized") {
            return res.status(401).json({
                ok: false,
                message: "로그인이 필요한 기능입니다."
            });
        } else if (e.message === "Not Found") {
            return res.status(404).json({
                ok: false,
                message: "존재하지 않는 댓글입니다."
            });
        } else {
            next(e);
            return;
        }
    }

    return res.status(200).json({
        ok: true,
        message: "댓글 좋아요 수정 완료",
        data: {
            likes
        }
    });
});

likeRouter.put("/posts/:postId/like", needSignin, async (req, res, next) => {
    const { id: userId } = res.locals.user;
    const { postId } = req.params;

    const t = await db.sequelize.transaction();

    try {
        // 포스트 존재 확인
        const post = await Post.findOne({
            where: { id: postId },
            transaction: t,
        });

        if (!post) {
            throw new Error("Not Found");
        }

        let { likes } = post;

        // 댓글 좋아요 여부 확인 및 업데이트
        const postLike = await PostLike.findOne({
            where: { userId, id: postId },
            transaction: t,
        });

        if (!postLike) {
            await PostLike.create({
                userId,
                postId
            }, {
                transaction: t
            });

            likes += 1;
        } else {
            await PostLike.destroy({
                where: { id: postId, userId },
                transaction: t
            });

            likes -= 1;
        }


        // 댓글 좋아요 카운트
        await Post.update({
            likes,
        }, {
            where: { id: postId },
            transaction: t
        });

        // 트랜잭션 커밋
        await t.commit();

    } catch (e) {
        console.log(e);
        // 트랜잭션 롤백
        await t.rollback();
        
        if (e.message === "Unauthorized") {
            return res.status(401).json({
                ok: false,
                message: "로그인이 필요한 기능입니다."
            });
        } else if (e.message === "Not Found") {
            return res.status(404).json({
                ok: false,
                message: "존재하지 않는 포스트입니다."
            });
        } else {
            next(e);
            return;
        }
    }

    return res.status(200).json({
        ok: true,
        message: "포스트 좋아요 수정 완료",
        data: {
            likes,
        }
    });
});

export default likeRouter;