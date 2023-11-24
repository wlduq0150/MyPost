import { Model, DataTypes } from "sequelize";

export default class Follow extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                followerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                followeeId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                modelName: "Follow",
                tableName: "follows",
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }

    static associate(db) {
        db.Post.belongsTo(db.User, { foreignKey: "followerId", targetKey: "id" });
        db.Post.belongsTo(db.User, { foreignKey: "followeeId", targetKey: "id" });
    }
}
