import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { theme } from '../../theme/theme.constants';
import { carService } from '../../services/car.service';
// Import car images from assets folder
import carBannerImage from '../../assets/car_img1-removebg-preview.png';
import carImg1 from '../../assets/car_img1-removebg-preview.png';
import carImg2 from '../../assets/car_img2-removebg-preview.png';
import carImg3 from '../../assets/car_img3-removebg-preview.png';
import carImg4 from '../../assets/car_img4-removebg-preview.png';
import carImg5 from '../../assets/car_img5-removebg-preview.png';
import carImg6 from '../../assets/car_img6-removebg-preview.png';
import carImg7 from '../../assets/car_img7-removebg-preview.png';

/**
 * HomePage Component
 * Exact match to the mobile app design shown in the image
 * Mobile-first design with blue theme
 * Now with dynamic data from backend
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const [location] = useState('Lombok mataram');
  const [topCarTypes, setTopCarTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default car type images mapping (fallback)
  const carTypeImageMap = {
    'sedan': carImg1,
    'suv': carImg2,
    'hatchback': carImg3,
    'luxury': carImg4,
    'sports': carImg5,
    'compact': carImg6,
    'muv': carImg7,
    'coupe': carImg1,
  };

  // Helper function to format car type name
  const formatCarType = (carType) => {
    if (!carType) return '';
    return carType.charAt(0).toUpperCase() + carType.slice(1);
  };

  // Fetch top car types from backend
  useEffect(() => {
    const fetchTopCarTypes = async () => {
      try {
        const response = await carService.getTopCarTypes({ limit: 10 });
        if (response.success && response.data.carTypes) {
          const carTypesWithImages = response.data.carTypes.map((carType, index) => ({
            id: index + 1,
            name: formatCarType(carType.carType),
            carType: carType.carType, // Keep original for filtering
            count: carType.count,
            avgRating: carType.avgRating,
            totalBookings: carType.totalBookings,
            // Use sample car image if available, otherwise fallback
            image: carType.sampleCar?.primaryImage?.url || 
                   carType.sampleCar?.images?.[0]?.url || 
                   carTypeImageMap[carType.carType] || 
                   carImg1,
            // Store sample car ID for navigation
            sampleCarId: carType.sampleCar?._id,
          }));
          setTopCarTypes(carTypesWithImages);
        }
      } catch (error) {
        console.error('Error fetching top car types:', error);
        // Fallback to default car types
        setTopCarTypes([
          { id: 1, name: 'Sedan', carType: 'sedan', image: carImg1 },
          { id: 2, name: 'SUV', carType: 'suv', image: carImg2 },
          { id: 3, name: 'Hatchback', carType: 'hatchback', image: carImg3 },
          { id: 4, name: 'Luxury', carType: 'luxury', image: carImg4 },
          { id: 5, name: 'Sports', carType: 'sports', image: carImg5 },
          { id: 6, name: 'Compact', carType: 'compact', image: carImg6 },
          { id: 7, name: 'MUV', carType: 'muv', image: carImg7 },
        ]);
      }
    };

    fetchTopCarTypes();
  }, []);

  // Fetch nearby cars from backend
  useEffect(() => {
    const fetchNearbyCars = async () => {
      try {
        setLoading(true);
        // Extract city from location (e.g., "Lombok mataram" -> "mataram")
        const city = location.split(' ').pop() || location;
        const response = await carService.getNearbyCars({ 
          city,
          limit: 10,
        });
        
        if (response.success && response.data.cars) {
          const formattedCars = response.data.cars.map((car) => ({
            id: car._id || car.id,
            brand: car.brand,
            model: car.model,
            dealership: car.owner?.name || 'DriveOn Premium',
            price: car.pricePerDay,
            image: car.primaryImage || car.images?.[0]?.url || carImg1,
            rating: car.averageRating || 0,
            carId: car._id || car.id,
          }));
          setVehicles(formattedCars);
        }
      } catch (error) {
        console.error('Error fetching nearby cars:', error);
        // Fallback to default vehicles
        setVehicles([
          { 
            id: 1, 
            brand: 'Toyota',
            model: 'Camry',
            dealership: 'DriveOn Premium',
            price: 890,
            image: carImg1,
            rating: 4.7,
          },
          { 
            id: 2, 
            brand: 'Honda',
            model: 'City',
            dealership: 'DriveOn Premium',
            price: 620,
            image: carImg2,
            rating: 4.8,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyCars();
  }, [location]);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header Section - Blue Background - Fixed */}
      <header className="text-white overflow-hidden md:rounded-none rounded-b-3xl shrink-0 max-w-full z-40 fixed left-0 right-0 top-0" style={{ backgroundColor: theme.colors.primary, width: '100%' }}>
        {/* Abstract blue pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
        </div>

        {/* Header Content */}
        <div className="relative px-3 py-2 flex items-center justify-between md:px-6 md:py-3 lg:px-8 lg:py-4 md:max-w-7xl md:mx-auto">
          {/* Logo */}
          <div className="flex items-center ml-2 md:-ml-2">
            <img
              src="/driveonlogo.png"
              alt="DriveOn Logo"
              className="h-10 md:h-12 lg:h-14 w-auto object-contain"
            />
          </div>

          {/* Profile Picture */}
          <button
            onClick={handleProfileClick}
            className="ml-2 touch-target md:ml-4 lg:ml-6 hover:opacity-80 transition-opacity"
            aria-label="Profile"
          >
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-white object-cover md:w-10 md:h-10 lg:w-12 lg:h-12"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border-2 border-white md:w-10 md:h-10 lg:w-12 lg:h-12">
                <svg
                  className="w-5 h-5 text-white md:w-6 md:h-6 lg:w-7 lg:h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </button>
        </div>
        </header>

      {/* Main Content Area - Scrollable with padding for fixed header and bottom navbar */}
      <main className="px-4 md:px-6 lg:px-8 space-y-6 max-w-full md:max-w-7xl md:mx-auto" style={{ 
        paddingTop: '66px', // Space for header (~66px)
        paddingBottom: '90px', // Space for bottom navbar
      }}>
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 md:px-6 md:py-4 flex items-center gap-3 mt-8 md:mt-10 lg:mt-12 md:max-w-2xl md:mx-auto lg:max-w-3xl">
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
            placeholder="Search vehicle.."
            className="flex-1 text-base text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>

        {/* Featured Car Banner */}
        <div className="rounded-xl p-3 md:p-6 lg:p-8 relative overflow-hidden max-w-full" style={{ backgroundColor: theme.colors.primary }}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-white rounded-full -mr-12 -mt-12 md:-mr-16 md:-mt-16 lg:-mr-20 lg:-mt-20"></div>
          </div>

          <div className="relative flex items-center justify-between gap-3 md:gap-6 lg:gap-8 max-w-full">
            {/* Left Side - Text Content */}
            <div className="flex-1 min-w-0 z-10 max-w-full overflow-hidden">
              <div className="text-xs md:text-sm lg:text-base text-white/70 mb-0.5 md:mb-1 uppercase tracking-wide">Featured Today</div>
              <h2 className="text-lg md:text-2xl lg:text-4xl font-bold text-white mb-1.5 md:mb-2 lg:mb-3 leading-tight">Rent Your Dream Car</h2>
              <p className="text-xs md:text-base lg:text-lg text-white/80 mb-2 md:mb-4 line-clamp-2">Premium cars available for rent at affordable prices</p>
              <button 
                onClick={() => navigate('/cars')}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1.5 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-lg flex items-center gap-1.5 text-xs md:text-sm lg:text-base font-semibold transition-colors shadow-md hover:shadow-lg relative z-20"
              >
                <svg
                  className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
                Explore Cars
              </button>
            </div>

            {/* Right Side - Car Image */}
            <div className="w-40 h-32 md:w-56 md:h-44 lg:w-80 lg:h-64 shrink-0 absolute right-0 top-1/2 -translate-y-1/2 z-30">
              <img
                src={carBannerImage}
                alt="Premium Car"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Top Car Types Section */}
        <div className="max-w-full overflow-hidden">
          <div className="flex items-center justify-between mb-1 md:mb-4 lg:mb-6">
            <h3 className="text-lg md:text-2xl lg:text-3xl font-semibold text-gray-900">Top Brands</h3>
            <button 
              onClick={() => navigate('/cars')}
              className="text-sm md:text-base lg:text-lg font-medium hover:underline shrink-0 transition-colors" 
              style={{ color: theme.colors.primary }}
            >
              See All
            </button>
          </div>
          <div className="flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto -mx-4 pl-4 pr-4 scrollbar-hide md:overflow-x-visible md:mx-0 md:px-0">
            {topCarTypes.map((carType) => (
              <div
                key={carType.id}
                onClick={() => {
                  // Navigate to browse cars page with carType filter
                  navigate(`/cars?carType=${encodeURIComponent(carType.carType)}`);
                }}
                className="shrink-0 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer active:scale-95"
              >
                <div className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 flex items-center justify-center bg-gray-50 rounded-lg p-2 md:p-3 lg:p-4 hover:bg-gray-100 transition-colors">
                  <img
                    src={carType.image}
                    alt={carType.name}
                    className="w-full h-full object-contain m-0 p-0"
                  />
                </div>
                <span className="text-xs md:text-sm lg:text-base font-medium text-gray-700 text-center max-w-[80px] md:max-w-full truncate m-0 p-0 mt-2 md:mt-3">
                  {carType.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Identify the Closest Vehicle Card */}
        <div className="rounded-xl p-4 md:p-6 lg:p-8 flex items-center justify-between max-w-full overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" style={{ backgroundColor: theme.colors.primary }}>
          <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
            <div className="relative w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-500 rounded-full border-2" style={{ borderColor: theme.colors.primary }}></div>
            </div>
            <span className="text-white font-medium text-sm md:text-base lg:text-lg">Identify the closest vehicle</span>
          </div>
          <svg
            className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white flex-shrink-0"
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
        </div>

        {/* Available Near You Section */}
        <div className="w-full overflow-visible">
          <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8 px-0">
            <h3 className="text-lg md:text-2xl lg:text-3xl font-semibold text-gray-900">Available Near You</h3>
            <button 
              onClick={() => navigate('/cars')}
              className="text-sm md:text-base lg:text-lg font-medium hover:underline shrink-0 transition-colors" 
              style={{ color: theme.colors.primary }}
            >
              See All
            </button>
          </div>
          <div 
            className="flex gap-2.5 overflow-x-scroll overflow-y-hidden pb-2 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 lg:gap-8 md:mx-0 md:px-0 md:overflow-x-visible" 
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              willChange: 'scroll-position',
              touchAction: 'pan-x pinch-zoom',
            }}
          >
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="shrink-0 w-56 md:w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigate(`/cars/${vehicle.carId || vehicle.id}`)}
              >
                {/* View Button - Top Right */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/cars/${vehicle.carId || vehicle.id}`);
                  }}
                  className="absolute top-2 right-2 md:top-3 md:right-3 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all shadow-md hover:opacity-90 hover:scale-105 bg-white"
                  style={{ 
                    zIndex: 100,
                    color: theme.colors.primary,
                  }}
                >
                  View
                </button>

                {/* Car Image - Elevated with 3D effect */}
                <div className="relative -mt-8 mb-2 flex justify-center items-center overflow-hidden" style={{ zIndex: 10, height: '140px', width: '100%' }}>
                  <div 
                    className="relative flex items-center justify-center"
                    style={{ 
                      transform: 'translateZ(0)',
                      filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.2))',
                      width: '180px',
                      height: '140px',
                    }}
                  >
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="object-contain"
                      style={{ 
                        transform: 'perspective(1000px) rotateY(-8deg) rotateX(2deg)',
                        backfaceVisibility: 'hidden',
                        width: '180px',
                        height: '140px',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                </div>

                {/* Card Content - More Compact */}
                <div className="px-2.5 md:px-4 pb-2.5 md:pb-4 pt-0">
                  {/* Car Details and Price Row */}
                  <div className="flex items-start justify-between gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                    {/* Left: Car Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-gray-500 mb-0.5 md:mb-1 line-clamp-1">{vehicle.dealership}</p>
                      <h4 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 line-clamp-1">
                        {vehicle.brand} {vehicle.model}
                      </h4>
                    </div>

                    {/* Right: Price */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="text-right">
                        <div className="text-base md:text-lg lg:text-xl font-bold" style={{ color: theme.colors.primary }}>
                          ₹{vehicle.price}
                        </div>
                        <p className="text-xs md:text-sm text-gray-500">Per Day</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
