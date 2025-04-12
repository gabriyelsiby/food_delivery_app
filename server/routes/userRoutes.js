import express from "express";
import { upload } from "../middlewares/multer.js";
import { authUser } from "../middlewares/authUser.js";
import { authAdmin } from "../middlewares/authAdmin.js";

import {
  userSignup,
  userLogin,
  userProfile,
  updateUserProfile,
  userLogout,
  checkUser,
  updateUserAddress,
  getAllUsers,
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
router.post("/logout", authUser, userLogout);

// ✅ Admin: Get All Users (requires both user auth and admin role)
router.get("/all", authAdmin, getAllUsers);

export { router as userRouter };
