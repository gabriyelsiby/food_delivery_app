import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { upload } from "../middlewares/multer.js";
import { 
    userSignup, userLogin, userProfile, updateUserProfile, userLogout 
} from "../controllers/userControllers.js";

const router = express.Router();

// ✅ User Signup
router.post("/signup", userSignup);

// ✅ User Login
router.post("/login", userLogin);

// ✅ Get User Profile
router.get("/profile", authUser, userProfile);

// ✅ Update User Profile (Including Profile Picture)
router.put("/update-profile", authUser, upload.single("profilePic"), updateUserProfile);

// ✅ User Logout
router.get("/logout", authUser, userLogout);

export { router as userRouter };
