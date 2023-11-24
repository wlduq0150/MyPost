import path from "path";
import multer from "multer";
import multer_s3 from "multer-s3";
import aws from "aws-sdk";
import { AWS_S3_BUCKET_NAME } from "../constants/aws-s3.constant.js";

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY_KEY,
    region: process.env.AWS_S3_REGION
});

const videoExtension = [".mp4"];

const uploadVideosMulter = multer({
    storage: multer_s3({
        s3,
        bucket: AWS_S3_BUCKET_NAME,
        acl: "public-read-write",
        key: (req, file, callback) => {
            const ext = path.extname(file.originalname);

            if (!videoExtension.includes(ext)) {
                return callback(new Error("잘못된 파일 확장자입니다."))
            }

            callback(null, `video/${Date.now()}_${file.originalname}`)
        }
    })
}).single("video");

export const uploadVideos = (req, res, next) => {
    uploadVideosMulter(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                message: "비디오 업로드 실패하였습니다."
            });
        }

        next();
    });
};