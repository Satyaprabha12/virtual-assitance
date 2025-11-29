import e from "express"
import dotenv from "dotenv"
dotenv.config()
import ConnectDb from "./config/db.js"
import authRouter from "./routes/auth.route.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.route.js"



const app = e()
app.use(cors({
    origin:"https://virtual-assistance-1.onrender.com",
    credentials:true
}))
const port = process.env.PORT || 5000

app.use(e.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)



app.listen(port,()=>{
    ConnectDb()
    console.log("server started")
})