import {Router} from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken, addressController, getAddressController, getUserProfileController, updateUserProfileController } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT} from "../middlewares/auth.middlewares.js";
import { isAdmin } from "../middlewares/admin.middlewares.js";
const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)
//router.route("/login").post(registerUser)

router.route("/login").post(loginUser)

//forgot password
//router.route("/forgotPassword").post(forgotPassword)

//secured route
//router.route("/logout").post(verifyJWT, logoutUser)
router.route("/logout").post(logoutUser); // ❌ No verifyJWT here

router.route("/access-token").post(refreshAccessToken)

router.get("/user-auth", verifyJWT, (req, res) => {
  res.status(200).send({ ok: true });
});

router.post('/admin/create-track', verifyJWT, isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
});

router.post("/address",verifyJWT,addressController)

router.post("/get-address",verifyJWT,getAddressController)


router.get("/profile", verifyJWT, getUserProfileController);
router.put("/update-profile", verifyJWT, updateUserProfileController);

export default router;