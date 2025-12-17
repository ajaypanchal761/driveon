import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard, Mousewheel } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import CarDetailsHeader from '../components/layout/CarDetailsHeader';
import { colors } from '../theme/colors';
import useInViewAnimation from '../hooks/useInViewAnimation';
import { useAppSelector } from '../../hooks/redux';
import reviewService from '../../services/review.service';
import carService from '../../services/car.service';
import commonService from '../../services/common.service';

// Import car images
import carImg1 from '../../assets/car_img1-removebg-preview.png';
import carImg4 from '../../assets/car_img4-removebg-preview.png';
import carImg5 from '../../assets/car_img5-removebg-preview.png';
import carImg6 from '../../assets/car_img6-removebg-preview.png';
import carImg8 from '../../assets/car_img8.png';
import carBanImg1 from '../../assets/car_banImg1.jpg';
import carBanImg3 from '../../assets/car_banImg3-removebg-preview.png';

/**
 * Helper function to detect car facing direction
 * Returns 'left' or 'right' based on image filename or URL
 */
const getCarFacingDirection = (imageUrl) => {
  if (!imageUrl) return 'right'; // Default to right
  
  // Convert to string if it's an imported module
  const imagePath = typeof imageUrl === 'string' ? imageUrl : imageUrl.src || '';
  const lowerPath = imagePath.toLowerCase();
  
  // Check filename for direction indicators
  if (lowerPath.includes('front-left') || lowerPath.includes('left-front') || 
      lowerPath.includes('facing-left') || lowerPath.includes('_left')) {
    return 'left';
  }
  
  if (lowerPath.includes('front-right') || lowerPath.includes('right-front') || 
      lowerPath.includes('facing-right') || lowerPath.includes('_right')) {
    return 'right';
  }
  
  // Check for side profile indicators
  if (lowerPath.includes('side-left') || lowerPath.includes('left-side')) {
    return 'left';
  }
  
  if (lowerPath.includes('side-right') || lowerPath.includes('right-side')) {
    return 'right';
  }
  
  // Try to detect from specific car image names
  // Based on common car image naming patterns
  if (lowerPath.includes('car_img1') || lowerPath.includes('ferrari')) {
    // Ferrari FF - typically front-facing left
    return 'left';
  }
  
  if (lowerPath.includes('car_img4') || lowerPath.includes('lamborghini')) {
    // Lamborghini - typically front-facing left
    return 'left';
  }
  
  if (lowerPath.includes('car_img5') || lowerPath.includes('bmw') && lowerPath.includes('gts')) {
    // BMW GTS - typically side profile facing right
    return 'right';
  }
  
  if (lowerPath.includes('car_img6') || lowerPath.includes('tesla')) {
    // Tesla - typically front-facing left
    return 'left';
  }
  
  if (lowerPath.includes('car_img8') || lowerPath.includes('bmw') && !lowerPath.includes('gts')) {
    // BMW side profile - typically facing right
    return 'right';
  }
  
  // Default: assume right-facing (most common)
  return 'right';
};

/**
 * CarDetailsPage Component
 * Car details page matching the design images
 */
