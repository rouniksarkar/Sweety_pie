import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser" 
import path from "path";


const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({
    extended:true,
    limit:"16kb",
}))
app.use(cookieParser())

// app.js or server.js

//routes

//routes declaration
import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users",userRouter)


//create category Router
import categoryRoutes from "./routes/category.routes.js"

app.use("/api/v1/category",categoryRoutes)

//create products route
import productRoutes from "./routes/product.routes.js"

app.use("/api/v1/product",productRoutes)

//create cart route
import cartRoutes from "./routes/cart.routes.js"
app.use("/api/v1/cart",cartRoutes);


//order -payment routes
import orderRoutes from "./routes/order.routes.js"
app.use("/api/v1/order",orderRoutes);

//otp
import otpRoutes from "./routes/otp.routes.js"
app.use("/api/v1/otp",otpRoutes);

//invoice genration
import invoiceRoutes from "./routes/invoice.routes.js";

app.use("/api/v1/invoice", invoiceRoutes);

app.use("/invoices", express.static(path.join(process.cwd(), "public/invoices")));

// Banner 
import bannerRoutes from "./routes/banner.routes.js"
app.use("/api/v1/banner",bannerRoutes)

//review

import reviewRoutes from "./routes/review.routes.js"

app.use('/api/v1/products/:productId/reviews', reviewRoutes);

import userReviewRoutes from "./routes/userReview.routes.js" 

app.use('/api/v1/users/:userId/reviews', userReviewRoutes);
 
// standalone routes: /api/reviews/:id
app.use('/api/v1/reviews', reviewRoutes);

//error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("❌ Error:", message);

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export {app}