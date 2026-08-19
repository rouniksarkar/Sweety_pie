import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { Address } from "../models/address.model.js"
//import { uploadOnCloudinary } from "../utils/FileUpload.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new apiError(500, "something went wrong on tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //get user details
    //validation-nor empty
    //check if user already exist:username and email
    //check for images and check for avater
    //upload them to cloudinary
    //create user object- create entry in db
    //remove passward and refresh token fields from response
    //check for user creation
    //return response

    const { username, email, password } = req.body

    // if(username===""){
    //     throw new apiError(400,"fullname is required")
    // }

    if (
        [username, password, email].some((field) => field?.trim() === "")
    ) {
        throw new apiError(400, "All fields are required")
    }
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existingUser) {
        throw new apiError(409, "User with email already exsists")
    }

    //const avatarLocalPath=req.files?.avatar[0]?.path
    //const coverImageLocalPath=req.files?.coverImage[0]?.path 

    // if(!avatarLocalPath){
    //     throw new apiError(404,"avatar not found")
    // }

    // const avatar=await uploadOnCloudinary(avatarLocalPath)
    // const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    // if(!avatar){
    //     throw new apiError(404,"avatar not found")
    // }

    const user = await User.create({
        username: username.toLowerCase(),
        //avatar:avatar.url,
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refrshToken"
    )

    if (!createdUser) {
        throw new apiError(500, "something went wrong in register user!")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Register successsfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // req body to data
    // check username and email
    //find the user
    //password check
    //access and refresh token
    //send cookies
    //response

    const { username, email, password } = req.body

    if (!username && !email) {
        throw new apiError(400, "username or email required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new apiError(404, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new apiError(401, "password is not correct")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedIn = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                user: loggedIn, accessToken, refreshToken
            },
                "User logged In Successfully"
            )
        )

})

//logout hitesh
// const logoutUser=asyncHandler(async(req,res)=>{
//     User.findByIdAndUpdate(
//         req.user._id,
//         {
//             $set:{
//                 refreshToken:undefined
//             }
//         },
//         {
//             new:true
//         }
//     )
//     const options={
//         httpOnly:true,
//         secure:true
//     }
//     return res
//     .status(200)
//     .clearCookie("accessToken",options)
//     .clearCookie("refreshToken",options)
// })

const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: false, // true in production with HTTPS
        sameSite: "Lax",
    };

    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: "Logged out successfully" });
});


//forgot password

// const forgotPassword= async(req,res)=>{
//     try {
//         const {email,answer,newPassword}=req.body
//         if(!email){
//             res.status(400).send({message:"Email is required"})
//         }
//         if(!answer){
//             res.status(400).send({message:"Answer is required"})
//         }
//         if(!newPassword){
//             res.status(400).send({message:"newPassword is required"})
//         }
//         //check
//         const user= await User.findOne({email,answer})
//         //validation
//         if(!user){
//             return res.status(404).send({
//                 success:false,
//                 message:"Wrong email or answer"
//             })
//         }
//         const hashed=await user.isPasswordCorrect(newPassword)
//         await User.findByIdAndUpdate(user._id,{password:hashed})
//         res.status(200).send({
//             success:true,
//             message:"Password Reset Successfully"
//         })


//     } catch (error) {
//         throw apiError(500,"Something went wrong for require passsword")
//     }
// }

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

        if (incomingRefreshToken) {
            throw new apiError(401, "unAuthorixed Request")
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = User.findById(decodedToken?._id)
        if (!user) {
            throw new apiError(401, "Invalid Refresh Token")
        }

        if (incomingRefreshToken !== user?.newRefreshToken) {
            throw new apiError(401, "Refres token expired or use")
        }

        const options = {
            httpOnly: true,
            secure: true,
        }
        await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "access token refreshed"
                )
            )
    } catch (error) {
        throw new apiError(401, "error")
    }


})

const addressController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { street, city, state, pin } = req.body;
        if (
            [userId, street, city, state, pin].some((field) => field?.trim() === "")
        ) {
            throw new apiError(400, "All fields are required")
        }
        const address = new Address({
            username: userId,
            street,
            city,
            state,
            pin
        });
        await address.save();
        res.status(201).json({ success: true, address, message: "Address save" })
    } catch (error) {
        throw new apiError(401, "error in addressing")
    }
}

const getAddressController = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user._id });
        res.json({ success: true, addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching addresses", error });
    }
}

const getUserProfileController = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        const address = await Address.findOne({ user: req.user._id });

        res.json({
            success: true,
            user,
            address
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching profile", error });
    }
};

const updateUserProfileController = async (req, res) => {
    try {
        const { username, password, street, city, state, pin } = req.body;

        // 🔹 Update user details
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (username) user.username = username;
        if (password) user.password = password; // password will be hashed in pre-save hook

        await user.save();

        // 🔹 Update or create address
        let address = await Address.findOne({ user: req.user._id });
        if (!address) {
            address = new Address({ user: req.user._id, street, city, state, pin });
        } else {
            // ✅ always set required fields
            address.street = street;
            address.city = city;
            address.state = state;
            address.pin = pin;
        }
        await address.save();


        res.json({ success: true, message: "Profile updated", user, address });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ success: false, message: "Error updating profile", error: error.message });
    }
};



export { registerUser, loginUser, logoutUser, refreshAccessToken, addressController, getAddressController, getUserProfileController, updateUserProfileController };