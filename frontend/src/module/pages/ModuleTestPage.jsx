import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import BottomNavbar from "../components/layout/BottomNavbar";
import { colors } from "../theme/colors";
import FilterDropdown from "../components/common/FilterDropdown";
import { useAppSelector } from "../../hooks/redux";
import { carService } from "../../services/car.service";
import { useLocation } from "../../hooks/useLocation";

// Use existing car images from assets
import carImg1 from "../../assets/car_banImg1.jpg";
import carImg2 from "../../assets/car_banImg2.jpg";
import carImg3 from "../../assets/car_banImg3.jpg";
import carImg4 from "../../assets/car_banImg4.jpg";
import carImg5 from "../../assets/car_banImg5.jpg";
import carImg6 from "../../assets/car_img6-removebg-preview.png";
import nearbyImg1 from "../../assets/car_img8.png";
import nearbyImg2 from "../../assets/car_img4-removebg-preview.png";
import nearbyImg3 from "../../assets/car_img5-removebg-preview.png";
import bannerCar1 from "../../assets/car_img1-removebg-preview.png";
import bannerCar2 from "../../assets/car_img4-removebg-preview.png";
import bannerCar3 from "../../assets/car_img5-removebg-preview.png";
import bannerCar4 from "../../assets/car_img6-removebg-preview.png";
import logo1 from "../../assets/car_logo1_PNG1.png";
import logo2 from "../../assets/car_logo2_PNG.png";
import logo3 from "../../assets/car_logo3_PNG.png";
import logo4 from "../../assets/car_logo4_PNG.png";
import logo5 from "../../assets/car_logo5_PNG.png";
import logo6 from "../../assets/car_logo6_PNG.png";
import logo7 from "../../assets/car_logo7_PNG.png";
import logo8 from "../../assets/car_logo8_PNG.png";
import logo9 from "../../assets/car_logo9_PNG.png";
import logo10 from "../../assets/car_logo10_PNG.png";
import logo11 from "../../assets/car_logo11_PNG.png";
import logo13 from "../../assets/car_logo13_PNG.png";
import logo14 from "../../assets/car_logo14_PNG.png";
import logo15 from "../../assets/car_logo15.png";
import logo16 from "../../assets/car_logo16.png";

/**
 * ModuleTestPage
 * Standalone page that visually matches the reference mobile screen.
 * Purely UI/layout – no business logic changed.
 */
