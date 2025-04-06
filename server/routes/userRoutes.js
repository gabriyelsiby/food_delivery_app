import express from "express";
import { upload } from "../middlewares/multer.js";
import { authUser } from "../middlewares/authUser.js";

import {
    userSignup,
    userLogin,
    userProfile,
    updateUserProfile,
    userLogout,
    checkUser,
    updateUserAddress,
} from "../controllers/userControllers.js";

const router = express.Router();

// ✅ User Signup
router.post("/signup", userSignup);

// ✅ User Login
router.post("/login", userLogin);

// ✅ Check Auth
router.get("/check-auth", authUser, checkUser);

// ✅ Get User Profile
router.get("/profile", authUser, userProfile);

// ✅ Update User Profile (with optional profile picture)
router.put("/update-profile", authUser, upload.single("profilePic"), updateUserProfile);

// ✅ Update User Address
router.put("/update-address", authUser, updateUserAddress);

// ✅ User Logout
router.get("/logout", authUser, userLogout);

export { router as userRouter };
