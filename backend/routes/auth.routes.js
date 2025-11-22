import express from 'express';
import {
  register,
  sendLoginOTP,
  verifyOTP,
  resendOTP,
  refreshToken,
  logout,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/auth/register', register);
router.post('/auth/send-login-otp', sendLoginOTP);
router.post('/auth/verify-otp', verifyOTP);
router.post('/auth/resend-otp', resendOTP);
router.post('/auth/refresh-token', refreshToken);

// Protected routes
router.post('/auth/logout', authenticate, logout);

export default router;

