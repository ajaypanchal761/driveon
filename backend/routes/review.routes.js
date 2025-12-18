import express from 'express';
import { getCarReviews } from '../controllers/review.controller.js';

const router = express.Router();

// Get reviews for a car (stubbed empty response for now)
router.get('/car/:carId', getCarReviews);

export default router;


