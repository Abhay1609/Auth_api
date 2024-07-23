import { asyncHandler } from "../utils/asyncHandler.js"
import Customer from "../models/customer.model.js"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiError.js"
const verifyJwt=asyncHandler(async(req,res,next)=>{
    try{
    const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
        
    if(!token){
        throw new ApiError(401,"Invalid Token")
    }

    let decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
    const customer=await Customer.findById(decodedToken?._id).select(
        "-password "
    )
    if(!customer){
        throw new ApiError(402,"Authorize access")
    }
    req.customer=customer
    next()}
    catch(error){
        throw new ApiError(401,error?.message||"Invalild access token")
    }
    
})
export {verifyJwt}