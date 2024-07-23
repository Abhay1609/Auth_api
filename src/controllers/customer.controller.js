import Customer from "../models/customer.model.js";
import  {asyncHandler}  from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const Register=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;
    
    if(!name||!email||!password){
        throw new ApiError(400, "All field are required");
    }

    const existingcustomer=await Customer.findOne({email})
    
    if(existingcustomer){
        throw new ApiError(400,"User with email already exist");
    }
    const customer=await Customer.create({
        name,
        email,
        password
    })
    const newCustomer=await Customer.findById(customer._id).select("-password")
    //console.log(newCustomer)
    if(!newCustomer){
        throw new ApiError(500,"Server Error")
      
     
    }
    const accessToken=await newCustomer.accessToken()
    const refreshToken=await newCustomer.refreshToken()
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(201)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            newCustomer,
            "User Creted"
        ));



})
const login=asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    const existingcustomer=await Customer.findOne({email})
    if(!existingcustomer){
        throw new ApiError (401,"Invalid email")
    }
    
    const ispassword=await existingcustomer.isPasswordCorrect(password)
   // console.log(ispassword)
    if(!ispassword){
        throw new ApiError(401, "Invalid password")
    }
    const refreshToken=await existingcustomer.refreshToken()
    const accessToken = await existingcustomer.accessToken()
    //console.log(refreshToken,accessToken)
    const options={
        httpOnly:true,
        secure:true
    }
    const loginCustomer=await Customer.findById(existingcustomer._id)
    if(!loginCustomer){
        throw new ApiError(500, "Internal Server Error")
    }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {"accessToken":accessToken,"refreshToken":refreshToken},
            "User is Loggin"
        )
    )

})
const logout=asyncHandler(async(req,res)=>{
    const customer=req.customer
    if(!customer){
        throw new ApiError(402,"Unautorize access")
    }
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
    
})
export {Register, login ,logout}