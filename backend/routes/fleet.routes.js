import express from 'express';
import {
    getOutwardCars,
    createOutwardCar,
    getOutwardBookings,
    createOutwardBooking,
    createFleetRazorpayOrder,
    verifyFleetRazorpayPayment
} from '../controllers/fleet.controller.js';

const router = express.Router();

router.route('/outward-cars')
    .get(getOutwardCars)
    .post(createOutwardCar);

router.route('/outward-bookings')
    .get(getOutwardBookings)
    .post(createOutwardBooking);

router.post('/razorpay/create-order', createFleetRazorpayOrder);
router.post('/razorpay/verify', verifyFleetRazorpayPayment);

export default router;
