import { Model, DataTypes } from "sequelize";
import { issueRefreshToken } from "../constants/security.constant.js";

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
                followers: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,

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
        db.User.hasMany(db.Follow, { foreignKey: "followerId", sourceKey: "id" });
        db.User.hasMany(db.Follow, { foreignKey: "followeeId", sourceKey: "id" });
        db.User.hasMany(db.CommentLike, {
            as: "commentLikes",
            foreignKey: "userId",
            sourceKey: "id",
        });
    }
}
