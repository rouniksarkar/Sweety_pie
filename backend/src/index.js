import connectDB from "./db/index.js";
import {app} from "./app.js"
import dotenv from "dotenv";

dotenv.config({ path: './.env' });


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`Server running on ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MOngoDb connection fails !!",error);
})