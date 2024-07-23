import mongoose from "mongoose"

const dbConnection=async ()=>{
    try{
    const conntection=await mongoose.connect(`${process.env.MONGODB_URI}/youtr`)
    console.log("connection succesful",conntection.connection.host)}
    catch(error){
        console.log("connection in error",error);
        process_exit(1)
    }

}
export default dbConnection
