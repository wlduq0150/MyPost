import Sequelize from 'sequelize';
import * as configEX from "../config/config.js";
import User from "./users.model.js";
import Post from './posts.model.js';
import Comment from './comments.model.js';
import PostLike from './postLikes.model.js';
import CommentLike from './commentLikes.model.js';

const env = process.env.NODE_ENV || 'development';
const config = configEX[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

db.User = User;
db.Post = Post;
db.Comment = Comment;
db.PostLike = PostLike;
db.CommentLike = CommentLike;

User.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
PostLike.init(sequelize);
CommentLike.init(sequelize);

User.associate(db);
Post.associate(db);
Comment.associate(db);
PostLike.associate(db);
CommentLike.associate(db);

export default db;
