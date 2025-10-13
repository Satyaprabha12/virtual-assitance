import e from "express";
import { askToAssistant, getCurrentUser } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"
import { updateAssistant } from "../controllers/user.controller.js";

const userRouter = e.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post("/update-assistant",isAuth,upload.single("AssistantImage"),updateAssistant)
userRouter.post("/ask",isAuth,askToAssistant)

export default  userRouter