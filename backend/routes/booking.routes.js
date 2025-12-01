import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  startTrip,
  endTrip,
  updateBookingLocation,
} from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create booking
router.post('/', createBooking);

// Get user bookings
router.get('/', getUserBookings);

// Get booking by ID
router.get('/:id', getBookingById);

// Update booking status
router.patch('/:id/status', updateBookingStatus);

// Start trip
router.post('/:id/start', startTrip);

// End trip
router.post('/:id/end', endTrip);

// Update booking location (for tracking)
router.post('/:id/location', updateBookingLocation);

export default router;

