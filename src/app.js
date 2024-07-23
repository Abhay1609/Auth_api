import express, { json } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { ApiError } from "./utils/apiError.js"
const app = express()
app.use(express.json());
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"
}))
app.use(express.urlencoded({limit:"16kb"}))
app.use(express.static('public/'))
app.use(cookieParser())
import router from "./router/auth.route.js"
app.use('/api',router)

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors,
            success: err.success,
        });
    } else {
        res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            errors: [],
            success: false,
        });
    }
});


export default app