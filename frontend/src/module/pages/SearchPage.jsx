import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchHeader from '../components/layout/SearchHeader';
import BottomNavbar from '../components/layout/BottomNavbar';
import SearchBar from '../components/common/SearchBar';
import BrandFilter from '../components/common/BrandFilter';
import SearchCarCard from '../components/common/SearchCarCard';
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
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

      {/* Header - Mobile view only - Fixed at top */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <SearchHeader />
      </div>

      {/* Back Button - Below Header (Web view only) */}
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

      {/* Main Container - Responsive */}
      <div className={`max-w-7xl mx-auto md:pt-0 pt-20 ${isFilterOpen ? 'md:ml-80' : ''} transition-all duration-300`}>
        {/* Search Bar - Centered on Desktop */}
        <div className="px-4 md:px-6 lg:px-8 pt-0.5 pb-0 md:pt-4 md:pb-2">
          <div className="md:max-w-3xl md:mx-auto">
            <SearchBar 
              onFilterToggle={setIsFilterOpen} 
              onSearch={handleSearch}
              searchQuery={searchQuery}
            />
          </div>
        </div>

        {/* Brand Filters - Full width on Desktop */}
        <div>
          <BrandFilter 
            brands={brands}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
          />
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="px-4 md:px-6 lg:px-8 pb-24 md:pb-8">
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
                <div className="mb-6 md:mb-8 lg:mb-10">
                  <div className="flex items-center justify-between mb-3 md:mb-4 lg:mb-6">
                    <h2 className="text-base md:text-2xl lg:text-3xl font-bold text-black">
                      Recommend For You
                    </h2>
                  </div>
                  
                  {/* Car Cards Grid - 2 columns on mobile, 3 on tablet, 3 on desktop (wider cards) */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6">
                    {filteredRecommendCars.map((car, index) => (
                      <SearchCarCard key={car.id} car={car} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {/* Our Popular Cars Section */}
              {filteredPopularCars.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3 md:mb-4 lg:mb-6">
                    <h2 className="text-base md:text-2xl lg:text-3xl font-bold text-black">
                      Our Popular Cars
                    </h2>
                  </div>
                  
                  {/* Popular Cars - Horizontal scrollable on mobile, grid on desktop (wider cards) */}
                  <div className="flex md:grid md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6 overflow-x-auto md:overflow-x-visible scrollbar-hide -mx-0">
                    {filteredPopularCars.map((car, index) => (
                      <div 
                        key={car.id} 
                        className="min-w-[280px] md:min-w-0 flex-shrink-0" 
                        style={{ pointerEvents: 'auto' }}
                      >
                        <SearchCarCard car={car} horizontal={true} index={index} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Navbar - Overlay on top of container - Hidden on Desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default SearchPage;

