import dotenv from "dotenv"
import app from "./app.js"
dotenv.config({
    path:"./.env"
})
import dbConnection from "./dB/dbConnection.js"
dbConnection().then(()=>{
    app.listen(process.env.PORT,(()=>{
        console.log("listening at ",process.env.PORT)
    })
)})
.catch(
    (error)=>{
        console.log("error",error)
    }
)
