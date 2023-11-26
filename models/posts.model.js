import { Model, DataTypes } from "sequelize";

export default class Post extends Model {
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
			title: {
				type: DataTypes.STRING(100),
				allowNull: false
			},
            thumbnail: {
                type: DataTypes.STRING(100),
				allowNull: true
            },
			content: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			likes: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			}
		}, {
			sequelize,
			timestamps: true,
			modelName: "Post",
			tableName: "posts",
			charset: "utf8",
			collate: "utf8_general_ci",
		});
	}
	
	static associate(db) {
        db.Post.hasMany(db.Comment, { as: "comments", foreignKey: "postId", sourceKey: "id" });
        db.Post.hasMany(db.PostLike, { as: "postLikes", foreignKey: "postId", sourceKey: "id" });
        db.Post.belongsTo(db.User, { as: "user", foreignKey: "userId", targetKey: "id" });
    }
}