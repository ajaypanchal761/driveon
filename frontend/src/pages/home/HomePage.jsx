import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import { theme } from "../../theme/theme.constants";
import { carService } from "../../services/car.service";
import { useLocationTracking } from "../../hooks/useLocationTracking";
// Import car images from assets folder
import carBannerImage from "../../assets/car_img1-removebg-preview.png";
import carImg1 from "../../assets/car_img1-removebg-preview.png";
import carImg2 from "../../assets/car_img2-removebg-preview.png";
import carImg3 from "../../assets/car_img3-removebg-preview.png";
import carImg4 from "../../assets/car_img4-removebg-preview.png";
import carImg5 from "../../assets/car_img5-removebg-preview.png";
import carImg6 from "../../assets/car_img6-removebg-preview.png";
import carImg7 from "../../assets/car_img7-removebg-preview.png";

/**
 * HomePage Component
 * Exact match to the mobile app design shown in the image
 * Mobile-first design with blue theme
 * Now with dynamic data from backend
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Track user location
  const { currentLocation, coordinates } = useLocationTracking(
    true,
    isAuthenticated,
    user?.id
  );

  const [topCarTypes, setTopCarTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showLocation, setShowLocation] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const lastScrollYRef = useRef(0);

  // Default car type images mapping (fallback)
  const carTypeImageMap = {
    sedan: carImg1,
    suv: carImg2,
    hatchback: carImg3,
    luxury: carImg4,
    sports: carImg5,
    compact: carImg6,
    muv: carImg7,
    coupe: carImg1,
  };

  // Helper function to format car type name
  const formatCarType = (carType) => {
    if (!carType) return "";
    return carType.charAt(0).toUpperCase() + carType.slice(1);
  };

  // Fetch top car types from backend
  useEffect(() => {
    const fetchTopCarTypes = async () => {
      try {
        const response = await carService.getTopCarTypes({ limit: 10 });
        if (response.success && response.data.carTypes) {
          const carTypesWithImages = response.data.carTypes.map(
            (carType, index) => ({
              id: index + 1,
              name: formatCarType(carType.carType),
              carType: carType.carType, // Keep original for filtering
              count: carType.count,
              avgRating: carType.avgRating,
              totalBookings: carType.totalBookings,
              // Use sample car image if available, otherwise fallback
              image:
                carType.sampleCar?.primaryImage?.url ||
                carType.sampleCar?.images?.[0]?.url ||
                carTypeImageMap[carType.carType] ||
                carImg1,
              // Store sample car ID for navigation
              sampleCarId: carType.sampleCar?._id,
            })
          );
          setTopCarTypes(carTypesWithImages);
        }
      } catch (error) {
        console.error("Error fetching top car types:", error);
        // Fallback to default car types
        setTopCarTypes([
          { id: 1, name: "Sedan", carType: "sedan", image: carImg1 },
          { id: 2, name: "SUV", carType: "suv", image: carImg2 },
          { id: 3, name: "Hatchback", carType: "hatchback", image: carImg3 },
          { id: 4, name: "Luxury", carType: "luxury", image: carImg4 },
          { id: 5, name: "Sports", carType: "sports", image: carImg5 },
          { id: 6, name: "Compact", carType: "compact", image: carImg6 },
          { id: 7, name: "MUV", carType: "muv", image: carImg7 },
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
        // Use coordinates if available, otherwise extract city from location string
        let city = "Mumbai"; // Default fallback
        if (coordinates) {
          // If we have coordinates, we can use them for more accurate nearby search
          // For now, extract city from currentLocation string
          const locationParts = currentLocation.split(",");
          city =
            locationParts[locationParts.length - 2]?.trim() ||
            locationParts[locationParts.length - 1]?.trim() ||
            "Mumbai";
        } else if (
          currentLocation &&
          currentLocation !== "Loading location..." &&
          currentLocation !== "Location permission denied"
        ) {
          const locationParts = currentLocation.split(",");
          city =
            locationParts[locationParts.length - 2]?.trim() ||
            locationParts[locationParts.length - 1]?.trim() ||
            "Mumbai";
        }

        const response = await carService.getNearbyCars({
          city,
          limit: 10,
        });

        if (response.success && response.data.cars) {
          const formattedCars = response.data.cars.map((car) => ({
            id: car._id || car.id,
            brand: car.brand,
            model: car.model,
            dealership: car.owner?.name || "DriveOn Premium",
            price: car.pricePerDay,
            image: car.primaryImage || car.images?.[0]?.url || carImg1,
            rating: car.averageRating || 0,
            carId: car._id || car.id,
          }));
          setVehicles(formattedCars);
        }
      } catch (error) {
        console.error("Error fetching nearby cars:", error);
        // Fallback to default vehicles
        setVehicles([
          {
            id: 1,
            brand: "Toyota",
            model: "Camry",
            dealership: "DriveOn Premium",
            price: 890,
            image: carImg1,
            rating: 4.7,
          },
          {
            id: 2,
            brand: "Honda",
            model: "City",
            dealership: "DriveOn Premium",
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
  }, [currentLocation, coordinates]);

  // Check if desktop view
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Handle scroll to show/hide location (only for mobile view)
  useEffect(() => {
    // Initial check - only apply scroll behavior on mobile
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        const currentScrollY = window.scrollY;
        setShowLocation(currentScrollY < 10);
        lastScrollYRef.current = currentScrollY;
      } else {
        // Desktop: always show
        setShowLocation(true);
      }
    };

    checkMobile();
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      // Only apply scroll behavior on mobile view
      if (window.innerWidth < 768) {
        const currentScrollY = window.scrollY;

        if (currentScrollY < 10) {
          // At the top, always show
          setShowLocation(true);
        } else {
          // When scrolled down, hide location
          setShowLocation(false);
        }

        lastScrollYRef.current = currentScrollY;
      } else {
        // Desktop: always show
        setShowLocation(true);
      }
    };

    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header Section - Blue Background - Fixed */}
      <header
        className="text-white overflow-hidden md:rounded-none rounded-b-3xl shrink-0 max-w-full z-40 fixed left-0 right-0 top-0"
        style={{ backgroundColor: theme.colors.primary, width: "100%" }}
      >
        {/* Abstract blue pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
        </div>

        {/* Header Content */}
        <div
          className={`relative px-3 py-4 md:px-6 md:py-5 lg:px-6 lg:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:max-w-7xl md:mx-auto transition-all duration-300 ${
            showLocation ? "" : "pb-2"
          }`}
        >
          {/* Mobile View - Logo and Profile Icon Row */}
          <div className="flex md:hidden items-center justify-between gap-2">
            {/* Left - Logo */}
            <div className="flex-shrink-0 ml-2">
              <img
                src="/driveonlogo.png"
                alt="DriveOn Logo"
                className="h-9 w-auto object-contain"
              />
            </div>

            {/* Right - Profile Icon */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="relative flex items-center justify-center w-10 h-10"
                >
                  {/* Circular car image with white border */}
                  <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-gray-800">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile Car"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src={carImg1}
                        alt="Car"
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile View - User Name and Location Below Logo */}
          {isAuthenticated && user && (
            <div
              className={`flex md:hidden flex-col gap-0.5 ml-2 transition-all duration-300 overflow-hidden ${
                showLocation ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <span className="text-sm font-bold text-white">
                Hello {user.name || user.email?.split("@")[0] || "User"}
              </span>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3 h-3 text-white flex-shrink-0"
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
                <span className="text-xs text-white uppercase font-medium">
                  {currentLocation &&
                  !currentLocation.includes("error") &&
                  !currentLocation.includes("timeout") &&
                  !currentLocation.includes("denied") &&
                  !currentLocation.includes("unavailable") &&
                  !currentLocation.includes("Loading")
                    ? currentLocation
                    : "Mumbai, Maharashtra"}
                </span>
              </div>
            </div>
          )}

          {/* Desktop View - Logo on Left */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <img
              src="/driveonlogo.png"
              alt="DriveOn Logo"
              className="h-10 lg:h-11 w-auto object-contain"
            />
          </div>

          {/* Desktop View - User Name and Location in Center */}
          {isAuthenticated && user && (
            <div className="hidden md:flex flex-col items-center gap-1 flex-1 justify-center">
              <span className="text-sm lg:text-base font-bold text-white">
                Hello {user.name || user.email?.split("@")[0] || "User"}
              </span>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3 h-3 lg:w-4 lg:h-4 text-white flex-shrink-0"
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
                <span className="text-xs lg:text-sm text-white uppercase font-medium">
                  {currentLocation &&
                  !currentLocation.includes("error") &&
                  !currentLocation.includes("timeout") &&
                  !currentLocation.includes("denied") &&
                  !currentLocation.includes("unavailable") &&
                  !currentLocation.includes("Loading")
                    ? currentLocation
                    : "Mumbai, Maharashtra"}
                </span>
              </div>
            </div>
          )}

          {/* Desktop View - Profile Icon on Right */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="relative flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12"
              >
                {/* Circular car image with white border */}
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-gray-800">
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt="Profile Car"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={carImg1}
                      alt="Car"
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium rounded-lg"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable with padding for fixed header and bottom navbar */}
      <main
        className="px-4 md:px-6 lg:px-8 space-y-6 max-w-full md:max-w-7xl md:mx-auto"
        style={{
          paddingTop: showLocation
            ? isDesktop
              ? "120px"
              : "100px" // Desktop: 120px, Mobile: 100px
            : isDesktop
            ? "80px"
            : "70px", // Desktop: 80px, Mobile: 70px
          paddingBottom: "90px", // Space for bottom navbar
        }}
      >
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 md:px-6 md:py-4 flex items-center gap-3 mt-6 md:mt-8 lg:mt-10 md:max-w-2xl md:mx-auto lg:max-w-3xl">
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
        <div
          className="rounded-xl p-3 md:p-6 lg:p-8 relative overflow-hidden max-w-full"
          style={{ backgroundColor: theme.colors.primary }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-white rounded-full -mr-12 -mt-12 md:-mr-16 md:-mt-16 lg:-mr-20 lg:-mt-20"></div>
          </div>

          <div className="relative flex items-center justify-between gap-3 md:gap-6 lg:gap-8 max-w-full">
            {/* Left Side - Text Content */}
            <div className="flex-1 min-w-0 z-10 max-w-full overflow-hidden">
              <div className="text-xs md:text-sm lg:text-base text-white/70 mb-0.5 md:mb-1 uppercase tracking-wide">
                Featured Today
              </div>
              <h2 className="text-lg md:text-2xl lg:text-4xl font-bold text-white mb-1.5 md:mb-2 lg:mb-3 leading-tight">
                Rent Your Dream Car
              </h2>
              <p className="text-xs md:text-base lg:text-lg text-white/80 mb-2 md:mb-4 line-clamp-2">
                Premium cars available for rent at affordable prices
              </p>
              <button
                onClick={() => navigate("/cars")}
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
            <h3 className="text-lg md:text-2xl lg:text-3xl font-semibold text-gray-900">
              Top Brands
            </h3>
            <button
              onClick={() => navigate("/cars")}
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
                  navigate(
                    `/cars?carType=${encodeURIComponent(carType.carType)}`
                  );
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
        <div
          className="rounded-xl p-4 md:p-6 lg:p-8 flex items-center justify-between max-w-full overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
          style={{ backgroundColor: theme.colors.primary }}
        >
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
              <div
                className="absolute -top-0.5 -right-0.5 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-500 rounded-full border-2"
                style={{ borderColor: theme.colors.primary }}
              ></div>
            </div>
            <span className="text-white font-medium text-sm md:text-base lg:text-lg">
              Identify the closest vehicle
            </span>
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
            <h3 className="text-lg md:text-2xl lg:text-3xl font-semibold text-gray-900">
              Available Near You
            </h3>
            <button
              onClick={() => navigate("/cars")}
              className="text-sm md:text-base lg:text-lg font-medium hover:underline shrink-0 transition-colors"
              style={{ color: theme.colors.primary }}
            >
              See All
            </button>
          </div>
          <div
            className="flex gap-2.5 overflow-x-scroll overflow-y-hidden pb-2 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 lg:gap-8 md:mx-0 md:px-0 md:overflow-x-visible"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              willChange: "scroll-position",
              touchAction: "pan-x pinch-zoom",
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
                <div
                  className="relative -mt-8 mb-2 flex justify-center items-center overflow-hidden"
                  style={{ zIndex: 10, height: "140px", width: "100%" }}
                >
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      transform: "translateZ(0)",
                      filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.2))",
                      width: "180px",
                      height: "140px",
                    }}
                  >
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="object-contain"
                      style={{
                        transform:
                          "perspective(1000px) rotateY(-8deg) rotateX(2deg)",
                        backfaceVisibility: "hidden",
                        width: "180px",
                        height: "140px",
                        objectFit: "contain",
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
                      <p className="text-xs md:text-sm text-gray-500 mb-0.5 md:mb-1 line-clamp-1">
                        {vehicle.dealership}
                      </p>
                      <h4 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 line-clamp-1">
                        {vehicle.brand} {vehicle.model}
                      </h4>
                    </div>

                    {/* Right: Price */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="text-right">
                        <div
                          className="text-base md:text-lg lg:text-xl font-bold"
                          style={{ color: theme.colors.primary }}
                        >
                          ₹{vehicle.price}
                        </div>
                        <p className="text-xs md:text-sm text-gray-500">
                          Per Day
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Website Sections - Desktop Only */}
        <div className="hidden md:block">
          {/* Features/Benefits Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2
                  className="text-3xl lg:text-4xl font-bold mb-4"
                  style={{ color: theme.colors.primary }}
                >
                  Why Choose DriveOn?
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Experience seamless car rental with our trusted platform
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    ),
                    title: "Verified KYC",
                    description:
                      "Secure DigiLocker integration for verified identity",
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
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
                    ),
                    title: "Live Tracking",
                    description:
                      "Real-time GPS tracking for safety and security",
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                    title: "Flexible Payment",
                    description:
                      "Pay full or 35% advance - choose what works for you",
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    ),
                    title: "Referral Rewards",
                    description:
                      "Earn points and discounts with our referral program",
                  },
                ].map((feature, index) => (
                  <div key={`feature-${index}`} className="text-center">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                      style={{
                        backgroundColor: `${theme.colors.primary}15`,
                        color: theme.colors.primary,
                      }}
                    >
                      {feature.icon}
                    </div>
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Our Trusted Partners Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2
                  className="text-3xl lg:text-4xl font-bold mb-4"
                  style={{ color: theme.colors.primary }}
                >
                  Our Trusted Partners
                </h2>
                <p className="text-gray-600 text-lg">
                  We work with leading brands to provide you the best experience
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                {[
                  "DigiLocker",
                  "Razorpay",
                  "Stripe",
                  "AWS",
                  "Cloudinary",
                  "Firebase",
                ].map((partner, index) => (
                  <div
                    key={`partner-${index}`}
                    className="flex items-center justify-center h-20 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                  >
                    <span className="text-gray-700 font-semibold text-sm md:text-base">
                      {partner}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2
                  className="text-3xl lg:text-4xl font-bold mb-4"
                  style={{ color: theme.colors.primary }}
                >
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 text-lg">
                  Find answers to common questions about DriveOn
                </p>
              </div>
              <div className="space-y-4">
                {[
                  {
                    question: "How do I complete my profile?",
                    answer:
                      "To book a car, you need to complete 100% of your profile including name, email, phone, age, gender, address, profile photo, and KYC verification through DigiLocker.",
                  },
                  {
                    question: "What is KYC verification?",
                    answer:
                      "KYC (Know Your Customer) verification is done through DigiLocker OAuth2 integration. You need to verify your Aadhaar, PAN, and Driving License documents.",
                  },
                  {
                    question: "Do I need a guarantor?",
                    answer:
                      "Yes, you need to add a guarantor who must also complete registration and KYC verification. The guarantor will receive an invite via email or phone.",
                  },
                  {
                    question: "What payment options are available?",
                    answer:
                      "You can choose between full payment or 35% advance payment. The remaining amount will be auto-debited. We accept payments through Razorpay and Stripe.",
                  },
                  {
                    question: "Is location tracking mandatory?",
                    answer:
                      "Yes, live GPS tracking is mandatory during active trips for safety and security. Location is tracked every 10 seconds and stored for 6 months.",
                  },
                  {
                    question: "How does the referral program work?",
                    answer:
                      "Every user gets a referral code. When a new user signs up using your code and completes their first trip, you earn points that can be used as discounts.",
                  },
                ].map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={`faq-${index}`}
                      className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                        isOpen
                          ? "border-gray-300 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg transition-colors hover:bg-gray-50"
                        style={{
                          focusRingColor: theme.colors.primary,
                        }}
                      >
                        <h3
                          className={`text-lg font-semibold pr-4 flex-1 ${
                            isOpen ? "" : ""
                          }`}
                          style={{ color: theme.colors.primary }}
                        >
                          {faq.question}
                        </h3>
                        <svg
                          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? "transform rotate-180" : ""
                          }`}
                          style={{ color: theme.colors.primary }}
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
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed pt-4">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Download App Section */}
          <section
            className="py-20 bg-gradient-to-r"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
            }}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-left">
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                    Download DriveOn App
                  </h2>
                  <p className="text-white/90 text-lg lg:text-xl mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Get the best car rental experience on your mobile. Book
                    cars, track trips, and manage bookings on the go.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <a
                      href="#"
                      className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg
                        className="w-7 h-7 mr-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-1.44-1.88-.78-2.89-1.21-3.24-2.01-.3-.7-.23-1.64.23-2.84L7.1 7.22c.5-1.17 1.17-2.06 2.01-2.68.85-.63 1.9-.99 3.15-1.08 1.05-.08 2.05.07 3.01.45.96.38 1.83 1.05 2.61 2.01l-1.44 1.44c-.72-.89-1.5-1.36-2.35-1.6-.85-.24-1.75-.15-2.65.24-.9.39-1.6 1.05-2.1 1.98l3.18 7.29c.4.92.88 1.6 1.44 2.04.56.44 1.2.65 1.92.65.72 0 1.48-.21 2.28-.63l-.63-1.6zm.27 1.6l1.61 4.04c.24.6.44 1.12.6 1.56.16.44.28.8.36 1.08.08.28.12.48.12.6 0 .32-.08.56-.24.72-.16.16-.4.24-.72.24-.2 0-.4-.04-.6-.12-.2-.08-.48-.2-.84-.36-.36-.16-.88-.36-1.56-.6l-4.04-1.61 2.88-2.88z" />
                      </svg>
                      <span>Download for iOS</span>
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg
                        className="w-7 h-7 mr-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                      </svg>
                      <span>Download for Android</span>
                    </a>
                  </div>
                </div>
                <div className="flex justify-center lg:justify-center">
                  <div className="relative">
                    {/* Phone Mockup */}
                    <div className="relative w-72 h-[560px] mx-auto lg:ml-8">
                      {/* Phone Frame */}
                      <div className="absolute inset-0 bg-black rounded-[3.5rem] p-3 shadow-2xl">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>
                        {/* Screen */}
                        <div className="w-full h-full bg-white rounded-[3rem] overflow-hidden relative"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
