import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.middleware.js';
import { getProfile, updateProfile, uploadPhoto, getKYCStatus, updateLocation, changePassword } from '../controllers/user.controller.js';
import {
  getMyGuarantorRequests,
  getGuarantorRequestDetails,
  acceptGuarantorRequest,
  rejectGuarantorRequest,
} from '../controllers/user.guarantor.controller.js';
import { validateCoupon } from '../controllers/admin.coupon.controller.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// User profile routes
router.get('/user/profile', getProfile);
router.put('/user/profile', updateProfile);
router.put('/user/change-password', changePassword);

// Upload photo route with multer middleware
// Access multer instance from app.locals (set in server.js)
router.post('/user/upload-photo', (req, res, next) => {
  const upload = req.app.locals.upload;
  if (!upload) {
    return res.status(500).json({
      success: false,
      message: 'File upload service not configured',
    });
  }
  upload.single('photo')(req, res, (err) => {
    if (err) {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum size is 5MB.',
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload error',
        });
      }
      // Handle other errors (like file filter errors)
      if (err.message) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      return next(err);
    }
    next();
  });
}, uploadPhoto);

router.get('/user/kyc-status', getKYCStatus);

// Location update route
router.post('/user/update-location', updateLocation);

// ============================================
// GUARANTOR REQUEST ROUTES - PROTECTED
// ============================================

// Get My Guarantor Requests - PROTECTED
// Route: GET /api/user/guarantor-requests
router.get('/user/guarantor-requests', getMyGuarantorRequests);

// Get Guarantor Request Details - PROTECTED
// Route: GET /api/user/guarantor-requests/:id
router.get('/user/guarantor-requests/:id', getGuarantorRequestDetails);

// Accept Guarantor Request - PROTECTED
// Route: POST /api/user/guarantor-requests/:id/accept
router.post('/user/guarantor-requests/:id/accept', acceptGuarantorRequest);

// Reject Guarantor Request - PROTECTED
// Route: POST /api/user/guarantor-requests/:id/reject
router.post('/user/guarantor-requests/:id/reject', rejectGuarantorRequest);

// ============================================
// COUPON ROUTES - PROTECTED
// ============================================

// Validate Coupon - PROTECTED
// Route: POST /api/coupons/validate
router.post('/coupons/validate', validateCoupon);

export default router;