const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState('offers');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [offers, setOffers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [cancellationPolicy, setCancellationPolicy] = useState(null);
  const [inclusionsExclusions, setInclusionsExclusions] = useState([]);

  // Get authentication state
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);

  // Refs for section scrolling
  const offersRef = useRef(null);
  const reviewsRef = useRef(null);
  const locationRef = useRef(null);
  const featuresRef = useRef(null);
  const cancellationRef = useRef(null);
  const inclusionExclusionRef = useRef(null);
  const faqsRef = useRef(null);

  // Mock car data - used only when no initial car is provided and API data isn't available
  // Structure matches document.txt requirements: Model, Brand, Seats, Transmission, Fuel Type, Color, Features, Rating, Reviews, Owner Details, Price
  const getCarData = () => {
    const cars = {
      '1': {
        id: 1,
        brand: 'Ferrari',
        model: 'FF',
        name: 'Ferrari-FF', // For display compatibility
        image: carImg1,
        images: [carImg1],
        rating: 5.0,
        reviewsCount: 100,
        location: 'Washington DC',
        seats: 4,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        color: 'Red',
        carType: 'Sports',
        year: 2020,
        price: 200,
        pricePerDay: 200,
        description: 'A car with high specs that are rented at an affordable price.',
        owner: {
          name: 'Hela Quintin',
          profilePic: 'https://via.placeholder.com/50',
          verified: true,
          rating: 4.9
        },
        host: {
          name: 'Hela Quintin',
          profilePic: 'https://via.placeholder.com/50',
          verified: true
        },
        features: [
          'Air Conditioning',
          'GPS Navigation',
          'Bluetooth',
          'USB Charging',
          'Leather Seats',
          'Sunroof',
          'Autopilot',
          'Premium Sound System'
        ],
        featureIcons: [
          { icon: 'seat', label: 'Capacity', value: '4 Seats' },
          { icon: 'engine', label: 'Engine', value: '670 HP' },
          { icon: 'speed', label: 'Max Speed', value: '250km/h' },
          { icon: 'autopilot', label: 'Autopilot', value: 'Available' },
          { icon: 'charge', label: 'Fuel Economy', value: '12 km/l' },
          { icon: 'parking', label: 'Parking', value: 'Auto Parking' }
        ],
        reviews: [
          {
            name: 'Mr. Jack',
            profilePic: 'https://via.placeholder.com/40',
            rating: '5.0',
            comment: 'The rental car was clean, reliable, and the service was quick and efficient.'
          },
          {
            name: 'Robert',
            profilePic: 'https://via.placeholder.com/40',
            rating: '5.0',
            comment: 'The rental car was clean, r and the service was quick'
          }
        ]
      },
      '2': {
        id: 2,
        brand: 'Tesla',
        model: 'Model S',
        name: 'Tesla Model S',
        image: carImg6,
        images: [carImg6],
        rating: 5.0,
        reviewsCount: 125,
        location: 'Chicago, USA',
        seats: 5,
        transmission: 'Automatic',
        fuelType: 'Electric',
        color: 'White',
        carType: 'Sedan',
        year: 2023,
        price: 100,
        pricePerDay: 100,
        description: 'A car with high specs that are rented at an affordable price.',
        owner: {
          name: 'Hela Quintin',
          profilePic: 'https://via.placeholder.com/50',
          verified: true,
          rating: 5.0
        },
        host: {
          name: 'Hela Quintin',
          profilePic: 'https://via.placeholder.com/50',
          verified: true
        },
        features: [
          'Air Conditioning',
          'GPS Navigation',
          'Bluetooth',
          'USB Charging',
          'Leather Seats',
          'Autopilot',
          'Supercharging',
          'Premium Sound System'
        ],
        featureIcons: [
          { icon: 'seat', label: 'Capacity', value: '5 Seats' },
          { icon: 'engine', label: 'Power', value: '670 HP' },
          { icon: 'speed', label: 'Max Speed', value: '250km/h' },
          { icon: 'autopilot', label: 'Autopilot', value: 'Available' },
          { icon: 'charge', label: 'Range', value: '405 Miles' },
          { icon: 'parking', label: 'Parking', value: 'Auto Parking' }
        ],
        reviews: [
          {
            name: 'Mr. Jack',
            profilePic: 'https://via.placeholder.com/40',
            rating: '5.0',
            comment: 'The rental car was clean, reliable, and the service was quick and efficient.'
          },
          {
            name: 'Robert',
            profilePic: 'https://via.placeholder.com/40',
            rating: '5.0',
            comment: 'The rental car was clean, r and the service was quick'
          }
        ]
      },
      '3': {
        id: 3,
        brand: 'BMW',
        model: '3 Series',
        name: 'BMW 3 Series',
        image: carImg8,
        images: [carImg8],
        rating: 5.0,
        reviewsCount: 125,
        location: 'New York',
        seats: 5,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        color: 'Black',
        carType: 'Sedan',
        year: 2022,
        price: 150,
        pricePerDay: 150,
        description: 'A car with high specs that are rented at an affordable price.',
        owner: {
          name: 'Hela Quintin',
          profilePic: 'https://via.placeholder.com/50',
          verified: true,
          rating: 4.8
        },
        host: {
          name: 'Hela Quintin',
          profilePic: 'https://via.placeholder.com/50',
          verified: true
        },
        features: [
          'Air Conditioning',
          'GPS Navigation',
          'Bluetooth',
          'USB Charging',
          'Leather Seats',
          'Sunroof',
          'Backup Camera',
          'Parking Sensors'
        ],
        featureIcons: [
          { icon: 'seat', label: 'Capacity', value: '5 Seats' },
          { icon: 'engine', label: 'Engine', value: '330 HP' },
          { icon: 'speed', label: 'Max Speed', value: '250km/h' },
          { icon: 'autopilot', label: 'Technology', value: 'iDrive' },
          { icon: 'charge', label: 'Fuel Economy', value: '15 km/l' },
          { icon: 'parking', label: 'Parking', value: 'Auto Parking' }
        ],
        reviews: [
          {
            name: 'Mr. Jack',
            profilePic: 'https://via.placeholder.com/40',
            rating: '5.0',
            comment: 'The rental car was clean, reliable, and the service was quick and efficient.'
          },
          {
            name: 'Robert',
            profilePic: 'https://via.placeholder.com/40',
            rating: '5.0',
            comment: 'The rental car was clean, r and the service was quick'
          }
        ]
      },
      '4': {
        id: 4,
        brand: 'Lamborghini',
        model: 'Aventador',
        name: 'Lamborghini Aventador',
        image: carImg4,
        images: [carImg4],
        rating: 4.9,
        reviewsCount: 80,
        location: 'New York',
        seats: 2,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        color: 'Yellow',
        carType: 'Sports',
        year: 2021,
        price: 250,
        pricePerDay: 250,
        description: 'A car with high specs that are rented at an affordable price.',
        owner: {
          name: 'Hela Quintin',
          profilePic: 'https://via.placeholder.com/50',
          verified: true,
          rating: 4.9
        },
        host: {
          name: 'Hela Quintin',
          profilePic: 'https://via.placeholder.com/50',
          verified: true
        },
        features: [
          'Air Conditioning',
          'GPS Navigation',
          'Bluetooth',
          'USB Charging',
          'Leather Seats',
          'Premium Sound System',
          'Sport Mode',
          'Launch Control'
        ],
        featureIcons: [
          { icon: 'seat', label: 'Capacity', value: '2 Seats' },
          { icon: 'engine', label: 'Engine', value: '730 HP' },
          { icon: 'speed', label: 'Max Speed', value: '350km/h' },
          { icon: 'autopilot', label: 'Drive Mode', value: 'Sport' },
          { icon: 'charge', label: 'Fuel Economy', value: '8 km/l' },
          { icon: 'parking', label: 'Parking', value: 'Auto Parking' }
        ],
        reviews: [
          {
            name: 'Mr. Jack',
            profilePic: 'https://via.placeholder.com/40',
            rating: '4.9',
            comment: 'The rental car was clean, reliable, and the service was quick and efficient.'
          },
          {
            name: 'Robert',
            profilePic: 'https://via.placeholder.com/40',
            rating: '4.9',
            comment: 'The rental car was clean, r and the service was quick'
          }
        ]
      },
      '5': {
        id: 5,
        brand: 'BMW',
        model: 'M2 GTS',
        name: 'BMW M2 GTS',
        image: carImg5,
        images: [carImg5],
        rating: 5.0,
        reviewsCount: 95,
        location: 'Los Angeles',
        seats: 5,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        color: 'Blue',
        carType: 'Sports',
        year: 2023,
        price: 150,
        pricePerDay: 150,
        description: 'A car with high specs that are rented at an affordable price.',
        owner: {
          name: 'Hela Quintin',
          profilePic: 'https://via.placeholder.com/50',
          verified: true,
          rating: 5.0
        },
        host: {
          name: 'Hela Quintin',
          profilePic: 'https://via.placeholder.com/50',
          verified: true
        },
        features: [
          'Air Conditioning',
          'GPS Navigation',
          'Bluetooth',
          'USB Charging',
          'Leather Seats',
          'Sunroof',
          'Sport Mode',
          'Premium Sound System'
        ],
        featureIcons: [
          { icon: 'seat', label: 'Capacity', value: '5 Seats' },
          { icon: 'engine', label: 'Engine', value: '450 HP' },
          { icon: 'speed', label: 'Max Speed', value: '280km/h' },
          { icon: 'autopilot', label: 'Drive Mode', value: 'Sport' },
          { icon: 'charge', label: 'Fuel Economy', value: '12 km/l' },
          { icon: 'parking', label: 'Parking', value: 'Auto Parking' }
        ],
        reviews: [
          {
            name: 'Mr. Jack',
            profilePic: 'https://via.placeholder.com/40',
            rating: '5.0',
            comment: 'The rental car was clean, reliable, and the service was quick and efficient.'
          },
          {
            name: 'Robert',
            profilePic: 'https://via.placeholder.com/40',
            rating: '5.0',
            comment: 'The rental car was clean, r and the service was quick'
          }
        ]
      },
      'bmw-i7': {
        id: 'bmw-i7',
        brand: 'BMW',
        model: 'i7',
        name: 'BMW i7',
        image: carBanImg3,
        images: [carBanImg3],
        rating: 5.0,
        reviewsCount: 150,
        location: 'New York',
        seats: 5,
        transmission: 'Automatic',
        fuelType: 'Electric',
        color: 'Silver',
        carType: 'Luxury',
        year: 2024,
        price: 800,
        pricePerDay: 800,
        description: 'Experience luxury and innovation with the BMW i7. This premium electric sedan combines cutting-edge technology with exceptional comfort and performance.',
        owner: {
          name: 'BMW Premium',
          profilePic: 'https://via.placeholder.com/50',
          verified: true,
          rating: 5.0
        },
        host: {
          name: 'BMW Premium',
          profilePic: 'https://via.placeholder.com/50',
          verified: true
        },
        features: [
          'Air Conditioning',
          'GPS Navigation',
          'Bluetooth',
          'USB Charging',
          'Leather Seats',
          'Sunroof',
          'Autopilot',
          'Premium Sound System',
          'Wireless Charging',
          'Massage Seats'
        ],
        featureIcons: [
          { icon: 'seat', label: 'Capacity', value: '5 Seats' },
          { icon: 'engine', label: 'Power', value: '544 HP' },
          { icon: 'speed', label: 'Max Speed', value: '250km/h' },
          { icon: 'autopilot', label: 'Technology', value: 'Electric Drive' },
          { icon: 'charge', label: 'Range', value: '625 km' },
          { icon: 'parking', label: 'Parking', value: 'Auto Parking' }
        ],
        reviews: [
          {
            name: 'Mr. Jack',
            profilePic: 'https://via.placeholder.com/40',
            rating: '5.0',
            comment: 'The BMW i7 exceeded all expectations. Luxurious, powerful, and incredibly smooth ride.'
          },
          {
            name: 'Robert',
            profilePic: 'https://via.placeholder.com/40',
            rating: '5.0',
            comment: 'Best luxury car rental experience. The electric drive is silent and powerful.'
          }
        ]
      },
      'audi-r8': {
        id: 'audi-r8',
        brand: 'Audi',
        model: 'R8 Performance',
        name: 'Audi R8 Performance',
        image: carBanImg1,
        rating: 5.0,
        reviewsCount: 120,
        location: 'Los Angeles, USA',
        seats: 2,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        color: 'Silver',
        carType: 'Sports',
        year: 2023,
        price: 800,
        pricePerDay: 800,
        description: 'Experience the ultimate in performance and luxury with the Audi R8 Performance. A supercar that combines breathtaking speed with everyday usability.',
        owner: {
          name: 'Audi Premium',
          profilePic: 'https://via.placeholder.com/50',
          verified: true,
          rating: 5.0
        },
        host: {
          name: 'Audi Premium',
          profilePic: 'https://via.placeholder.com/50',
          verified: true
        },
        features: [
          'Air Conditioning',
          'GPS Navigation',
          'Bluetooth',
          'USB Charging',
          'Leather Seats',
          'Sport Mode',
          'Launch Control',
          'Premium Sound System',
          'Carbon Fiber Accents',
          'Quattro All-Wheel Drive'
        ],
        featureIcons: [
          { icon: 'seat', label: 'Capacity', value: '2 Seats' },
          { icon: 'engine', label: 'Engine', value: '602 HP' },
          { icon: 'speed', label: 'Max Speed', value: '330km/h' },
          { icon: 'autopilot', label: 'Drive Mode', value: 'Performance' },
          { icon: 'charge', label: 'Fuel Economy', value: '10 km/l' },
          { icon: 'parking', label: 'Parking', value: 'Auto Parking' }
        ],
        reviews: [
          {
            name: 'Mr. Jack',
            profilePic: 'https://via.placeholder.com/40',
            rating: '5.0',
            comment: 'The Audi R8 Performance is absolutely incredible. Fast, comfortable, and turns heads everywhere. Best rental experience ever!'
          },
          {
            name: 'Robert',
            profilePic: 'https://via.placeholder.com/40',
            rating: '5.0',
            comment: 'Amazing supercar! The performance is mind-blowing and the service was top-notch. Highly recommend!'
          },
          {
            name: 'Sarah',
            profilePic: 'https://via.placeholder.com/40',
            rating: '5.0',
            comment: 'Dream car experience! The R8 Performance exceeded all expectations. Smooth ride and incredible acceleration.'
          }
        ]
      }
    };
    return cars[id] || cars['1'];
  };

  // Helper function to clean and normalize car images
  // Returns all unique images from API (same as admin side)
  const normalizeCarImages = (carData) => {
    if (!carData) return null;
    
    let allImages = [];
    let primaryImage = null;
    
    // Extract all images from images array (same as admin side)
    if (carData.images && Array.isArray(carData.images) && carData.images.length > 0) {
      // First, extract all image URLs with their primary status
      const imageUrls = carData.images
        .map(img => {
          if (typeof img === 'string') return { url: img.trim(), isPrimary: false };
          return {
            url: (img?.url || img?.path || null)?.trim(),
            isPrimary: img?.isPrimary || false
          };
        })
        .filter(img => img.url); // Remove null/empty values
      
      // Remove duplicates based on URL
      const uniqueImages = [];
      const seenUrls = new Set();
      for (const img of imageUrls) {
        if (!seenUrls.has(img.url)) {
          seenUrls.add(img.url);
          uniqueImages.push(img);
        }
      }
      
      // Find primary image and put it first
      const primaryImgObj = uniqueImages.find(img => img.isPrimary);
      if (primaryImgObj) {
        primaryImage = primaryImgObj.url;
        // Put primary image first, then others
        allImages = [
          primaryImage,
          ...uniqueImages.filter(img => !img.isPrimary).map(img => img.url)
        ];
      } else {
        // No primary image, use all images in original order
        allImages = uniqueImages.map(img => img.url);
        primaryImage = allImages[0];
      }
    }
    
    // If no images from array, try carData.image
    if (allImages.length === 0 && carData.image) {
      const img = typeof carData.image === 'string' 
        ? carData.image.trim() 
        : (carData.image?.url || carData.image?.path || null)?.trim();
      if (img) {
        allImages = [img];
        primaryImage = img;
      }
    }
    
    // Ensure we have at least one image
    if (allImages.length === 0) {
      allImages = [carImg1];
      primaryImage = carImg1;
    } else if (!primaryImage) {
      primaryImage = allImages[0];
    }
    
    return {
      ...carData,
      image: primaryImage,
      images: allImages // All images array (same as admin side)
    };
  };

  // Helper function to extract numeric price from price string or number
  const extractPrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      // Extract number from strings like "Rs. 200" or "200" or "Rs.200"
      const match = price.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
    return 0;
  };

  // Normalize car data from location state to ensure pricePerDay is set
  const normalizeCarFromState = (carData) => {
    if (!carData) return null;
    const normalized = normalizeCarImages(carData);
    // Ensure pricePerDay is set from price if it's missing
    if (!normalized.pricePerDay && normalized.price) {
      normalized.pricePerDay = extractPrice(normalized.price);
    }
    // Also ensure price is numeric
    if (typeof normalized.price === 'string') {
      normalized.price = extractPrice(normalized.price);
    }
    // Ensure reviews is initialized as array
    if (!normalized.reviews || !Array.isArray(normalized.reviews)) {
      normalized.reviews = [];
    }
    return normalized;
  };

  const initialCar = location.state?.car || null;
  const normalizedInitialCar = initialCar ? normalizeCarFromState(initialCar) : null;
  
  // Always ensure we have a valid baseCar (fallback to mock data if needed)
  const getBaseCarData = () => {
    try {
      const mockCar = normalizeCarImages(getCarData());
      if (mockCar && (!mockCar.reviews || !Array.isArray(mockCar.reviews))) {
        mockCar.reviews = [];
      }
      return mockCar;
    } catch (error) {
      console.error('Error getting base car data:', error);
      // Return minimal valid car object
      return {
        id: id || '1',
        _id: id || '1',
        brand: '',
        model: '',
        name: 'Car',
        image: carImg1,
        images: [carImg1],
        rating: 0,
        reviewsCount: 0,
        reviews: [],
        location: '',
        locationObject: {},
        seats: 4,
        seatingCapacity: 4,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        year: new Date().getFullYear(),
        color: '',
        carType: '',
        mileage: null,
        engineCapacity: '',
        horsepower: null,
        pricePerDay: 0,
        price: 0,
        description: '',
        features: [],
        owner: null,
        host: null,
      };
    }
  };
  
  const baseCar = normalizedInitialCar || getBaseCarData();
  // Ensure baseCar has reviews initialized
  if (baseCar && (!baseCar.reviews || !Array.isArray(baseCar.reviews))) {
    baseCar.reviews = [];
  }
  // Ensure normalizedInitialCar has reviews initialized
  const initialCarWithReviews = normalizedInitialCar 
    ? (normalizedInitialCar.reviews && Array.isArray(normalizedInitialCar.reviews) 
        ? normalizedInitialCar 
        : { ...normalizedInitialCar, reviews: [] })
    : null;
  const [car, setCar] = useState(initialCarWithReviews || baseCar);
  // If we have initial car from state, don't show loader - set loading to false immediately
  // Only show loader if we don't have initial car AND we have an ID to fetch
  // Set initial loading to false if we have car data (from state or baseCar)
  const [isLoading, setIsLoading] = useState(!initialCar && !baseCar && !!id);
  
  // Immediately set loading to false if we have initial car or baseCar
  useEffect(() => {
    if (initialCar || baseCar) {
      setIsLoading(false);
    }
  }, [initialCar, baseCar]);

  // Fetch car details from backend when a real car ID (Mongo ObjectId) is used
  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      // If we already have full car data from navigation state for this id,
      // don't refetch from API to avoid image order changing (no shuffle)
      // Also ensure loading is false immediately
      if (normalizedInitialCar && (normalizedInitialCar._id === id || normalizedInitialCar.id === id)) {
        setCar(normalizedInitialCar);
        setIsLoading(false);
        return;
      }
      
      // If we have initial car but IDs don't match, still don't show loader
      if (initialCar) {
        setIsLoading(false);
        return;
      }

      // If it's not a Mongo ObjectId (e.g. demo IDs like "1", "bmw-i7"), keep using mock data
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      if (!isValidObjectId) {
        // Use baseCar but ensure it has the correct ID
        const carWithId = { ...baseCar, id: id, _id: id };
        setCar(carWithId);
        setIsLoading(false);
        return;
      }

      // Only set loading to true if we don't have any car data at all
      // If we have baseCar, keep loading false and fetch in background
      if (!baseCar) {
        setIsLoading(true);
      }
      try {
        const response = await carService.getCarDetails(id);
        if (response.success && response.data?.car) {
          const apiCar = response.data.car;

          // Extract all images from API (same as admin side)
          let allImages = [];
          let primaryImage = null;
          
          // Extract all images from images array (same as admin side)
          if (apiCar.images && Array.isArray(apiCar.images) && apiCar.images.length > 0) {
            // First, extract all image URLs
            const imageUrls = apiCar.images
              .map(img => {
                if (typeof img === 'string') return { url: img.trim(), isPrimary: false };
                return {
                  url: (img?.url || img?.path || null)?.trim(),
                  isPrimary: img?.isPrimary || false
                };
              })
              .filter(img => img.url); // Remove null/empty values
            
            // Remove duplicates based on URL
            const uniqueImages = [];
            const seenUrls = new Set();
            for (const img of imageUrls) {
              if (!seenUrls.has(img.url)) {
                seenUrls.add(img.url);
                uniqueImages.push(img);
              }
            }
            
            // Find primary image
            const primaryImgObj = uniqueImages.find(img => img.isPrimary);
            if (primaryImgObj) {
              primaryImage = primaryImgObj.url;
              // Put primary image first, then others
              allImages = [
                primaryImage,
                ...uniqueImages.filter(img => !img.isPrimary).map(img => img.url)
              ];
            } else {
              // No primary image, use all images in original order
              allImages = uniqueImages.map(img => img.url);
              primaryImage = allImages[0];
            }
          }
          
          // If no images from array, try primaryImage field
          if (allImages.length === 0 && apiCar.primaryImage) {
            allImages = [apiCar.primaryImage];
            primaryImage = apiCar.primaryImage;
          }
          
          // Ensure we have at least one image
          if (allImages.length === 0) {
            allImages = [carImg1];
            primaryImage = carImg1;
          } else if (!primaryImage) {
            primaryImage = allImages[0];
          }

          // Build car object purely from backend data (no mock merge)
          // Use all images (same as admin side)
          const normalizedCar = normalizeCarImages({
            id: apiCar._id || apiCar.id,
            _id: apiCar._id || apiCar.id,
            brand: apiCar.brand || '',
            model: apiCar.model || '',
            name: `${apiCar.brand || ''} ${apiCar.model || ''}`.trim() || 'Car',
            image: primaryImage,
            images: allImages, // All images array (same as admin side)
            rating: apiCar.averageRating || 0,
            reviewsCount: apiCar.reviewsCount || 0,
            reviews: [], // Initialize reviews as empty array
            location:
              typeof apiCar.location === 'string'
                ? apiCar.location
                : apiCar.location?.city ||
                  apiCar.location?.address ||
                  '',
            locationObject: apiCar.location || {},
            seats: apiCar.seatingCapacity || 4,
            seatingCapacity: apiCar.seatingCapacity || 4,
            transmission:
              apiCar.transmission === 'automatic'
                ? 'Automatic'
                : apiCar.transmission === 'manual'
                ? 'Manual'
                : apiCar.transmission === 'cvt'
                ? 'CVT'
                : 'Automatic',
            fuelType:
              apiCar.fuelType === 'petrol'
                ? 'Petrol'
                : apiCar.fuelType === 'diesel'
                ? 'Diesel'
                : apiCar.fuelType === 'electric'
                ? 'Electric'
                : apiCar.fuelType === 'hybrid'
                ? 'Hybrid'
                : 'Petrol',
            year: apiCar.year || new Date().getFullYear(),
            color: apiCar.color || '',
            carType: apiCar.carType || '',
            mileage: apiCar.mileage || null,
            engineCapacity: apiCar.engineCapacity || '',
            horsepower: apiCar.horsepower || apiCar.enginePower || null,
            pricePerDay: apiCar.pricePerDay || 0,
            price: apiCar.pricePerDay || 0,
            description: apiCar.description || '',
            features: apiCar.features || [], // Features array from API
            owner: apiCar.owner ? {
              name: apiCar.owner.name || 'DriveOn Premium',
              email: apiCar.owner.email || '',
              phone: apiCar.owner.phone || '',
              profilePhoto: apiCar.owner.profilePhoto || null,
              verified: apiCar.owner.verified || false,
              rating: apiCar.owner.rating || 4.5,
            } : null,
            host: apiCar.owner ? {
              name: apiCar.owner.name || 'DriveOn Premium',
              profilePic: apiCar.owner.profilePhoto || null,
              verified: apiCar.owner.verified || false,
            } : null,
          });
          
          // Preserve images from location.state to prevent shuffle
          // If we have images from initial state, keep them and only update other fields
          if (initialCar && initialCar.images && initialCar.images.length > 0) {
            setCar(prevCar => ({
              ...normalizedCar,
              images: prevCar.images, // Keep original images order
              image: prevCar.image || normalizedCar.image, // Keep original primary image
            }));
          } else {
            setCar(normalizedCar);
          }
        } else {
          // API returned success but no car data - use baseCar with correct ID
          const carWithId = { ...baseCar, id: id, _id: id };
          setCar(carWithId);
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        // On error, use baseCar with correct ID instead of showing error
        const carWithId = { ...baseCar, id: id, _id: id };
        setCar(carWithId);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Use car ID from params or car object
        const carId = id || car?._id || car?.id || baseCar?._id || baseCar?.id;
        if (!carId) {
          return;
        }

        // Check if carId is a valid MongoDB ObjectId (24 hex characters)
        // If not, skip API call and keep existing data
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(carId);
        if (!isValidObjectId) {
          return;
        }

        const response = await reviewService.getCarReviews(carId, {
          page: 1,
          limit: 5, // Show only 5 reviews on car details page
          sort: 'newest',
        });

        if (response.success && response.data) {
          // Format reviews for display
          const formattedReviews = response.data.reviews.map(review => ({
            name: review.user?.name || 'Anonymous',
            profilePic: review.user?.photo || 'https://via.placeholder.com/40',
            rating: review.overallRating?.toFixed(1) || '0',
            comment: review.comment,
          }));

          // Merge reviews into existing car state (don't reset to mock data)
          setCar(prev => {
            if (!prev) return prev; // Don't update if car is null
            return {
              ...prev,
              reviews: formattedReviews,
              reviewsCount: response.data.ratings?.totalReviews || prev.reviewsCount || 0,
              averageRating: response.data.ratings?.averageOverallRating || prev.rating || 0,
            };
          });
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
        // Keep existing car data on error
      }
    };

    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fetch common data (offers, FAQs, cancellation policy, inclusions/exclusions)
  useEffect(() => {
    const fetchCommonData = async () => {
      try {
        // Fetch FAQs from common API
        try {
          const faqsResponse = await commonService.getFAQs();
          if (faqsResponse.success && faqsResponse.data?.faqs) {
            setFaqs(faqsResponse.data.faqs);
          } else {
            // Default FAQs if API fails
            setFaqs([
              {
                question: 'Who pays for the Fuel and FASTag?',
                answer: 'The guest is responsible for fuel costs. You will receive the car with a full tank and should return it with the same fuel level. FASTag charges are also the responsibility of the guest. Please check with the host for Fastag recharge if needed.'
              },
              {
                question: 'Can I modify or extend my trip after booking creation?',
                answer: 'Yes, you can modify or extend your trip. Please contact our support team or the car owner at least 24 hours before your scheduled pickup time. Modifications are subject to availability and may result in price adjustments.'
              },
              {
                question: 'How do I cancel my booking?',
                answer: 'You can cancel your booking through the app or by contacting support. Free cancellation is available up to 24 hours before pickup for a full refund. Cancellations made 12-24 hours before pickup receive a 50% refund. Cancellations made less than 12 hours before pickup are not eligible for refund.'
              },
              {
                question: 'What is refundable security deposit and why do I pay it?',
                answer: 'The security deposit is a refundable amount held to cover any potential damages, traffic violations, or additional charges during your rental period. It is fully refundable after the trip completion, provided there are no damages or violations. The deposit amount varies based on the car type and is typically returned within 5-7 business days after trip completion.'
              },
            ]);
          }
        } catch (error) {
          console.error('Error fetching FAQs:', error);
          // Use default FAQs on error
          setFaqs([
            {
              question: 'Who pays for the Fuel and FASTag?',
              answer: 'The guest is responsible for fuel costs. You will receive the car with a full tank and should return it with the same fuel level. FASTag charges are also the responsibility of the guest. Please check with the host for Fastag recharge if needed.'
            },
            {
              question: 'Can I modify or extend my trip after booking creation?',
              answer: 'Yes, you can modify or extend your trip. Please contact our support team or the car owner at least 24 hours before your scheduled pickup time. Modifications are subject to availability and may result in price adjustments.'
            },
            {
              question: 'How do I cancel my booking?',
              answer: 'You can cancel your booking through the app or by contacting support. Free cancellation is available up to 24 hours before pickup for a full refund. Cancellations made 12-24 hours before pickup receive a 50% refund. Cancellations made less than 12 hours before pickup are not eligible for refund.'
            },
            {
              question: 'What is refundable security deposit and why do I pay it?',
              answer: 'The security deposit is a refundable amount held to cover any potential damages, traffic violations, or additional charges during your rental period. It is fully refundable after the trip completion, provided there are no damages or violations. The deposit amount varies based on the car type and is typically returned within 5-7 business days after trip completion.'
            },
          ]);
        }

        // Set default offers (can be fetched from API in future)
        setOffers([
          {
            id: '50-off',
            title: 'Get 50% OFF!',
            description: 'Check Availability Here >',
            code: 'SAVE50',
            discount: 50,
            type: 'percentage'
          },
          {
            id: 'first-time',
            title: 'First Time User Discount',
            description: 'Get 20% off on your first booking. Use code: FIRST20',
            code: 'FIRST20',
            discount: 20,
            type: 'percentage'
          },
          {
            id: 'weekend',
            title: 'Weekend Special',
            description: 'Book for 3+ days and get 15% discount on weekends',
            code: 'WEEKEND15',
            discount: 15,
            type: 'percentage',
            minDays: 3
          }
        ]);

        // Set default cancellation policy (can be fetched from API in future)
        setCancellationPolicy({
          freeCancellation: {
            title: 'Free Cancellation',
            description: 'Cancel up to 24 hours before pickup time for a full refund.',
            hours: 24
          },
          partialRefund: {
            title: 'Partial Refund',
            description: 'Cancel between 12-24 hours before pickup: 50% refund',
            hours: { min: 12, max: 24 },
            refundPercentage: 50
          },
          noRefund: {
            title: 'No Refund',
            description: 'Cancellations made less than 12 hours before pickup are not eligible for refund.',
            hours: 12
          }
        });

        // Set default inclusions/exclusions (can be fetched from API in future)
        setInclusionsExclusions([
          {
            type: 'exclusion',
            title: 'Fuel',
            description: 'Fuel not included. Guest should return the car with the same fuel level as at start.',
            icon: 'fuel'
          },
          {
            type: 'exclusion',
            title: 'Toll/Fastag',
            description: 'Toll/Fastag charges not included. Check with host for Fastag recharge.',
            icon: 'toll'
          },
          {
            type: 'exclusion',
            title: 'Trip Protection',
            description: 'Trip Protection excludes: Off-road use, driving under influence, over-speeding, illegal use, restricted zones.',
            icon: 'protection'
          }
        ]);
      } catch (error) {
        console.error('Error fetching common data:', error);
      }
    };

    fetchCommonData();
  }, []);
  
  // Extract numeric price from car.price (format: "Rs. 200" or just number)
  const getCarPrice = () => {
    if (typeof car.price === 'number') return car.price;
    if (typeof car.pricePerDay) return car.pricePerDay;
    if (typeof car.price === 'string') {
      const match = car.price.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
    return 0;
  };

  // Get car display name (Brand + Model or name)
  const getCarDisplayName = () => {
    if (car.brand && car.model) {
      return `${car.brand} ${car.model}`;
    }
    return car.name || 'Car';
  };

  // Get car specifications string (as per document.txt: Seats, Transmission, Fuel Type)
  const getCarSpecs = () => {
    const specs = [];
    if (car.seats) specs.push(`${car.seats} Seats`);
    if (car.transmission) specs.push(car.transmission);
    if (car.fuelType) specs.push(car.fuelType);
    return specs.join(' · ');
  };
  
  // Generate car images for gallery.
  // Shows all images from API (same as admin side)
  const generateCarImages = () => {
    if (!car) return [carImg1];
    
    // Return all images from car.images array (same as admin side)
    if (car.images && Array.isArray(car.images) && car.images.length > 0) {
      return car.images
        .map(img => {
          if (typeof img === 'string') return img.trim();
          return (img?.url || img?.path || null)?.trim();
        })
        .filter(Boolean); // Remove null/empty values
    }
    
    // Fallback to car.image if images array is empty
    if (car.image) {
      const img = typeof car.image === 'string' ? car.image : (car.image?.url || car.image?.path || null);
      if (img) return [img];
    }
    
    return [carImg1];
  };
  
  const carImages = generateCarImages();
  
  // Reset image index only when car ID changes (not when images array changes)
  useEffect(() => {
    if (carImages.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [car?.id || car?._id || id]); // Only reset when car ID changes, not when images array changes
  
  // Detect car facing direction
  const [facingDirection, setFacingDirection] = useState('right');
  const [imageRef, isImageInView] = useInViewAnimation({ threshold: 0.1 });
  
  useEffect(() => {
    if (!car) return;
    const direction = getCarFacingDirection(car.image || carImages[0]);
    setFacingDirection(direction);
  }, [car?.image, carImages]);

  // Booking form state
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropDate, setDropDate] = useState('');
  const [dropTime, setDropTime] = useState('');
  const [paymentOption, setPaymentOption] = useState('advance');
  const [specialRequests, setSpecialRequests] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Combined date-time picker modal state
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const [dateTimePickerTarget, setDateTimePickerTarget] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState(30);
  const [selectedPeriod, setSelectedPeriod] = useState('am');
  
  // Time picker modal state
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  // Helper: Convert date string (YYYY-MM-DD) to Date object in local timezone
  // Use noon (12:00) to avoid timezone shift issues
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const day = parseInt(parts[2], 10);
      // Create date at noon to avoid timezone shift issues
      return new Date(year, month, day, 12, 0, 0);
    }
    return null;
  };

  // Helper: Convert Date object to date string (YYYY-MM-DD) in local timezone
  const formatLocalDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calculate dynamic price
  const calculatePrice = () => {
    if (!pickupDate || !dropDate || !car) {
      return {
        basePrice: 0,
        totalDays: 0,
        totalPrice: 0,
        advancePayment: 0,
        remainingPayment: 0,
        discount: 0,
        finalPrice: 0,
      };
    }

    // Parse dates in local timezone to avoid timezone shift
    const pickup = parseLocalDate(pickupDate) || new Date();
    const drop = parseLocalDate(dropDate) || new Date();
    const diffTime = Math.abs(drop - pickup);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const basePrice = getCarPrice();
    let totalPrice = basePrice * totalDays;

    // Apply dynamic pricing multipliers
    const dayOfWeek = pickup.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendMultiplier = isWeekend ? 1.2 : 1.0;
    totalPrice = totalPrice * weekendMultiplier;

    // Apply coupon discount
    const discount = couponDiscount || 0;
    const finalPrice = Math.max(0, totalPrice - discount);

    // Payment options
    const advancePayment = Math.round(finalPrice * 0.35);
    const remainingPayment = finalPrice - advancePayment;

    return {
      basePrice,
      totalDays,
      totalPrice: Math.round(totalPrice),
      discount: Math.round(discount),
      finalPrice: Math.round(finalPrice),
      advancePayment,
      remainingPayment: Math.round(remainingPayment),
    };
  };

  const priceDetails = calculatePrice();

  // Get minimum date (today) - using local timezone
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Combined date-time picker helpers
  const openDateTimePicker = (target) => {
    setDateTimePickerTarget(target);
    
    const existingDate = target === 'pickup' ? pickupDate : dropDate;
    let baseDate;
    if (existingDate) {
      baseDate = parseLocalDate(existingDate);
      if (!baseDate) baseDate = new Date();
    } else if (target === 'drop' && pickupDate) {
      baseDate = parseLocalDate(pickupDate);
      if (!baseDate) baseDate = new Date();
    } else {
      baseDate = new Date();
    }
    setCalendarMonth(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));
    setCalendarSelectedDate(baseDate);
    
    const existingTime = target === 'pickup' ? pickupTime : dropTime;
    if (existingTime) {
      const [hour, minute] = existingTime.split(':').map(Number);
      if (hour >= 12) {
        setSelectedPeriod('pm');
        setSelectedHour(hour === 12 ? 12 : hour - 12);
      } else {
        setSelectedPeriod('am');
        setSelectedHour(hour === 0 ? 12 : hour);
      }
      setSelectedMinute(minute || 0);
    } else {
      setSelectedHour(10);
      setSelectedMinute(30);
      setSelectedPeriod('am');
    }
    
    setIsDateTimePickerOpen(true);
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Select Date';
    // Parse date string directly to avoid timezone issues
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const day = parseInt(parts[2], 10);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${String(day).padStart(2, '0')} ${monthNames[month]} ${year}`;
    }
    // Fallback for other formats
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('default', { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i += 1) {
      days.push(null);
    }
    // Create dates at noon (12:00) to avoid timezone shift issues
    // This ensures the date stays the same regardless of timezone
    for (let d = 1; d <= daysInMonth; d += 1) {
      days.push(new Date(year, month, d, 12, 0, 0));
    }
    return days;
  };

  const formatDisplayTime = (timeStr) => {
    if (!timeStr) return 'Select Time';
    const [hour, minute] = timeStr.split(':').map(Number);
    const period = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const handleDateTimePickerDone = () => {
    if (!dateTimePickerTarget) {
      setIsDateTimePickerOpen(false);
      return;
    }
    
    if (calendarSelectedDate) {
      // Use local date components instead of toISOString to avoid timezone shift
      const dateStr = formatLocalDate(calendarSelectedDate);
      if (dateTimePickerTarget === 'pickup') {
        setPickupDate(dateStr);
        // Compare dates properly
        if (dropDate) {
          const dropDateObj = parseLocalDate(dropDate);
          if (dropDateObj && dropDateObj < calendarSelectedDate) {
            setDropDate('');
          }
        }
      } else if (dateTimePickerTarget === 'drop') {
        setDropDate(dateStr);
      }
    }
    
    let hour24 = selectedHour;
    if (selectedPeriod === 'pm' && selectedHour !== 12) {
      hour24 = selectedHour + 12;
    } else if (selectedPeriod === 'am' && selectedHour === 12) {
      hour24 = 0;
    }
    
    const timeStr = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    
    if (dateTimePickerTarget === 'pickup') {
      setPickupTime(timeStr);
    } else if (dateTimePickerTarget === 'drop') {
      setDropTime(timeStr);
    }
    
    setIsDateTimePickerOpen(false);
  };

  // Handle coupon application
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }

    if (couponCode.toUpperCase() === 'SAVE10') {
      const discount = priceDetails.totalPrice * 0.1;
      setAppliedCoupon({ code: 'SAVE10', discount: discount });
      setCouponDiscount(discount);
      alert('Coupon applied successfully!');
    } else {
      alert('Invalid coupon code');
      setAppliedCoupon(null);
      setCouponDiscount(0);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!pickupDate || !dropDate || !pickupTime || !dropTime) {
      alert('Please select pickup and drop date & time');
      return;
    }

    if (!agreeToTerms) {
      alert('Please agree to terms and conditions');
      return;
    }

    // Navigate to payment page
    if (!car || (!car.id && !car._id)) return;
    navigate(`/book-now/${car.id || car._id}`, { 
      state: { 
        car, 
        pickupDate, 
        pickupTime, 
        dropDate, 
        dropTime, 
        paymentOption, 
        specialRequests, 
        couponCode: appliedCoupon?.code, 
        couponDiscount, 
        priceDetails 
      } 
    });
  };

  // Navigation for image gallery
  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? carImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === carImages.length - 1 ? 0 : prev + 1));
  };

  // Handle tab click and scroll to section
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    const refs = {
      offers: offersRef,
      reviews: reviewsRef,
      location: locationRef,
      features: featuresRef,
      cancellation: cancellationRef,
      'inclusion-exclusion': inclusionExclusionRef,
      faqs: faqsRef,
    };
    
    const ref = refs[tabName];
    if (ref && ref.current) {
      const offset = 150; // Offset for sticky header
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const refs = [
        { id: 'offers', ref: offersRef },
        { id: 'reviews', ref: reviewsRef },
        { id: 'location', ref: locationRef },
        { id: 'features', ref: featuresRef },
        { id: 'cancellation', ref: cancellationRef },
        { id: 'inclusion-exclusion', ref: inclusionExclusionRef },
        { id: 'faqs', ref: faqsRef },
      ];

      const scrollPosition = window.scrollY + 200; // Offset for header

      for (let i = refs.length - 1; i >= 0; i--) {
        const { id, ref } = refs[i];
        if (ref && ref.current) {
          const elementTop = ref.current.offsetTop;
          if (scrollPosition >= elementTop) {
            setActiveTab(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Feature Icons
  const getFeatureIcon = (iconType) => {
    switch (iconType) {
      case 'seat':
        return (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        );
      case 'engine':
        return (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'speed':
        return (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'autopilot':
        return (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'charge':
        return (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'parking':
        return (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Show loading state only if we're actively loading and have no car data
  // Don't show loader if we have initial car from navigation state or baseCar
  if (isLoading && !car && !initialCar && !baseCar) {
    return (
      <div 
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: colors.backgroundPrimary }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p className="text-gray-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  // If no car data at all (shouldn't happen with fallback, but just in case)
  // But only show error if we don't have initial car or baseCar
  if (!car && !initialCar && !baseCar) {
    return (
      <div 
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: colors.backgroundPrimary }}
      >
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load car details.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: colors.backgroundTertiary }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full relative"
      style={{ backgroundColor: colors.backgroundPrimary }}
    >
      {/* Web Header - Only visible on web */}
      <header
        className="hidden md:block w-full sticky top-0 z-50"
        style={{ backgroundColor: colors.brandBlack }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center h-16 md:h-20 lg:h-24 justify-between">
            {/* Left - Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/driveonlogo.png"
                alt="DriveOn Logo"
                className="h-8 md:h-10 lg:h-12 xl:h-14 w-auto object-contain"
              />
            </Link>

            {/* Center - Navigation Tabs */}
            <nav className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 xl:gap-10 h-full">
              <Link
                to="/"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                Contact
              </Link>
              <Link
                to="/faq"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                FAQs
              </Link>
            </nav>

            {/* Right - Login/Signup and Profile Icon */}
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                >
                  {/* Circular profile icon with white border */}
                  <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-gray-800">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src={carImg1}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-3 md:px-4 lg:px-5 xl:px-6 py-1.5 md:py-2 lg:py-2.5 rounded-lg border text-xs md:text-sm lg:text-base font-medium transition-all hover:opacity-90"
                  style={{
                    borderColor: colors.borderMedium,
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                  }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Header - Mobile view only */}
      <div className="md:hidden">
        <CarDetailsHeader />
      </div>

      {/* Back Button - Below Header (desktop only) */}
      <div className="hidden md:block w-full px-4 md:px-6 lg:px-8 xl:px-12 pt-4 md:pt-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{ color: colors.backgroundTertiary }}
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-base md:text-lg font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Web container - max-width and centered on larger screens */}
      <div className="max-w-7xl mx-auto">
        {/* Desktop: Two-column layout (Image Gallery Left + Booking Form Right) */}
        <div className="hidden lg:grid lg:grid-cols-[65%_35%] lg:gap-6 lg:px-6 xl:px-8 lg:mt-4">
          {/* Left Column: Car Image Gallery */}
          <div className="relative w-full">
            <div className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: colors.backgroundPrimary }}>
              {/* Main Large Image with Navigation Arrows */}
              <div className="relative w-full h-[500px] xl:h-[600px] flex items-center justify-center overflow-hidden bg-gray-50">
                {carImages && carImages.length > 0 && carImages[currentImageIndex] ? (
                  <img
                    key={`main-image-${currentImageIndex}-${carImages[currentImageIndex]}`}
                    src={carImages[currentImageIndex]}
                    alt={`${car.name || getCarDisplayName()} - Main Image`}
                    className="w-full h-full object-contain p-6 xl:p-10 transition-all duration-500 ease-in-out"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      position: 'relative',
                      zIndex: 1
                    }}
                    draggable={false}
                    onError={(e) => {
                      console.error('Image failed to load:', carImages[currentImageIndex]);
                      e.target.src = carImg1;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={carImg1}
                      alt="Default Car"
                      className="w-full h-full object-contain p-6 xl:p-10"
                      draggable={false}
                      style={{
                        position: 'relative',
                        zIndex: 1
                      }}
                    />
                  </div>
                )}
                
                {/* Navigation Arrow - Left */}
                {carImages.length > 1 && (
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    style={{ backgroundColor: colors.overlayWhite }}
                    aria-label="Previous image"
                  >
                    <svg 
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Navigation Arrow - Right */}
                {carImages.length > 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    style={{ backgroundColor: colors.overlayWhite }}
                    aria-label="Next image"
                  >
                    <svg 
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                
                {/* Image Counter */}
                {carImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: colors.overlayBlack, color: colors.textWhite }}
                  >
                    {currentImageIndex + 1}/{carImages.length}
                  </div>
                )}
                
                {/* Heart Icon - Top Left */}
                <motion.button 
                  onClick={() => {
                    setIsFavorite(!isFavorite);
                    setIsAnimating(true);
                    setTimeout(() => setIsAnimating(false), 300);
                  }}
                  className="absolute top-2 left-4 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  style={{ backgroundColor: colors.overlayWhite }}
                  animate={isAnimating ? {
                    scale: [1, 1.3, 1],
                  } : {}}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <svg 
                    className={`w-7 h-7 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                    fill={isFavorite ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                </motion.button>
              </div>
              
              {/* Thumbnail Row - Below Main Image */}
              {carImages.length > 1 && (
                <div className="p-4 xl:p-6">
                  <div className="flex gap-2 xl:gap-3 overflow-x-auto scrollbar-hide pb-2">
                    {carImages.map((image, index) => {
                      const imageKey = typeof image === 'string' ? image : (image?.url || image?.path || `img-${index}`);
                      return (
                        <div
                          key={`thumbnail-${imageKey}-${index}`}
                          className={`flex-shrink-0 relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                            currentImageIndex === index 
                              ? '' 
                              : 'hover:opacity-80 opacity-70'
                          }`}
                          style={{
                            backgroundColor: colors.backgroundPrimary,
                            border: currentImageIndex === index ? `2px solid ${colors.backgroundTertiary}` : '2px solid transparent',
                            width: '120px',
                            height: '120px'
                          }}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <div className="w-full h-full flex items-center justify-center p-2 bg-white">
                            <img
                              src={image}
                              alt={`${car.name || getCarDisplayName()} - Thumbnail ${index + 1}`}
                              className="w-full h-full object-contain"
                              draggable={false}
                              onError={(e) => {
                                console.error('Thumbnail failed to load:', image);
                                e.target.src = carImg1;
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Booking Form Card (Sticky) */}
          <div className="lg:sticky lg:top-4 lg:self-start lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <form onSubmit={handleSubmit} className="rounded-2xl p-4 xl:p-6 shadow-lg space-y-4"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              {/* Price Summary at Top */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                    Rs. {getCarPrice()}
                  </span>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>/day</span>
                </div>
                {priceDetails.totalDays > 0 && (
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    {priceDetails.totalDays} {priceDetails.totalDays === 1 ? 'day' : 'days'} • Total: Rs. {priceDetails.finalPrice}
                  </div>
                )}
              </div>

              {/* Pickup Date & Time */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: colors.textPrimary }}>Pickup Date & Time</label>
                <button
                  type="button"
                  onClick={() => openDateTimePicker('pickup')}
                  className="w-full px-3 py-2.5 rounded-lg border-2 text-left"
                  style={{ 
                    borderColor: (pickupDate && pickupTime) ? colors.backgroundTertiary : colors.borderMedium,
                    backgroundColor: (pickupDate && pickupTime) ? colors.backgroundPrimary : colors.backgroundSecondary
                  }}
                >
                  <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                    {pickupDate && pickupTime ? `${formatDisplayDate(pickupDate)} • ${formatDisplayTime(pickupTime)}` : 'Select Date & Time'}
                  </div>
                </button>
              </div>

              {/* Drop Date & Time */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: colors.textPrimary }}>Drop Date & Time</label>
                <button
                  type="button"
                  onClick={() => openDateTimePicker('drop')}
                  className="w-full px-3 py-2.5 rounded-lg border-2 text-left"
                  style={{ 
                    borderColor: (dropDate && dropTime) ? colors.backgroundTertiary : colors.borderMedium,
                    backgroundColor: (dropDate && dropTime) ? colors.backgroundPrimary : colors.backgroundSecondary
                  }}
                >
                  <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                    {dropDate && dropTime ? `${formatDisplayDate(dropDate)} • ${formatDisplayTime(dropTime)}` : 'Select Date & Time'}
                  </div>
                </button>
              </div>

              {/* Payment Option */}
              <div>
                <h3 className="text-sm font-bold mb-2" style={{ color: colors.textPrimary }}>Payment Option</h3>
                <button
                  type="button"
                  onClick={() => setPaymentOption('advance')}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    paymentOption === 'advance' ? 'shadow-md' : ''
                  }`}
                  style={{
                    borderColor: paymentOption === 'advance' ? colors.backgroundTertiary : colors.borderMedium,
                    backgroundColor: paymentOption === 'advance' ? colors.backgroundPrimary : colors.backgroundSecondary
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm mb-0.5" style={{ color: colors.textPrimary }}>35% Advance Payment</div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>Pay 35% now, rest later</div>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ 
                      borderColor: paymentOption === 'advance' ? colors.backgroundTertiary : colors.borderCheckbox 
                    }}>
                      {paymentOption === 'advance' && (
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.backgroundTertiary }}></div>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {/* Coupon Code */}
              <div>
                <h3 className="text-sm font-bold mb-2" style={{ color: colors.textPrimary }}>Coupon Code</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                    style={{ 
                      borderColor: colors.borderMedium,
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textPrimary
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-6 py-2 rounded-lg text-white font-semibold text-sm"
                    style={{ backgroundColor: colors.backgroundTertiary }}
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: `${colors.success}20` }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold" style={{ color: colors.success }}>
                        {appliedCoupon.code} Applied
                      </span>
                      <span className="text-xs font-bold" style={{ color: colors.success }}>
                        -Rs. {couponDiscount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              {priceDetails.totalDays > 0 && (
                <div className="rounded-xl p-4" style={{ backgroundColor: colors.backgroundPrimary }}>
                  <h3 className="text-sm font-bold mb-2" style={{ color: colors.textPrimary }}>Price Summary</h3>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-sm" style={{ color: colors.textSecondary }}>
                      <span>Base Price ({priceDetails.totalDays} days)</span>
                      <span className="font-semibold" style={{ color: colors.textPrimary }}>Rs. {priceDetails.totalPrice}</span>
                    </div>
                    {priceDetails.discount > 0 && (
                      <div className="flex justify-between text-sm" style={{ color: colors.textSecondary }}>
                        <span>Discount</span>
                        <span className="font-semibold" style={{ color: colors.success }}>-Rs. {priceDetails.discount}</span>
                      </div>
                    )}
                    <div className="border-t pt-1.5 mt-1.5" style={{ borderColor: colors.borderMedium }}>
                      <div className="flex justify-between font-bold" style={{ color: colors.textPrimary }}>
                        <span className="text-base">Total Amount</span>
                        <span className="text-base">Rs. {priceDetails.finalPrice}</span>
                      </div>
                    </div>
                    {paymentOption === 'advance' && (
                      <div className="mt-2 pt-2 border-t" style={{ borderColor: colors.borderMedium }}>
                        <div className="flex justify-between mb-0.5 text-xs" style={{ color: colors.textSecondary }}>
                          <span>Advance Payment (35%)</span>
                          <span className="font-semibold">Rs. {priceDetails.advancePayment}</span>
                        </div>
                        <div className="flex justify-between text-xs" style={{ color: colors.textSecondary }}>
                          <span>Remaining Amount</span>
                          <span className="font-semibold">Rs. {priceDetails.remainingPayment}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-2"
                  style={{ borderColor: agreeToTerms ? colors.backgroundTertiary : colors.borderCheckbox }}
                />
                <label htmlFor="terms" className="text-xs" style={{ color: colors.textSecondary }}>
                  I agree to the <span className="font-semibold" style={{ color: colors.textPrimary }}>Terms & Conditions</span> and <span className="font-semibold" style={{ color: colors.textPrimary }}>Privacy Policy</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-bold text-base shadow-xl"
                style={{ backgroundColor: colors.backgroundTertiary }}
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>

        {/* Mobile/Tablet: Original Layout (image directly on page, no white card) */}
        <div className="lg:hidden">
          {/* Car Images Section */}
          <div className="relative w-full mt-2 md:mt-4">
            {/* Mobile: Swipeable Carousel */}
            <div className="md:hidden relative w-full">
            <Swiper
              modules={[Pagination, Keyboard, Mousewheel]}
              spaceBetween={0}
              slidesPerView={1}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet-custom',
                bulletActiveClass: 'swiper-pagination-bullet-active-custom',
                el: '.car-pagination-dots',
              }}
              onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
              keyboard={{ enabled: true }}
              mousewheel={{ enabled: true, forceToAxis: true, sensitivity: 1 }}
              speed={300}
              className="w-full"
              watchSlidesProgress={true}
              allowTouchMove={true}
            >
              {carImages && carImages.length > 0 ? (
                carImages.map((image, index) => (
                  <SwiperSlide key={index} className="!w-full">
                    <div 
                      className="relative w-full h-[350px] flex items-center justify-center overflow-hidden bg-gray-50"
                      style={{ backgroundColor: colors.backgroundPrimary }}
                    >
                      {index === 0 ? (
                        <motion.img
                          ref={imageRef}
                          src={image || carImg1}
                          onError={(e) => {
                            console.error('Mobile image failed to load:', image);
                            e.target.src = carImg1;
                          }}
                          alt={`${car.name || getCarDisplayName()} - Image ${index + 1}`}
                          className="w-full h-full object-contain p-4"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                          }}
                          draggable={false}
                          initial={{ 
                            x: facingDirection === 'left' ? 200 : -200, 
                            opacity: 0 
                          }}
                          animate={{ 
                            x: 0, 
                            opacity: 1 
                          }}
                          transition={{ 
                            duration: 0.7, 
                            ease: 'easeOut'
                          }}
                          key={`${car?.id || car?._id || 'car'}-${index}-animated`}
                        />
                      ) : (
                        <img
                          src={image || carImg1}
                          onError={(e) => {
                            console.error('Mobile image failed to load:', image);
                            e.target.src = carImg1;
                          }}
                          alt={`${car.name || getCarDisplayName()} - Image ${index + 1}`}
                          className="w-full h-full object-contain p-4"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                          }}
                          draggable={false}
                        />
                      )}
                    
                    {/* Heart Icon - Top Left */}
                    <motion.button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                        setIsAnimating(true);
                        setTimeout(() => setIsAnimating(false), 300);
                      }}
                      className="absolute top-2 left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.overlayWhite }}
                      animate={isAnimating ? {
                        scale: [1, 1.3, 1],
                      } : {}}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                    >
                      <svg 
                        className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                        fill={isFavorite ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                      </svg>
                    </motion.button>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide className="!w-full">
                  <div 
                    className="relative w-full h-[350px] flex items-center justify-center overflow-hidden bg-gray-50"
                    style={{ backgroundColor: colors.backgroundPrimary }}
                  >
                    <img
                      src={carImg1}
                      alt="Default Car"
                      className="w-full h-full object-contain p-4"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                      draggable={false}
                    />
                    {/* Heart Icon - Top Left */}
                    <motion.button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                        setIsAnimating(true);
                        setTimeout(() => setIsAnimating(false), 300);
                      }}
                      className="absolute top-2 left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.overlayWhite }}
                      animate={isAnimating ? {
                        scale: [1, 1.3, 1],
                      } : {}}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                    >
                      <svg 
                        className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                        fill={isFavorite ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                      </svg>
                    </motion.button>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>

            {/* Pagination Dots - Below Car Image */}
            {carImages && carImages.length > 1 && (
              <div className="car-pagination-dots absolute bottom-8 left-0 right-0 flex justify-center items-center gap-2 z-10"></div>
            )}

            {/* Custom Pagination Styles */}
            <style>{`
              .swiper-pagination-bullet-custom {
                width: 8px;
                height: 8px;
                background: ${colors.overlayBlack};
                opacity: 1;
                margin: 0 4px;
                transition: all 0.3s ease;
                border-radius: 50%;
                cursor: pointer;
              }
              .swiper-pagination-bullet-active-custom {
                background: ${colors.backgroundTertiary};
                width: 8px;
                height: 8px;
              }
              .car-pagination-dots {
                position: absolute;
                bottom: 32px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
                z-index: 10;
              }
              /* Ensure slides are visible when active */
              .swiper-slide {
                opacity: 1;
                transition: opacity 0.3s;
              }
              .swiper-slide-active {
                opacity: 1 !important;
              }
            `}</style>
          </div>

            {/* Tablet: Main Image with Thumbnails (hidden on lg+) */}
            <div className="hidden md:block lg:hidden w-full px-6">
              <div className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: colors.backgroundPrimary }}>
                {/* Main Large Image */}
                <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden bg-gray-50">
                  {carImages && carImages.length > 0 && carImages[currentImageIndex] ? (
                    <img
                      key={currentImageIndex}
                      src={carImages[currentImageIndex]}
                      alt={`${car.name || getCarDisplayName()} - Main Image`}
                      className="w-full h-full object-contain p-6 transition-all duration-500 ease-in-out"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                      draggable={false}
                      onError={(e) => {
                        console.error('Tablet image failed to load:', carImages[currentImageIndex]);
                        e.target.src = carImg1;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={carImg1}
                        alt="Default Car"
                        className="w-full h-full object-contain p-6"
                        draggable={false}
                      />
                    </div>
                  )}
                  
                  {/* Heart Icon - Top Left */}
                  <motion.button 
                    onClick={() => {
                      setIsFavorite(!isFavorite);
                      setIsAnimating(true);
                      setTimeout(() => setIsAnimating(false), 300);
                    }}
                    className="absolute top-2 left-4 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    style={{ backgroundColor: colors.overlayWhite }}
                    animate={isAnimating ? {
                      scale: [1, 1.3, 1],
                    } : {}}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                  >
                    <svg 
                      className={`w-7 h-7 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                      fill={isFavorite ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                      />
                    </svg>
                  </motion.button>
                </div>
                
                {/* Thumbnail Grid - Below Main Image */}
                {carImages.length > 1 && (
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2">
                      {carImages.map((image, index) => {
                        const imageKey = typeof image === 'string' ? image : (image?.url || image?.path || `img-${index}`);
                        return (
                          <div
                            key={`tablet-thumbnail-${imageKey}-${index}`}
                            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                              currentImageIndex === index 
                                ? 'scale-105 shadow-lg border-2' 
                                : 'hover:opacity-80 hover:scale-102 opacity-70 border-2 border-transparent'
                            }`}
                            style={{
                              backgroundColor: colors.backgroundPrimary,
                              borderColor: currentImageIndex === index ? colors.backgroundTertiary : 'transparent'
                            }}
                            onClick={() => setCurrentImageIndex(index)}
                          >
                            <div className="aspect-square w-full flex items-center justify-center p-2">
                              <img
                                src={image}
                                alt={`${car.name || getCarDisplayName()} - Thumbnail ${index + 1}`}
                                className="w-full h-full object-contain"
                                draggable={false}
                                onError={(e) => {
                                  console.error('Tablet thumbnail failed to load:', image);
                                  e.target.src = carImg1;
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Main Content Below Two-Column Layout */}
        <div className="hidden lg:block px-6 xl:px-8 pb-8 pt-6">
          <div 
            className="rounded-3xl p-6 xl:p-8 shadow-lg"
            style={{ 
              backgroundColor: colors.backgroundSecondary,
              boxShadow: `0 2px 8px ${colors.shadowLight}`,
            }}
          >
            {/* Car Name and Description - As per document.txt: Model, Brand */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-black mb-2">{getCarDisplayName()}</h1>
              
              {/* Car Specifications - As per document.txt: Seats, Transmission, Fuel Type */}
              {getCarSpecs() && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-600">{getCarSpecs()}</span>
                  {car.color && (
                    <span className="text-sm text-gray-600"> · {car.color}</span>
                  )}
                  {car.year && (
                    <span className="text-sm text-gray-600"> · {car.year}</span>
                  )}
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-3">{car.description}</p>
              
              {/* Rating and Reviews - As per document.txt */}
              <div className="flex items-center gap-2 mb  -3">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-black">
                    {typeof car?.rating === 'number' ? car.rating.toFixed(1) : (car?.rating || '0.0')}
                  </span>
                  <svg 
                    className="w-4 h-4" 
                    fill={colors.accentOrange} 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-500">({car?.reviewsCount || 0}+ Reviews)</span>
              </div>

            </div>

            {/* Tab Navigation Bar */}
            <div className="mb-6 border-b" style={{ borderColor: colors.borderMedium }}>
              <div className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide -mx-0">
                {[
                  { id: 'offers', label: 'Offers' },
                  { id: 'reviews', label: 'Reviews' },
                  { id: 'location', label: 'Location' },
                  { id: 'features', label: 'Features' },
                  { id: 'cancellation', label: 'Cancellation' },
                  { id: 'inclusion-exclusion', label: 'Inclusion/Exclusion' },
                  { id: 'faqs', label: 'FAQs' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className="flex-shrink-0 pb-3 px-1 text-sm md:text-base font-medium transition-all relative"
                    style={{
                      color: activeTab === tab.id ? colors.backgroundTertiary : colors.textSecondary,
                    }}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ backgroundColor: colors.backgroundTertiary }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Offers Section */}
            <div ref={offersRef} className="mb-8 scroll-mt-24">
              <h2 className="text-xl font-bold text-black mb-4">Exclusive Offers</h2>
              <div className="space-y-4">
                {offers && offers.length > 0 ? (
                  offers.map((offer, index) => (
                    <div 
                      key={offer.id || index}
                      className={`p-4 rounded-xl border-2 ${offer.code ? 'flex items-center justify-between' : ''}`}
                      style={{ 
                        backgroundColor: colors.backgroundPrimary,
                        borderColor: colors.borderMedium
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {index === 0 && (
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl"
                            style={{ backgroundColor: colors.backgroundTertiary, color: colors.textWhite }}
                          >
                            Z
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-base mb-1" style={{ color: colors.textPrimary }}>
                            {offer.title}
                          </div>
                          <div className="text-sm" style={{ color: colors.textSecondary }}>
                            {offer.description}
                          </div>
                        </div>
                      </div>
                      {offer.code && (
                        <button
                          className="px-6 py-2 rounded-lg text-white font-semibold text-sm"
                          style={{ backgroundColor: colors.backgroundTertiary }}
                        >
                          {index === 0 ? 'APPLY' : 'Apply Code'}
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No offers available at the moment.</div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div ref={reviewsRef} className="mb-8 scroll-mt-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-black">Review ({car.reviewsCount})</h2>
                <button 
                  onClick={() => navigate(`/car-details/${car.id}/reviews`, { state: { car } })}
                  className="text-sm text-gray-500 font-medium hover:text-black transition-colors"
                >
                  See All
                </button>
              </div>
              
              {/* Reviews - Horizontal Scroll */}
              <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-0">
                {car?.reviews && car.reviews.length > 0 ? (
                  car.reviews.map((review, index) => (
                  <div 
                    key={index}
                    className="min-w-[220px] max-w-[220px] flex-shrink-0 p-3 py-3 rounded-lg border border-black"
                    style={{ backgroundColor: colors.backgroundPrimary }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-black">{review.name}</span>
                          <span className="text-xs font-semibold text-black">{review.rating}</span>
                          <svg 
                            className="w-3 h-3" 
                            fill={colors.accentOrange} 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed break-words">{review.comment}</p>
                  </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">No reviews yet</div>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div ref={locationRef} className="mb-8 scroll-mt-24">
              <div 
                className="p-4 rounded-xl border-2"
                style={{ 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.borderMedium
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Car Location</h2>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {(() => {
                      const location = car?.locationObject || car?.location || {};
                      const locationParts = [];
                      if (typeof location === 'string') {
                        locationParts.push(location);
                      } else {
                        if (location.address) locationParts.push(location.address);
                        if (location.city) locationParts.push(location.city);
                        if (location.state) locationParts.push(location.state);
                        if (location.pincode) locationParts.push(location.pincode);
                        if (location.country) locationParts.push(location.country);
                      }
                      const locationString = locationParts.length > 0 
                        ? locationParts.join(', ') 
                        : (car?.location || 'Location not available');
                      
                      // Split into two lines if too long
                      const words = locationString.split(', ');
                      const midPoint = Math.ceil(words.length / 2);
                      const firstLine = words.slice(0, midPoint).join(', ');
                      const secondLine = words.slice(midPoint).join(', ');
                      
                      return (
                        <>
                          {firstLine && (
                            <div className="text-sm mb-1" style={{ color: colors.textPrimary }}>
                              {firstLine}
                            </div>
                          )}
                          {secondLine && (
                            <div className="text-sm mb-2" style={{ color: colors.textPrimary }}>
                              {secondLine}
                            </div>
                          )}
                        </>
                      );
                    })()}
                    {car?.locationObject?.coordinates && (
                      <div className="text-sm" style={{ color: colors.textSecondary }}>
                        Coordinates: {car.locationObject.coordinates.latitude?.toFixed(4)}, {car.locationObject.coordinates.longitude?.toFixed(4)}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <div 
                      className="w-20 h-20 rounded-lg flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: colors.backgroundLight }}
                    >
                      {/* Map grid lines */}
                      <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" style={{ opacity: 0.3 }}>
                        <line x1="0" y1="20" x2="100" y2="20" stroke={colors.borderMedium} strokeWidth="1" />
                        <line x1="0" y1="40" x2="100" y2="40" stroke={colors.borderMedium} strokeWidth="1" />
                        <line x1="0" y1="60" x2="100" y2="60" stroke={colors.borderMedium} strokeWidth="1" />
                        <line x1="0" y1="80" x2="100" y2="80" stroke={colors.borderMedium} strokeWidth="1" />
                        <line x1="20" y1="0" x2="20" y2="100" stroke={colors.borderMedium} strokeWidth="1" />
                        <line x1="40" y1="0" x2="40" y2="100" stroke={colors.borderMedium} strokeWidth="1" />
                        <line x1="60" y1="0" x2="60" y2="100" stroke={colors.borderMedium} strokeWidth="1" />
                        <line x1="80" y1="0" x2="80" y2="100" stroke={colors.borderMedium} strokeWidth="1" />
                      </svg>
                      {/* Red location pin */}
                      <svg className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#F44336" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Car Features - As per document.txt: Features Array */}
            <div ref={featuresRef} className="mb-8 scroll-mt-24">
              <h2 className="text-xl font-bold text-black mb-3">Car features</h2>
              
              {/* Feature Icons Grid (if featureIcons exist) */}
              {car.featureIcons && car.featureIcons.length > 0 && (
                <div className="grid grid-cols-6 gap-4 mb-4">
                  {car.featureIcons.map((feature, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg flex flex-col items-center text-center"
                      style={{ backgroundColor: colors.backgroundPrimary }}
                    >
                      <div className="mb-2">
                        {getFeatureIcon(feature.icon)}
                      </div>
                      <span className="text-xs text-gray-600 mb-1">{feature.label}</span>
                      <span className="text-xs font-bold text-black">{feature.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Features List (as per document.txt: Features Array) */}
              {car.features && Array.isArray(car.features) && car.features.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {car.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg"
                      style={{ backgroundColor: colors.backgroundPrimary }}
                    >
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div ref={reviewsRef} className="mb-6 scroll-mt-24">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-black">Review ({car?.reviewsCount || 0})</h2>
                <button 
                  onClick={() => navigate(`/car-details/${car?.id || car?._id || id}/reviews`, { state: { car } })}
                  className="text-sm text-gray-500 font-medium hover:text-black transition-colors"
                >
                  VIEW MORE &gt;
                </button>
              </div>
              
              {/* Reviews - Horizontal Scroll */}
              <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-0">
                {car?.reviews && car.reviews.length > 0 ? (
                  car.reviews.map((review, index) => (
                    <div 
                      key={index}
                      className="min-w-[220px] max-w-[220px] flex-shrink-0 p-3 py-3 rounded-lg border border-black"
                      style={{ backgroundColor: colors.backgroundPrimary }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-black">{review.name}</span>
                            <span className="text-xs font-semibold text-black">{review.rating}</span>
                            <svg 
                              className="w-3 h-3" 
                              fill={colors.accentOrange} 
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed break-words">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No reviews yet</div>
                )}
              </div>
            </div>

            {/* Cancellation Section */}
            <div ref={cancellationRef} className="mb-8 scroll-mt-24">
              <h2 className="text-xl font-bold text-black mb-4">Cancellation Policy</h2>
              <div 
                className="p-4 rounded-xl border-2"
                style={{ 
                  backgroundColor: colors.backgroundPrimary,
                  borderColor: colors.borderMedium
                }}
              >
                {cancellationPolicy ? (
                  <div className="space-y-4">
                    {cancellationPolicy.freeCancellation && (
                      <div>
                        <div className="font-semibold text-base mb-2" style={{ color: colors.textPrimary }}>
                          {cancellationPolicy.freeCancellation.title}
                        </div>
                        <div className="text-sm mb-1" style={{ color: colors.textSecondary }}>
                          {cancellationPolicy.freeCancellation.description}
                        </div>
                      </div>
                    )}
                    {cancellationPolicy.partialRefund && (
                      <div className="border-t pt-4" style={{ borderColor: colors.borderMedium }}>
                        <div className="font-semibold text-base mb-2" style={{ color: colors.textPrimary }}>
                          {cancellationPolicy.partialRefund.title}
                        </div>
                        <div className="text-sm mb-1" style={{ color: colors.textSecondary }}>
                          {cancellationPolicy.partialRefund.description}
                        </div>
                      </div>
                    )}
                    {cancellationPolicy.noRefund && (
                      <div className="border-t pt-4" style={{ borderColor: colors.borderMedium }}>
                        <div className="font-semibold text-base mb-2" style={{ color: colors.textPrimary }}>
                          {cancellationPolicy.noRefund.title}
                        </div>
                        <div className="text-sm" style={{ color: colors.textSecondary }}>
                          {cancellationPolicy.noRefund.description}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Cancellation policy information not available.</div>
                )}
              </div>
            </div>

            {/* Inclusion/Exclusion Section */}
            <div ref={inclusionExclusionRef} className="mb-8 scroll-mt-24">
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Inclusion/Exclusions</h2>
              <div className="space-y-4">
                {inclusionsExclusions && inclusionsExclusions.length > 0 ? (
                  inclusionsExclusions.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {item.icon === 'fuel' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textSecondary }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        ) : item.icon === 'toll' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textSecondary }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textSecondary }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>{item.title}</div>
                        <div className="text-sm" style={{ color: colors.textSecondary }}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">Inclusion/exclusion information not available.</div>
                )}
              </div>
            </div>

            {/* FAQs Section */}
            <div ref={faqsRef} className="mb-8 scroll-mt-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>FAQs</h2>
                <button 
                  className="text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: colors.textSecondary }}
                >
                  VIEW MORE &gt;
                </button>
              </div>
              <div className="space-y-0">
                {faqs && faqs.length > 0 ? (
                  faqs.map((faq, index) => (
                  <div 
                    key={index}
                    className="border-b"
                    style={{ borderColor: colors.borderMedium }}
                  >
                    <div
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="py-4 flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <div className="text-sm font-medium flex-1" style={{ color: colors.textPrimary }}>
                        {faq.question}
                      </div>
                      <svg 
                        className={`w-5 h-5 flex-shrink-0 ml-4 transition-transform duration-300 ${
                          openFaqIndex === index ? 'transform rotate-180' : ''
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: colors.textSecondary }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 text-sm" style={{ color: colors.textSecondary }}>
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 py-4">No FAQs available at the moment.</div>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Main Content - White Rounded Card */}
        <div className="lg:hidden px-4 md:px-6 pb-24 md:pb-8 pt-4 md:pt-6">
        <div 
          className="rounded-3xl p-4 md:p-6 lg:p-8 -mx-4 md:mx-0 md:shadow-lg"
          style={{ 
            backgroundColor: colors.backgroundSecondary,
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
            boxShadow: `0 2px 8px ${colors.shadowLight}`,
          }}
        >
          {/* Car Name and Description - As per document.txt: Model, Brand */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-black mb-2">{getCarDisplayName()}</h1>
            
            {/* Car Specifications - As per document.txt: Seats, Transmission, Fuel Type */}
            {getCarSpecs() && (
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-600">{getCarSpecs()}</span>
                {car.color && (
                  <span className="text-sm text-gray-600"> · {car.color}</span>
                )}
                {car.year && (
                  <span className="text-sm text-gray-600"> · {car.year}</span>
                )}
              </div>
            )}
            
            <p className="text-sm text-gray-600 mb-3">{car.description}</p>
            
            {/* Rating and Reviews - As per document.txt */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex flex items-center gap-1">
                <span className="text-sm font-semibold text-black">
                  {typeof car?.rating === 'number' ? car.rating.toFixed(1) : (car?.rating || '0.0')}
                </span>
                <svg 
                  className="w-4 h-4" 
                  fill={colors.accentOrange} 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500">({car?.reviewsCount || 0}+ Reviews)</span>
            </div>

          </div>

          {/* Tab Navigation Bar - Mobile */}
          <div className="mb-6 border-b" style={{ borderColor: colors.borderMedium }}>
            <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide -mx-0">
              {[
                { id: 'offers', label: 'Offers' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'location', label: 'Location' },
                { id: 'features', label: 'Features' },
                { id: 'cancellation', label: 'Cancellation' },
                { id: 'inclusion-exclusion', label: 'Inclusion/Exclusion' },
                { id: 'faqs', label: 'FAQs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className="flex-shrink-0 pb-3 px-1 text-xs md:text-sm font-medium transition-all relative"
                  style={{
                    color: activeTab === tab.id ? colors.backgroundTertiary : colors.textSecondary,
                  }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: colors.backgroundTertiary }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Offers Section - Mobile */}
          <div ref={offersRef} className="mb-8 scroll-mt-24">
            <h2 className="text-lg md:text-xl font-bold text-black mb-4">Exclusive Offers</h2>
            <div className="space-y-4">
              <div 
                className="p-4 rounded-xl border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                style={{ 
                  backgroundColor: colors.backgroundPrimary,
                  borderColor: colors.borderMedium
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl flex-shrink-0"
                    style={{ backgroundColor: colors.backgroundTertiary, color: colors.textWhite }}
                  >
                    Z
                  </div>
                  <div>
                    <div className="font-bold text-base mb-1" style={{ color: colors.textPrimary }}>
                      Get 50% OFF!
                    </div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      Check Availability Here &gt;
                    </div>
                  </div>
                </div>
                <button
                  className="px-6 py-2 rounded-lg text-white font-semibold text-sm w-full md:w-auto"
                  style={{ backgroundColor: colors.backgroundTertiary }}
                >
                  APPLY
                </button>
              </div>
              <div 
                className="p-4 rounded-xl border-2"
                style={{ 
                  backgroundColor: colors.backgroundPrimary,
                  borderColor: colors.borderMedium
                }}
              >
                <div className="font-semibold text-base mb-2" style={{ color: colors.textPrimary }}>
                  First Time User Discount
                </div>
                <div className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                  Get 20% off on your first booking. Use code: FIRST20
                </div>
                <button
                  className="px-4 py-1.5 rounded-lg text-sm font-medium"
                  style={{ 
                    backgroundColor: colors.backgroundTertiary,
                    color: colors.textWhite
                  }}
                >
                  Apply Code
                </button>
              </div>
              <div 
                className="p-4 rounded-xl border-2"
                style={{ 
                  backgroundColor: colors.backgroundPrimary,
                  borderColor: colors.borderMedium
                }}
              >
                <div className="font-semibold text-base mb-2" style={{ color: colors.textPrimary }}>
                  Weekend Special
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  Book for 3+ days and get 15% discount on weekends
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section - Mobile */}
          <div ref={reviewsRef} className="mb-8 scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-black">Review ({car?.reviewsCount || 0})</h2>
              <button 
                onClick={() => navigate(`/car-details/${car?.id || car?._id || id}/reviews`, { state: { car } })}
                className="text-sm text-gray-500 font-medium hover:text-black transition-colors"
              >
                See All
              </button>
            </div>
            
            {/* Reviews - Horizontal Scroll */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-0">
              {car.reviews && car.reviews.length > 0 ? (
                car.reviews.map((review, index) => (
                  <div 
                    key={index}
                    className="min-w-[220px] max-w-[220px] flex-shrink-0 p-3 py-3 rounded-lg border border-black"
                    style={{ backgroundColor: colors.backgroundPrimary }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-black">{review.name}</span>
                          <span className="text-xs font-semibold text-black">{review.rating}</span>
                          <svg 
                            className="w-3 h-3" 
                            fill={colors.accentOrange} 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed break-words">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No reviews yet</div>
              )}
            </div>
          </div>

          {/* Location Section - Mobile */}
          <div ref={locationRef} className="mb-8 scroll-mt-24">
            <div 
              className="p-4 rounded-xl border-2"
              style={{ 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.borderMedium
              }}
            >
              <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Car Location</h2>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {(() => {
                    const location = car?.locationObject || car?.location || {};
                    const locationParts = [];
                    if (typeof location === 'string') {
                      locationParts.push(location);
                    } else {
                      if (location.address) locationParts.push(location.address);
                      if (location.city) locationParts.push(location.city);
                      if (location.state) locationParts.push(location.state);
                      if (location.pincode) locationParts.push(location.pincode);
                      if (location.country) locationParts.push(location.country);
                    }
                    const locationString = locationParts.length > 0 
                      ? locationParts.join(', ') 
                      : (car?.location || 'Location not available');
                    
                    // Split into two lines if too long
                    const words = locationString.split(', ');
                    const midPoint = Math.ceil(words.length / 2);
                    const firstLine = words.slice(0, midPoint).join(', ');
                    const secondLine = words.slice(midPoint).join(', ');
                    
                    return (
                      <>
                        {firstLine && (
                          <div className="text-sm mb-1" style={{ color: colors.textPrimary }}>
                            {firstLine}
                          </div>
                        )}
                        {secondLine && (
                          <div className="text-sm mb-2" style={{ color: colors.textPrimary }}>
                            {secondLine}
                          </div>
                        )}
                      </>
                    );
                  })()}
                  {car?.locationObject?.coordinates && (
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      Coordinates: {car.locationObject.coordinates.latitude?.toFixed(4)}, {car.locationObject.coordinates.longitude?.toFixed(4)}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <div 
                    className="w-20 h-20 rounded-lg flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: colors.backgroundLight }}
                  >
                    {/* Map grid lines */}
                    <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" style={{ opacity: 0.3 }}>
                      <line x1="0" y1="20" x2="100" y2="20" stroke={colors.borderMedium} strokeWidth="1" />
                      <line x1="0" y1="40" x2="100" y2="40" stroke={colors.borderMedium} strokeWidth="1" />
                      <line x1="0" y1="60" x2="100" y2="60" stroke={colors.borderMedium} strokeWidth="1" />
                      <line x1="0" y1="80" x2="100" y2="80" stroke={colors.borderMedium} strokeWidth="1" />
                      <line x1="20" y1="0" x2="20" y2="100" stroke={colors.borderMedium} strokeWidth="1" />
                      <line x1="40" y1="0" x2="40" y2="100" stroke={colors.borderMedium} strokeWidth="1" />
                      <line x1="60" y1="0" x2="60" y2="100" stroke={colors.borderMedium} strokeWidth="1" />
                      <line x1="80" y1="0" x2="80" y2="100" stroke={colors.borderMedium} strokeWidth="1" />
                    </svg>
                    {/* Red location pin */}
                    <svg className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#F44336" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Car Features - As per document.txt: Features Array */}
          <div ref={featuresRef} className="mb-8 scroll-mt-24">
            <h2 className="text-lg md:text-xl font-bold text-black mb-3">Car features</h2>
            
            {/* Feature Icons Grid (if featureIcons exist) */}
            {car.featureIcons && car.featureIcons.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mb-4">
                {car.featureIcons.map((feature, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg flex flex-col items-center text-center"
                    style={{ backgroundColor: colors.backgroundPrimary }}
                  >
                    <div className="mb-2">
                      {getFeatureIcon(feature.icon)}
                    </div>
                    <span className="text-xs text-gray-600 mb-1">{feature.label}</span>
                    <span className="text-xs font-bold text-black">{feature.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Features List (as per document.txt: Features Array) */}
            {car.features && Array.isArray(car.features) && car.features.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {car.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ backgroundColor: colors.backgroundPrimary }}
                  >
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews Section - Mobile - As per document.txt: Reviews */}
          <div ref={reviewsRef} className="mb-6 scroll-mt-24">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-black">Review ({car?.reviewsCount || 0})</h2>
              <button 
                onClick={() => navigate(`/car-details/${car?.id || car?._id || id}/reviews`)}
                className="text-sm text-gray-500 font-medium hover:text-black transition-colors"
              >
                VIEW MORE &gt;
              </button>
            </div>
            
            {/* Reviews - Horizontal Scroll */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-0">
              {car?.reviews && car.reviews.length > 0 ? (
                car.reviews.map((review, index) => (
                  <div 
                    key={index}
                    className="min-w-[220px] max-w-[220px] flex-shrink-0 p-3 py-3 rounded-lg border border-black"
                    style={{ backgroundColor: colors.backgroundPrimary }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-black">{review.name}</span>
                          <span className="text-xs font-semibold text-black">{review.rating}</span>
                          <svg 
                            className="w-3 h-3" 
                            fill={colors.accentOrange} 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed break-words">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No reviews yet</div>
              )}
            </div>
          </div>

          {/* Cancellation Section - Mobile */}
          <div ref={cancellationRef} className="mb-8 scroll-mt-24">
            <h2 className="text-lg md:text-xl font-bold text-black mb-4">Cancellation Policy</h2>
            <div 
              className="p-4 rounded-xl border-2"
              style={{ 
                backgroundColor: colors.backgroundPrimary,
                borderColor: colors.borderMedium
              }}
            >
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-base mb-2" style={{ color: colors.textPrimary }}>
                    Free Cancellation
                  </div>
                  <div className="text-sm mb-1" style={{ color: colors.textSecondary }}>
                    Cancel up to 24 hours before pickup time for a full refund.
                  </div>
                </div>
                <div className="border-t pt-4" style={{ borderColor: colors.borderMedium }}>
                  <div className="font-semibold text-base mb-2" style={{ color: colors.textPrimary }}>
                    Partial Refund
                  </div>
                  <div className="text-sm mb-1" style={{ color: colors.textSecondary }}>
                    Cancel between 12-24 hours before pickup: 50% refund
                  </div>
                </div>
                <div className="border-t pt-4" style={{ borderColor: colors.borderMedium }}>
                  <div className="font-semibold text-base mb-2" style={{ color: colors.textPrimary }}>
                    No Refund
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    Cancellations made less than 12 hours before pickup are not eligible for refund.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inclusion/Exclusion Section - Mobile */}
          <div ref={inclusionExclusionRef} className="mb-8 scroll-mt-24">
            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Inclusion/Exclusions</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textSecondary }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Fuel</div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    Fuel not included. Guest should return the car with the same fuel level as at start.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textSecondary }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Toll/Fastag</div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    Toll/Fastag charges not included. Check with host for Fastag recharge.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textSecondary }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Trip Protection</div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    Trip Protection excludes: Off-road use, driving under influence, over-speeding, illegal use, restricted zones.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Section - Mobile */}
          <div ref={faqsRef} className="mb-8 scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold" style={{ color: colors.textPrimary }}>FAQs</h2>
              <button 
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: colors.textSecondary }}
              >
                VIEW MORE &gt;
              </button>
            </div>
            <div className="space-y-0">
              {faqs && faqs.length > 0 ? (
                faqs.map((faq, index) => (
                  <div 
                    key={index}
                    className="border-b"
                    style={{ borderColor: colors.borderMedium }}
                  >
                    <div
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="py-4 flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <div className="text-sm font-medium flex-1" style={{ color: colors.textPrimary }}>
                        {faq.question}
                      </div>
                      <svg 
                        className={`w-5 h-5 flex-shrink-0 ml-4 transition-transform duration-300 ${
                          openFaqIndex === index ? 'transform rotate-180' : ''
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: colors.textSecondary }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 text-sm" style={{ color: colors.textSecondary }}>
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 py-4">No FAQs available at the moment.</div>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Book Now Button - Fixed at Bottom on mobile, static on web (only for mobile/tablet) */}
        <div className="lg:hidden fixed md:static bottom-0 left-0 right-0 z-50 md:z-auto">
          <div className="px-4 md:px-6 py-3 md:py-0 md:mt-6" style={{ backgroundColor: colors.backgroundSecondary }}>
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => navigate(`/book-now/${car?.id || car?._id || id}`)}
                className="w-full md:w-auto md:min-w-[300px] md:mx-auto md:block py-4 flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: colors.backgroundTertiary, borderRadius: '16px' }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Date-Time Picker Modal */}
      {isDateTimePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsDateTimePickerOpen(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <div className="p-4">
              {/* Time Selection Button */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>Time</label>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTimePickerOpen(true);
                    }}
                    className="w-auto px-4 py-2.5 rounded-xl border-2 flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ 
                      borderColor: colors.backgroundTertiary,
                      backgroundColor: colors.backgroundTertiary,
                      color: colors.backgroundSecondary
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-sm">
                      {selectedHour.toString().padStart(2, '0')} : {selectedMinute.toString().padStart(2, '0')} {selectedPeriod}
                    </span>
                  </button>
                </div>
              </div>

              {/* Calendar */}
              <div className="mb-4">
                <div className="mb-3 flex items-center justify-between">
                  <button
                    onClick={() => {
                      const newMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
                      setCalendarMonth(newMonth);
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h4 className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                    {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h4>
                  <button
                    onClick={() => {
                      const newMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
                      setCalendarMonth(newMonth);
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold py-1" style={{ color: colors.textSecondary }}>
                      {day}
                    </div>
                  ))}
                  {getCalendarDays().map((date, idx) => {
                    if (!date) return <div key={idx}></div>;
                    // Use local date components for comparison to avoid timezone issues
                    const dateStr = formatLocalDate(date);
                    const dateYear = date.getFullYear();
                    const dateMonth = date.getMonth();
                    const dateDay = date.getDate();
                    
                    // Check if selected using local date components
                    let isSelected = false;
                    if (calendarSelectedDate) {
                      const selectedYear = calendarSelectedDate.getFullYear();
                      const selectedMonth = calendarSelectedDate.getMonth();
                      const selectedDay = calendarSelectedDate.getDate();
                      isSelected = dateYear === selectedYear && 
                                   dateMonth === selectedMonth && 
                                   dateDay === selectedDay;
                    }
                    
                    // Check if past date using local date components
                    const today = new Date();
                    const todayYear = today.getFullYear();
                    const todayMonth = today.getMonth();
                    const todayDay = today.getDate();
                    const isPast = dateYear < todayYear || 
                                  (dateYear === todayYear && dateMonth < todayMonth) ||
                                  (dateYear === todayYear && dateMonth === todayMonth && dateDay < todayDay);
                    
                    const isMinDate = dateStr === getMinDate();
                    const isCurrentMonth = dateMonth === calendarMonth.getMonth();
                    
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!isPast && isCurrentMonth) {
                            // Ensure date is at noon to avoid timezone issues
                            const selectedDate = new Date(dateYear, dateMonth, dateDay, 12, 0, 0);
                            setCalendarSelectedDate(selectedDate);
                          }
                        }}
                        disabled={isPast && !isMinDate}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'text-white'
                            : isPast && !isMinDate
                            ? 'cursor-not-allowed'
                            : !isCurrentMonth
                            ? 'opacity-40'
                            : 'hover:bg-gray-100'
                        }`}
                        style={{
                          backgroundColor: isSelected ? colors.backgroundTertiary : 'transparent',
                          color: isSelected ? colors.backgroundSecondary : (isPast && !isMinDate ? colors.borderCheckbox : colors.textPrimary),
                        }}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDateTimePickerOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm"
                  style={{ 
                    borderColor: colors.backgroundTertiary,
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDateTimePickerDone}
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm"
                  style={{ backgroundColor: colors.backgroundTertiary }}
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Time Picker Modal */}
      {isTimePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsTimePickerOpen(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-2xl shadow-2xl"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 text-center" style={{ color: colors.textPrimary }}>Select Time</h3>
              
              {/* Time Selection */}
              <div className="flex items-center justify-center gap-4 mb-6">
                {/* Hour Selection */}
                <div className="flex flex-col items-center">
                  <label className="text-xs font-semibold mb-2" style={{ color: colors.textSecondary }}>Hour</label>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => setSelectedHour(hour)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedHour === hour ? 'text-white' : ''
                        }`}
                        style={{
                          backgroundColor: selectedHour === hour ? colors.backgroundTertiary : 'transparent',
                          color: selectedHour === hour ? colors.backgroundSecondary : colors.textPrimary,
                        }}
                      >
                        {hour.toString().padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-2xl font-bold mt-8" style={{ color: colors.textPrimary }}>:</span>

                {/* Minute Selection */}
                <div className="flex flex-col items-center">
                  <label className="text-xs font-semibold mb-2" style={{ color: colors.textSecondary }}>Minute</label>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                      <button
                        key={minute}
                        type="button"
                        onClick={() => setSelectedMinute(minute)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          selectedMinute === minute ? 'text-white' : ''
                        }`}
                        style={{
                          backgroundColor: selectedMinute === minute ? colors.backgroundTertiary : 'transparent',
                          color: selectedMinute === minute ? colors.backgroundSecondary : colors.textPrimary,
                        }}
                      >
                        {minute.toString().padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AM/PM Selection */}
                <div className="flex flex-col items-center">
                  <label className="text-xs font-semibold mb-2" style={{ color: colors.textSecondary }}>Period</label>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPeriod('am')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        selectedPeriod === 'am' ? 'text-white' : ''
                      }`}
                      style={{
                        backgroundColor: selectedPeriod === 'am' ? colors.backgroundTertiary : 'transparent',
                        color: selectedPeriod === 'am' ? colors.backgroundSecondary : colors.textPrimary,
                      }}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPeriod('pm')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        selectedPeriod === 'pm' ? 'text-white' : ''
                      }`}
                      style={{
                        backgroundColor: selectedPeriod === 'pm' ? colors.backgroundTertiary : 'transparent',
                        color: selectedPeriod === 'pm' ? colors.backgroundSecondary : colors.textPrimary,
                      }}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected Time Display */}
              <div className="mb-4 p-3 rounded-lg text-center" style={{ backgroundColor: colors.backgroundPrimary }}>
                <span className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  {selectedHour.toString().padStart(2, '0')} : {selectedMinute.toString().padStart(2, '0')} {selectedPeriod}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsTimePickerOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm"
                  style={{ 
                    borderColor: colors.backgroundTertiary,
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsTimePickerOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm"
                  style={{ backgroundColor: colors.backgroundTertiary }}
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Scrollbar Hide Styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CarDetailsPage;

