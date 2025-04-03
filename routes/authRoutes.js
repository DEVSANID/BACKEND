import express from 'express';

import rateLimit from 'express-rate-limit';
import authMiddleware from '../middlewares/authMiddleware.js'; // Add this middleware
import { signup, login, getUser, logout, forgotPassword, resetPassword } from '../controllers/authController.js';
import { registerAdmin, loginAdmin } from "../controllers/adminController.js";


const router = express.Router();

// Rate limiter for login (5 attempts per 15 minutes)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    message: 'Too many login attempts. Please try again later.'
});

// Rate limiter for signup (3 attempts per hour)
const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000,
    message: 'Too many signup attempts. Please try again later.'
});

// Authentication routes
router.post('/signup', signupLimiter, signup);
router.post('/login', loginLimiter, login);
router.get('/user', authMiddleware, getUser); // Fetch user details
router.post('/logout', logout); // Logout route
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/register-admin", registerAdmin);
router.post("/admin/login", loginAdmin);


export default router;
