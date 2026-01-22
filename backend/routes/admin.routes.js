import express from 'express';
import {
  adminSignup,
  adminLogin,
  refreshAdminToken,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getDashboardStats,
  getSystemSettings,
  updateSystemSettings,
  adminLogout,
  getAllUsers,
  getUserById,
  updateUserStatus,
  getAllReferrals,
  updateReferralPoints,
  sendNotification,
} from '../controllers/admin.controller.js';
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  updateCarStatus,
  deleteCar,
  toggleFeatured,
  togglePopular,
} from '../controllers/admin.car.controller.js';
import {
  getAllTickets,
  getTicketByIdAdmin,
  updateTicketStatus,
  addAdminResponse,
} from '../controllers/support.controller.js';
import {
  getAllBookings,
  getBookingById,
  updateBooking,
  getActiveBookingsWithTracking,
  getBookingStats,
} from '../controllers/admin.booking.controller.js';
import {
  sendGuarantorRequest,
  getAllGuarantorRequests,
  getGuarantorRequestById,
  deleteGuarantorRequest,
  getBookingGuarantorPoints,
} from '../controllers/admin.guarantor.controller.js';
import {
  getLatestLocations,
  getUserLocationHistory,
} from '../controllers/location.controller.js';
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  getCouponUsage,
} from '../controllers/admin.coupon.controller.js';
import {
  getAdminAddOnServicesPrices,
  updateAddOnServicesPrices,
} from '../controllers/addonServices.controller.js';
import { authenticateAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

// ============================================
// PUBLIC ROUTES - NO AUTHENTICATION REQUIRED
// ============================================
// IMPORTANT: Router is mounted at '/api/admin' in server.js
// So routes here are relative to '/api/admin'
// Example: '/login' becomes '/api/admin/login'

// Signup - PUBLIC
// Route: POST /api/admin/signup
router.post('/signup', adminSignup);

// Login - PUBLIC (NO MIDDLEWARE - goes directly to controller)
// Route: POST /api/admin/login
router.post('/login', adminLogin);

// Refresh token - PUBLIC
// Route: POST /api/admin/refresh-token
router.post('/refresh-token', refreshAdminToken);

// ============================================
// PROTECTED ROUTES - AUTHENTICATION REQUIRED
// ============================================

// Get Admin Profile - PROTECTED
// Route: GET /api/admin/profile
router.get('/profile', authenticateAdmin, getAdminProfile);

// Update Admin Profile - PROTECTED
// Route: PUT /api/admin/profile
router.put('/profile', authenticateAdmin, updateAdminProfile);

// Change Admin Password - PROTECTED
// Route: PUT /api/admin/change-password
router.put('/change-password', authenticateAdmin, changeAdminPassword);

// Get Dashboard Statistics - PROTECTED
// Route: GET /api/admin/dashboard/stats
router.get('/dashboard/stats', authenticateAdmin, getDashboardStats);

// Get System Settings - PROTECTED
// Route: GET /api/admin/settings
router.get('/settings', authenticateAdmin, getSystemSettings);

// Update System Settings - PROTECTED
// Route: PUT /api/admin/settings
router.put('/settings', authenticateAdmin, updateSystemSettings);

// Admin Logout - PROTECTED
// Route: POST /api/admin/logout
router.post('/logout', authenticateAdmin, adminLogout);

// ============================================
// USER MANAGEMENT ROUTES - PROTECTED
// ============================================

// Get All Users - PROTECTED
// Route: GET /api/admin/users
router.get('/users', authenticateAdmin, getAllUsers);

// Get User by ID - PROTECTED
// Route: GET /api/admin/users/:userId
router.get('/users/:userId', authenticateAdmin, getUserById);

// Update User Status - PROTECTED
// Route: PUT /api/admin/users/:userId/status
router.put('/users/:userId/status', authenticateAdmin, updateUserStatus);

// ============================================
// CAR MANAGEMENT ROUTES - PROTECTED
// ============================================

// Get All Cars - PROTECTED
// Route: GET /api/admin/cars
router.get('/cars', authenticateAdmin, getAllCars);

// Create New Car - PROTECTED
// Route: POST /api/admin/cars
// Note: Multer middleware will be applied in the route handler
router.post('/cars', authenticateAdmin, async (req, res, next) => {
  // Use multer middleware for file uploads
  const upload = req.app.locals.upload;
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'rcDocument', maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error',
      });
    }
    next();
  });
}, createCar);

// Get Car by ID - PROTECTED
// Route: GET /api/admin/cars/:carId
router.get('/cars/:carId', authenticateAdmin, getCarById);

// Update Car - PROTECTED
// Route: PUT /api/admin/cars/:carId
router.put('/cars/:carId', authenticateAdmin, async (req, res, next) => {
  // Use multer middleware for file uploads
  const upload = req.app.locals.upload;
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'rcDocument', maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error',
      });
    }
    next();
  });
}, updateCar);

// Update Car Status - PROTECTED
// Route: PUT /api/admin/cars/:carId/status
router.put('/cars/:carId/status', authenticateAdmin, updateCarStatus);

// Delete Car - PROTECTED
// Route: DELETE /api/admin/cars/:carId
router.delete('/cars/:carId', authenticateAdmin, deleteCar);

// Toggle Featured Status - PROTECTED
// Route: PUT /api/admin/cars/:carId/featured
router.put('/cars/:carId/featured', authenticateAdmin, toggleFeatured);

// Toggle Popular Status - PROTECTED
// Route: PUT /api/admin/cars/:carId/popular
router.put('/cars/:carId/popular', authenticateAdmin, togglePopular);