const ModuleTestPage = () => {
  const navigate = useNavigate();

  // Get authentication state
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);

  // Get user's current live location (throttled to avoid frequent updates)
  const { currentLocation, coordinates } = useLocation(true, isAuthenticated, user?._id || user?.id);

  // Dynamic data states
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [nearbyCars, setNearbyCars] = useState([]);
  const [bestCars, setBestCars] = useState([]);
  const [totalCarsCount, setTotalCarsCount] = useState(0);
  const [featuredCar, setFeaturedCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter options state for FilterDropdown
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    fuelTypes: [],
    transmissions: [],
    colors: [],
    carTypes: [],
    features: [],
    seats: [],
    ratings: [],
    locations: [],
  });

  // Applied filters state
  const [appliedFilters, setAppliedFilters] = useState({
    brand: '',
    model: '',
    seats: '',
    fuelType: '',
    transmission: '',
    color: '',
    priceRange: { min: '', max: '' },
    rating: '',
    location: '',
    carType: '',
    features: [],
    availableFrom: '',
    availableTo: '',
  });

  // Store all cars for filtering
  const [allCars, setAllCars] = useState([]);

  // Brand logos map for dynamic brands - expanded mapping
  const brandLogos = {
    // Luxury brands
    Ferrari: logo10,
    Lamborghini: logo5,
    BMW: logo11,
    Audi: logo10,
    Mercedes: logo11,
    Porsche: logo5,
    // Electric/Modern
    Tesla: logo4,
    // Japanese brands
    Toyota: logo2,
    Honda: logo8,
    Nissan: logo11,
    Mazda: logo4,
    Subaru: logo5,
    // Korean brands
    Hyundai: logo6,
    Kia: logo1,
    // Indian brands
    Maruti: logo2,
    'Maruti Suzuki': logo2,
    Tata: logo4,
    Mahindra: logo5,
    // Other popular brands
    Ford: logo4,
    Chevrolet: logo5,
    Volkswagen: logo6,
    Volvo: logo7,
    Skoda: logo8,
    // Common model names that might come as brands
    'Swift Dzire': logo2,
    'Swift': logo2,
    'Dzire': logo2,
    'XUV500': logo5,
    'XUV': logo5,
    'Alto 800': logo2,
    'Alto': logo2,
  };

  // Fallback brand logos array for unknown brands
  const fallbackBrandLogos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9, logo10, logo11, logo13, logo14, logo15, logo16];

  // Category images map
  const categoryImages = {
    Sports: carImg1,
    Electric: carImg2,
    Legends: carImg3,
    Classic: carImg4,
    Coupe: carImg5,
    SUV: carImg1,
    Sedan: carImg2,
    Hatchback: carImg3,
  };

  // Fallback images for cars
  const fallbackCarImages = [carImg1, nearbyImg1, nearbyImg2, nearbyImg3, carImg6, carImg4, carImg5];

  // Transform car data
  const transformCarData = (car, index = 0) => {
    let carImage = fallbackCarImages[index % fallbackCarImages.length];
    
    if (car.images && car.images.length > 0) {
      const primaryImage = car.images.find((img) => img.isPrimary);
      if (primaryImage) {
        const imgUrl = typeof primaryImage === 'string' 
          ? primaryImage 
          : (primaryImage.url || primaryImage.path || primaryImage);
        if (typeof imgUrl === 'string') {
          carImage = imgUrl.startsWith('http') 
            ? imgUrl 
            : `${import.meta.env.VITE_API_BASE_URL || ''}${imgUrl}`;
        }
      } else if (car.images[0]) {
        const imgUrl = typeof car.images[0] === 'string' 
          ? car.images[0] 
          : (car.images[0].url || car.images[0].path || car.images[0]);
        if (typeof imgUrl === 'string') {
          carImage = imgUrl.startsWith('http') 
            ? imgUrl 
            : `${import.meta.env.VITE_API_BASE_URL || ''}${imgUrl}`;
        }
      }
    } else if (car.image) {
      const imgUrl = typeof car.image === 'string' 
        ? car.image 
        : (car.image.url || car.image.path || car.image);
      if (typeof imgUrl === 'string') {
        carImage = imgUrl.startsWith('http') 
          ? imgUrl 
          : `${import.meta.env.VITE_API_BASE_URL || ''}${imgUrl}`;
      }
    }

    // Normalize fuel type
    const fuelType = car.fuelType || '';
    const normalizedFuelType = fuelType.toLowerCase() === 'petrol' ? 'Petrol' :
      fuelType.toLowerCase() === 'diesel' ? 'Diesel' :
      fuelType.toLowerCase() === 'electric' ? 'Electric' :
      fuelType.toLowerCase() === 'hybrid' ? 'Hybrid' :
      fuelType.charAt(0).toUpperCase() + fuelType.slice(1).toLowerCase();

    // Normalize transmission
    const transmission = car.transmission || '';
    const normalizedTransmission = transmission.toLowerCase() === 'automatic' ? 'Automatic' :
      transmission.toLowerCase() === 'manual' ? 'Manual' :
      transmission.toLowerCase() === 'cvt' ? 'CVT' :
      transmission.charAt(0).toUpperCase() + transmission.slice(1).toLowerCase();

    return {
      id: car._id || car.id,
      name: `${car.brand} ${car.model}`,
      brand: car.brand || '',
      model: car.model || '',
      rating: car.averageRating ? car.averageRating.toFixed(1) : '5.0',
      location: car.location?.city || car.location?.address || car.location || 'Location',
      seats: `${car.seatingCapacity || car.seats || 4} Seats`,
      seatingCapacity: car.seatingCapacity || car.seats || 4,
      price: `Rs. ${car.pricePerDay || 0}/Day`,
      image: carImage,
      pricePerDay: car.pricePerDay || 0,
      // Filter-related properties
      fuelType: normalizedFuelType,
      transmission: normalizedTransmission,
      color: car.color || '',
      carType: car.carType || car.bodyType || '',
      features: car.features || [],
    };
  };

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("10");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [activeFilter, setActiveFilter] = useState("$200–$1,000 / day");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef(null);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [animatingStates, setAnimatingStates] = useState({});

  // Fetch dynamic data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch categories (car types) with counts
        const carTypesResponse = await carService.getTopCarTypes({ limit: 10 });
        if (carTypesResponse.success && carTypesResponse.data?.carTypes) {
          const carTypes = carTypesResponse.data.carTypes.map((type, index) => ({
            id: index + 1,
            label: type.name || type.carType || type,
            count: type.count || 0,
            image: categoryImages[type.name || type.carType || type] || categoryImages.Sports,
          }));
          setCategories(carTypes);
        }

        // Fetch top brands
        const brandsResponse = await carService.getTopBrands({ limit: 10 });
        if (brandsResponse.success && brandsResponse.data?.brands) {
          const brandsData = brandsResponse.data.brands.map((brand, index) => {
            const brandName = brand.name || brand.brand || brand;
            const normalizedName = brandName.trim();
            let brandLogo = null;
            
            // First, check if API returned a logo for this brand
            if (brand.logo || brand.brandLogo || brand.image) {
              const apiLogo = brand.logo || brand.brandLogo || brand.image;
              if (typeof apiLogo === 'string' && apiLogo) {
                brandLogo = apiLogo.startsWith('http') 
                  ? apiLogo 
                  : `${import.meta.env.VITE_API_BASE_URL || ''}${apiLogo}`;
              }
            }
            
            // If no API logo, map specific brand/model names to correct logos
            if (!brandLogo) {
            // Indian brands/models
            if (normalizedName.toLowerCase().includes('alto') || normalizedName.toLowerCase().includes('800')) {
              brandLogo = logo2; // Maruti/Toyota logo for Alto
            } else if (normalizedName.toLowerCase().includes('xuv') || normalizedName.toLowerCase().includes('500')) {
              brandLogo = logo9; // Mahindra logo for XUV
            } else if (normalizedName.toLowerCase().includes('swift') || normalizedName.toLowerCase().includes('dzire')) {
              brandLogo = logo2; // Maruti logo for Swift/Dzire
            } else if (normalizedName.toLowerCase().includes('hyundai')) {
              brandLogo = logo6; // Hyundai logo (different from KIA)
            } else if (normalizedName.toLowerCase().includes('kia')) {
              brandLogo = logo1; // KIA logo
            } else if (normalizedName.toLowerCase().includes('volvo')) {
              brandLogo = logo7; // Volvo logo
            } else if (normalizedName.toLowerCase().includes('toyota')) {
              brandLogo = logo2; // Toyota logo
            } else if (normalizedName.toLowerCase().includes('mahindra')) {
              brandLogo = logo9; // Mahindra logo
            } else if (normalizedName.toLowerCase().includes('maruti')) {
              brandLogo = logo2; // Maruti logo
            } else if (normalizedName.toLowerCase().includes('tata')) {
              brandLogo = logo3; // Tata logo
            } else if (normalizedName.toLowerCase().includes('honda')) {
              brandLogo = logo8; // Honda logo
            } else if (normalizedName.toLowerCase().includes('nissan')) {
              brandLogo = logo11; // Nissan logo
            } else if (normalizedName.toLowerCase().includes('ford')) {
              brandLogo = logo4; // Ford logo
            } else if (normalizedName.toLowerCase().includes('chevrolet')) {
              brandLogo = logo5; // Chevrolet logo
            } else if (normalizedName.toLowerCase().includes('ferrari')) {
              brandLogo = logo10; // Ferrari logo
            } else if (normalizedName.toLowerCase().includes('lamborghini')) {
              brandLogo = logo5; // Lamborghini logo
            } else if (normalizedName.toLowerCase().includes('bmw')) {
              brandLogo = logo11; // BMW logo
            } else if (normalizedName.toLowerCase().includes('audi')) {
              brandLogo = logo10; // Audi logo
            } else if (normalizedName.toLowerCase().includes('tesla')) {
              brandLogo = logo4; // Tesla logo
            } else {
              // Try exact match from brandLogos map
              brandLogo = brandLogos[normalizedName];
              
              // Try case-insensitive match
              if (!brandLogo) {
                const brandKey = Object.keys(brandLogos).find(
                  key => key.toLowerCase() === normalizedName.toLowerCase()
                );
                brandLogo = brandKey ? brandLogos[brandKey] : null;
              }
              
              // Use fallback brand logo if still not found
              if (!brandLogo) {
                brandLogo = fallbackBrandLogos[index % fallbackBrandLogos.length];
              }
            }
          }
            
            return {
              id: index + 1,
              name: brandName,
              logo: brandLogo,
              count: brand.count || 0,
            };
          });
          setBrands(brandsData);
        }

        // Fetch nearby cars (using user's coordinates if available)
        const nearbyParams = {
          limit: 3,
        };
        if (coordinates && coordinates.lat && coordinates.lng) {
          nearbyParams.latitude = coordinates.lat;
          nearbyParams.longitude = coordinates.lng;
        }
        const nearbyResponse = await carService.getNearbyCars(nearbyParams);
        if (nearbyResponse.success && nearbyResponse.data?.cars) {
          const nearbyCarsData = nearbyResponse.data.cars.slice(0, 3).map((car, index) => 
            transformCarData(car, index)
          );
          setNearbyCars(nearbyCarsData);
        }

        // Fetch best cars (latest/featured cars)
        const bestCarsResponse = await carService.getCars({
          limit: 2,
          sortBy: 'averageRating',
          sortOrder: 'desc',
          status: 'active',
          isAvailable: true,
        });
        if (bestCarsResponse.success && bestCarsResponse.data?.cars) {
          const bestCarsData = bestCarsResponse.data.cars.slice(0, 2).map((car, index) => 
            transformCarData(car, index)
          );
          setBestCars(bestCarsData);

          // Set featured car (first one)
          if (bestCarsResponse.data.cars.length > 0) {
            setFeaturedCar(transformCarData(bestCarsResponse.data.cars[0], 0));
          }
        }

        // Fetch all cars to extract filter options
        const allCarsResponse = await carService.getCars({
          limit: 100, // Get more cars to extract filter options
          status: 'active',
          isAvailable: true,
        });
        
        if (allCarsResponse.success && allCarsResponse.data?.pagination) {
          setTotalCarsCount(allCarsResponse.data.pagination.total || 0);
        }

        // Extract filter options from all cars and store cars for filtering
        if (allCarsResponse.success && allCarsResponse.data?.cars) {
          const cars = allCarsResponse.data.cars;
          
          // Store all cars for filtering
          const transformedAllCars = cars.map((car, index) => transformCarData(car, index));
          setAllCars(transformedAllCars);

          // Extract unique brands
          const uniqueBrands = Array.from(
            new Set(cars.map((car) => car.brand).filter(Boolean))
          ).sort();

          // Extract unique fuel types
          const uniqueFuelTypes = Array.from(
            new Set(
              cars
                .map((car) => {
                  const fuel = car.fuelType || '';
                  if (fuel.toLowerCase() === 'petrol') return 'Petrol';
                  if (fuel.toLowerCase() === 'diesel') return 'Diesel';
                  if (fuel.toLowerCase() === 'electric') return 'Electric';
                  if (fuel.toLowerCase() === 'hybrid') return 'Hybrid';
                  return fuel.charAt(0).toUpperCase() + fuel.slice(1).toLowerCase();
                })
                .filter(Boolean)
            )
          ).sort();

          // Extract unique transmissions
          const uniqueTransmissions = Array.from(
            new Set(
              cars
                .map((car) => {
                  const trans = car.transmission || '';
                  if (trans.toLowerCase() === 'automatic') return 'Automatic';
                  if (trans.toLowerCase() === 'manual') return 'Manual';
                  if (trans.toLowerCase() === 'cvt') return 'CVT';
                  return trans.charAt(0).toUpperCase() + trans.slice(1).toLowerCase();
                })
                .filter(Boolean)
            )
          ).sort();

          // Extract unique colors
          const uniqueColors = Array.from(
            new Set(
              cars
                .map((car) => {
                  const color = car.color || '';
                  return color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
                })
                .filter(Boolean)
            )
          ).sort();

          // Extract unique car types
          const uniqueCarTypes = Array.from(
            new Set(
              cars
                .map((car) => {
                  const type = car.carType || car.bodyType || '';
                  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
                })
                .filter(Boolean)
            )
          ).sort();

          // Extract all unique features
          const allFeatures = cars
            .flatMap((car) => car.features || [])
            .filter(Boolean);
          const uniqueFeatures = Array.from(new Set(allFeatures)).sort();

          // Extract unique seat counts
          const uniqueSeats = Array.from(
            new Set(cars.map((car) => car.seatingCapacity || car.seats).filter(Boolean))
          )
            .map((seats) => String(seats))
            .sort((a, b) => parseInt(a) - parseInt(b));

          // Extract unique locations
          const uniqueLocations = Array.from(
            new Set(
              cars
                .map((car) => {
                  const loc = car.location?.city || car.location?.address || car.location || '';
                  return loc.trim();
                })
                .filter(Boolean)
            )
          ).sort();

          // Extract unique ratings and create rating options
          const allRatings = cars
            .map((car) => {
              const rating = car.averageRating || car.rating || 0;
              return parseFloat(rating) || 0;
            })
            .filter((rating) => rating > 0);

          // Create rating filter options based on available ratings
          const ratingOptions = [];
          if (allRatings.length > 0) {
            const maxRating = Math.max(...allRatings);
            const minRating = Math.min(...allRatings);
            if (maxRating >= 4.0) ratingOptions.push('4.0+');
            if (maxRating >= 4.5) ratingOptions.push('4.5+');
            if (maxRating >= 5.0) ratingOptions.push('5.0');
          }

          // Set filter options
          setFilterOptions({
            brands: uniqueBrands,
            fuelTypes: uniqueFuelTypes,
            transmissions: uniqueTransmissions,
            colors: uniqueColors,
            carTypes: uniqueCarTypes,
            features: uniqueFeatures,
            seats: uniqueSeats,
            ratings: ratingOptions,
            locations: uniqueLocations,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Keep default/empty data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [coordinates]);

  // Auto focus input when search becomes active
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTimeDisplay = () => {
    return `${selectedHour} : ${selectedMinute} ${selectedPeriod.toLowerCase()}`;
  };

  // Handler for when filters are applied
  const handleApplyFilters = (filters) => {
    console.log("Applied Filters:", filters);
    setAppliedFilters(filters);
    setIsFilterOpen(false);
  };

  // Filter cars based on applied filters
  const filteredCars = useMemo(() => {
    let filtered = [...allCars];

    // Filter by brand
    if (appliedFilters.brand) {
      filtered = filtered.filter((car) => 
        car.brand?.toLowerCase() === appliedFilters.brand.toLowerCase()
      );
    }

    // Filter by model
    if (appliedFilters.model) {
      const modelQuery = appliedFilters.model.toLowerCase().trim();
      filtered = filtered.filter((car) => 
        car.model?.toLowerCase().includes(modelQuery) ||
        car.name?.toLowerCase().includes(modelQuery)
      );
    }

    // Filter by fuel type
    if (appliedFilters.fuelType) {
      filtered = filtered.filter((car) => {
        const carFuelType = car.fuelType || '';
        return carFuelType.toLowerCase() === appliedFilters.fuelType.toLowerCase();
      });
    }

    // Filter by transmission
    if (appliedFilters.transmission) {
      filtered = filtered.filter((car) => {
        const carTransmission = car.transmission || '';
        return carTransmission.toLowerCase() === appliedFilters.transmission.toLowerCase();
      });
    }

    // Filter by car type
    if (appliedFilters.carType) {
      filtered = filtered.filter((car) => {
        const carType = car.carType || '';
        return carType.toLowerCase() === appliedFilters.carType.toLowerCase();
      });
    }

    // Filter by color
    if (appliedFilters.color) {
      filtered = filtered.filter((car) => {
        const carColor = car.color || '';
        return carColor.toLowerCase() === appliedFilters.color.toLowerCase();
      });
    }

    // Filter by seats
    if (appliedFilters.seats) {
      filtered = filtered.filter((car) => {
        const carSeats = String(car.seatingCapacity || '');
        return carSeats === appliedFilters.seats;
      });
    }

    // Filter by features (all selected features must be present)
    if (appliedFilters.features && appliedFilters.features.length > 0) {
      filtered = filtered.filter((car) => {
        const carFeatures = car.features || [];
        return appliedFilters.features.every((feature) =>
          carFeatures.some((carFeature) =>
            carFeature.toLowerCase() === feature.toLowerCase()
          )
        );
      });
    }

    // Filter by price range
    if (appliedFilters.priceRange.min || appliedFilters.priceRange.max) {
      filtered = filtered.filter((car) => {
        const carPrice = parseFloat(car.price?.replace(/[^0-9.]/g, '') || car.pricePerDay || 0);
        const minPrice = parseFloat(appliedFilters.priceRange.min) || 0;
        const maxPrice = parseFloat(appliedFilters.priceRange.max) || Infinity;
        return carPrice >= minPrice && carPrice <= maxPrice;
      });
    }

    // Filter by rating
    if (appliedFilters.rating) {
      filtered = filtered.filter((car) => {
        const carRating = parseFloat(car.rating) || 0;
        const minRating = parseFloat(appliedFilters.rating.replace('+', '')) || 0;
        return carRating >= minRating;
      });
    }

    // Filter by location
    if (appliedFilters.location) {
      filtered = filtered.filter((car) => {
        return car.location?.toLowerCase().includes(appliedFilters.location.toLowerCase());
      });
    }

    return filtered;
  }, [allCars, appliedFilters]);

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: colors.backgroundTertiary }}
    >
      {/* TOP COMPACT HEADER - matches reference */}
      <div
        className="px-4 pt-6 pb-4 space-y-2"
        style={{ backgroundColor: colors.backgroundTertiary }}
      >
        {/* Logo and Location in same row */}
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <img
            alt="DriveOn Logo"
            src="/driveonlogo.png"
            className="h-9 w-auto object-contain"
          />
          {/* Location pill */}
          <button
            type="button"
            className="flex items-center justify-between rounded-full px-4 py-1.5 text-[11px] flex-shrink-0"
            style={{
              backgroundColor: colors.backgroundTertiary,
              color: colors.textWhite,
            }}
            onClick={() => navigate("/module-location")}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white text-[10px]"
                style={{ backgroundColor: colors.backgroundTertiary }}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <span className="truncate">{currentLocation || 'Getting location...'}</span>
            </span>
            <svg
              className="w-3 h-3 text-gray-300 flex-shrink-0 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {!isSearchActive ? (
            <motion.button
              type="button"
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-[11px] shadow-sm"
              style={{
                backgroundColor: "#21292b",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              onClick={() => setIsSearchActive(true)}
              whileHover={{ 
                scale: 1.02,
                borderColor: "rgba(255,255,255,0.2)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.svg
                className="w-4 h-4 text-gray-200 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </motion.svg>
              <span className="flex-1 text-left text-gray-300 truncate">
                Search your dream car....
              </span>
              <motion.svg
                className="w-3 h-3 text-gray-300 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </motion.button>
          ) : (
            <motion.div
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-[11px] shadow-sm"
              style={{
                backgroundColor: "#21292b",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.svg
                className="w-4 h-4 text-gray-200 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </motion.svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search your dream car...."
                className="flex-1 bg-transparent text-gray-300 placeholder-gray-400 outline-none text-[11px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate("/search");
                  }
                  if (e.key === "Escape") {
                    setIsSearchActive(false);
                    setSearchValue("");
                  }
                }}
              />
              {searchValue && (
                <motion.button
                  type="button"
                  onClick={() => {
                    setSearchValue("");
                    navigate("/search");
                  }}
                  className="flex-shrink-0"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-4 h-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              )}
              <motion.button
                type="button"
                onClick={() => {
                  setIsSearchActive(false);
                  setSearchValue("");
                }}
                className="flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-4 h-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* CONTENT */}
      <main
        className="flex-1 pb-0"
        style={{ backgroundColor: colors.backgroundTertiary }}
      >
        {/* Floating white card container like reference */}
        <motion.div 
          className="mt-3 rounded-t-3xl bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.5)] px-4 pt-4 pb-28 space-y-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* FILTER PILLS ROW */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {/* All filters pill */}
            <motion.button
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold flex-shrink-0 border shadow-sm"
              style={{
                borderColor: "#e5e7eb",
                backgroundColor:
                  activeFilter === "All filters"
                    ? colors.backgroundTertiary
                    : colors.backgroundSecondary,
                color:
                  activeFilter === "All filters"
                    ? "#ffffff"
                    : colors.textPrimary,
              }}
              onClick={() => {
                setActiveFilter("All filters");
                setIsFilterOpen(true);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>All filters</span>
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 01.8 1.6L15 13.25V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.75L3.2 4.6A1 1 0 013 4z"
                />
              </svg>
            </motion.button>

            {/* Price pill */}
            <motion.button
              type="button"
              className="px-3 py-1.5 rounded-full text-[11px] font-medium flex-shrink-0"
              style={{
                backgroundColor:
                  activeFilter === "$200–$1,000 / day"
                    ? colors.backgroundTertiary
                    : colors.backgroundSecondary,
                color:
                  activeFilter === "$200–$1,000 / day"
                    ? "#ffffff"
                    : colors.textSecondary,
                border: "1px solid #e5e7eb",
              }}
              onClick={() => setActiveFilter("$200–$1,000 / day")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              $200–$1,000 / day
            </motion.button>

            {["Brand", "Body", "More"].map((label) => (
              <motion.button
                key={label}
                type="button"
                className="px-3 py-1.5 rounded-full text-[11px] font-medium flex-shrink-0 border"
                style={{
                  borderColor: "#e5e7eb",
                  backgroundColor:
                    activeFilter === label
                      ? colors.backgroundTertiary
                      : colors.backgroundSecondary,
                  color:
                    activeFilter === label ? "#ffffff" : colors.textSecondary,
                }}
                onClick={() => setActiveFilter(label)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {label}
              </motion.button>
            ))}
          </div>

          {/* CATEGORY IMAGE CARDS */}
          <motion.div 
            className="bg-white rounded-3xl px-3 pt-3 pb-4 shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {categories.map((cat, index) => (
                <motion.button
                  key={cat.id}
                  type="button"
                  className="flex-shrink-0 w-24"
                  onClick={() => navigate(`/category/${cat.label.toLowerCase()}`)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + (index * 0.05) }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-24 h-20 rounded-xl overflow-hidden mb-2 bg-gray-100 shadow-md">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-gray-900">
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {cat.count} cars
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* TOP BRANDS SECTION (between categories and meta row) */}
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h2 className="text-base font-bold text-black mb-4">Top Brands</h2>
            <div className="relative overflow-hidden w-full">
              <div className="flex gap-7 brands-scroll">
                {brands.concat(brands).map((brand, index) => (
                  <motion.button
                    key={`${brand.id}-${index}`}
                    type="button"
                    className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
                    onClick={() => navigate(`/brand/${brand.name}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center p-2.5"
                      style={{ backgroundColor: colors.backgroundTertiary }}
                    >
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {brand.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
            <style>{`
              .brands-scroll {
                animation: scrollBrands 30s linear infinite;
                display: flex;
                width: fit-content;
              }
              @keyframes scrollBrands {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .brands-scroll:hover {
                animation-play-state: paused;
              }
            `}</style>
          </motion.div>

          {/* META ROW */}
          <div className="flex items-center justify-between mt-1 px-1">
            <span className="text-xs text-gray-500">{totalCarsCount || 0} available</span>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-gray-600"
            >
              <span>Popular</span>
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* FEATURED CAR CARD */}
          {featuredCar && (
            <motion.div 
              className="px-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.div 
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 cursor-pointer"
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/car-details/${featuredCar.id}`)}
              >
                <div className="w-full h-48 bg-gray-100 overflow-hidden">
                  <motion.img
                    src={featuredCar.image}
                    alt={featuredCar.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="px-4 pt-3 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {featuredCar.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-gray-700">{featuredCar.price}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-md"
                        style={{ backgroundColor: colors.backgroundTertiary }}
                      >
                        <svg
                          className="w-3 h-3 text-yellow-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span>{featuredCar.rating}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* BANNER SECTION - Between Featured Car and Best Cars */}
          <div className="mb-3 md:mb-6 relative overflow-hidden rounded-2xl md:rounded-3xl block md:hidden mt-4 px-1">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet-custom',
                bulletActiveClass: 'swiper-pagination-bullet-active-custom',
                el: '.mobile-banner-pagination',
              }}
              className="w-full rounded-2xl md:rounded-3xl overflow-hidden"
              style={{ background: 'rgb(41, 70, 87)' }}
            >
              {[
                { image: bannerCar1, alt: 'Car 1' },
                { image: bannerCar2, alt: 'Car 2' },
                { image: bannerCar3, alt: 'Car 3' },
                { image: bannerCar4, alt: 'Car 4' },
              ].map((car, index) => (
                <SwiperSlide key={index} className="!w-full">
                  <div 
                    className="min-w-full flex items-center justify-between px-4 md:px-6 lg:px-8 h-36 md:h-48 lg:h-56 cursor-pointer"
                    onClick={() => navigate("/search")}
                  >
                    <div className="flex-shrink-0 w-1/3 z-10">
                      <h2 className="text-sm md:text-base lg:text-lg font-bold mb-1 text-white whitespace-nowrap">
                        20% Off Your First Ride!
                      </h2>
                      <p className="text-xs md:text-xs lg:text-sm mb-2 md:mb-3 text-white">
                        Experience Seamless Car Rentals.
                      </p>
                      <button 
                        className="px-2 md:px-2.5 py-0.5 md:py-1 rounded-md font-medium text-xs transition-all hover:opacity-90 bg-white text-black border-2 border-white whitespace-nowrap"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/search");
                        }}
                      >
                        Discover More
                      </button>
                    </div>
                    <div className="flex-1 flex items-center justify-end h-full relative">
                      <img
                        alt={car.alt}
                        className="h-full max-h-full w-auto object-contain"
                        draggable="false"
                        src={car.image}
                        style={{ maxWidth: '100%', objectFit: 'contain', transform: 'translateX(15px)' }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="mobile-banner-pagination flex justify-center items-center gap-2 mt-4"></div>
            <style>{`
              .swiper-pagination-bullet-custom {
                width: 8px;
                height: 8px;
                background: rgba(0, 0, 0, 0.3);
                opacity: 1;
                margin: 0 4px;
                transition: all 0.3s ease;
                border-radius: 50%;
                cursor: pointer;
                display: inline-block;
              }
              .swiper-pagination-bullet-active-custom {
                background: #000000;
                width: 10px;
                height: 10px;
              }
            `}</style>
          </div>

          {/* BEST CARS GRID (above Nearby) */}
          <motion.div 
            className="mt-4 px-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black">
                Best Cars
              </h2>
              <motion.button
                type="button"
                className="text-sm text-gray-600 font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/search")}
              >
                View All
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {bestCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  className="w-full rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + (index * 0.05) }}
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                  onClick={() => navigate(`/car-details/${car.id}`)}
                >
                  <div
                    className="relative w-full h-28 md:h-40 flex items-center justify-center rounded-t-xl overflow-hidden"
                    style={{ backgroundColor: "#f0f0f0" }}
                  >
                    <img
                      alt={car.name}
                      src={car.image}
                      className="w-full h-full object-contain scale-125"
                      style={{ opacity: 1 }}
                    />
                    <motion.button 
                      className="absolute -top-1 left-1.5 md:left-2 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFavoriteStates(prev => ({ ...prev, [car.id]: !prev[car.id] }));
                        setAnimatingStates(prev => ({ ...prev, [car.id]: true }));
                        setTimeout(() => {
                          setAnimatingStates(prev => ({ ...prev, [car.id]: false }));
                        }, 300);
                      }}
                      animate={animatingStates[car.id] ? {
                        scale: [1, 1.3, 1],
                      } : {}}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg
                        className={`w-5 h-5 md:w-6 md:h-6 ${favoriteStates[car.id] ? 'text-red-500' : 'text-white'}`}
                        fill={favoriteStates[car.id] ? 'currentColor' : 'none'}
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
                  <div className="p-2 md:p-3 lg:p-4">
                    <h3 className="text-xs md:text-sm lg:text-base font-bold text-black mb-1 md:mb-1.5">
                      {car.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-1 md:mb-1.5">
                      <span className="text-xs md:text-sm font-semibold text-black">
                        {car.rating}
                      </span>
                      <svg
                        className="w-3.5 h-3.5 md:w-4 md:h-4"
                        fill="#FF6B35"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1 mb-1.5 md:mb-2">
                      <svg
                        className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-[10px] md:text-xs text-gray-500">
                        {car.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5 md:mt-2">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                          />
                        </svg>
                        <span className="text-[10px] md:text-xs text-gray-500">
                          {car.seats}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] md:text-xs text-gray-500">
                          {car.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* NEARBY CARS SECTION (horizontal cards) */}
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black">Nearby Cars</h2>
              <motion.button
                type="button"
                className="text-sm text-gray-600 font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/search")}
              >
                View All
              </motion.button>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-0">
              {nearbyCars.map((car, index) => (
                <motion.div 
                  key={car.id} 
                  className="min-w-[280px] flex-shrink-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
                >
                  <motion.div
                    className="w-full rounded-xl overflow-hidden cursor-pointer"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                    onClick={() => navigate(`/car-details/${car.id}`)}
                  >
                    <div
                      className="relative w-full h-28 flex items-center justify-center rounded-t-xl overflow-hidden"
                      style={{ backgroundColor: "#f0f0f0" }}
                    >
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-contain scale-125"
                      />
                      <motion.button 
                        className="absolute -top-1 left-1.5 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFavoriteStates(prev => ({ ...prev, [car.id]: !prev[car.id] }));
                          setAnimatingStates(prev => ({ ...prev, [car.id]: true }));
                          setTimeout(() => {
                            setAnimatingStates(prev => ({ ...prev, [car.id]: false }));
                          }, 300);
                        }}
                        animate={animatingStates[car.id] ? {
                          scale: [1, 1.3, 1],
                        } : {}}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg
                          className={`w-5 h-5 ${favoriteStates[car.id] ? 'text-red-500' : 'text-white'}`}
                          fill={favoriteStates[car.id] ? 'currentColor' : 'none'}
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
                    <div className="p-2 md:p-3">
                      <h3 className="text-xs md:text-sm font-bold text-black mb-1">
                        {car.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs md:text-sm font-semibold text-black">
                          {car.rating}
                        </span>
                        <svg
                          className="w-3.5 h-3.5"
                          fill="#FF6B35"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <svg
                          className="w-3 h-3 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-[10px] md:text-xs text-gray-500">
                          {car.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                            />
                          </svg>
                          <span className="text-[10px] md:text-xs text-gray-500">
                            {car.seats}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] md:text-xs text-gray-500">
                            {car.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* BOTTOM NAVIGATION (reuse existing) */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavbar />
      </div>

      {/* Calendar modal styled like provided popup */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl max-h-[85vh] overflow-y-auto shadow-2xl bg-white opacity-100">
            <div className="p-4">
              {/* Time summary + open clock popup */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-black">
                  Time
                </label>
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="w-auto px-4 py-2.5 rounded-xl border-2 flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      borderColor: "#21292b",
                      backgroundColor: "#21292b",
                      color: "#ffffff",
                    }}
                    onClick={() => setIsTimeOpen(true)}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-semibold text-sm">
                      {formatTimeDisplay()}
                    </span>
                  </button>
                </div>
              </div>

              {/* Calendar header */}
              <div className="mb-4">
                <div className="mb-3 flex items-center justify-between">
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                    type="button"
                  >
                    <svg
                      className="w-4 h-4"
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
                  </button>
                  <h4 className="text-base font-semibold text-black">
                    December {new Date().getFullYear()}
                  </h4>
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                    type="button"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Week days */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div
                        key={d}
                        className="text-center text-xs font-semibold py-1 text-gray-600"
                      >
                        {d}
                      </div>
                    )
                  )}

                  {/* Simple static days grid to match design */}
                  <div></div>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                    (day) => (
                      <button
                        key={day}
                        type="button"
                        disabled
                        className="p-1.5 rounded-lg text-xs font-semibold transition-all cursor-not-allowed"
                        style={{
                          backgroundColor: "transparent",
                          color: "#d1d5db",
                        }}
                      >
                        {day}
                      </button>
                    )
                  )}
                  {[
                    15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                    31,
                  ].map((day) => (
                    <button
                      key={day}
                      type="button"
                      className="p-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-gray-100"
                      style={{
                        backgroundColor: "transparent",
                        color: "#000000",
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm"
                  type="button"
                  style={{
                    borderColor: "#21292b",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                  }}
                  onClick={() => setIsCalendarOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm"
                  type="button"
                  style={{ backgroundColor: "#21292b" }}
                  onClick={() => setIsCalendarOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters popup - Using shared FilterDropdown component */}
      <FilterDropdown
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        brands={filterOptions.brands}
        fuelTypes={filterOptions.fuelTypes}
        transmissions={filterOptions.transmissions}
        colorsList={filterOptions.colors}
        carTypes={filterOptions.carTypes}
        featuresList={filterOptions.features}
        seatOptions={filterOptions.seats}
        ratingOptions={filterOptions.ratings}
        locations={filterOptions.locations}
      />

      {/* Time picker popup shown above calendar */}
      {isTimeOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl shadow-2xl bg-white">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 text-center text-black">
                Select Time
              </h3>
              <div className="flex items-center justify-center gap-4 mb-6">
                {/* Hour column */}
                <div className="flex flex-col items-center">
                  <label className="text-xs font-semibold mb-2 text-gray-600">
                    Hour
                  </label>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: 12 }, (_, i) =>
                      String(i + 1).padStart(2, "0")
                    ).map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedHour === hour ? "text-white" : "text-black"
                        }`}
                        style={
                          selectedHour === hour
                            ? { backgroundColor: "#21292b", color: "#ffffff" }
                            : { backgroundColor: "transparent" }
                        }
                        onClick={() => setSelectedHour(hour)}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-2xl font-bold mt-8 text-black">:</span>

                {/* Minute column */}
                <div className="flex flex-col items-center">
                  <label className="text-xs font-semibold mb-2 text-gray-600">
                    Minute
                  </label>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: 60 }, (_, i) =>
                      String(i).padStart(2, "0")
                    ).map((minute) => (
                      <button
                        key={minute}
                        type="button"
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          selectedMinute === minute
                            ? "text-white"
                            : "text-black"
                        }`}
                        style={
                          selectedMinute === minute
                            ? { backgroundColor: "#21292b", color: "#ffffff" }
                            : { backgroundColor: "transparent" }
                        }
                        onClick={() => setSelectedMinute(minute)}
                      >
                        {minute}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Period column */}
                <div className="flex flex-col items-center">
                  <label className="text-xs font-semibold mb-2 text-gray-600">
                    Period
                  </label>
                  <div className="flex flex-col gap-2">
                    {["AM", "PM"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedPeriod === p ? "text-white" : "text-black"
                        }`}
                        style={
                          selectedPeriod === p
                            ? { backgroundColor: "#21292b", color: "#ffffff" }
                            : { backgroundColor: "transparent" }
                        }
                        onClick={() => setSelectedPeriod(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div
                className="mb-4 p-3 rounded-lg text-center"
                style={{ backgroundColor: "#f8f8f8" }}
              >
                <span className="text-lg font-bold text-black">
                  {formatTimeDisplay()}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm"
                  type="button"
                  style={{
                    borderColor: "#21292b",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                  }}
                  onClick={() => setIsTimeOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm"
                  type="button"
                  style={{ backgroundColor: "#21292b" }}
                  onClick={() => setIsTimeOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleTestPage;
