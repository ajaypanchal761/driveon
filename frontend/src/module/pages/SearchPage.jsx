import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchHeader from '../components/layout/SearchHeader';
import BottomNavbar from '../components/layout/BottomNavbar';
import BrandFilter from '../components/common/BrandFilter';
import SearchCarCard from '../components/common/SearchCarCard';
import FilterDropdown from '../components/common/FilterDropdown';
import { colors } from '../theme/colors';
import { useAppSelector } from '../../hooks/redux';
import { carService } from '../../services/car.service';

// Import car images
import carImg1 from '../../assets/car_img1-removebg-preview.png';
import carImg4 from '../../assets/car_img4-removebg-preview.png';
import carImg5 from '../../assets/car_img5-removebg-preview.png';
import carImg6 from '../../assets/car_img6-removebg-preview.png';
import carImg8 from '../../assets/car_img8.png';

// Import brand logos
import logo4 from '../../assets/car_logo4_PNG.png';
import logo5 from '../../assets/car_logo5_PNG.png';
import logo10 from '../../assets/car_logo10_PNG.png';
import logo11 from '../../assets/car_logo11_PNG.png';

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

  // Brand logos map for dynamic brands
  const brandLogos = {
    Ferrari: logo10,
    Tesla: logo4,
    BMW: logo11,
    Lamborghini: logo5,
  };

  // Dynamic data state
  const [brands, setBrands] = useState([]);
  const [allRecommendCars, setAllRecommendCars] = useState([]);
  const [allPopularCars, setAllPopularCars] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fallback images for cars when API images missing
  const fallbackCarImages = [carImg1, carImg6, carImg8, carImg4, carImg5];

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
    };
  };

  // Fetch cars and brands from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest active cars
        const carsResponse = await carService.getCars({
          limit: 12,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          status: 'active',
          isAvailable: true,
        });

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

        const dynamicBrands = uniqueBrandNames.slice(0, 6).map((brandName, idx) => ({
          id: brandName,
          name: brandName,
          logo: brandLogos[brandName] || fallbackCarImages[idx % fallbackCarImages.length],
        }));

        setBrands(dynamicBrands);
      } catch (error) {
        console.error('Error loading search data:', error);
        // Keep empty lists on error - UI will simply show no cars
      } finally {
        setDataLoaded(true);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter cars based on selected brand and search query
  const filteredRecommendCars = useMemo(() => {
    let filtered = allRecommendCars;
    
    // Filter by brand
    if (selectedBrand !== 'all') {
      filtered = filtered.filter((car) => car.brand === selectedBrand);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((car) => 
        car.name?.toLowerCase().includes(query) ||
        car.brand?.toLowerCase().includes(query) ||
        car.model?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [selectedBrand, allRecommendCars, searchQuery]);

  const filteredPopularCars = useMemo(() => {
    let filtered = allPopularCars;
    
    // Filter by brand
    if (selectedBrand !== 'all') {
      filtered = filtered.filter((car) => car.brand === selectedBrand);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((car) => 
        car.name?.toLowerCase().includes(query) ||
        car.brand?.toLowerCase().includes(query) ||
        car.model?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [selectedBrand, allPopularCars, searchQuery]);

  // Combine all filtered cars to check if any exist
  const allFilteredCars = useMemo(() => {
    return [...filteredRecommendCars, ...filteredPopularCars];
  }, [filteredRecommendCars, filteredPopularCars]);

  return (
    <>
      {/* Mobile View - DO NOT MODIFY */}
      <div 
        className="min-h-screen w-full flex flex-col md:hidden"
        style={{ backgroundColor: colors.backgroundTertiary }}
      >
      {/* TOP COMPACT HEADER - matches module-test page */}
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
              <span className="truncate">Los Angeles, California, U.S.</span>
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
          className="flex items-center gap-2 mt-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div 
            className="rounded-lg px-3 py-2.5 flex items-center gap-2 flex-1"
            style={{ 
              backgroundColor: colors.backgroundPrimary,
              border: `1px solid ${colors.borderMedium}`
            }}
          >
            <svg 
              className="w-5 h-5 text-gray-400" 
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
            <input
              type="text"
              placeholder="Search your dream car....."
              className="flex-1 text-sm text-gray-500 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
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
              <line x1="3" y1="7" x2="21" y2="7" strokeLinecap="round"/>
              <circle cx="6" cy="7" r="2" fill="currentColor"/>
              <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
              <line x1="3" y1="17" x2="21" y2="17" strokeLinecap="round"/>
              <circle cx="18" cy="17" r="2" fill="currentColor"/>
            </svg>
          </button>
        </motion.div>
      </div>

      {/* CONTENT */}
      <main
        className="flex-1 pb-0"
        style={{ backgroundColor: colors.backgroundTertiary }}
      >
        {/* Floating white card container */}
        <motion.div 
          className="mt-3 rounded-t-3xl bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.5)] px-4 pt-4 pb-28 space-y-4"
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

          {/* Main Content */}
          <div className="mt-4">
          {/* Show "No cars found" message if no cars match the filter */}
          {dataLoaded && allFilteredCars.length === 0 ? (
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
          setIsFilterOpen(false);
        }}
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
        {/* Web Header */}
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
              <nav className="hidden lg:flex items-center gap-6">
                <Link
                  to="/"
                  className="text-sm lg:text-base xl:text-lg font-medium text-white hover:opacity-80 transition-opacity"
                >
                  Home
                </Link>
                <Link
                  to="/search"
                  className="text-sm lg:text-base xl:text-lg font-medium text-white hover:opacity-80 transition-opacity"
                >
                  Search
                </Link>
              </nav>

              {/* Right - User Actions */}
              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-sm md:text-base font-semibold"
                    style={{ color: colors.backgroundTertiary }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-sm md:text-base font-medium text-white hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: colors.backgroundTertiary }}
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
                  className="rounded-xl px-4 py-3 flex items-center gap-3 flex-1"
                  style={{ 
                    backgroundColor: colors.backgroundSecondary,
                    border: `1px solid ${colors.borderMedium}`
                  }}
                >
                  <svg 
                    className="w-5 h-5 text-gray-400" 
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
                  <input
                    type="text"
                    placeholder="Search your dream car....."
                    className="flex-1 text-base text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                  />
                </div>
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="px-6 py-3 rounded-xl text-base font-medium text-white hover:opacity-90 transition-opacity"
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

            {/* Main Content - Web */}
            {allFilteredCars.length === 0 ? (
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

        {/* Filter Dropdown for Web */}
        <FilterDropdown
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={(filters) => {
            console.log('Applied filters:', filters);
            setIsFilterOpen(false);
          }}
        />
      </div>
    </>
  );
};

export default SearchPage;

