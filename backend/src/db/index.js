import mongoose from "mongoose";

const connectDB= async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`\n MongoDb connected Successfully ${process.env.PORT}`);
        
    } catch (error) {
        console.log("MOngoDB connection error",error);
        process.exit(1)
    }
}

export default connectDB;