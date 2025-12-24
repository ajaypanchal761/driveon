import Car from '../models/Car.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

/**
 * @desc    Get All Cars (Public)
 * @route   GET /api/cars
 * @access  Public
 */
export const getAllCars = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      brand,
      carType,
      fuelType,
      location,
      minPrice,
      maxPrice,
      status = 'active', // Only show active cars to public
      isAvailable = true,
      isFeatured,
      isPopular,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query = {
      status: 'active', // Public can only see active cars
      isAvailable: isAvailable === 'true' || isAvailable === true,
    };

    // Date range availability filter
    if (req.query.startDate && req.query.endDate) {
      const requestedStart = new Date(req.query.startDate);
      const requestedEnd = new Date(req.query.endDate);

      console.log('--- DEBUG: Checking Availability (Robust) ---');
      console.log('Request Start:', requestedStart);
      console.log('Request End:', requestedEnd);

      // 1. Broad fetch: Get all bookings that *might* overlap based on just the date part.
      // We look for any booking where the date range intersects with our date range.
      // This is a superset of actual conflicts.
      const candidateBookings = await Booking.find({
        status: { $in: ['pending', 'confirmed', 'active'] },
        $or: [
          {
            // Booking date matches or overlaps
            'tripStart.date': { $lte: requestedEnd },
            'tripEnd.date': { $gte: requestedStart }
          }
        ]
      }).select('car tripStart tripEnd status');

      const bookedCarIds = new Set();

      // 2. Precise check: Filter in memory using time components
      for (const booking of candidateBookings) {
        // Helper to combine date and time
        const getFullDateTime = (dateObj, timeStr) => {
          if (!dateObj) return null;
          const dt = new Date(dateObj);

          if (timeStr && typeof timeStr === 'string') {
            const parts = timeStr.trim().split(':'); // Handle "HH:MM"
            if (parts.length >= 2) {
              const hours = parseInt(parts[0], 10);
              const minutes = parseInt(parts[1], 10);
              if (!isNaN(hours) && !isNaN(minutes)) {
                dt.setHours(hours, minutes, 0, 0);
              }
            } else if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
              // Handle "10:30 AM" format if present (legacy support)
              const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
              if (match) {
                let h = parseInt(match[1], 10);
                const m = parseInt(match[2], 10);
                const period = match[3].toUpperCase();
                if (period === 'PM' && h < 12) h += 12;
                if (period === 'AM' && h === 12) h = 0;
                dt.setHours(h, m, 0, 0);
              }
            }
          } else {
            // If no time string (legacy), assume start of day for start, end of day for end?
            // Actually unsafe to assume, but let's default to the date object itself (usually 00:00Z)
          }
          return dt;
        };

        const bookingStart = getFullDateTime(booking.tripStart.date, booking.tripStart.time);
        const bookingEnd = getFullDateTime(booking.tripEnd.date, booking.tripEnd.time);

        if (bookingStart && bookingEnd) {
          // Strict overlap check:
          // Overlap exists if (StartA < EndB) and (EndA > StartB)
          if (bookingStart < requestedEnd && bookingEnd > requestedStart) {
            console.log(`Conflict found for Car ${booking.car}: Booking ${booking._id} (${bookingStart.toISOString()} - ${bookingEnd.toISOString()}) vs Request (${requestedStart.toISOString()} - ${requestedEnd.toISOString()})`);
            bookedCarIds.add(booking.car.toString());
          }
        }
      }

      console.log('Booked Car IDs Found (Precise):', Array.from(bookedCarIds));

      if (bookedCarIds.size > 0) {
        query._id = { $nin: Array.from(bookedCarIds) };
      }
    }

    // Search filter
    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Brand filter
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Car type filter - case-insensitive matching to show all models of the same type
    if (carType && carType !== 'all') {
      query.carType = { $regex: new RegExp(`^${carType}$`, 'i') };
    }

    // Fuel type filter
    if (fuelType && fuelType !== 'all') {
      query.fuelType = fuelType;
    }

    // Location filter
    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerDay.$lte = parseFloat(maxPrice);
    }

    // Featured filter
    if (isFeatured === 'true' || isFeatured === true) {
      query.isFeatured = true;
    }

    // Popular filter
    if (isPopular === 'true' || isPopular === true) {
      query.isPopular = true;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get cars with pagination
    const cars = await Car.find(query)
      .populate('owner', 'name email phone profilePhoto')
      .select('-rejectionReason -approvedBy')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Car.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        cars,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get all cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching cars',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get Car by ID (Public)
 * @route   GET /api/cars/:carId
 * @access  Public
 */
export const getCarById = async (req, res) => {
  try {
    const { carId } = req.params;

    const car = await Car.findById(carId)
      .populate('owner', 'name email phone profilePhoto')
      .select('-rejectionReason -approvedBy');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Only show active cars to public
    if (car.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Increment views
    car.views += 1;
    await car.save();

    res.status(200).json({
      success: true,
      data: { car },
    });
  } catch (error) {
    console.error('Get car by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching car',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get Top Brands (Public)
 * @route   GET /api/cars/brands/top
 * @access  Public
 */
export const getTopBrands = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get brands with most active cars
    const brands = await Car.aggregate([
      {
        $match: {
          status: 'active',
          isAvailable: true,
        },
      },
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 },
          avgRating: { $avg: '$averageRating' },
          totalBookings: { $sum: '$totalBookings' },
        },
      },
      {
        $sort: { count: -1, totalBookings: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          brand: '$_id',
          count: 1,
          avgRating: { $round: ['$avgRating', 1] },
          totalBookings: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: { brands },
    });
  } catch (error) {
    console.error('Get top brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching top brands',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get Top Car Types (Public)
 * @route   GET /api/cars/types/top
 * @access  Public
 */
export const getTopCarTypes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get car types with most active cars and include a sample car for each type
    const carTypes = await Car.aggregate([
      {
        $match: {
          status: 'active',
          isAvailable: true,
        },
      },
      {
        $group: {
          _id: '$carType',
          count: { $sum: 1 },
          avgRating: { $avg: '$averageRating' },
          totalBookings: { $sum: '$totalBookings' },
          // Get the first car (most recent or featured) for each type
          sampleCar: { $first: '$$ROOT' },
        },
      },
      {
        $sort: { count: -1, totalBookings: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          carType: '$_id',
          count: 1,
          avgRating: { $round: ['$avgRating', 1] },
          totalBookings: 1,
          sampleCar: {
            _id: '$sampleCar._id',
            brand: '$sampleCar.brand',
            model: '$sampleCar.model',
            year: '$sampleCar.year',
            pricePerDay: '$sampleCar.pricePerDay',
            images: '$sampleCar.images',
            primaryImage: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$sampleCar.images',
                    as: 'img',
                    cond: { $eq: ['$$img.isPrimary', true] },
                  },
                },
                0,
              ],
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: { carTypes },
    });
  } catch (error) {
    console.error('Get top car types error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching top car types',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get Available Cars Near Location (Public)
 * @route   GET /api/cars/nearby
 * @access  Public
 */
export const getNearbyCars = async (req, res) => {
  try {
    const {
      city,
      limit = 10,
      maxDistance = 50, // km
      latitude,
      longitude,
    } = req.query;

    let query = {
      status: 'active',
      isAvailable: true,
    };

    // Location filter
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    // Get cars
    let cars = await Car.find(query)
      .populate('owner', 'name email phone profilePhoto')
      .select('-rejectionReason -approvedBy')
      .sort({ isFeatured: -1, averageRating: -1, createdAt: -1 })
      .limit(parseInt(limit));

    // If coordinates provided, sort by distance (simplified - can use geospatial queries for better accuracy)
    if (latitude && longitude) {
      cars = cars.map(car => {
        if (car.location.coordinates?.latitude && car.location.coordinates?.longitude) {
          const distance = calculateDistance(
            parseFloat(latitude),
            parseFloat(longitude),
            car.location.coordinates.latitude,
            car.location.coordinates.longitude
          );
          return { ...car.toObject(), distance };
        }
        return car.toObject();
      }).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    res.status(200).json({
      success: true,
      data: { cars },
    });
  } catch (error) {
    console.error('Get nearby cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching nearby cars',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

