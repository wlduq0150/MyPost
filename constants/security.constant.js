import "dotenv/config";

export const PASSWORD_SALT_ROUNDS = Number.parseInt(process.env.PASSWORD_SALT_ROUNDS, 10);
