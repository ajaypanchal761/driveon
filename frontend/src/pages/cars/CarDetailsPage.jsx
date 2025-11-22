import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../../theme/theme.constants';
import carImg1 from '../../assets/car_img1-removebg-preview.png';
import carImg2 from '../../assets/car_img2-removebg-preview.png';
import carImg3 from '../../assets/car_img3-removebg-preview.png';
import carImg4 from '../../assets/car_img4-removebg-preview.png';
import carImg5 from '../../assets/car_img5-removebg-preview.png';
import carImg6 from '../../assets/car_img6-removebg-preview.png';
import carImg7 from '../../assets/car_img7-removebg-preview.png';

/**
 * CarDetailsPage Component
 * Car details page - Mobile-optimized
 * Matches the Ford Mustang Classic design pattern with website theme
 */
const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Mock car data based on document.txt structure
  const carsData = {
    '1': {
      id: '1',
      brand: 'Tesla',
      model: 'Model X',
      variant: 'Performance',
      year: 2018,
      price: 180,
      image: carImg1,
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Electric',
      color: 'White',
      carType: 'SUV',
      rating: 4.8,
      horsepower: 670,
      mileage: '15,000 km',
      location: 'Mumbai, Maharashtra',
      ownerName: 'Rajesh Kumar',
      ownerRating: 4.9,
      description: 'Experience the future of driving with the Tesla Model X. This all-electric SUV combines luxury, performance, and cutting-edge technology. With its falcon-wing doors, autopilot capabilities, and impressive range, the Model X redefines what an SUV can be.',
      reviews: 50,
      features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging', 'Leather Seats', 'Sunroof', 'Autopilot', 'Premium Sound System'],
    },
    '2': {
      id: '2',
      brand: 'Mercedes-Benz',
      model: 'S-Class',
      variant: 'Luxury',
      year: 2020,
      price: 220,
      image: carImg2,
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      color: 'Silver',
      carType: 'Sedan',
      rating: 4.7,
      horsepower: 496,
      mileage: '12,500 km',
      location: 'Delhi, NCR',
      ownerName: 'Priya Sharma',
      ownerRating: 4.8,
      description: 'The Mercedes-Benz S-Class represents the pinnacle of automotive luxury and innovation. With its elegant design, advanced safety features, and unparalleled comfort, the S-Class offers a driving experience like no other.',
      reviews: 45,
      features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging', 'Leather Seats', 'Sunroof', 'Massage Seats', 'Ambient Lighting'],
    },
    '3': {
      id: '3',
      brand: 'BMW',
      model: '7 Series',
      variant: 'Executive',
      year: 2019,
      price: 200,
      image: carImg3,
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      color: 'White',
      carType: 'Sedan',
      rating: 4.6,
      horsepower: 523,
      mileage: '18,000 km',
      location: 'Bangalore, Karnataka',
      ownerName: 'Amit Patel',
      ownerRating: 4.7,
      description: 'The BMW 7 Series combines powerful performance with sophisticated luxury. Featuring cutting-edge technology, premium materials, and exceptional craftsmanship, this flagship sedan delivers an extraordinary driving experience.',
      reviews: 38,
      features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging', 'Leather Seats', 'Sunroof', 'Wireless Charging', 'Gesture Control'],
    },
    '4': {
      id: '4',
      brand: 'Audi',
      model: 'A8 L',
      variant: 'Premium',
      year: 2021,
      price: 210,
      image: carImg4,
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      color: 'Black',
      carType: 'Sedan',
      rating: 4.9,
      horsepower: 563,
      mileage: '8,500 km',
      location: 'Pune, Maharashtra',
      ownerName: 'Sneha Reddy',
      ownerRating: 5.0,
      description: 'The Audi A8 L sets new standards in luxury and technology. With its spacious interior, advanced driver assistance systems, and refined performance, the A8 L offers a first-class travel experience.',
      reviews: 52,
      features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging', 'Leather Seats', 'Sunroof', 'Virtual Cockpit', 'Bang & Olufsen Sound'],
    },
    '5': {
      id: '5',
      brand: 'Jaguar',
      model: 'XF',
      variant: 'Sport',
      year: 2019,
      price: 175,
      image: carImg5,
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Diesel',
      color: 'Blue',
      carType: 'Sedan',
      rating: 4.5,
      horsepower: 296,
      mileage: '22,000 km',
      location: 'Hyderabad, Telangana',
      ownerName: 'Vikram Singh',
      ownerRating: 4.6,
      description: 'The Jaguar XF combines dynamic performance with British elegance. With its sleek design, responsive handling, and luxurious interior, the XF delivers a thrilling driving experience.',
      reviews: 32,
      features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging', 'Leather Seats', 'Sport Mode', 'Meridian Sound System'],
    },
    '6': {
      id: '6',
      brand: 'Lexus',
      model: 'LS 500',
      variant: 'F Sport',
      year: 2020,
      price: 195,
      image: carImg6,
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      color: 'Grey',
      carType: 'Sedan',
      rating: 4.8,
      horsepower: 416,
      mileage: '14,200 km',
      location: 'Chennai, Tamil Nadu',
      ownerName: 'Anjali Menon',
      ownerRating: 4.9,
      description: 'The Lexus LS 500 represents the perfect blend of luxury and efficiency. With its hybrid powertrain, exquisite craftsmanship, and advanced technology, the LS 500 offers a serene and sophisticated driving experience.',
      reviews: 41,
      features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging', 'Leather Seats', 'Sunroof', 'Mark Levinson Audio', 'Climate Control'],
    },
    '7': {
      id: '7',
      brand: 'Porsche',
      model: 'Panamera',
      variant: 'Turbo',
      year: 2021,
      price: 250,
      image: carImg7,
      seats: 4,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      color: 'Red',
      carType: 'Sedan',
      rating: 4.9,
      horsepower: 620,
      mileage: '6,800 km',
      location: 'Gurgaon, Haryana',
      ownerName: 'Rohit Malhotra',
      ownerRating: 4.9,
      description: 'The Porsche Panamera combines sports car performance with luxury sedan comfort. With its powerful engine, precise handling, and premium interior, the Panamera delivers an exhilarating driving experience.',
      reviews: 48,
      features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging', 'Leather Seats', 'Sunroof', 'Sport Chrono', 'Bose Sound System'],
    },
  };

  const car = carsData[id];

  // Generate multiple images for the car (using same image 3-4 times)
  const carImages = car ? [car.image, car.image, car.image, car.image] : [];

  // If car not found, redirect to listing page
  useEffect(() => {
    if (!car) {
      navigate('/cars');
    }
  }, [car, navigate]);

  if (!car) {
    return null;
  }

  // Handle previous image
  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      scrollToImage(newIndex);
    }
  };

  // Handle next image
  const handleNextImage = () => {
    if (currentImageIndex < carImages.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      scrollToImage(newIndex);
    }
  };

  // Scroll to specific image
  const scrollToImage = (index) => {
    if (scrollContainerRef.current) {
      const imageElements = scrollContainerRef.current.children;
      if (imageElements[index]) {
        imageElements[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half-fill-${id}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path fill={`url(#half-fill-${id})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.primary }}>
      {/* Header Section - Purple Background */}
      <header className="text-white relative overflow-hidden" style={{ backgroundColor: theme.colors.primary }}>
        <div className="relative px-4 pt-3 pb-2 md:px-6 md:py-4 lg:px-8 lg:py-5 md:max-w-7xl md:mx-auto">
          {/* Back Button and Heart Icon */}
          <div className="flex items-center justify-between mb-3">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 -ml-1 touch-target hover:opacity-80 transition-opacity"
              aria-label="Go back"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Heart Icon */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-1.5 touch-target hover:opacity-80 transition-opacity"
              aria-label="Add to favorites"
            >
              <svg
                className={`w-6 h-6 md:w-7 md:h-7 ${isFavorite ? 'fill-current text-white' : 'text-white'}`}
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Car Name */}
          <div className="mb-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
              {car.brand} <span className="font-normal">{car.model}</span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-white/80 mt-0.5">{car.variant}</p>
          </div>
        </div>
      </header>

      {/* Car Images Section */}
      <div className="relative -mt-4 mb-4 flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 md:max-w-7xl md:mx-auto">
        {/* Mobile: Horizontal Scroll */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 w-full snap-x snap-mandatory md:hidden"
          onScroll={(e) => {
            const container = e.target;
            const scrollLeft = container.scrollLeft;
            const itemWidth = container.scrollWidth / carImages.length;
            const newIndex = Math.round(scrollLeft / itemWidth);
            if (newIndex !== currentImageIndex && newIndex >= 0 && newIndex < carImages.length) {
              setCurrentImageIndex(newIndex);
            }
          }}
        >
          {carImages.map((image, index) => (
            <div key={index} className="shrink-0 w-full max-w-sm snap-center">
              <img
                src={image}
                alt={`${car.brand} ${car.model} - Image ${index + 1}`}
                className="w-full h-auto object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Desktop: Main Image with Thumbnails */}
        <div className="hidden md:block w-full">
          {/* Main Image */}
          <div className="rounded-xl p-4 lg:p-5 xl:p-6 mb-3 lg:mb-4 flex items-center justify-center min-h-[280px] lg:min-h-[320px] xl:min-h-[360px]">
            <img
              src={carImages[currentImageIndex]}
              alt={`${car.brand} ${car.model} - Main`}
              className="max-w-full max-h-[280px] lg:max-h-[320px] xl:max-h-[360px] object-contain transition-opacity duration-300"
              draggable={false}
            />
          </div>
          
          {/* Thumbnail Grid */}
          <div className="grid grid-cols-4 gap-2 lg:gap-3">
            {carImages.map((image, index) => (
              <div
                key={index}
                className={`rounded-lg p-2 lg:p-2.5 cursor-pointer transition-all duration-200 ${
                  currentImageIndex === index 
                    ? 'ring-2 ring-white shadow-lg scale-105 opacity-100' 
                    : 'hover:opacity-80 hover:scale-102 opacity-70'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${car.brand} ${car.model} - Thumbnail ${index + 1}`}
                  className="w-full h-16 lg:h-20 xl:h-24 object-contain"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicator Button - White - Hidden on Desktop */}
        <div className="flex items-center gap-1 mt-2 md:hidden">
          {/* Left arrow */}
          <div className="w-8 h-0.5 bg-white"></div>
          {/* Circular button */}
          <button
            onClick={handlePreviousImage}
            disabled={currentImageIndex === 0}
            className={`bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg touch-target flex items-center justify-center transition-opacity ${
              currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ color: theme.colors.primary }}
            aria-label="Previous car image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          {/* Right arrow */}
          <div className="w-8 h-0.5 bg-white"></div>
          <button
            onClick={handleNextImage}
            disabled={currentImageIndex === carImages.length - 1}
            className={`bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg touch-target flex items-center justify-center transition-opacity ${
              currentImageIndex === carImages.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ color: theme.colors.primary }}
            aria-label="Next car image"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <div className="w-8 h-0.5 bg-white"></div>
        </div>
      </div>

      {/* Main Content Container - Desktop Layout */}
      <div className="md:max-w-7xl md:mx-auto md:px-6 lg:px-8 xl:px-10">
        {/* Desktop: Two Column Layout */}
        <div className="md:grid md:grid-cols-2 md:gap-8 lg:gap-12 xl:gap-16">
          {/* Left Column - Images and Features (Desktop) */}
          <div className="md:order-2 md:sticky md:top-6 md:self-start md:space-y-6 lg:space-y-8">
            {/* Car Features Section - Purple Background */}
            <div className="px-4 pb-4 md:px-0 md:pb-0" style={{ backgroundColor: theme.colors.primary }}>
              <h3 className="text-sm md:text-base lg:text-lg font-semibold text-white mb-3 md:mb-4 lg:mb-5 hidden md:block">Quick Info</h3>
              <div className="grid grid-cols-4 gap-2 md:gap-3 lg:gap-4">
          {/* Seats Card */}
          <div className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-5 flex flex-col items-center hover:bg-white/15 transition-colors">
            <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white mb-1 md:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs md:text-sm lg:text-base text-white font-medium">{car.seats} Seats</span>
          </div>

          {/* Transmission Card */}
          <div className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-5 flex flex-col items-center hover:bg-white/15 transition-colors">
            <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white mb-1 md:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs md:text-sm lg:text-base text-white font-medium">{car.transmission}</span>
          </div>

          {/* Horsepower Card */}
          <div className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-5 flex flex-col items-center hover:bg-white/15 transition-colors">
            <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white mb-1 md:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs md:text-sm lg:text-base text-white font-medium">{car.horsepower} hp</span>
          </div>

          {/* Air Conditioning Card */}
          <div className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-5 flex flex-col items-center hover:bg-white/15 transition-colors">
            <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white mb-1 md:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span className="text-xs md:text-sm lg:text-base text-white font-medium">Air C</span>
          </div>
        </div>
      </div>
          </div>

          {/* Right Column - Details (Desktop) */}
          <div className="md:order-1 md:space-y-6 lg:space-y-8">
            {/* Additional Car Details Section - Purple Background */}
            <div className="px-4 pb-24 md:pb-0" style={{ backgroundColor: theme.colors.primary }}>
              {/* Car Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-5 mb-4 md:mb-6 lg:mb-8">
          {/* Car Type */}
          <div className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-5 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs md:text-sm text-white/70">Car Type</span>
            </div>
            <span className="text-sm md:text-base lg:text-lg font-semibold text-white">{car.carType}</span>
          </div>

          {/* Fuel Type */}
          <div className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-5 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs md:text-sm text-white/70">Fuel Type</span>
            </div>
            <span className="text-sm md:text-base lg:text-lg font-semibold text-white">{car.fuelType}</span>
          </div>

          {/* Color */}
          <div className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-5 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="text-xs md:text-sm text-white/70">Color</span>
            </div>
            <span className="text-sm md:text-base lg:text-lg font-semibold text-white">{car.color}</span>
          </div>

          {/* Year */}
          <div className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-5 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs md:text-sm text-white/70">Year</span>
            </div>
            <span className="text-sm md:text-base lg:text-lg font-semibold text-white">{car.year}</span>
          </div>

          {/* Mileage */}
          <div className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-5 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-xs md:text-sm text-white/70">Mileage</span>
            </div>
            <span className="text-sm md:text-base lg:text-lg font-semibold text-white">{car.mileage}</span>
          </div>

          {/* Location */}
          <div className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-5 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs md:text-sm text-white/70">Location</span>
            </div>
            <span className="text-sm md:text-base lg:text-lg font-semibold text-white truncate">{car.location}</span>
          </div>
        </div>

              {/* Features Section */}
              <div className="mb-4 md:mb-6 lg:mb-8">
                <h3 className="text-sm md:text-base lg:text-lg font-semibold text-white mb-3 md:mb-4 lg:mb-5">Features</h3>
                <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4">
                  {car.features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-lg px-3 py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5 text-xs md:text-sm lg:text-base text-white hover:bg-white/15 transition-all cursor-default"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Owner Details */}
              <div className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-5 mb-4 md:mb-6 hover:bg-white/15 transition-colors">
                <h3 className="text-sm md:text-base lg:text-lg font-semibold text-white mb-3 md:mb-4">Owner Details</h3>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm md:text-base lg:text-lg font-medium text-white mb-2">{car.ownerName}</p>
                    <div className="flex items-center gap-1.5">
                      {renderStars(car.ownerRating)}
                      <span className="text-xs md:text-sm lg:text-base text-white/70 ml-1">{car.ownerRating}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                    <svg className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 md:mb-6 lg:mb-8">
                <h3 className="text-sm md:text-base lg:text-lg font-semibold text-white mb-3 md:mb-4">Description</h3>
                <p className="text-sm md:text-base lg:text-lg text-white/90 leading-relaxed md:leading-loose">
                  {car.description}
                </p>
              </div>

              {/* Rating and Reviews */}
              <div className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-5 hover:bg-white/15 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex items-center gap-1">
                      {renderStars(car.rating)}
                    </div>
                    <span className="text-sm md:text-base lg:text-lg text-white font-medium">
                      {car.rating} ({car.reviews} Reviews)
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/cars/${car.id}/reviews`)}
                    className="text-sm md:text-base lg:text-lg font-medium text-white hover:underline flex items-center gap-1 md:gap-2 transition-all hover:opacity-80 hover:translate-x-1"
                  >
                    View All
                    <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar - Fixed */}
      <div 
        className="fixed bottom-0 left-0 right-0 border-t-2 border-white/20 px-4 py-4 md:px-6 lg:px-8 xl:px-10 z-50 shadow-2xl"
        style={{ backgroundColor: theme.colors.primary }}
      >
        <div className="flex items-center justify-between max-w-md md:max-w-7xl md:mx-auto">
          {/* Price - Same line alignment */}
          <div className="flex flex-row items-baseline gap-1">
            <span className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
              Rs. {car.price}
            </span>
            <span className="text-sm md:text-base lg:text-lg text-white/80">/day</span>
          </div>

          {/* Rent Now Button - White with theme color text */}
          <button
            onClick={() => {
              // Navigate to booking page or show booking modal
              navigate(`/booking/${car.id}`);
            }}
            className="px-8 py-3.5 md:px-10 md:py-4 lg:px-14 lg:py-4 xl:px-16 xl:py-5 rounded-lg md:rounded-xl text-sm md:text-base lg:text-lg xl:text-xl font-bold shadow-xl touch-target active:scale-95 md:active:scale-100 transition-all hover:shadow-2xl hover:scale-105"
            style={{
              backgroundColor: '#ffffff',
              color: theme.colors.primary,
              boxShadow: '0 4px 14px 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
