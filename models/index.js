import Sequelize from 'sequelize';
import * as configEX from "../config/config.js";
import User from "./users.model.js";

const env = process.env.NODE_ENV || 'development';
const config = configEX[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

db.User = User;

User.init(sequelize);

User.associate(db);

export default db;
