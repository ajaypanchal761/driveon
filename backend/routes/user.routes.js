import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.middleware.js';
import { getProfile, updateProfile, uploadPhoto, getKYCStatus, updateLocation } from '../controllers/user.controller.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// User profile routes
router.get('/user/profile', getProfile);
router.put('/user/profile', updateProfile);

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

export default router;


