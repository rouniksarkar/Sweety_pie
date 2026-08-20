import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    slug:{
            type:String,
            lowercase:true,
        },
    description:{
        type:String,
        required:true,
    },
    productImage:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        default:0
    },
    discountType:{
        type:String,
        enum:["percentage","flatOff",null],
        default:0
    },
    discountValue:{
        type:Number,
        default:0
    },
    stock:{
        default:0,
        type:Number
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    shipping:{
        type:Boolean,
    },
    averageRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
},
    { timestamps: true }
)

productSchema.methods.getDiscountedPrice=function(){
    if(!this.discountType || this.discountValue===0) return this.price;
    if(this.discountType=="percentage"){
        return this.price -(this.discountValue * this.price)/100;
    }
    else if(this.discountType=="flatOff"){
        return Math.max(0,this.price -this.discountValue);
    }
    else{
        return this.price;
    }

}

export const Product = mongoose.model("Product", productSchema)