import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/colors";

// Fallback car images
import carImg1 from "../../../assets/car_img1-removebg-preview.png";
import carImg4 from "../../../assets/car_img4-removebg-preview.png";
import carImg5 from "../../../assets/car_img5-removebg-preview.png";
import carImg6 from "../../../assets/car_img6-removebg-preview.png";
import carImg8 from "../../../assets/car_img8.png";

const fallbackCarImages = [carImg1, carImg6, carImg8, carImg4, carImg5];

/**
 * ReturningCarBanner Component
 * Shows cars that are returning soon from other users' bookings
 * Always visible with dummy data (for user2 browsing/booking)
 * With horizontal scroll and pagination dots
 */
const ReturningCarBanner = () => {
  const navigate = useNavigate();
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const mobileScrollRef = useRef(null);
  const webScrollRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const isAutoScrollingRef = useRef(false);
  const pauseTimeoutRef = useRef(null);
  const currentIndexRef = useRef(0);
  const isPausedRef = useRef(false);

  // Dummy data - Cars returning soon from other users
  const returningCars = [
    {
      id: "returning1",
      name: "Toyota Innova",
      brand: "Toyota",
      model: "Innova",
      image: fallbackCarImages[0],
      price: 1200,
      location: "Mumbai",
      returningIn: "2 hours",
    },
    {
      id: "returning2",
      name: "Hyundai Creta",
      brand: "Hyundai",
      model: "Creta",
      image: fallbackCarImages[1],
      price: 1500,
      location: "Delhi",
      returningIn: "1 hour 30 mins",
    },
    {
      id: "returning3",
      name: "Maruti Swift Dzire",
      brand: "Maruti",
      model: "Swift Dzire",
      image: fallbackCarImages[2],
      price: 800,
      location: "Bangalore",
      returningIn: "3 hours",
    },
  ];

  // Get active scroll container (mobile or web)
  const getScrollContainer = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768 ? webScrollRef.current : mobileScrollRef.current;
    }
    return null;
  };

  // Track scroll position to update current index
  useEffect(() => {
    if (returningCars.length <= 1) return;

    const handleScroll = (container) => {
      if (!container) return;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.clientWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      
      if (newIndex >= 0 && newIndex < returningCars.length) {
        setCurrentCarIndex(newIndex);
        currentIndexRef.current = newIndex;
      }
    };

    const mobileContainer = mobileScrollRef.current;
    const webContainer = webScrollRef.current;

    const mobileHandler = () => {
      handleScroll(mobileContainer);
      // Only pause if it's user-initiated scroll, not auto-scroll
      if (!isAutoScrollingRef.current) {
        setIsAutoScrollPaused(true);
        isPausedRef.current = true;
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = setTimeout(() => {
          setIsAutoScrollPaused(false);
          isPausedRef.current = false;
        }, 5000); // Resume after 5 seconds
      }
    };
    
    const webHandler = () => {
      handleScroll(webContainer);
      if (!isAutoScrollingRef.current) {
        setIsAutoScrollPaused(true);
        isPausedRef.current = true;
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = setTimeout(() => {
          setIsAutoScrollPaused(false);
          isPausedRef.current = false;
        }, 5000); // Resume after 5 seconds
      }
    };

    if (mobileContainer) mobileContainer.addEventListener("scroll", mobileHandler, { passive: true });
    if (webContainer) webContainer.addEventListener("scroll", webHandler, { passive: true });

    if (mobileContainer) handleScroll(mobileContainer);
    if (webContainer) handleScroll(webContainer);

    return () => {
      if (mobileContainer) mobileContainer.removeEventListener("scroll", mobileHandler);
      if (webContainer) webContainer.removeEventListener("scroll", webHandler);
    };
  }, [returningCars.length]);

  // Auto-scroll to next car
  useEffect(() => {
    // Clear any existing interval first
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    if (returningCars.length <= 1) return;

    // Start interval - it will check pause state on each execution
    autoScrollIntervalRef.current = setInterval(() => {
      // Skip if paused (use ref to get latest value)
      if (isPausedRef.current) return;

      const container = getScrollContainer();
      if (!container) return;

      // Use ref to get current index to avoid dependency issues
      const currentIdx = currentIndexRef.current;
      const nextIndex = (currentIdx + 1) % returningCars.length;
      const cardWidth = container.clientWidth;
      
      // Mark as auto-scrolling
      isAutoScrollingRef.current = true;
      
      container.scrollTo({
        left: nextIndex * cardWidth,
        behavior: "smooth",
      });
      
      // Reset flag after scroll completes (smooth scroll takes ~500ms)
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 800);
    }, 3000); // Auto-scroll every 3 seconds

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [returningCars.length]);

  // Navigate to specific index
  const goToIndex = (index) => {
    const container = getScrollContainer();
    if (!container) return;

    // Pause auto-scroll when user clicks pagination
    setIsAutoScrollPaused(true);
    isPausedRef.current = true;
    
    // Clear existing timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Mark as auto-scrolling (programmatic scroll)
    isAutoScrollingRef.current = true;
    
    const cardWidth = container.clientWidth;
    container.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    
    // Reset flag after scroll completes
    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 600);
    
    // Resume auto-scroll after 10 seconds
    pauseTimeoutRef.current = setTimeout(() => {
      setIsAutoScrollPaused(false);
      isPausedRef.current = false;
    }, 10000);
  };

  const handleBannerClick = (car) => {
    navigate(`/car-details/${car.id}`, {
      state: {
        car,
        highlightReturning: true,
      },
    });
  };

  return (
    <div className="w-full mb-4 md:mb-6">
      {/* Mobile View */}
      <div className="block md:hidden">
          <div
            className="rounded-2xl overflow-hidden shadow-2xl relative"
            style={{
              background: colors.gradientHeader || "linear-gradient(180deg, #1C205C 0%, #0D102D 100%)",
              maxHeight: "280px",
              height: "auto",
            }}
          >
          <div
            ref={mobileScrollRef}
            className="flex overflow-x-auto scroll-smooth h-full"
            style={{
              scrollSnapType: "x mandatory",
              touchAction: "pan-x",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {returningCars.map((car, index) => (
              <div
                key={car.id || index}
                className="flex-shrink-0 flex items-center justify-between px-4 py-4 w-full cursor-pointer"
                style={{ scrollSnapAlign: "center" }}
                onClick={() => handleBannerClick(car)}
              >
                {/* Left Side - Text Content */}
                <div 
                  className={`flex-1 min-w-0 pr-3 transition-all duration-700 ease-out ${
                    index === currentCarIndex ? "opacity-100 translate-y-0" : "opacity-50 translate-y-4"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "#10B981" }}
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "#10B981" }}
                    >
                      Returning Soon
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 truncate">
                    {car.name}
                  </h3>
                  <p className="text-sm text-white/90 mb-1.5">
                    Available in {car.returningIn}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-sm font-semibold text-white">
                      Rs. {car.price} / day
                    </span>
                    <span className="text-xs text-white/60">•</span>
                    <span className="text-sm text-white/80 truncate">
                      {car.location}
                    </span>
                  </div>
                  <button
                    className="px-4 py-1.5 rounded-lg font-semibold text-xs transition-all hover:opacity-90"
                    style={{
                      backgroundColor: colors.backgroundPrimary,
                      color: colors.textPrimary,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBannerClick(car);
                    }}
                  >
                    Book Now
                  </button>
                </div>

                {/* Right Side - Car Image */}
                <div
                  className="flex-shrink-0 flex items-center justify-center transition-all duration-700 ease-out"
                  style={{ 
                    width: "40%", 
                    minWidth: "120px",
                    transform: index === currentCarIndex ? "scale(1)" : "scale(0.9)",
                    opacity: index === currentCarIndex ? 1 : 0.8
                  }}
                >
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-auto object-contain"
                    draggable={false}
                    style={{
                      objectFit: "contain",
                      maxHeight: "250px",
                      width: "100%",
                      transform: index === currentCarIndex ? "scale(1.25)" : "scale(1)",
                      transition: "transform 0.7s ease-out"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hide scrollbar */}
        <style>{`
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Pagination Dots - Outside Banner - Mobile */}
        {returningCars.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {returningCars.map((_, index) => (
              <span
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(index);
                }}
                className={`swiper-pagination-bullet-custom ${
                  index === currentCarIndex
                    ? "swiper-pagination-bullet-active-custom"
                    : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Web View */}
      <div className="hidden md:block">
        <div
          className="rounded-3xl overflow-hidden shadow-2xl relative"
          style={{
            background: colors.gradientHeader || "linear-gradient(180deg, #1C205C 0%, #0D102D 100%)",
            maxHeight: "340px",
            height: "340px",
            overflow: "hidden",
          }}
        >
          <div
            ref={webScrollRef}
            className="flex overflow-x-auto overflow-y-hidden scroll-smooth h-full"
            style={{
              scrollSnapType: "x mandatory",
              touchAction: "pan-x",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              overflowY: "hidden",
            }}
          >
            {returningCars.map((car, index) => (
              <div
                key={car.id || index}
                className="flex-shrink-0 flex items-center justify-between px-6 py-2 lg:px-8 lg:py-3 w-full cursor-pointer"
                style={{ scrollSnapAlign: "center" }}
                onClick={() => handleBannerClick(car)}
              >
                {/* Left Side - Text Content */}
                <div 
                  className={`flex-1 min-w-0 pr-6 transition-all duration-700 ease-out ${
                    index === currentCarIndex ? "opacity-100 translate-y-0" : "opacity-50 translate-y-6"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "#10B981" }}
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span
                      className="text-sm font-semibold uppercase tracking-wide"
                      style={{ color: "#10B981" }}
                    >
                      Returning Soon
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1.5">
                    {car.name}
                  </h3>
                  <p className="text-lg lg:text-xl text-white/90 mb-2">
                    This car is returning in{" "}
                    <span className="font-semibold">{car.returningIn}</span> - Book
                    it now!
                  </p>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-lg lg:text-xl font-semibold text-white">
                      Rs. {car.price} / day
                    </span>
                    <span className="text-white/60">•</span>
                    <span className="text-lg text-white/80">{car.location}</span>
                  </div>
                  <button
                    className="px-5 py-2.5 rounded-lg font-semibold text-base transition-all hover:opacity-90"
                    style={{
                      backgroundColor: colors.backgroundPrimary,
                      color: colors.textPrimary,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBannerClick(car);
                    }}
                  >
                    Book Now
                  </button>
                </div>

                {/* Right Side - Car Image */}
                <div
                  className="flex-shrink-0 flex items-center justify-center transition-all duration-700 ease-out"
                  style={{ 
                    width: "45%", 
                    minWidth: "280px",
                    transform: index === currentCarIndex ? "scale(1)" : "scale(0.9)",
                    opacity: index === currentCarIndex ? 1 : 0.8
                  }}
                >
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-auto object-contain"
                    draggable={false}
                    style={{
                      objectFit: "contain",
                      maxHeight: "340px",
                      width: "100%",
                      transform: index === currentCarIndex ? "scale(1.15)" : "scale(1)",
                      transition: "transform 0.7s ease-out"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hide scrollbar */}
        <style>{`
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Pagination Dots - Outside Banner - Web */}
        {returningCars.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {returningCars.map((_, index) => (
              <span
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(index);
                }}
                className={`swiper-pagination-bullet-custom ${
                  index === currentCarIndex
                    ? "swiper-pagination-bullet-active-custom"
                    : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Custom Pagination Styles */}
      <style>{`
        .swiper-pagination-bullet-custom {
          width: 6px;
          height: 6px;
          background: rgba(0, 0, 0, 0.3);
          opacity: 1;
          margin: 0 3px;
          transition: all 0.3s ease;
          border-radius: 50%;
          cursor: pointer;
          display: inline-block;
        }
        .swiper-pagination-bullet-active-custom {
          background: ${colors.backgroundTertiary};
          width: 24px;
          height: 6px;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default ReturningCarBanner;
