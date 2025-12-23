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
      availabilityStart,
      availabilityEnd,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
    } = req.query;

    // Build query
    const query = {
      status: 'active', // Public can only see active cars
      isAvailable: isAvailable === 'true' || isAvailable === true,
    };

    // Availability Filter (Database Check + Time Verification)
    // Handle various frontend parameter names for dates and times
    const reqStartDate = availabilityStart || startDate || req.query.pickupDate;
    const reqEndDate = availabilityEnd || endDate || req.query.dropoffDate;
    const reqStartTime = req.query.pickupTime || '00:00 am'; // Default to start of day if not provided
    const reqEndTime = req.query.dropoffTime || '11:59 pm';  // Default to end of day if not provided

    // Helper to parse dates (handles DD-MM-YYYY and ISO)
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      if (dateStr instanceof Date) return dateStr;

      // Check for DD-MM-YYYY format (e.g., 23-12-2025)
      if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}/.test(dateStr)) {
        const parts = dateStr.split(/[-/]/);
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
      return new Date(dateStr);
    };

    // Helper to combine Date and Time string into full Date object
    // Time format expected: "10:30 am" or "10:30 pm"
    const parseDateTime = (dateObj, timeStr) => {
      if (!dateObj || isNaN(dateObj.getTime())) return null;

      const dateTime = new Date(dateObj);
      dateTime.setHours(0, 0, 0, 0); // Reset time part

      if (!timeStr) return dateTime;

      try {
        const [time, period] = timeStr.toLowerCase().split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'pm' && hours !== 12) hours += 12;
        if (period === 'am' && hours === 12) hours = 0;

        dateTime.setHours(hours, minutes, 0, 0);
      } catch (e) {
        console.error('Error parsing time:', timeStr, e);
      }

      return dateTime;
    };

    if (reqStartDate && reqEndDate) {
      const startDateObj = parseDate(reqStartDate);
      let endDateObj = parseDate(reqEndDate);

      if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
        // Set end date to end of day to capture all potential bookings on that day
        endDateObj.setHours(23, 59, 59, 999);

        // Create full datetime objects for the request
        const requestStart = parseDateTime(startDateObj, reqStartTime);
        const requestEnd = parseDateTime(endDateObj, reqEndTime);

        console.log('🔍 Checking availability for:', {
          reqDate: reqStartDate, reqTime: reqStartTime,
          parsedStart: requestStart.toLocaleString(),
          parsedEnd: requestEnd.toLocaleString(),
          dbQueryEnd: endDateObj.toLocaleString()
        });

        // 1. Initial DB Query: Find bookings that overlap on DATES (broad filter)
        // We still use the date fields for initial filtering to be efficient
        const potentialConflicts = await Booking.find({
          status: { $in: ['confirmed', 'active', 'pending'] },
          $or: [
            {
              'tripStart.date': { $lte: endDateObj },
              'tripEnd.date': { $gte: startDateObj }
            }
          ]
        }).select('car tripStart tripEnd'); // Select tripStart/tripEnd to check times

        // 2. Precise Filter: Check exact time overlaps in memory
        const bookedCarIds = potentialConflicts.filter(booking => {
          // Construct booking full start/end times
          // Note: Booking model stores date as Date and time as String ("HH:mm am/pm")
          // We use the same parseDateTime helper
          const bookingStart = parseDateTime(new Date(booking.tripStart.date), booking.tripStart.time);
          const bookingEnd = parseDateTime(new Date(booking.tripEnd.date), booking.tripEnd.time);

          // Overlap condition: (StartA < EndB) && (EndA > StartB)
          const isOverlapping = (requestStart < bookingEnd) && (requestEnd > bookingStart);

          if (isOverlapping) {
            console.log(`❌ Collision found for Car ${booking.car}:`);
            console.log(`   Req: ${requestStart.toLocaleString()} - ${requestEnd.toLocaleString()}`);
            console.log(`   Bkg: ${bookingStart.toLocaleString()} - ${bookingEnd.toLocaleString()}`);
          }

          return isOverlapping;
        }).map(b => b.car);

        if (bookedCarIds.length > 0) {
          console.log(`❌ Excluding ${bookedCarIds.length} booked cars due to time overlap`);
          query._id = { $nin: bookedCarIds };
        } else {
          console.log('✅ No time overlaps found (Dates matched, but times were clear)');
        }
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

