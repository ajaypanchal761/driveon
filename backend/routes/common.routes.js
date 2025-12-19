import express from 'express';
import {
  getHeroBanners,
  getFAQs,
  getPromotionalBanner,
  getBannerOverlay,
  searchPlaces,
  getReturningCars,
} from '../controllers/common.controller.js';

const router = express.Router();

// Public routes
router.get('/banners/hero', getHeroBanners);
router.get('/banners/promotional', getPromotionalBanner);
router.get('/banners/overlay', getBannerOverlay);
router.get('/faqs', getFAQs);
router.get('/places/search', searchPlaces);
router.get('/returning-cars', getReturningCars);

export default router;




