import { Model, DataTypes } from "sequelize";

export default class PostLike extends Model {
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
            }
		}, {
			sequelize,
			timestamps: true,
			modelName: "PostLike",
			tableName: "postLikes",
			charset: "utf8",
			collate: "utf8_general_ci",
		});
	}
	
	static associate(db) {
        db.PostLike.belongsTo(db.User, { foreignKey: "userId", targetKey: "id" });
        db.PostLike.belongsTo(db.Post, { foreignKey: "postId", targetKey: "id" });
    }
}