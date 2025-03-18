import express from "express";
import { 
    checkUser, 
    userSignup, 
    userLogin, 
    userLogout, 
    updateUserProfile, 
    userProfile 
} from "../controllers/userControllers.js";  // ✅ Ensure the path is correct

import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/profile", authUser, userProfile);
router.put("/profile-update", authUser, updateUserProfile);
router.get("/logout", userLogout);
router.get("/check-user", authUser, checkUser);

export { router as userRouter };
