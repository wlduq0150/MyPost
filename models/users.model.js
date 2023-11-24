import { Model, DataTypes } from "sequelize";
import jwt from "jsonwebtoken";
import {
    JWT_REFRESH_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_EXPIRES_IN,
} from "../constants/security.constant.js";

export default class User extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    unique: true,
                },
                password: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                birth: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                refreshToken: {
                    type: DataTypes.STRING(255),
                    allowNull: true, // 로그아웃된 사용자의 경우 refreshToken은 없을 수 있습니다.
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: "User",
                tableName: "users",
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }

    static associate(db) {
        db.User.hasMany(db.Post, { as: "posts", foreignKey: "userId", sourceKey: "id" });
        db.User.hasMany(db.Comment, { as: "comments", foreignKey: "userId", sourceKey: "id" });
        db.User.hasMany(db.CommentLike, {
            as: "commentLikes",
            foreignKey: "userId",
            sourceKey: "id",
        });
    }
    // 추가: refreshToken 발급 메서드
    // 로그인시 사용자 및 데이터 베이스에 refresh Token에 빈 payload를 값을 저장하기 위함
    static async issueRefreshToken(userId) {
        const refreshToken = jwt.sign({}, JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
        });

        // DB에 refreshToken 저장
        await this.update({ refreshToken }, { where: { id: userId } });

        return refreshToken;
    }
}
