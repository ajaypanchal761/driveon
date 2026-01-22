import express from 'express';
import {
  register,
  sendLoginOTP,
  verifyOTP,
  resendOTP,
  refreshToken,
  logout,
  staffLogin,
  getStaffProfile,
  staffForgotPassword,
  staffResetPassword,
  saveStaffFcmToken,
  saveUserFcmToken,
} from '../controllers/auth.controller.js';
import { authenticate, authenticateStaff } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/auth/register', register);
router.post('/auth/send-login-otp', sendLoginOTP);
router.post('/auth/verify-otp', verifyOTP);
router.post('/auth/resend-otp', resendOTP);
router.post('/auth/refresh-token', refreshToken);
router.post('/auth/staff-login', staffLogin);
router.post('/auth/staff-forgot-password', staffForgotPassword);
router.post('/auth/staff-reset-password/:resetToken', staffResetPassword);

// Protected routes
router.post('/auth/logout', authenticate, logout);
router.get('/auth/staff-profile', authenticateStaff, getStaffProfile);
router.post('/auth/staff-fcm-token', authenticateStaff, saveStaffFcmToken);
router.post('/auth/user-fcm-token', authenticate, saveUserFcmToken);

export default router;

