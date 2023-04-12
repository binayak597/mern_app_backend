import { Router } from "express";
import { getUser, loginUser, registerUser,
         updateUser, generateOTP,
        verifyOTP, resetPassword, createResetSession } from "../controllers/userController.js";
import { localVariables } from "../middlewares/auth.js";
import { registerEmail } from "../controllers/mailer.js";
import { verifyUser } from "../middlewares/verifyUser.js";



const router = Router();

router.get("/username/:userName", getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/authenticate", verifyUser, (req, res) => res.end());
router.put("/update", updateUser);
router.get("/generateOTP", verifyUser, localVariables, generateOTP);
router.get("/verifyOTP", verifyUser, verifyOTP);
router.put("/resetPassword", verifyUser, resetPassword);
router.post("/registerMail", registerEmail);
router.get("/createResetSession", createResetSession);


export { router };