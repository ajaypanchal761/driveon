import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../module/theme/colors';
import { commonService } from '../../services/common.service';

// Fallback car images
import carImg1 from '../../assets/car_img1-removebg-preview.png';
import carImg4 from '../../assets/car_img4-removebg-preview.png';
import carImg5 from '../../assets/car_img5-removebg-preview.png';
import carImg6 from '../../assets/car_img6-removebg-preview.png';
import carImg8 from '../../assets/car_img8.png';

const fallbackCarImages = [carImg1, carImg6, carImg8, carImg4, carImg5];

/**
 * ReturningCarBanner Component
 * Displays a banner advertising cars that are returning soon from active trips
 * With horizontal scroll-snap scrolling inside single banner container
 */
const ReturningCarBanner = () => {
  const navigate = useNavigate();
  const [returningCars, setReturningCars] = useState([]);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const mobileScrollRef = useRef(null);
  const webScrollRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);

  // Fetch returning cars
  useEffect(() => {
    const fetchReturningCars = async () => {
      try {
        setIsLoading(true);
        const response = await commonService.getReturningCars();
        
        // Service returns dummy data in catch block, so response should always have data
        if (response && response.success && response.data?.cars?.length > 0) {
          // Transform car data
          const transformedCars = response.data.cars.map((car, index) => {
            // Get car image
            let carImage = fallbackCarImages[index % fallbackCarImages.length];
            if (car.images && car.images.length > 0) {
              const primaryImage = car.images.find(img => img.isPrimary);
              carImage = primaryImage 
                ? (primaryImage.url || primaryImage.path || primaryImage)
                : (car.images[0]?.url || car.images[0]?.path || car.images[0] || carImage);
            } else if (car.primaryImage) {
              carImage = car.primaryImage;
            }

            // Calculate time until return
            let returningIn = car.returningIn || 'Soon';
            if (car.returningDate) {
              const returnDate = new Date(car.returningDate);
              const now = new Date();
              const diffMs = returnDate - now;
              
              if (diffMs > 0) {
                const hours = Math.floor(diffMs / (1000 * 60 * 60));
                const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                
                if (hours > 0) {
                  returningIn = `${hours} hour${hours > 1 ? 's' : ''}`;
                  if (minutes > 0) {
                    returningIn += ` ${minutes} min${minutes > 1 ? 's' : ''}`;
                  }
                } else if (minutes > 0) {
                  returningIn = `${minutes} min${minutes > 1 ? 's' : ''}`;
                } else {
                  returningIn = 'Very soon';
                }
              } else {
                returningIn = 'Returning now';
              }
            }

            return {
              id: car._id || car.id,
              name: `${car.brand || ''} ${car.model || ''}`.trim(),
              brand: car.brand,
              model: car.model,
              image: carImage,
              price: car.pricePerDay || 0,
              location: car.location?.city || car.location?.address || 'Location',
              returningIn,
              returningDate: car.returningDate,
            };
          });

          setReturningCars(transformedCars);
        } else {
          // If no cars from API, use dummy data fallback
          const now = Date.now();
          const dummyCars = [
            {
              id: 'dummy1',
              name: 'Toyota Innova',
              brand: 'Toyota',
              model: 'Innova',
              image: fallbackCarImages[0],
              price: 1200,
              location: 'Mumbai',
              returningIn: '2 hours',
              returningDate: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'dummy2',
              name: 'Hyundai Creta',
              brand: 'Hyundai',
              model: 'Creta',
              image: fallbackCarImages[1],
              price: 1500,
              location: 'Delhi',
              returningIn: '1 hour 30 mins',
              returningDate: new Date(now + 1.5 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'dummy3',
              name: 'Maruti Swift Dzire',
              brand: 'Maruti',
              model: 'Swift Dzire',
              image: fallbackCarImages[2],
              price: 800,
              location: 'Bangalore',
              returningIn: '3 hours',
              returningDate: new Date(now + 3 * 60 * 60 * 1000).toISOString(),
            },
          ];
          setReturningCars(dummyCars);
        }
      } catch (error) {
        console.error('Error fetching returning cars:', error);
        // Use dummy data on error
        const now = Date.now();
        const dummyCars = [
          {
            id: 'dummy1',
            name: 'Toyota Innova',
            brand: 'Toyota',
            model: 'Innova',
            image: fallbackCarImages[0],
            price: 1200,
            location: 'Mumbai',
            returningIn: '2 hours',
            returningDate: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'dummy2',
            name: 'Hyundai Creta',
            brand: 'Hyundai',
            model: 'Creta',
            image: fallbackCarImages[1],
            price: 1500,
            location: 'Delhi',
            returningIn: '1 hour 30 mins',
            returningDate: new Date(now + 1.5 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'dummy3',
            name: 'Maruti Swift Dzire',
            brand: 'Maruti',
            model: 'Swift Dzire',
            image: fallbackCarImages[2],
            price: 800,
            location: 'Bangalore',
            returningIn: '3 hours',
            returningDate: new Date(now + 3 * 60 * 60 * 1000).toISOString(),
          },
        ];
        setReturningCars(dummyCars);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReturningCars();

    // Refresh every 30 seconds to update time
    const refreshInterval = setInterval(fetchReturningCars, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Get active scroll container (mobile or web)
  const getScrollContainer = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 ? webScrollRef.current : mobileScrollRef.current;
    }
    return null;
  };

  // Track scroll position to update current index - Fixed to properly sync with scroll
  useEffect(() => {
    if (returningCars.length <= 1) return;

    const handleScroll = (container) => {
      if (!container) return;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.clientWidth;
      
      // Calculate active index based on scroll position
      const newIndex = Math.round(scrollLeft / cardWidth);
      
      // Update index if it's valid and different
      if (newIndex >= 0 && newIndex < returningCars.length) {
        setCurrentCarIndex((prevIndex) => {
          if (prevIndex !== newIndex) {
            return newIndex;
          }
          return prevIndex;
        });
      }
    };

    const mobileContainer = mobileScrollRef.current;
    const webContainer = webScrollRef.current;

    const mobileHandler = () => {
      handleScroll(mobileContainer);
    };
    const webHandler = () => {
      handleScroll(webContainer);
    };

    // Add scroll listeners
    if (mobileContainer) {
      mobileContainer.addEventListener('scroll', mobileHandler, { passive: true });
    }
    if (webContainer) {
      webContainer.addEventListener('scroll', webHandler, { passive: true });
    }

    // Initial sync
    if (mobileContainer) {
      handleScroll(mobileContainer);
    }
    if (webContainer) {
      handleScroll(webContainer);
    }

    return () => {
      if (mobileContainer) {
        mobileContainer.removeEventListener('scroll', mobileHandler);
      }
      if (webContainer) {
        webContainer.removeEventListener('scroll', webHandler);
      }
    };
  }, [returningCars.length]);

  // Auto-scroll to next car
  useEffect(() => {
    if (returningCars.length <= 1 || isAutoScrollPaused) {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
      return;
    }

    autoScrollIntervalRef.current = setInterval(() => {
      const container = getScrollContainer();
      if (!container) return;

      const nextIndex = (currentCarIndex + 1) % returningCars.length;
      const cardWidth = container.clientWidth;
      container.scrollTo({
        left: nextIndex * cardWidth,
        behavior: 'smooth'
      });
    }, 5000);

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [returningCars.length, isAutoScrollPaused, currentCarIndex]);

  // Navigate to specific index
  const goToIndex = (index) => {
    const container = getScrollContainer();
    if (!container) return;

    setIsAutoScrollPaused(true);
    const cardWidth = container.clientWidth;
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    
    // Resume auto-scroll after 10 seconds
    setTimeout(() => setIsAutoScrollPaused(false), 10000);
  };

  // Mouse drag handlers
  const onMouseDown = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    setIsDragging(true);
    const container = getScrollContainer();
    if (container) {
      container.style.cursor = 'grabbing';
    }
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    const container = getScrollContainer();
    if (container) {
      container.scrollLeft -= e.movementX;
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    const container = getScrollContainer();
    if (container) {
      container.style.cursor = 'grab';
    }
    setIsAutoScrollPaused(true);
    setTimeout(() => setIsAutoScrollPaused(false), 10000);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
    const container = getScrollContainer();
    if (container) {
      container.style.cursor = 'grab';
    }
  };

  // Don't show banner only while loading
  // Banner will always show with dummy data if API fails
  if (isLoading) {
    return null;
  }

  // Don't show if no cars (shouldn't happen due to dummy data fallback)
  if (returningCars.length === 0) {
    return null;
  }

  const handleBannerClick = (car) => {
    navigate(`/car-details/${car.id}`, { 
      state: { 
        car,
        highlightReturning: true 
      } 
    });
  };

  return (
    <div className="w-full mb-4 md:mb-6 relative">
      {/* Mobile View - Single Banner with Horizontal Scroll */}
      <div className="mb-3 md:mb-6 relative block md:hidden">
        <div
          className="rounded-2xl overflow-hidden shadow-lg"
          style={{ 
            backgroundColor: colors.backgroundTertiary,
            maxHeight: '240px',
            height: 'auto',
          }}
        >
          <div
            ref={mobileScrollRef}
            className="flex overflow-x-auto scroll-smooth h-full"
            style={{
              scrollSnapType: 'x mandatory',
              touchAction: 'pan-x',
              cursor: isDragging ? 'grabbing' : 'grab',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            {returningCars.map((car, index) => (
              <div
                key={car.id || index}
                className="flex-shrink-0 flex items-center justify-between px-4 py-4 w-full"
                style={{ scrollSnapAlign: 'center' }}
                onClick={() => handleBannerClick(car)}
              >
                {/* Left Side - Text Content */}
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg 
                      className="w-4 h-4 flex-shrink-0" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: '#10B981' }}
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <span 
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: '#10B981' }}
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

                {/* Right Side - Car Image - Increased size */}
                <div className="flex-shrink-0 flex items-center justify-center" style={{ width: '40%', minWidth: '120px' }}>
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-auto object-contain"
                    draggable={false}
                    style={{ 
                      objectFit: 'contain',
                      maxHeight: '250px',
                      width: '100%',
                      transform: 'scale(1.25)',
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

        {/* Pagination Dots - Outside Banner */}
        {returningCars.length > 1 && (
          <div className="mobile-banner-pagination flex justify-center items-center gap-2 mt-4">
            {returningCars.map((_, index) => (
              <span
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(index);
                }}
                className={`swiper-pagination-bullet-custom ${
                  index === currentCarIndex ? 'swiper-pagination-bullet-active-custom' : ''
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Web View - Single Banner with Horizontal Scroll */}
      <div className="hidden md:block mb-3 md:mb-6 relative">
        <div
          className="rounded-2xl overflow-hidden shadow-lg"
          style={{ 
            backgroundColor: colors.backgroundTertiary,
            maxHeight: '320px',
            height: '320px',
            overflow: 'hidden',
          }}
        >
          <div
            ref={webScrollRef}
            className="flex overflow-x-auto overflow-y-hidden scroll-smooth h-full"
            style={{
              scrollSnapType: 'x mandatory',
              touchAction: 'pan-x',
              cursor: isDragging ? 'grabbing' : 'grab',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              overflowY: 'hidden',
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            {returningCars.map((car, index) => (
              <div
                key={car.id || index}
                className="flex-shrink-0 flex items-center justify-between px-6 py-2 lg:px-8 lg:py-3 w-full"
                style={{ scrollSnapAlign: 'center' }}
                onClick={() => handleBannerClick(car)}
              >
                {/* Left Side - Text Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 mb-2">
                    <svg 
                      className="w-5 h-5 flex-shrink-0" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: '#10B981' }}
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <span 
                      className="text-sm font-semibold uppercase tracking-wide"
                      style={{ color: '#10B981' }}
                    >
                      Returning Soon
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1.5">
                    {car.name}
                  </h3>
                  <p className="text-lg lg:text-xl text-white/90 mb-2">
                    This car is returning in <span className="font-semibold">{car.returningIn}</span> - Book it now!
                  </p>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-lg lg:text-xl font-semibold text-white">
                      Rs. {car.price} / day
                    </span>
                    <span className="text-white/60">•</span>
                    <span className="text-lg text-white/80">
                      {car.location}
                    </span>
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

                {/* Right Side - Car Image - Increased size */}
                <div className="flex-shrink-0 flex items-center justify-center" style={{ width: '45%', minWidth: '280px' }}>
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-auto object-contain"
                    draggable={false}
                    style={{ 
                      objectFit: 'contain',
                      maxHeight: '340px',
                      width: '100%',
                      transform: 'scale(1.15)',
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
          <div className="mobile-banner-pagination flex justify-center items-center gap-2 mt-4">
            {returningCars.map((_, index) => (
              <span
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(index);
                }}
                className={`swiper-pagination-bullet-custom ${
                  index === currentCarIndex ? 'swiper-pagination-bullet-active-custom' : ''
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
          background: #000000;
          width: 6px;
          height: 6px;
        }
      `}</style>
    </div>
  );
};

export default ReturningCarBanner;
