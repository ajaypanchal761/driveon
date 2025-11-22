import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getProfile, updateProfile, uploadPhoto, getKYCStatus } from '../controllers/user.controller.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// User profile routes
router.get('/user/profile', getProfile);
router.put('/user/profile', updateProfile);
router.post('/user/upload-photo', uploadPhoto);
router.get('/user/kyc-status', getKYCStatus);

export default router;

