import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchHeader from '../components/layout/SearchHeader';
import BottomNavbar from '../components/layout/BottomNavbar';
import BrandFilter from '../components/common/BrandFilter';
import SearchCarCard from '../components/common/SearchCarCard';
import FilterDropdown from '../components/common/FilterDropdown';
import ReturningCarBanner from '../components/common/ReturningCarBanner';
import { colors } from '../theme/colors';
import { useAppSelector } from '../../hooks/redux';
import { carService } from '../../services/car.service';
import { useLocation } from '../../hooks/useLocation';

// Import car images
import carImg1 from '../../assets/car_img1-removebg-preview.png';
import carImg4 from '../../assets/car_img4-removebg-preview.png';
import carImg5 from '../../assets/car_img5-removebg-preview.png';
import carImg6 from '../../assets/car_img6-removebg-preview.png';
import carImg8 from '../../assets/car_img8.png';

// Import brand logos
import logo1 from '../../assets/car_logo1_PNG1.png';
import logo2 from '../../assets/car_logo2_PNG.png';
import logo3 from '../../assets/car_logo3_PNG.png';
import logo4 from '../../assets/car_logo4_PNG.png';
import logo5 from '../../assets/car_logo5_PNG.png';
import logo6 from '../../assets/car_logo6_PNG.png';
import logo7 from '../../assets/car_logo7_PNG.png';
import logo8 from '../../assets/car_logo8_PNG.png';
import logo9 from '../../assets/car_logo9_PNG.png';
import logo10 from '../../assets/car_logo10_PNG.png';
import logo11 from '../../assets/car_logo11_PNG.png';
import logo13 from '../../assets/car_logo13_PNG.png';
import logo14 from '../../assets/car_logo14_PNG.png';
import logo15 from '../../assets/car_logo15.png';
import logo16 from '../../assets/car_logo16.png';

/**
 * SearchPage Component - Exact match to design
 * Search page with filters, brand selection, and car listings
 */
