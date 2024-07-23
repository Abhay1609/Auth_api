import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const customerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
},{timestamps:true})
customerSchema.pre(
    "save",async function(next){
        this.password=await bcrypt.hash(this.password,10)
        next()
    }
)
customerSchema.methods.refreshToken=function(){ 
    return jwt.sign(
    {
        _id:this._id,
        name:this.name,
        email:this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}


)}
customerSchema.methods.accessToken=function(){
    return jwt.sign({
        _id:this._id},
    
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}
customerSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}






const Customer=mongoose.model("Customer",customerSchema)

export default Customer