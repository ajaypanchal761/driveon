import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNavbar from '../components/layout/BottomNavbar';
import BrandFilter from '../components/common/BrandFilter';
import SearchCarCard from '../components/common/SearchCarCard';
import FilterDropdown from '../components/common/FilterDropdown';
import { colors } from '../theme/colors';
import { useAppSelector } from '../../hooks/redux';

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
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get authentication state
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);

  // Brand data
  const brands = [
    { id: 1, logo: logo10, name: 'Ferrari' },
    { id: 2, logo: logo4, name: 'Tesla' },
    { id: 3, logo: logo11, name: 'BMW' },
    { id: 4, logo: logo5, name: 'Lamborghini' },
  ];

  // Recommend For You cars with brandId - Matching CarDetailsPage
  const allRecommendCars = [
    {
      id: 2, // Tesla Model S
      name: 'Tesla Model S',
      brand: 'Tesla',
      model: 'Model S',
      image: carImg6, // Matching CarDetailsPage
      rating: '5.0',
      location: 'Chicago, USA',
      price: 'Rs. 100',
      brandId: 2, // Tesla
    },
    {
      id: 1, // Ferrari
      name: 'Ferrari-FF',
      brand: 'Ferrari',
      model: 'FF',
      image: carImg1, // Matching CarDetailsPage
      rating: '5.0',
      location: 'Washington DC',
      price: 'Rs. 200',
      brandId: 1, // Ferrari
    },
    {
      id: 4, // Lamborghini
      name: 'Lamborghini Aventador',
      brand: 'Lamborghini',
      model: 'Aventador',
      image: carImg4, // Matching CarDetailsPage
      rating: '4.9',
      location: 'New York',
      price: 'Rs. 250',
      brandId: 4, // Lamborghini
    },
    {
      id: 5, // BMW M2 GTS
      name: 'BMW M2 GTS',
      brand: 'BMW',
      model: 'M2 GTS',
      image: carImg5, // Matching CarDetailsPage
      rating: '5.0',
      location: 'Los Angeles',
      price: 'Rs. 150',
      brandId: 3, // BMW
    },
  ];

  // Popular Cars with brandId - Matching CarDetailsPage
  const allPopularCars = [
    {
      id: 1, // Ferrari
      name: 'Ferrari-FF',
      brand: 'Ferrari',
      model: 'FF',
      image: carImg1, // Matching CarDetailsPage
      rating: '5.0',
      location: 'Washington DC',
      price: 'Rs. 200',
      brandId: 1, // Ferrari
    },
    {
      id: 3, // BMW
      name: 'BMW 3 Series',
      brand: 'BMW',
      model: '3 Series',
      image: carImg8, // Matching CarDetailsPage
      rating: '5.0',
      location: 'New York',
      price: 'Rs. 150',
      brandId: 3, // BMW
    },
  ];

  // Filter cars based on selected brand
  const filteredRecommendCars = useMemo(() => {
    if (selectedBrand === 'all') {
      return allRecommendCars;
    }
    return allRecommendCars.filter(car => car.brandId === selectedBrand);
  }, [selectedBrand]);

  const filteredPopularCars = useMemo(() => {
    if (selectedBrand === 'all') {
      return allPopularCars;
    }
    return allPopularCars.filter(car => car.brandId === selectedBrand);
  }, [selectedBrand]);

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
          className="mt-3 rounded-t-3xl bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.5)] px-4 pt-4 pb-44 space-y-4"
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

          {/* Main Content */}
          <div className="mt-4">
          {/* Show "No cars found" message if no cars match the filter */}
          {allFilteredCars.length === 0 ? (
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
                  to="#"
                  className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                  style={{ color: colors.textWhite }}
                >
                  About
                </Link>
                <Link
                  to="#"
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

