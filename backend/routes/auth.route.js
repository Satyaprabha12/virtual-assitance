import e from "express";
import { Login, logOut, signUp } from "../controllers/auth.controller.js";

const authRouter = e.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",Login)
authRouter.get("/logout",logOut)

export default  authRouter