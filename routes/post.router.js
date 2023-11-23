import express from "express";
import sequelize from "sequelize";
import db from "../models/index.js";
import User from "../models/users.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import PostLike from "../models/postLikes.model.js";
import CommentLike from "../models/commentLikes.model.js";

const postRouter = express.Router();

// 로그인 인증 부분 완료되면 userId 부분 수정 필요, 실패 시 반환 코드 추가 필요.

// 게시글 작성 라우터
postRouter.post("/posts", async(req,res)=>{
    const userId = 1;
    const { content, title, thumbnail } = req.body;

    try {
        if(!content||!title){
            return res.status(400).json({ok:false, message:"내용을 모두 채워 주세요."})
        };
        if(!userId){ //로그인 부분 완료 후 수정 필요.
            return res.status(401).json({ok:false, message:"로그인 이후 이용할 수 있습니다."})
        };
        const post = await Post.create({
         userId,
         title,
         content,
         thumbnail,
        })
        
        return res.status(201).json({ok:true, message:"게시글 작성 성공", data: post})
    } catch (error){
        console.log(error);
        return res.status(501).json({message:"서버 오류 발생"})
    
    }
});

//게시글 조회 라우터(메인화면에서 쓸 수 있지 않을까?)
postRouter.get("/posts", async(req,res)=>{
    try {
        const posts = await Post.findAll({
            attributes: ["id", "title", "thumbnail", "createdAt"],
            order:["createdAt"]
        })

        return res.status(200).json({ok:true, message:"게시글 조회 성공", data:posts});
    } catch(error){
        console.log(error);
        return res.status(501).json({ok:false, message:"서버 오류 발생"});
    }
});

// 게시글 상세 조회 라우터
postRouter.get("/posts/:postId", async(req,res)=>{    
    const {postId} = req.params;
    try{
        const post = await Post.findOne({
            attributes:["id","title", "thumbnail", "content", "createdAt", "updatedAt"],
            where :{id:postId},
        })
        if(!post){
            return res.status(400).json({ok:false, message:"게시물이 존재하지 않습니다."})
        };
    return res.status(200).json({ok:true, message:"게시글 상세 조회 성공", data:post})
    }catch(error){
        console.log(error);
        return res.status(501).json({ok:false, message:"서버 오류 발생"})}
});

// 게시글 수정 라우터
postRouter.put("/posts/:postId", async(req,res)=>{
    const userId = 1;
    const postIdInt=Number(req.params.postId);
    const {title, thumbnail, content} = req.body;

    try{
        const post = await Post.findOne({where:{id:postIdInt}});
        if(!post)
        {
            return res.status(400).json({ok:false, message:"게시물이 존재하지 않습니다."})
        };
        if(!userId){//로그인 부분 완료 후 수정 필요.
            return res.status(401).json({ok:false, message:"로그인 이후 이용할 수 있습니다."})
        };
        await Post.update(
            {...req.body},
            {where: {id:postIdInt,userId:userId}}
        );
        return res.status(200).json({ok:true, message:"게시글 수정 성공"})
    
    }catch(error){
        console.log(error);
        return res.status(501).json({ok:false, message:"서버 오류 발생"})
    };
});

// 게시글 삭제 라우터
postRouter.delete("/posts/:postId", async(req,res)=>{
    const userId = 1;
    const postIdInt=Number(req.params.postId);

    try{
        const post = await Post.findOne({where:{id:postIdInt}});
        if(!post)
        {
            return res.status(400).json({ok:false, message:"게시글이 존재하지 않습니다."})
        };
        if(!userId){//로그인 부분 완료 후 수정 필요.
            res.status(401).json({ok:false, message:"로그인 이후 이용할 수 있습니다."})
        };
        await Post.destroy(
            {where:{id:postIdInt,userId: userId}}
        );
        res.status(200).json({ok:true, message: "게시글 삭제 완료"})
    }catch(error){
        console.log(error);
        return res.status(501).json({ok:false, message:"서버 오류 발생"})
    }
});

export default postRouter;