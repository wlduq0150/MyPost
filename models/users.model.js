import { Model, DataTypes } from "sequelize";

export default class User extends Model {
	static init(sequelize) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: DataTypes.STRING(100),
				allowNull: false
			},
			email: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: true
			},
			password: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			birth: {
				type: DataTypes.DATE,
				allowNull: false
			}
		}, {
			sequelize,
			timestamps: true,
			modelName: "User",
			tableName: "users",
			charset: "utf8",
			collate: "utf8_general_ci",
		});
	}
	
	static associate(db) {}
}