import dotenv from "dotenv";
dotenv.config();

const development = {
    username: "root",
    password: "wlduq0160",
    database: "myPost",
    host: "nest-database.c0mrakurnszp.ap-northeast-2.rds.amazonaws.com",
    dialect: "mysql",
};

export { development };