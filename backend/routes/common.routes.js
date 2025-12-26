import express from 'express';
import {
  getHeroBanners,
  getFAQs,
  getPromotionalBanner,
  getBannerOverlay,
  searchPlaces,
  getReturningCars,
  getCarSpecificCoupons,
} from '../controllers/common.controller.js';
import { getAddOnServicesPrices } from '../controllers/addonServices.controller.js';

const router = express.Router();

// Public routes
router.get('/banners/hero', getHeroBanners);
router.get('/banners/promotional', getPromotionalBanner);
router.get('/banners/overlay', getBannerOverlay);
router.get('/faqs', getFAQs);
router.get('/places/search', searchPlaces);
router.get('/addon-services/prices', getAddOnServicesPrices);
router.get('/returning-cars', getReturningCars);
router.get('/coupons/car-specific', getCarSpecificCoupons);

export default router;

