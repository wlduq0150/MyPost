import { Model, DataTypes } from "sequelize";

export default class Comment extends Model {
	static init(sequelize) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
			content: {
				type: DataTypes.STRING(200),
				allowNull: false
			}
		}, {
			sequelize,
			timestamps: true,
			modelName: "Comment",
			tableName: "comments",
			charset: "utf8",
			collate: "utf8_general_ci",
		});
	}
	
	static associate(db) {
        db.Comment.hasMany(db.CommentLike, { as: "commentLikes", foreignKey: "commentId", sourceKey: "id" });
        db.Comment.belongsTo(db.User, { foreignKey: "userId", targetKey: "id" });
        db.Comment.belongsTo(db.Post, { foreignKey: "postId", targetKey: "id" });
    }
}