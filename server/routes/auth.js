import express from "express";
import { login, register } from "../controllers/auth.js";
import { uploadBoth } from "../middleware/upload.js";
import { requestPasswordReset, resetForgottenPassword } from '../controllers/userController.js';
import { googleLogin, setGoogleUserRole } from "../controllers/googleLoginController.js";

const router = express.Router();

// Public route: login with email/password
router.post("/login", login);
router.post('/google-login', googleLogin);
// Public route: register with optional picture + CV upload
// Expects multipart/form-data with fields:
// - picture (file)
// - cvFile (file)
// - name, email, username, password, role, birth_date (text)
router.post("/register", uploadBoth, register);
router.post("/set-role", setGoogleUserRole);
// for password resetting stuff
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetForgottenPassword);

export default router;