// ============================================
// SUPPORT TICKET MANAGEMENT ROUTES - PROTECTED
// ============================================

// Get All Support Tickets - PROTECTED
// Route: GET /api/admin/tickets
router.get('/tickets', authenticateAdmin, getAllTickets);

// Get Ticket by ID - PROTECTED
// Route: GET /api/admin/tickets/:ticketId
router.get('/tickets/:ticketId', authenticateAdmin, getTicketByIdAdmin);

// Update Ticket Status - PROTECTED
// Route: PUT /api/admin/tickets/:ticketId/status
router.put('/tickets/:ticketId/status', authenticateAdmin, updateTicketStatus);

// Add Admin Response - PROTECTED
// Route: POST /api/admin/tickets/:ticketId/response
router.post('/tickets/:ticketId/response', authenticateAdmin, addAdminResponse);

// ============================================
// BOOKING MANAGEMENT ROUTES - PROTECTED
// ============================================

// Get All Bookings - PROTECTED
// Route: GET /api/admin/bookings
router.get('/bookings', authenticateAdmin, getAllBookings);

// Get Booking Statistics - PROTECTED
// Route: GET /api/admin/bookings/stats
router.get('/bookings/stats', authenticateAdmin, getBookingStats);

// Get Active Bookings with Tracking - PROTECTED
// Route: GET /api/admin/bookings/active/tracking
router.get('/bookings/active/tracking', authenticateAdmin, getActiveBookingsWithTracking);

// Get Booking by ID - PROTECTED
// Route: GET /api/admin/bookings/:id
router.get('/bookings/:id', authenticateAdmin, getBookingById);

// Update Booking - PROTECTED
// Route: PATCH /api/admin/bookings/:id
router.patch('/bookings/:id', authenticateAdmin, updateBooking);

// ============================================
// GUARANTOR REQUEST MANAGEMENT ROUTES - PROTECTED
// ============================================

// Send Guarantor Request - PROTECTED
// Route: POST /api/admin/guarantor-requests
router.post('/guarantor-requests', authenticateAdmin, sendGuarantorRequest);

// Get All Guarantor Requests - PROTECTED
// Route: GET /api/admin/guarantor-requests
router.get('/guarantor-requests', authenticateAdmin, getAllGuarantorRequests);

// Get Guarantor Request by ID - PROTECTED
// Route: GET /api/admin/guarantor-requests/:id
router.get('/guarantor-requests/:id', authenticateAdmin, getGuarantorRequestById);

// Delete Guarantor Request - PROTECTED
// Route: DELETE /api/admin/guarantor-requests/:id
router.delete('/guarantor-requests/:id', authenticateAdmin, deleteGuarantorRequest);

// Route: GET /api/admin/bookings/:bookingId/guarantor-points
router.get('/bookings/:bookingId/guarantor-points', authenticateAdmin, getBookingGuarantorPoints);

// ============================================
// LOCATION TRACKING ROUTES - PROTECTED
// ============================================

// Get Latest Locations - PROTECTED
// Route: GET /api/admin/locations/latest
router.get('/locations/latest', authenticateAdmin, getLatestLocations);

// Get User Location History - PROTECTED
// Route: GET /api/admin/locations/user/:userId
router.get('/locations/user/:userId', authenticateAdmin, getUserLocationHistory);

// ============================================
// COUPON MANAGEMENT ROUTES - PROTECTED
// ============================================

// Create Coupon - PROTECTED
// Route: POST /api/admin/coupons
router.post('/coupons', authenticateAdmin, createCoupon);

// Get All Coupons - PROTECTED
// Route: GET /api/admin/coupons
router.get('/coupons', authenticateAdmin, getAllCoupons);

// Get Coupon by ID - PROTECTED
// Route: GET /api/admin/coupons/:id
router.get('/coupons/:id', authenticateAdmin, getCouponById);

// Update Coupon - PROTECTED
// Route: PUT /api/admin/coupons/:id
router.put('/coupons/:id', authenticateAdmin, updateCoupon);

// Delete Coupon - PROTECTED
// Route: DELETE /api/admin/coupons/:id
router.delete('/coupons/:id', authenticateAdmin, deleteCoupon);

// Toggle Coupon Status - PROTECTED
// Route: PATCH /api/admin/coupons/:id/toggle
router.patch('/coupons/:id/toggle', authenticateAdmin, toggleCouponStatus);

// Get Coupon Usage Statistics - PROTECTED
// Route: GET /api/admin/coupons/:id/usage
router.get('/coupons/:id/usage', authenticateAdmin, getCouponUsage);

// ============================================
// ADD-ON SERVICES MANAGEMENT ROUTES - PROTECTED
// ============================================

// Get Add-On Services Prices - PROTECTED
// Route: GET /api/admin/addon-services/prices
router.get('/addon-services/prices', authenticateAdmin, getAdminAddOnServicesPrices);

// Update Add-On Services Prices - PROTECTED
// Route: PUT /api/admin/addon-services/prices
router.put('/addon-services/prices', authenticateAdmin, updateAddOnServicesPrices);

// ============================================
// REFERRAL MANAGEMENT ROUTES - PROTECTED
// ============================================

// Get All Referrals - PROTECTED
// Route: GET /api/admin/referrals
router.get('/referrals', authenticateAdmin, getAllReferrals);

// Update Referral Points - PROTECTED
// Route: PUT /api/admin/referrals/:referralId/points
router.put('/referrals/:referralId/points', authenticateAdmin, updateReferralPoints);

// Send Manual Notification - PROTECTED
// Route: POST /api/admin/send-notification
router.post('/send-notification', sendNotification);

export default router;

