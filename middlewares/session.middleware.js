import session from "express-session";
import dotenv from "dotenv";

dotenv.config();
export const sessionMiddleware = session({
	resave: false,
	saveUninitialized: false,
	secret: "znzltlzmfptdmsqlalfdlaksgdmfwlehahfmsek",
	cookie: {
		httpOnly: true,
		secure: false,
	}
});