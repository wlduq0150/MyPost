import { Model, DataTypes } from "sequelize";

export default class CommentLike extends Model {
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
            commentId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
		}, {
			sequelize,
			timestamps: true,
			modelName: "CommentLike",
			tableName: "commentLikes",
			charset: "utf8",
			collate: "utf8_general_ci",
		});
	}
	
	static associate(db) {
        db.CommentLike.belongsTo(db.User, { foreignKey: "userId", targetKey: "id" });
        db.CommentLike.belongsTo(db.Comment, { foreignKey: "commentId", targetKey: "id" });
    }
}