const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Get authentication state
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);

  // Get user's current live location
  const { currentLocation } = useLocation(true, isAuthenticated, user?._id || user?.id);

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
    Mazda: logo6,
    Subaru: logo7,
    // Korean brands
    Hyundai: logo6,
    Kia: logo1,
    // Indian brands
    Maruti: logo2,
    'Maruti Suzuki': logo2,
    Tata: logo3,
    Mahindra: logo9,
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
    'XUV500': logo9,
    'XUV': logo9,
    'Alto 800': logo2,
    'Alto': logo2,
  };

  // Fallback brand logos array for unknown brands
  const fallbackBrandLogos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9, logo10, logo11, logo13, logo14, logo15, logo16];

  // Dynamic data state
  const [brands, setBrands] = useState([]);
  const [allRecommendCars, setAllRecommendCars] = useState([]);
  const [allPopularCars, setAllPopularCars] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  // Don't show loader initially - data will load in background
  const [isLoading, setIsLoading] = useState(false);

  // Filter states from FilterDropdown
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

  // Track if filters should auto-open (e.g., when coming from home pills)
  const [shouldOpenFilters, setShouldOpenFilters] = useState(false);

  // Sync brand selection between pills and filter dropdown
  useEffect(() => {
    setAppliedFilters(prev => ({
      ...prev,
      brand: selectedBrand === 'all' ? '' : selectedBrand
    }));
  }, [selectedBrand]);

  // Sync state when query params change (e.g., from home pills)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchQuery(q);

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const availabilityStart = searchParams.get('availabilityStart');
    const availabilityEnd = searchParams.get('availabilityEnd');
    const brandParam = searchParams.get('brand');
    const modelParam = searchParams.get('model');

    if (minPrice || maxPrice || availabilityStart || availabilityEnd || brandParam || modelParam) {
      setAppliedFilters((prev) => ({
        ...prev,
        priceRange: {
          min: minPrice || prev.priceRange.min,
          max: maxPrice || prev.priceRange.max,
        },
        availableFrom: availabilityStart || prev.availableFrom,
        availableTo: availabilityEnd || prev.availableTo,
        brand: brandParam || prev.brand,
        model: modelParam || prev.model,
      }));

      if (brandParam) {
        setSelectedBrand(brandParam);
      }
      
      // Auto-open filters if we have specific filter params (not just search query)
      if (minPrice || maxPrice || brandParam || modelParam) {
        setShouldOpenFilters(true);
      }
    }

    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setShouldOpenFilters(true);
    }
  }, [searchParams]);

  // Open filters when requested by URL params
  useEffect(() => {
    if (shouldOpenFilters) {
      setIsFilterOpen(true);
      setShouldOpenFilters(false);
    }
  }, [shouldOpenFilters]);

  // Filter options extracted from cars data
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    fuelTypes: [],
    transmissions: [],
    colors: [],
    carTypes: [],
    features: [],
    seats: [],
    locations: [],
    ratings: [],
  });

  // Fallback images for cars when API images missing
  const fallbackCarImages = [carImg1, carImg6, carImg8, carImg4, carImg5];

  // Helper: case-insensitive partial match for multi-word queries
  const matchesQuery = (car, query) => {
    const trimmed = (query || '').trim().toLowerCase();
    if (!trimmed) return true;
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    const haystack = `${car.name || ''} ${car.brand || ''} ${car.model || ''}`.toLowerCase();
    return tokens.every((token) => haystack.includes(token));
  };

  const norm = (val) => (val || '').toString().toLowerCase().trim();

  // Transform API car data to SearchCarCard format
  const transformCarData = (car, index = 0) => {
    let carImage = fallbackCarImages[index % fallbackCarImages.length];
    let carImages = [];

    if (car.images && car.images.length > 0) {
      // Extract all image URLs (same as admin side)
      carImages = car.images
        .map(img => {
          if (typeof img === 'string') return img;
          return img?.url || img?.path || null;
        })
        .filter(Boolean);

      // Remove duplicates
      carImages = [...new Set(carImages)];

      // Find primary image first, otherwise use first image
      const primaryImage = car.images.find((img) => img.isPrimary);
      carImage = primaryImage ? (primaryImage.url || primaryImage.path || primaryImage) : (carImages[0] || carImage);
    } else {
      carImages = [carImage];
    }

    // Normalize fuel type
    const normalizedFuelType = car.fuelType
      ? car.fuelType.toLowerCase() === 'petrol'
        ? 'Petrol'
        : car.fuelType.toLowerCase() === 'diesel'
          ? 'Diesel'
          : car.fuelType.toLowerCase() === 'electric'
            ? 'Electric'
            : car.fuelType.toLowerCase() === 'hybrid'
              ? 'Hybrid'
              : car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1).toLowerCase()
      : '';

    // Normalize transmission
    const normalizedTransmission = car.transmission
      ? car.transmission.toLowerCase() === 'automatic'
        ? 'Automatic'
        : car.transmission.toLowerCase() === 'manual'
          ? 'Manual'
          : car.transmission.toLowerCase() === 'cvt'
            ? 'CVT'
            : car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1).toLowerCase()
      : '';

    return {
      id: car._id || car.id,
      name: `${car.brand} ${car.model}`,
      brand: car.brand,
      model: car.model,
      image: carImage,
      images: carImages, // All images array (same as admin side)
      rating: car.averageRating ? car.averageRating.toFixed(1) : '5.0',
      location: car.location?.city || car.location?.address || 'Location',
      price: `Rs. ${car.pricePerDay || 0}`,
      pricePerDay: car.pricePerDay || 0,
      // Preserve filter-related properties
      fuelType: normalizedFuelType,
      transmission: normalizedTransmission,
      color: car.color || '',
      carType: car.carType || car.bodyType || '',
      features: car.features || [],
      seats: car.seatingCapacity || car.seats || 4,
      seatingCapacity: car.seatingCapacity || car.seats || 4,
      bookings: car.bookings || car.bookingsMap || [], // Preserve bookings for availability filter
    };
  };

  // Fetch cars and brands from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Prepare query params with availability dates
        const queryParams = {
          limit: 12,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          status: 'active',
          isAvailable: true,
        };

        const availabilityStart = searchParams.get('availabilityStart');
        const availabilityEnd = searchParams.get('availabilityEnd');
        
        if (availabilityStart) queryParams.startDate = availabilityStart;
        if (availabilityEnd) queryParams.endDate = availabilityEnd;

        // Fetch latest active cars
        const carsResponse = await carService.getCars(queryParams);

        let cars = [];
        if (carsResponse.success && carsResponse.data?.cars) {
          cars = carsResponse.data.cars;
        }

        const transformedCars = cars.map((car, index) => transformCarData(car, index));

        // First 6 as "Recommend For You", next 4 as "Our Popular Cars"
        setAllRecommendCars(transformedCars.slice(0, 6));
        setAllPopularCars(transformedCars.slice(6, 10));

        // Build dynamic brands list from available cars
        const uniqueBrandNames = Array.from(
          new Set(transformedCars.map((car) => car.brand).filter(Boolean))
        );

        const dynamicBrands = uniqueBrandNames.slice(0, 6).map((brandName, idx) => {
          // Normalize brand name for matching
          const normalizedName = brandName.trim();
          let brandLogo = null;

          // First, check if API returned a logo for this brand
          const brandFromAPI = carsResponse.data.cars.find(car => car.brand === brandName);
          if (brandFromAPI?.brandLogo || brandFromAPI?.logo) {
            const apiLogo = brandFromAPI.brandLogo || brandFromAPI.logo;
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
                brandLogo = fallbackBrandLogos[idx % fallbackBrandLogos.length];
              }
            }
          }

          return {
            id: brandName,
            name: brandName,
            logo: brandLogo,
          };
        });

        setBrands(dynamicBrands);

        // Extract unique filter options from cars data
        const uniqueBrands = Array.from(
          new Set(cars.map((car) => car.brand).filter(Boolean))
        ).sort();

        const uniqueFuelTypes = Array.from(
          new Set(
            cars
              .map((car) => {
                const fuel = car.fuelType || '';
                // Normalize fuel type
                if (fuel.toLowerCase() === 'petrol') return 'Petrol';
                if (fuel.toLowerCase() === 'diesel') return 'Diesel';
                if (fuel.toLowerCase() === 'electric') return 'Electric';
                if (fuel.toLowerCase() === 'hybrid') return 'Hybrid';
                return fuel.charAt(0).toUpperCase() + fuel.slice(1).toLowerCase();
              })
              .filter(Boolean)
          )
        ).sort();

        const uniqueTransmissions = Array.from(
          new Set(
            cars
              .map((car) => {
                const trans = car.transmission || '';
                // Normalize transmission
                if (trans.toLowerCase() === 'automatic') return 'Automatic';
                if (trans.toLowerCase() === 'manual') return 'Manual';
                if (trans.toLowerCase() === 'cvt') return 'CVT';
                return trans.charAt(0).toUpperCase() + trans.slice(1).toLowerCase();
              })
              .filter(Boolean)
          )
        ).sort();

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

        // Extract all unique features from all cars
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

          // Add rating options: 4.0+, 4.5+, 5.0 if there are cars with those ratings
          if (maxRating >= 4.0) ratingOptions.push('4.0+');
          if (maxRating >= 4.5) ratingOptions.push('4.5+');
          if (maxRating >= 5.0) ratingOptions.push('5.0');

          // If no high ratings, add options based on available ratings
          if (ratingOptions.length === 0) {
            if (maxRating >= 3.0) ratingOptions.push('3.0+');
            if (maxRating >= 3.5) ratingOptions.push('3.5+');
            if (maxRating >= 4.0) ratingOptions.push('4.0+');
          }
        } else {
          // Default options if no ratings available
          ratingOptions.push('4.0+', '4.5+', '5.0');
        }

        // Update filter options
        setFilterOptions({
          brands: uniqueBrands,
          fuelTypes: uniqueFuelTypes,
          transmissions: uniqueTransmissions,
          colors: uniqueColors,
          carTypes: uniqueCarTypes,
          features: uniqueFeatures,
          seats: uniqueSeats,
          locations: uniqueLocations,
          ratings: ratingOptions,
        });
      } catch (error) {
        console.error('Error loading search data:', error);
        // Keep empty lists on error - UI will simply show no cars
      } finally {
        setIsLoading(false);
        setDataLoaded(true);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('availabilityStart'), searchParams.get('availabilityEnd')]);

  // Handle search
  const handleSearch = (query) => {
    const trimmedQuery = query?.trim() || '';
    setSearchQuery(trimmedQuery);
    // Update URL with search query
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`, { replace: true });
    } else {
      navigate('/search', { replace: true });
    }
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredRecommendCars = useMemo(() => {
    let filtered = allRecommendCars;

    // Filter by brand (combined from pills and dropdown)
    const activeBrand = appliedFilters.brand || (selectedBrand !== 'all' ? selectedBrand : '');
    if (activeBrand) {
      const target = norm(activeBrand);
      filtered = filtered.filter((car) => {
        const b = norm(car.brand);
        const m = norm(car.model);
        const n = norm(car.name);
        return b === target || m.includes(target) || n.includes(target);
      });
    }

    // Filter by model from FilterDropdown
    if (appliedFilters.model) {
      const modelQuery = norm(appliedFilters.model);
      filtered = filtered.filter((car) =>
        norm(car.model).includes(modelQuery) ||
        norm(car.name).includes(modelQuery)
      );
    }

    // Filter by fuel type
    if (appliedFilters.fuelType) {
      filtered = filtered.filter((car) => {
        const carFuelType = car.fuelType || '';
        return carFuelType === appliedFilters.fuelType;
      });
    }

    // Filter by transmission
    if (appliedFilters.transmission) {
      filtered = filtered.filter((car) => {
        const carTransmission = car.transmission || '';
        return carTransmission === appliedFilters.transmission;
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
        const carSeats = String(car.seats || car.seatingCapacity || '');
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
      const minRating = parseFloat(appliedFilters.rating.replace('+', '')) || 0;
      filtered = filtered.filter((car) => {
        const carRating = parseFloat(car.rating) || 0;
        return carRating >= minRating;
      });
    }

    // Filter by location
    if (appliedFilters.location) {
      const locationQuery = norm(appliedFilters.location);
      filtered = filtered.filter((car) => {
        const carLoc = norm(car.location);
        return carLoc.includes(locationQuery);
      });
    }



    // Filter by search query (case-insensitive, supports partial words)
    if (searchQuery.trim()) {
      filtered = filtered.filter((car) => matchesQuery(car, searchQuery));
    }

    return filtered;
  }, [selectedBrand, allRecommendCars, searchQuery, appliedFilters]);

  const filteredPopularCars = useMemo(() => {
    let filtered = allPopularCars;

    // Filter by brand (combined from pills and dropdown)
    const activeBrand = appliedFilters.brand || (selectedBrand !== 'all' ? selectedBrand : '');
    if (activeBrand) {
      const target = norm(activeBrand);
      filtered = filtered.filter((car) => {
        const b = norm(car.brand);
        const m = norm(car.model);
        const n = norm(car.name);
        return b === target || m.includes(target) || n.includes(target);
      });
    }

    // Filter by model from FilterDropdown
    if (appliedFilters.model) {
      const modelQuery = norm(appliedFilters.model);
      filtered = filtered.filter((car) =>
        norm(car.model).includes(modelQuery) ||
        norm(car.name).includes(modelQuery)
      );
    }

    // Filter by fuel type
    if (appliedFilters.fuelType) {
      filtered = filtered.filter((car) => {
        const carFuelType = car.fuelType || '';
        return carFuelType === appliedFilters.fuelType;
      });
    }

    // Filter by transmission
    if (appliedFilters.transmission) {
      filtered = filtered.filter((car) => {
        const carTransmission = car.transmission || '';
        return carTransmission === appliedFilters.transmission;
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
        const carSeats = String(car.seats || car.seatingCapacity || '');
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
      const minRating = parseFloat(appliedFilters.rating.replace('+', '')) || 0;
      filtered = filtered.filter((car) => {
        const carRating = parseFloat(car.rating) || 0;
        return carRating >= minRating;
      });
    }

    // Filter by location
    if (appliedFilters.location) {
      const locationQuery = norm(appliedFilters.location);
      filtered = filtered.filter((car) => {
        const carLoc = norm(car.location);
        return carLoc.includes(locationQuery);
      });
    }



    // Filter by search query (case-insensitive, supports partial words)
    if (searchQuery.trim()) {
      filtered = filtered.filter((car) => matchesQuery(car, searchQuery));
    }

    return filtered;
  }, [selectedBrand, allPopularCars, searchQuery, appliedFilters]);

  // Combine all filtered cars to check if any exist
  const allFilteredCars = useMemo(() => {
    return [...filteredRecommendCars, ...filteredPopularCars];
  }, [filteredRecommendCars, filteredPopularCars]);

  return (
    <>
      {/* Mobile View - DO NOT MODIFY */}
      <div
        className="min-h-screen w-full flex flex-col md:hidden max-md:h-screen max-md:overflow-hidden"
        style={{ backgroundColor: colors.backgroundTertiary }}
      >
        {/* TOP COMPACT HEADER - matches module-test page */}
        <div
          className="px-4 pt-6 pb-4 space-y-2 max-md:sticky max-md:top-0 max-md:z-20 max-md:flex-shrink-0"
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
                <span className="truncate max-w-[140px]">{currentLocation || 'Getting location...'}</span>
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

          {/* Search Bar Section - In Header */}
          <motion.div
            className="flex items-center gap-2 mt-3 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div
              className="rounded-lg px-3 py-0 flex items-center gap-2 flex-1 min-w-0"
              style={{
                backgroundColor: colors.backgroundPrimary,
                border: `1px solid ${colors.borderMedium}`
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearch(searchQuery);
                }}
                className="flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity p-1 -ml-1"
                aria-label="Search"
                style={{ zIndex: 10 }}
              >
                <svg
                  className="w-5 h-5 text-gray-400 hover:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Search your dream car....."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(searchQuery);
                  }
                }}
                className="flex-1 text-sm text-gray-500 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            <button
              aria-label="Open filters"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: colors.backgroundPrimary,
                border: `1px solid ${colors.borderMedium}`
              }}
            >
              <svg
                className="w-5 h-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="7" x2="21" y2="7" strokeLinecap="round" />
                <circle cx="6" cy="7" r="2" fill="currentColor" />
                <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <line x1="3" y1="17" x2="21" y2="17" strokeLinecap="round" />
                <circle cx="18" cy="17" r="2" fill="currentColor" />
              </svg>
            </button>
          </motion.div>
        </div>

        {/* CONTENT */}
        <main
          className="flex-1 pb-0 max-md:flex max-md:flex-col max-md:overflow-hidden"
          style={{ backgroundColor: colors.backgroundTertiary }}
        >
          {/* Floating white card container */}
          <motion.div
            className="mt-3 rounded-t-3xl bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.5)] px-4 pt-4 pb-52 space-y-4 max-md:flex-1 max-md:overflow-y-auto max-md:mt-0"
            style={{ minHeight: '100vh' }} // ensure full height on mobile even with little content
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Brand Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <BrandFilter
                brands={brands}
                selectedBrand={selectedBrand}
                onSelectBrand={setSelectedBrand}
              />
            </motion.div>

            {/* Returning Car Banner */}
            <ReturningCarBanner />

            {/* Main Content */}
            <div className="mt-4">
              {/* Show "No cars found" message if no cars match the filter - only after loading is complete */}
              {!isLoading && dataLoaded && allFilteredCars.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 md:py-20">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-lg md:text-2xl font-bold text-gray-700 mb-2">
                      No Cars Found
                    </h3>
                    <p className="text-sm md:text-base text-gray-500">
                      Sorry, we couldn't find any cars matching your selected filter.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Recommend For You Section */}
                  {filteredRecommendCars.length > 0 && (
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-black">
                          Recommend For You
                        </h2>
                      </div>

                      {/* Car Cards Grid - 2 columns */}
                      <div className="grid grid-cols-2 gap-3">
                        {filteredRecommendCars.map((car, index) => (
                          <motion.div
                            key={car.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                          >
                            <SearchCarCard car={car} index={index} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Our Popular Cars Section */}
                  {filteredPopularCars.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      <div className="flex items-center justify-between mb-3 md:mb-4 lg:mb-6">
                        <h2 className="text-base md:text-2xl lg:text-3xl font-bold text-black">
                          Our Popular Cars
                        </h2>
                      </div>

                      {/* Popular Cars - Horizontal scrollable on mobile, grid on desktop (wider cards) */}
                      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6 overflow-x-auto md:overflow-x-visible scrollbar-hide -mx-0">
                        {filteredPopularCars.map((car, index) => (
                          <motion.div
                            key={car.id}
                            className="min-w-[280px] md:min-w-0 flex-shrink-0"
                            style={{ pointerEvents: 'auto' }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                          >
                            <SearchCarCard car={car} horizontal={true} index={index} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </main>

        {/* Filter Dropdown */}
        <FilterDropdown
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={(filters) => {
            console.log('Applied filters:', filters);
            setAppliedFilters(filters);
            // Keep pills in sync with brand filter
            setSelectedBrand(filters.brand ? filters.brand : 'all');
            setIsFilterOpen(false);
            // Scroll to top to reveal filtered results
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
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

        {/* Bottom Navbar */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <BottomNavbar />
        </div>
      </div>

      {/* Web View - Only visible on desktop */}
      <div
        className="hidden md:block min-h-screen w-full"
        style={{ backgroundColor: colors.backgroundPrimary }}
      >
        {/* Web Header - match Home page */}
        <header
          className="w-full sticky top-0 z-50"
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
                    <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-gray-800">
                      {user?.profilePhoto && user.profilePhoto.trim() !== '' ? (
                        <img
                          src={user.profilePhoto}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm md:text-base font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
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

        {/* Web Content */}
        <div className="px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 md:py-8 lg:py-10">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar Section - Web */}
            <div className="mb-6 md:mb-8 lg:mb-10">
              <div className="flex items-center gap-4 max-w-3xl mx-auto">
                <div
                  className="rounded-xl px-4 py-2 flex items-center gap-3 flex-1"
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                    border: `1px solid ${colors.borderMedium}`
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSearch(searchQuery);
                    }}
                    className="flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity p-1 -ml-1"
                    aria-label="Search"
                    style={{ zIndex: 10 }}
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Search your dream car....."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch(searchQuery);
                      }
                    }}
                    className="flex-1 text-base text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                  />
                </div>
                <button
                  aria-label="Open filters"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="px-6 py-2 rounded-xl text-base font-medium text-white hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: colors.backgroundTertiary
                  }}
                >
                  Filters
                </button>
              </div>
            </div>

            {/* Brand Filters - Web */}
            <div className="mb-8 md:mb-10 lg:mb-12">
              <BrandFilter
                brands={brands}
                selectedBrand={selectedBrand}
                onSelectBrand={setSelectedBrand}
              />
            </div>

            {/* Returning Car Banner - Web */}
            <div className="mb-8 md:mb-10 lg:mb-12">
              <ReturningCarBanner />
            </div>

            {/* Main Content - Web */}
            {!isLoading && dataLoaded && allFilteredCars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-center">
                  <svg
                    className="w-24 h-24 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    No Cars Found
                  </h3>
                  <p className="text-base text-gray-500">
                    Sorry, we couldn't find any cars matching your selected filter.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Recommend For You Section - Web */}
                {filteredRecommendCars.length > 0 && (
                  <div className="mb-12 lg:mb-16">
                    <div className="flex items-center justify-between mb-6 lg:mb-8">
                      <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black">
                        Recommend For You
                      </h2>
                    </div>

                    {/* Car Cards Grid - Web */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                      {filteredRecommendCars.map((car, index) => (
                        <SearchCarCard key={car.id} car={car} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Our Popular Cars Section - Web */}
                {filteredPopularCars.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6 lg:mb-8">
                      <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black">
                        Our Popular Cars
                      </h2>
                    </div>

                    {/* Popular Cars - Grid on web */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                      {filteredPopularCars.map((car, index) => (
                        <SearchCarCard key={car.id} car={car} index={index} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Shared Filter Modal for both Mobile and Web */}
        <FilterDropdown
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          initialFilters={appliedFilters} // Sync state when re-opening
          onApplyFilters={(filters) => {
            console.log('Applied filters:', filters);
            setAppliedFilters(filters);
            // Keep pills in sync with brand filter
            setSelectedBrand(filters.brand ? filters.brand : 'all');
            setIsFilterOpen(false);
            // Scroll to top to reveal filtered results
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
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
      </div>
    </>
  );
};

export default SearchPage;



