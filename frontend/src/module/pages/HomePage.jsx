import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, Mousewheel, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Header from "../components/layout/Header";
import BottomNavbar from "../components/layout/BottomNavbar";
import BrandCard from "../components/common/BrandCard";
import CarCard from "../components/common/CarCard";
import BannerAd from "../../components/common/BannerAd";
import ReturningCarBanner from "../../components/common/ReturningCarBanner";
import { colors } from "../theme/colors";
import { useAppSelector } from "../../hooks/redux";
import { carService } from "../../services/car.service";
import { commonService } from "../../services/common.service";

// Import car images
import carImg1 from "../../assets/car_img1-removebg-preview.png";
import carImg4 from "../../assets/car_img4-removebg-preview.png";
import carImg5 from "../../assets/car_img5-removebg-preview.png";
import carImg6 from "../../assets/car_img6-removebg-preview.png";
import carImg8 from "../../assets/car_img8.png";

// Brand logos for fallback mapping
import logoToyota from "../../assets/car_logo2_PNG.png";
import logoHyundai from "../../assets/car_logo6_PNG.png";
import logoKia from "../../assets/car_logo1_PNG1.png";
import logoLandRover from "../../assets/car_logo15.png";
import logoBMW from "../../assets/car_logo11_PNG.png";
import logoAudi from "../../assets/car_logo10_PNG.png";
import logoSuzuki from "../../assets/car_logo2_PNG.png";
import logoMahindra from "../../assets/car_logo9_PNG.png";
import logoVolvo from "../../assets/car_logo7_PNG.png";
import logoSkoda from "../../assets/car_logo8_PNG.png";
import logoJaguar from "../../assets/car_logo14_PNG.png";
// External logos for brands missing local assets
const logoHonda =
  "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda-logo.png";
const logoNissan =
  "https://upload.wikimedia.org/wikipedia/commons/3/3e/Nissan_logo.png";

// Import web banner image (kept static by requirement)
import web_banImg2 from "../../assets/web_banImg2.png";

// Import mobile view image
import mobileViewImg1 from "../../assets/mobile_viewImg1.png";
import mobileViewImg2 from "../../assets/mobile_viewImg2.png";
import downloadRemoveBgPreview from "../../assets/download-removebg-preview.png";

/**
 * HomePage Component - Exact match to design
 * Mobile-first design with exact layout from image
 */
const HomePage = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(100); // Default height

  // Swiper refs for programmatic control
  const mobileBannerSwiperRef = useRef(null);
  const bannerCarouselSwiperRef = useRef(null);
  const heroBannerSwiperRef = useRef(null);

  // Get authentication state
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);

  // Cars state - fetched from API
  const [bestCars, setBestCars] = useState([]);
  const [nearbyCars, setNearbyCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);

  // Dynamic data states
  const [brands, setBrands] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Featured car for AVAILABLE section
  const [featuredCar, setFeaturedCar] = useState(null);
  
  // Promotional banner data
  const [promotionalBanner, setPromotionalBanner] = useState({
    title: "",
    subtitle: "",
  });
  
  // Banner overlay text
  const [bannerOverlay, setBannerOverlay] = useState({
    title: "",
    subtitle: "",
  });

  // Date picker states
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(null);
  const [calendarTarget, setCalendarTarget] = useState(null); // 'pickup' | 'dropoff'
  const [timePickerTarget, setTimePickerTarget] = useState(null); // 'pickup' | 'dropoff'
  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState(30);
  const [selectedPeriod, setSelectedPeriod] = useState('am');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Calendar helper functions
  const openCalendar = (target) => {
    setCalendarTarget(target);
    const currentDate = target === "pickup" ? pickupDate : dropoffDate;
    if (currentDate) {
      const date = new Date(currentDate);
      setCalendarSelectedDate(date);
      setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    } else {
      setCalendarSelectedDate(null);
      setCalendarMonth(new Date());
    }
    setIsCalendarOpen(true);
  };

  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const handleDateSelect = (date) => {
    setCalendarSelectedDate(date);
    // Format date as YYYY-MM-DD using local timezone to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    if (calendarTarget === "pickup") {
      setPickupDate(dateStr);
      if (dropoffDate && new Date(dropoffDate) < date) {
        setDropoffDate("");
      }
    } else {
      setDropoffDate(dateStr);
    }
    
    // Save dates to localStorage for auto-fill in car details page
    try {
      const dates = {
        pickupDate: calendarTarget === "pickup" ? dateStr : pickupDate,
        pickupTime: pickupTime,
        dropDate: calendarTarget === "dropoff" ? dateStr : dropoffDate,
        dropTime: dropoffTime,
      };
      localStorage.setItem('selectedBookingDates', JSON.stringify(dates));
    } catch (error) {
      console.error('Error saving dates to localStorage:', error);
    }
    
    setIsCalendarOpen(false);
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "dd-mm-yyyy";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTimeDisplay = (timeString) => {
    if (!timeString) return "hh:mm";
    return timeString;
  };

  const openTimePicker = (target) => {
    setTimePickerTarget(target);
    const currentTime = target === "pickup" ? pickupTime : dropoffTime;
    if (currentTime) {
      const [time, period] = currentTime.split(' ');
      if (time) {
        const [hour, minute] = time.split(':');
        setSelectedHour(parseInt(hour) || 10);
        setSelectedMinute(parseInt(minute) || 30);
        setSelectedPeriod(period || 'am');
      }
    }
    setIsTimePickerOpen(true);
  };

  const handleTimeSelect = () => {
    const formattedTime = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')} ${selectedPeriod}`;
    // Convert to 24-hour format for storage (HH:mm)
    let hour24 = selectedHour;
    if (selectedPeriod === 'pm' && selectedHour !== 12) {
      hour24 = selectedHour + 12;
    } else if (selectedPeriod === 'am' && selectedHour === 12) {
      hour24 = 0;
    }
    const time24Format = `${String(hour24).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    
    if (timePickerTarget === "pickup") {
      setPickupTime(formattedTime);
    } else if (timePickerTarget === "dropoff") {
      setDropoffTime(formattedTime);
    }
    
    // Save dates to localStorage for auto-fill in car details page
    try {
      // Get current times in 24-hour format
      let currentPickupTime24 = '';
      let currentDropoffTime24 = '';
      
      if (timePickerTarget === "pickup") {
        currentPickupTime24 = time24Format;
        // Convert existing dropoff time if available
        if (dropoffTime) {
          const [time, period] = dropoffTime.split(' ');
          if (time && period) {
            const [hour, minute] = time.split(':');
            let hour24 = parseInt(hour);
            if (period === 'pm' && hour24 !== 12) {
              hour24 = hour24 + 12;
            } else if (period === 'am' && hour24 === 12) {
              hour24 = 0;
            }
            currentDropoffTime24 = `${String(hour24).padStart(2, '0')}:${minute}`;
          }
        }
      } else {
        currentDropoffTime24 = time24Format;
        // Convert existing pickup time if available
        if (pickupTime) {
          const [time, period] = pickupTime.split(' ');
          if (time && period) {
            const [hour, minute] = time.split(':');
            let hour24 = parseInt(hour);
            if (period === 'pm' && hour24 !== 12) {
              hour24 = hour24 + 12;
            } else if (period === 'am' && hour24 === 12) {
              hour24 = 0;
            }
            currentPickupTime24 = `${String(hour24).padStart(2, '0')}:${minute}`;
          }
        }
      }
      
      const dates = {
        pickupDate: pickupDate,
        pickupTime: currentPickupTime24,
        dropDate: dropoffDate,
        dropTime: currentDropoffTime24,
      };
      localStorage.setItem('selectedBookingDates', JSON.stringify(dates));
    } catch (error) {
      console.error('Error saving dates to localStorage:', error);
    }
    
    setIsTimePickerOpen(false);
  };

  // Static hero car image - always use the Audi image (as requested)
  const heroImage = web_banImg2;

  const getLogoUrl = (logo) => {
    if (!logo || typeof logo !== "string") return logo || "";
    if (logo.startsWith("http") || logo.startsWith("data:")) return logo;
    // If it's an imported asset (starts with /assets or /src hashed path), return as-is
    if (logo.startsWith("/")) return logo;
    const base = import.meta.env.VITE_API_BASE_URL || "";
    return `${base}${logo.startsWith("/") ? "" : "/"}${logo}`;
  };

  const brandLogoMap = {
    toyota: logoToyota,
    hyundai: logoHyundai,
    kia: logoKia,
    "land rover": logoLandRover,
    landrover: logoLandRover,
    bmw: logoBMW,
    audi: logoAudi,
    suzuki: logoSuzuki,
    maruti: logoSuzuki,
    "maruti suzuki": logoSuzuki,
    mahindra: logoMahindra,
    volvo: logoVolvo,
    skoda: logoSkoda,
    jaguar: logoJaguar,
    honda: logoHonda,
    nissan: logoNissan,
    "swift": logoSuzuki,
    "swift dzire": logoSuzuki,
    "alto": logoSuzuki,
    "alto 800": logoSuzuki,
    "xuv500": logoMahindra,
    xuv: logoMahindra,
  };

  // Determine best-fit logo when API doesn't supply one or gives a model name
  const resolveBrandLogo = (name = "") => {
    const normalized = name.toLowerCase().trim();
    if (!normalized) return "";

    if (brandLogoMap[normalized]) return brandLogoMap[normalized];

    const includeMap = [
      {
        keywords: ["suzuki", "maruti", "swift", "dzire", "desire", "dezire", "alto", "baleno", "wagon", "celerio", "ertiga"],
        logo: logoSuzuki,
      },
      { keywords: ["hyundai", "creta", "i20", "grand i10", "venue", "verna"], logo: logoHyundai },
      { keywords: ["toyota", "innova", "fortuner", "glanza", "hycross", "hyryder"], logo: logoToyota },
      { keywords: ["mahindra", "xuv", "bolero", "scorpio", "thar"], logo: logoMahindra },
      { keywords: ["kia", "seltos", "sonet", "carens"], logo: logoKia },
      { keywords: ["land rover", "range rover", "landrover"], logo: logoLandRover },
      { keywords: ["bmw"], logo: logoBMW },
      { keywords: ["audi"], logo: logoAudi },
      { keywords: ["volvo"], logo: logoVolvo },
      { keywords: ["skoda"], logo: logoSkoda },
      { keywords: ["jaguar"], logo: logoJaguar },
      { keywords: ["honda"], logo: logoHonda },
      { keywords: ["nissan"], logo: logoNissan },
    ];

    for (const { keywords, logo } of includeMap) {
      if (keywords.some((keyword) => normalized.includes(keyword))) {
        return logo;
      }
    }

    return "";
  };

  // Fetch brands, hero banners, and FAQs from API
  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        setDataLoading(true);

        // Fetch brands from API (no static fallback)
        try {
          const brandsResponse = await carService.getTopBrands({ limit: 10 });
          const apiBrands = (brandsResponse.success && brandsResponse.data?.brands
            ? brandsResponse.data.brands
            : []
          )
            .map((brand, idx) => {
              const name = (brand.name || brand.brand || brand.model || "").trim();
              const fallbackLogo = resolveBrandLogo(name);
              const rawLogo =
                brand.logo ||
                brand.brandLogo ||
                brand.logoUrl ||
                brand.image ||
                fallbackLogo ||
                "";
              const mappedLogo = getLogoUrl(rawLogo);
              const finalLogo = mappedLogo || fallbackLogo;

              return {
                id: brand._id || brand.id || name || idx,
                name,
                logo: finalLogo,
                fallbackLogo,
              };
            })
            .filter((b) => b.name);

          setBrands(apiBrands);
        } catch (error) {
          console.error('Error fetching brands:', error);
          setBrands([]);
        }

        // Fetch hero banners from API (only text data, image stays static)
        try {
          const bannersResponse = await commonService.getHeroBanners();
          if (bannersResponse.success && bannersResponse.data?.banners?.length > 0) {
            setHeroBanners(
              bannersResponse.data.banners.map((banner) => ({
                gradient: banner.gradient || "",
                title: banner.title || "",
                subtitle: banner.subtitle || "",
                cta: banner.cta || "",
              }))
            );
          } else {
            setHeroBanners([]);
          }
        } catch (error) {
          console.error('Error fetching hero banners:', error);
          setHeroBanners([]);
        }

        // Fetch FAQs from API
        try {
          const faqsResponse = await commonService.getFAQs();
          if (faqsResponse.success && faqsResponse.data?.faqs?.length > 0) {
            setFaqs(faqsResponse.data.faqs);
          } else {
            setFaqs([]);
          }
        } catch (error) {
          console.error('Error fetching FAQs:', error);
          setFaqs([]);
        }

        // Fetch featured car for AVAILABLE section
        try {
          const featuredResponse = await carService.getCars({ 
            limit: 1, 
            featured: true,
            status: 'active',
            isAvailable: true,
          });
          if (featuredResponse.success && featuredResponse.data?.cars?.length > 0) {
            const car = featuredResponse.data.cars[0];
            const transformedCar = transformCarData(car, 0);
            setFeaturedCar(transformedCar);
          } else {
            // Fallback: Get first available car
            const fallbackResponse = await carService.getCars({ 
              limit: 1,
              status: 'active',
              isAvailable: true,
            });
            if (fallbackResponse.success && fallbackResponse.data?.cars?.length > 0) {
              const car = fallbackResponse.data.cars[0];
              const transformedCar = transformCarData(car, 0);
              setFeaturedCar(transformedCar);
            }
          }
        } catch (error) {
          console.error('Error fetching featured car:', error);
        }

        // Fetch promotional banner content
        try {
          const promoResponse = await commonService.getPromotionalBanner();
          if (promoResponse.success && promoResponse.data) {
            setPromotionalBanner({
              title: promoResponse.data.title || "",
              subtitle: promoResponse.data.subtitle || "",
            });
          } else {
            setPromotionalBanner({ title: "", subtitle: "" });
          }
        } catch (error) {
          console.error('Error fetching promotional banner:', error);
          setPromotionalBanner({ title: "", subtitle: "" });
        }

        // Fetch banner overlay text
        try {
          const overlayResponse = await commonService.getBannerOverlay();
          if (overlayResponse.success && overlayResponse.data) {
            setBannerOverlay({
              title: overlayResponse.data.title || "",
              subtitle: overlayResponse.data.subtitle || "",
            });
          } else {
            setBannerOverlay({ title: "", subtitle: "" });
          }
        } catch (error) {
          console.error('Error fetching banner overlay:', error);
          setBannerOverlay({ title: "", subtitle: "" });
        }
      } finally {
        setDataLoading(false);
      }
    };

    fetchDynamicData();
  }, []);

  // Auto-rotate hero banner using dynamic heroBanners
  useEffect(() => {
    if (!heroBanners.length) return;

    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) =>
        prevIndex + 1 < heroBanners.length ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroBanners]);

  const currentHero = heroBanners[currentHeroIndex] || {};
  const heroTitle = currentHero.title || "";
  const heroSubtitle = currentHero.subtitle || "";
  const heroCta = currentHero.cta || "";
  const heroGradient = currentHero.gradient || colors.backgroundPrimary;

  // Fallback car images
  const fallbackCarImages = [carImg1, carImg6, carImg8, carImg4, carImg5];

  // Transform API car data to CarCard format
  const transformCarData = (car, index = 0) => {
    if (!car) return null;
    
    // Extract all images from images array (same as admin side)
    let carImages = [];
    let carImage = fallbackCarImages[index % fallbackCarImages.length];
    
    if (car.images && Array.isArray(car.images) && car.images.length > 0) {
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
      const primaryImage = car.images.find(img => img.isPrimary);
      carImage = primaryImage ? (primaryImage.url || primaryImage.path || primaryImage) : (carImages[0] || carImage);
    } else if (car.primaryImage) {
      carImage = car.primaryImage;
      carImages = [car.primaryImage];
    } else {
      carImages = [carImage];
    }
    
    // Return all images (same as admin side)
    return {
      id: car._id || car.id,
      name: `${car.brand} ${car.model}`,
      brand: car.brand,
      model: car.model,
      image: carImage,
      images: carImages, // All images array (same as admin side)
      rating: car.averageRating ? car.averageRating.toFixed(1) : "5.0",
      location: car.location?.city || car.location?.address || "Location TBD",
      seats: car.seatingCapacity || car.seats || 5,
      price: car.pricePerDay || 0,
      pricePerDay: car.pricePerDay || 0,
    };
  };

  // Fetch latest cars from API
  useEffect(() => {
    const fetchLatestCars = async () => {
      try {
        setCarsLoading(true);
        
        // Fetch latest cars sorted by createdAt (descending)
        const response = await carService.getCars({
          limit: 5,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          status: 'active',
          isAvailable: true,
        });

        if (response.success && response.data?.cars) {
          const cars = response.data.cars;
          
          // Best Cars - First 2 latest cars
          const bestCarsData = cars.slice(0, 2).map((car, index) => transformCarData(car, index));
          setBestCars(bestCarsData);
          
          // Nearby Cars - Next 3 cars
          const nearbyCarsData = cars.slice(2, 5).map((car, index) => transformCarData(car, index + 2));
          setNearbyCars(nearbyCarsData);
        }
      } catch (error) {
        console.error('Error fetching latest cars:', error);
        // Keep empty arrays on error - will show nothing instead of hardcoded data
      } finally {
        setCarsLoading(false);
      }
    };

    fetchLatestCars();
  }, []);

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ backgroundColor: colors.backgroundPrimary }}
    >
      {/* Header - Only visible on mobile - Sticky at top */}
      <div className="md:hidden">
        <Header onHeightChange={setHeaderHeight} />
      </div>

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

      {/* Web Hero Section - Only visible on web */}
      <div className="hidden md:block relative w-full">
        {/* Hero Content Section - Static single slide */}
        <div
          className="hero relative w-full px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 transition-all duration-500 ease-in-out"
          style={{
            minHeight: "100vh",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            paddingTop: "24px",
            paddingBottom: "24px",
            background: heroGradient,
            transition: "background 500ms ease",
          }}
        >
          {/* Content Container */}
          <div className="max-w-7xl mx-auto relative flex-1 flex items-center w-full gap-4 md:gap-6 lg:gap-8 xl:gap-12 2xl:gap-16">
            {/* Left Side - Text Content */}
            <div className="hero-content flex-1 z-10">
              {/* Main Headline */}
              <h1
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-2 md:mb-3 lg:mb-4 leading-tight transition-all duration-1000 ease-in-out"
                style={{
                  animation: "fadeInUp 1s ease-in-out",
                }}
              >
                {heroTitle && (
                  <>
                    <span style={{ color: "#21292b" }}>
                      {heroTitle.split(" ")[0]}
                    </span>{" "}
                    <span style={{ color: colors.textPrimary }}>
                      {heroTitle.split(" ").slice(1).join(" ")}
                    </span>
                  </>
                )}
                {heroSubtitle && (
                  <>
                    <br />
                    <span style={{ color: colors.textPrimary }}>
                      {heroSubtitle}
                    </span>
                  </>
                )}
              </h1>

              {/* Call to Action */}
              {heroCta && (
                <div
                  className="flex items-center gap-2 md:gap-3 mt-3 md:mt-4 lg:mt-5 mb-4 md:mb-6 transition-all duration-1000 ease-in-out"
                  style={{
                    animation: "fadeInUp 1s ease-in-out",
                  }}
                >
                  <span
                    className="text-base md:text-lg lg:text-xl xl:text-2xl font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    {heroCta}
                  </span>
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: colors.textPrimary }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 13h14M5 13l-1-4h16l-1 4M5 13v6a1 1 0 001 1h12a1 1 0 001-1v-6M9 9V7a2 2 0 012-2h2a2 2 0 012 2v2"
                    />
                    <circle cx="7" cy="17" r="1.5" fill="currentColor" />
                    <circle cx="17" cy="17" r="1.5" fill="currentColor" />
                  </svg>
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: colors.borderMedium }}
                  />
                </div>
              )}
            </div>

            {/* Right Side - Car Image (Static Audi image as requested) */}
            <div className="flex-1 flex items-center justify-center h-full relative min-w-0">
              <img
                src={heroImage}
                alt="Hero Car"
                loading="eager"
                style={{
                  width: "100%",
                  maxWidth: "900px",
                  height: "auto",
                  maxHeight: "420px",
                  marginBottom: "16px",
                  objectFit: "contain",
                  transformOrigin: "center bottom",
                  filter: "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))",
                  animation: "fadeInUp 1s ease-in-out",
                }}
                draggable={false}
              />
            </div>
          </div>

                 {/* Search Bar Section - Positioned at bottom of hero section */}
                 <div
                   className="w-full px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pb-2 -mt-0"
                   onClick={(e) => e.stopPropagation()}
                 >
                   <div className="max-w-7xl mx-auto mb-24">
                    {/* Search Form */}
                    <div
                      className="booking-card flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 lg:gap-4 bg-white rounded-xl p-3 md:p-4 lg:p-5 shadow-lg"
                      style={{
                        border: `1px solid ${colors.borderMedium}`,
                        position: "relative",
                        zIndex: 40,
                      }}
                    >
                      {/* Trip Start Date */}
                      <div className="flex-1 relative">
                        <label
                          className="block text-xs md:text-sm font-medium mb-0.5 md:mb-1"
                          style={{ color: colors.textSecondary }}
                        >
                          Trip Start Date
                        </label>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openCalendar("pickup")}
                            className="flex-1 text-xs md:text-sm lg:text-base text-left outline-none py-0.5 md:py-1"
                            style={{
                              color: pickupDate
                                ? colors.textPrimary
                                : colors.textTertiary,
                            }}
                          >
                            {pickupDate ? formatDateDisplay(pickupDate) : "dd-mm-yyyy"}
                          </button>
                          <svg
                            className="w-3.5 h-3.5 md:w-4 md:h-4 cursor-pointer flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: colors.textSecondary }}
                            onClick={() => openCalendar("pickup")}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Divider */}
                      <div
                        className="hidden md:block w-px h-10 md:h-12 lg:h-14"
                        style={{ backgroundColor: colors.borderMedium }}
                      />

                      {/* Trip Start Time */}
                      <div className="flex-1 relative">
                        <label
                          className="block text-xs md:text-sm font-medium mb-0.5 md:mb-1"
                          style={{ color: colors.textSecondary }}
                        >
                          Trip Start Time
                        </label>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openTimePicker("pickup")}
                            className="flex-1 text-xs md:text-sm lg:text-base text-left outline-none py-0.5 md:py-1"
                            style={{
                              color: pickupTime
                                ? colors.textPrimary
                                : colors.textTertiary,
                            }}
                          >
                            {pickupTime ? formatTimeDisplay(pickupTime) : "hh:mm"}
                          </button>
                          <svg
                            className="w-3.5 h-3.5 md:w-4 md:h-4 cursor-pointer flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: colors.textSecondary }}
                            onClick={() => openTimePicker("pickup")}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Divider */}
                      <div
                        className="hidden md:block w-px h-10 md:h-12 lg:h-14"
                        style={{ backgroundColor: colors.borderMedium }}
                      />

                      {/* Trip End Date */}
                      <div className="flex-1 relative">
                        <label
                          className="block text-xs md:text-sm font-medium mb-0.5 md:mb-1"
                          style={{ color: colors.textSecondary }}
                        >
                          Trip End Date
                        </label>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openCalendar("dropoff")}
                            className="flex-1 text-xs md:text-sm lg:text-base text-left outline-none py-0.5 md:py-1"
                            style={{
                              color: dropoffDate
                                ? colors.textPrimary
                                : colors.textTertiary,
                            }}
                          >
                            {dropoffDate ? formatDateDisplay(dropoffDate) : "dd-mm-yyyy"}
                          </button>
                          <svg
                            className="w-3.5 h-3.5 md:w-4 md:h-4 cursor-pointer flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: colors.textSecondary }}
                            onClick={() => openCalendar("dropoff")}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Divider */}
                      <div
                        className="hidden md:block w-px h-10 md:h-12 lg:h-14"
                        style={{ backgroundColor: colors.borderMedium }}
                      />

                      {/* Trip End Time */}
                      <div className="flex-1 relative">
                        <label
                          className="block text-xs md:text-sm font-medium mb-0.5 md:mb-1"
                          style={{ color: colors.textSecondary }}
                        >
                          Trip End Time
                        </label>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openTimePicker("dropoff")}
                            className="flex-1 text-xs md:text-sm lg:text-base text-left outline-none py-0.5 md:py-1"
                            style={{
                              color: dropoffTime
                                ? colors.textPrimary
                                : colors.textTertiary,
                            }}
                          >
                            {dropoffTime ? formatTimeDisplay(dropoffTime) : "hh:mm"}
                          </button>
                          <svg
                            className="w-3.5 h-3.5 md:w-4 md:h-4 cursor-pointer flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: colors.textSecondary }}
                            onClick={() => openTimePicker("dropoff")}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Search Button */}
                      <button
                        type="button"
                        onClick={() => {
                          // Handle search action here
                          console.log("Search clicked", {
                            pickupDate,
                            dropoffDate,
                          });
                          navigate("/search");
                        }}
                        className="px-4 md:px-6 lg:px-8 py-2 md:py-2.5 lg:py-3 rounded-lg font-semibold text-xs md:text-sm lg:text-base transition-all hover:opacity-90 flex-shrink-0 w-full md:w-auto"
                        style={{
                          backgroundColor: colors.backgroundTertiary,
                          color: colors.textWhite,
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

        {/* White Background Section Below Search Bar */}
        <div
          className="w-full pt-8"
          style={{ backgroundColor: colors.backgroundPrimary }}
        ></div>
      </div>

      {/* Main Content - Web responsive container */}
      <div
        className="px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10 md:pt-0"
        style={{
          paddingTop: `calc(0.5rem + ${headerHeight}px)`,
        }}
      >
        {/* Web container - max-width and centered on larger screens */}
        <div className="max-w-7xl mx-auto">
          {/* Promotional Banner Carousel */}
          <div className="mb-3 md:mb-6 relative overflow-hidden rounded-2xl md:rounded-3xl block md:hidden">
            {bestCars.length > 0 && promotionalBanner.title && (
              <Swiper
                modules={[Pagination, Keyboard, Mousewheel, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                onSwiper={(swiper) => {
                  mobileBannerSwiperRef.current = swiper;
                }}
                pagination={{
                  el: ".mobile-banner-pagination",
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet-custom",
                  bulletActiveClass: "swiper-pagination-bullet-active-custom",
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                keyboard={{ enabled: true }}
                mousewheel={{ forceToAxis: true, sensitivity: 1 }}
                speed={500}
                loop={true}
                className="w-full rounded-2xl md:rounded-3xl overflow-hidden"
                style={{ background: colors.backgroundDark }}
                onClick={() => navigate("/search")}
              >
                {bestCars.map((slide, index) => (
                  <SwiperSlide key={slide.id || index} className="!w-full">
                    <div className="min-w-full flex items-center justify-between px-4 md:px-6 lg:px-8 h-36 md:h-48 lg:h-56">
                      {/* Left Side - Text Content */}
                      <div className="flex-shrink-0 w-1/3 z-10">
                        <h2 className="text-sm md:text-base lg:text-lg font-bold mb-1 text-white whitespace-nowrap">
                          {promotionalBanner.title}
                        </h2>
                        <p className="text-xs md:text-xs lg:text-sm mb-2 md:mb-3 text-white">
                          {promotionalBanner.subtitle}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/search");
                          }}
                          className="px-2 md:px-2.5 py-0.5 md:py-1 rounded-md font-medium text-xs transition-all hover:opacity-90 bg-white text-black border-2 border-white whitespace-nowrap"
                        >
                          Discover More
                        </button>
                      </div>

                      {/* Right Side - Car Image */}
                      <div className="flex-1 flex items-center justify-end h-full relative">
                        <img
                          src={slide.image}
                          alt={`Car ${slide.id || index + 1}`}
                          className="h-full max-h-full w-auto object-contain"
                          style={{
                            maxWidth: "100%",
                            objectFit: "contain",
                            transform: "translateX(15px)",
                          }}
                          draggable={false}
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            {/* Pagination Dots - Outside Banner */}
            <div className="mobile-banner-pagination flex justify-center items-center gap-2 mt-4"></div>

            {/* Custom Pagination Styles */}
            <style>{`
            .swiper-pagination-bullet-custom {
              width: 8px;
              height: 8px;
              background: ${colors.overlayBlackDark};
              opacity: 1;
              margin: 0 4px;
              transition: all 0.3s ease;
              border-radius: 50%;
              cursor: pointer;
              display: inline-block;
            }
            .swiper-pagination-bullet-active-custom {
              background: ${colors.brandBlack};
              width: 10px;
              height: 10px;
            }
          `}</style>
          </div>

          {/* Returning Car Banner - Shows cars returning soon - Mobile Only */}
          <div className="md:hidden">
            <ReturningCarBanner />
          </div>

          {/* Brands Section - Hidden on web view */}
          {brands.length > 0 && (
            <div className="mb-6 md:mb-8 lg:mb-12 xl:mb-16 md:-mt-24 md:hidden">
              <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-black mb-3 md:mb-4 lg:mb-5 xl:mb-6">
                Brands
              </h2>
              <div className="relative overflow-hidden w-full">
                <div className="flex gap-7 md:gap-8 lg:gap-12 xl:gap-16 brands-scroll">
                  {/* First set of brands */}
                  {brands.map((brand) => (
                    <BrandCard
                      key={brand.id}
                      logo={brand.logo}
                      name={brand.name}
                      fallbackLogo={brand.fallbackLogo}
                    />
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {brands.map((brand) => (
                    <BrandCard
                      key={`duplicate-${brand.id}`}
                      logo={brand.logo}
                      name={brand.name}
                      fallbackLogo={brand.fallbackLogo}
                    />
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
            @keyframes fadeInUp {
              0% {
                opacity: 0;
                transform: translateY(20px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .hero {
              transition: background 500ms ease;
            }
            .hero-content {
              max-width: 100%;
            }
            @media (min-width: 768px) {
              .hero-content {
                max-width: 50%;
              }
            }
            @media (min-width: 1024px) {
              .hero-content {
                max-width: 45%;
              }
            }
            @media (min-width: 1280px) {
              .hero-content {
                max-width: 42%;
              }
            }
            @media (min-width: 1536px) {
              .hero-content {
                max-width: 40%;
              }
            }
          `}</style>
            </div>
          )}

          {/* Best Cars Section */}
          <div className="relative">
            {/* Mobile View - White Card Header - Best Cars + Available + View All */}
            <div
              className="px-4 md:px-6 lg:px-8 py-3 md:py-4 -mx-4 md:mx-0 mb-0 md:hidden"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
                marginBottom: "0",
              }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-black">
                  Best Cars
                </h2>
                <button
                  className="text-sm text-gray-500 font-medium"
                  onClick={() => navigate("/search")}
                >
                  View All
                </button>
              </div>
            </div>

            {/* Mobile View - White Rounded Container */}
            <div
              className="rounded-b-3xl p-4 md:p-6 lg:p-8 -mx-4 md:mx-0 overflow-y-auto md:shadow-lg md:hidden"
              style={{
                backgroundColor: colors.backgroundSecondary,
                boxShadow: `0 2px 8px ${colors.shadowLight}`,
                borderTopLeftRadius: "0",
                borderTopRightRadius: "0",
                borderBottomLeftRadius: "24px",
                borderBottomRightRadius: "24px",
                minHeight: "calc(100vh - 240px)",
                paddingTop: "8px",
                paddingBottom: "100px",
                marginBottom: "-80px",
              }}
            >
              {/* Car Cards Grid - 2 columns on mobile */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {bestCars.map((car, index) => (
                  <CarCard key={car.id} car={car} index={index} />
                ))}
              </div>

              {/* Banner Section - Between Best Cars and Nearby - Mobile Only */}
              {featuredCar && (
                <div className="mb-3">
                  {/* Header Above Banner */}
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                        AVAILABLE
                      </h2>
                    </div>
                  </div>

                  {/* Banner Card - Clickable */}
                  <div
                    className="relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
                    style={{ backgroundColor: colors.backgroundSecondary }}
                    onClick={() => navigate(`/car-details/${featuredCar.id}`, { state: { car: featuredCar } })}
                  >
                    {/* Banner Image Carousel - Use featuredCar images */}
                    {featuredCar.images && featuredCar.images.length > 0 ? (
                      <Swiper
                        modules={[Pagination, Keyboard, Mousewheel, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        onSwiper={(swiper) => {
                          bannerCarouselSwiperRef.current = swiper;
                        }}
                        pagination={{
                          el: ".banner-carousel-pagination",
                          clickable: true,
                          renderBullet: (index, className) => {
                            return `<span class="${className}" style="width: 8px; height: 1.5px; background: rgba(255,255,255,0.5); border-radius: 2px; margin: 0 2px; display: inline-block; transition: all 0.3s;"></span>`;
                          },
                        }}
                        autoplay={{
                          delay: 3000,
                          disableOnInteraction: false,
                        }}
                        keyboard={{ enabled: true }}
                        mousewheel={{ forceToAxis: true, sensitivity: 1 }}
                        speed={500}
                        loop={featuredCar.images.length > 1}
                        className="w-full h-40 md:h-44 lg:h-48"
                        onSlideChange={(swiper) => {
                          // Update custom pagination dots
                          const paginationEl = document.querySelector(
                            ".banner-carousel-pagination"
                          );
                          if (paginationEl) {
                            const bullets = paginationEl.querySelectorAll(
                              ".swiper-pagination-bullet"
                            );
                            bullets.forEach((bullet, idx) => {
                              if (idx === swiper.realIndex) {
                                bullet.style.width = "24px";
                                bullet.style.background = "white";
                              } else {
                                bullet.style.width = "8px";
                                bullet.style.background = "rgba(255,255,255,0.5)";
                              }
                            });
                          }
                        }}
                      >
                        {featuredCar.images.map((image, index) => {
                          const imageUrl = typeof image === 'string' ? image : (image?.url || image?.path || image);
                          return (
                            <SwiperSlide key={`featured-${index}`} className="!w-full">
                              <div className="min-w-full h-full relative">
                                <img
                                  src={imageUrl}
                                  alt={`${featuredCar.name} - Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  draggable={false}
                                />
                                {/* Text Overlay */}
                                <div className="absolute inset-0 flex items-center justify-start px-4 md:px-6 lg:px-8 hidden">
                                  <div className="z-10">
                                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2">
                                      {bannerOverlay.title}
                                    </h3>
                                    <p className="text-xs md:text-sm lg:text-base text-white/90">
                                      {bannerOverlay.subtitle}
                                    </p>
                                  </div>
                                </div>
                                {/* Gradient Overlay for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                              </div>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    ) : (
                      // Fallback: Single image if no images array
                      <div className="w-full h-40 md:h-44 lg:h-48 relative">
                        <img
                          src={featuredCar.image}
                          alt={featuredCar.name}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                      </div>
                    )}

                    {/* Long Dots Indicator - Only show if multiple images */}
                    {featuredCar.images && featuredCar.images.length > 1 && (
                      <div className="banner-carousel-pagination absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-20"></div>
                    )}
                  </div>

                {/* Car Info Below Banner - Clickable */}
                {featuredCar && (
                  <div
                    className="mt-3 cursor-pointer"
                    onClick={() => navigate(`/car-details/${featuredCar.id}`, { state: { car: featuredCar } })}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-bold text-black">{featuredCar.name || `${featuredCar.brand} ${featuredCar.model}`}</h3>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-5 h-5"
                          fill={colors.accentOrange}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-base font-semibold text-black">
                          {featuredCar.rating || "5.0"}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Rs. {featuredCar.price || featuredCar.pricePerDay || 800} / day</p>
                  </div>
                )}
                </div>
              )}

              {/* Nearby Section - Mobile Only */}
              <div className="mt-2">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-black">
                    Nearby
                  </h2>
                  <button
                    className="text-sm text-gray-500 font-medium"
                    onClick={() => navigate("/search")}
                  >
                    View All
                  </button>
                </div>

                {/* Nearby Car Card - Horizontal scrollable */}
                <div className="flex gap-3 md:gap-4 lg:gap-5 overflow-x-auto scrollbar-hide -mx-0">
                  {nearbyCars.map((car, index) => (
                    <div
                      key={car.id}
                      className="min-w-[280px] md:min-w-[320px] lg:min-w-[360px] flex-shrink-0"
                    >
                      <CarCard car={car} index={bestCars.length + index} />
                    </div>
                  ))}
                </div>
              </div>
            </div>


            {/* Web View - Best Cars Section (No white card background) */}
            <div className="hidden md:block mb-8 md:mb-12 lg:mb-16 xl:mb-20">
              <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-black">
                  Best Cars
                </h2>
                <button
                  className="text-xs md:text-sm lg:text-base xl:text-lg text-gray-500 font-medium hover:opacity-80 transition-opacity"
                  onClick={() => navigate("/search")}
                >
                  View All
                </button>
              </div>

              {/* Car Cards Grid - 2 on tablet, 2 on desktop, 3 on xl - Wider cards for web view */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                {bestCars.map((car, index) => (
                  <CarCard key={car.id} car={car} index={index} />
                ))}
              </div>
            </div>

            {/* Web View - Nearby Section (No white card background) */}
            <div className="hidden md:block -mt-4 md:-mt-6 lg:-mt-8 xl:-mt-10 mb-8 md:mb-12 lg:mb-16 xl:mb-20">
              <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-black">
                  Nearby
                </h2>
                <button
                  className="text-xs md:text-sm lg:text-base xl:text-lg text-gray-500 font-medium hover:opacity-80 transition-opacity"
                  onClick={() => navigate("/search")}
                >
                  View All
                </button>
              </div>

              {/* Nearby Car Card - Horizontal scrollable */}
              <div className="flex gap-3 md:gap-4 lg:gap-5 xl:gap-6 overflow-x-auto scrollbar-hide -mx-0">
                {nearbyCars.map((car, index) => (
                  <div
                    key={car.id}
                    className="min-w-[280px] md:min-w-[300px] lg:min-w-[320px] xl:min-w-[360px] 2xl:min-w-[400px] flex-shrink-0"
                  >
                    <CarCard car={car} index={bestCars.length + index} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Popup */}
      {isCalendarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100] bg-black/40"
            onClick={() => setIsCalendarOpen(false)}
          />

          {/* Calendar Modal */}
          <div
            className="fixed z-[110] rounded-xl shadow-2xl border p-4"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.borderForm,
              width: "320px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-sm font-semibold"
                style={{ color: colors.textPrimary }}
              >
                {calendarTarget === "pickup" ? "Pick-up Date" : "Drop-off Date"}
              </h3>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="p-1 rounded hover:bg-gray-100"
                style={{ color: colors.textPrimary }}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() =>
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() - 1,
                      1
                    )
                  )
                }
                className="p-1.5 rounded-lg hover:bg-gray-100"
                style={{ color: colors.textPrimary }}
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
              <h4
                className="text-sm font-semibold"
                style={{ color: colors.textPrimary }}
              >
                {calendarMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h4>
              <button
                onClick={() =>
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() + 1,
                      1
                    )
                  )
                }
                className="p-1.5 rounded-lg hover:bg-gray-100"
                style={{ color: colors.textPrimary }}
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

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold py-1"
                  style={{ color: colors.textSecondary }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getCalendarDays().map((date, idx) => {
                if (!date) return <div key={idx}></div>;
                // Format date as YYYY-MM-DD using local timezone to avoid timezone issues
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;
                // Check if this date is selected based on the target (pickup or dropoff)
                const currentSelectedDate = calendarTarget === "pickup" ? pickupDate : dropoffDate;
                const isSelected = currentSelectedDate && dateStr === currentSelectedDate;
                const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                const isCurrentMonth =
                  date.getMonth() === calendarMonth.getMonth();
                const minDate =
                  calendarTarget === "dropoff" && pickupDate
                    ? new Date(pickupDate)
                    : new Date(new Date().setHours(0, 0, 0, 0));
                const isDisabled = date < minDate;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      !isDisabled && isCurrentMonth && handleDateSelect(date)
                    }
                    disabled={isDisabled && !isSelected}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? "text-white"
                        : isDisabled
                        ? "cursor-not-allowed opacity-40"
                        : !isCurrentMonth
                        ? "opacity-40"
                        : "hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? colors.backgroundTertiary
                        : "transparent",
                      color: isSelected
                        ? colors.backgroundSecondary
                        : isDisabled
                        ? colors.borderCheckbox
                        : colors.textPrimary,
                    }}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Time Picker Popup */}
      {isTimePickerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100] bg-black/40"
            onClick={() => setIsTimePickerOpen(false)}
          />

          {/* Time Picker Modal */}
          <div
            className="fixed z-[110] rounded-xl shadow-2xl border p-4"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.borderForm,
              width: "280px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-sm font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Select Time
              </h3>
              <button
                onClick={() => setIsTimePickerOpen(false)}
                className="p-1 rounded hover:bg-gray-100"
                style={{ color: colors.textPrimary }}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Time Selection */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {/* Hour */}
              <div className="flex flex-col items-center">
                <label className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                  Hour
                </label>
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => setSelectedHour(hour)}
                      className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                        selectedHour === hour
                          ? "text-white"
                          : "hover:bg-gray-100"
                      }`}
                      style={{
                        backgroundColor:
                          selectedHour === hour
                            ? colors.backgroundTertiary
                            : "transparent",
                        color:
                          selectedHour === hour
                            ? colors.backgroundSecondary
                            : colors.textPrimary,
                      }}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-2xl font-bold mt-6" style={{ color: colors.textPrimary }}>
                :
              </span>

              {/* Minute */}
              <div className="flex flex-col items-center">
                <label className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                  Minute
                </label>
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => setSelectedMinute(minute)}
                      className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                        selectedMinute === minute
                          ? "text-white"
                          : "hover:bg-gray-100"
                      }`}
                      style={{
                        backgroundColor:
                          selectedMinute === minute
                            ? colors.backgroundTertiary
                            : "transparent",
                        color:
                          selectedMinute === minute
                            ? colors.backgroundSecondary
                            : colors.textPrimary,
                      }}
                    >
                      {String(minute).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>

              {/* AM/PM */}
              <div className="flex flex-col items-center">
                <label className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                  Period
                </label>
                <div className="flex flex-col gap-1">
                  {["am", "pm"].map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                        selectedPeriod === period
                          ? "text-white"
                          : "hover:bg-gray-100"
                      }`}
                      style={{
                        backgroundColor:
                          selectedPeriod === period
                            ? colors.backgroundTertiary
                            : "transparent",
                        color:
                          selectedPeriod === period
                            ? colors.backgroundSecondary
                            : colors.textPrimary,
                      }}
                    >
                      {period.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="button"
              onClick={handleTimeSelect}
              className="w-full py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: colors.backgroundTertiary,
                color: colors.textWhite,
              }}
            >
              Confirm
            </button>
          </div>
        </>
      )}

      {/* Web View Sections - Why Choose DriveOn, FAQ, Download App, Footer - Only visible on web */}
      <div className="hidden md:block w-full">
        {/* Why Choose DriveOn Section - Web View Only */}
        <section className="py-8 md:py-12 lg:py-16 xl:py-20" style={{ backgroundColor: colors.backgroundSecondary }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="text-center mb-8 md:mb-10 lg:mb-12">
              <h2
                className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-2 md:mb-3 lg:mb-4"
                style={{ color: colors.textPrimary }}
              >
                Why Choose DriveOn?
              </h2>
              <p
                className="text-sm md:text-base lg:text-lg xl:text-xl max-w-2xl mx-auto px-2"
                style={{ color: colors.textSecondary }}
              >
                Experience seamless car rental with our trusted platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 lg:gap-8">
              {[
                {
                  icon: (
                    <svg
                      className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
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
                      className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
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
                      className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
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
                      className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
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
                <div
                  key={`feature-${index}`}
                  className="group relative rounded-2xl p-6 md:p-7 lg:p-8 text-center transition-all duration-300 ease-in-out cursor-default"
                  style={{
                    backgroundColor: colors.backgroundPrimary,
                    boxShadow: `0 2px 8px ${colors.shadowLight}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = `0 12px 24px ${colors.shadowLight}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadowLight}`;
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 lg:w-[72px] lg:h-[72px] rounded-xl mb-4 md:mb-5 lg:mb-6 transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${colors.backgroundTertiary}20`,
                        color: colors.backgroundTertiary,
                      }}
                    >
                      {feature.icon}
                    </div>
                    <h3
                      className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 transition-colors duration-300"
                      style={{ color: colors.textPrimary }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-sm md:text-base leading-relaxed transition-colors duration-300"
                      style={{ color: colors.textSecondary }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BannerAd Section - Our Trusted Partners */}
        <BannerAd />

        {/* FAQ Section - Hidden on web view */}
        {faqs.length > 0 && (
          <div
            className="w-full pt-4 md:pt-6 lg:pt-8 xl:pt-10 pb-12 md:pb-16 lg:pb-20 xl:pb-24 md:hidden"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
              <h2
                className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-center mb-6 md:mb-8 lg:mb-10 xl:mb-12"
                style={{ color: colors.textPrimary }}
              >
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="rounded-xl overflow-hidden transition-all duration-200"
                      style={{
                        backgroundColor: colors.backgroundPrimary,
                        border: `1px solid ${
                          isOpen ? colors.textPrimary : colors.borderLight
                        }`,
                        boxShadow: isOpen
                          ? `0 4px 6px ${colors.shadowLight}`
                          : "none",
                      }}
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full flex items-center justify-between p-4 md:p-5 lg:p-6 text-left focus:outline-none transition-colors hover:opacity-90"
                        style={{
                          backgroundColor: isOpen
                            ? colors.backgroundPrimary
                            : "transparent",
                        }}
                      >
                        <h3
                          className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold pr-4 flex-1"
                          style={{ color: colors.textPrimary }}
                        >
                          {faq.question}
                        </h3>
                        <svg
                          className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? "transform rotate-180" : ""
                          }`}
                          style={{ color: colors.textPrimary }}
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
                        <div className="px-4 md:px-5 lg:px-6 pb-4 md:pb-5 lg:pb-6 pt-0">
                          <p
                            className="text-xs md:text-sm lg:text-base leading-relaxed pt-2"
                            style={{ color: colors.textSecondary }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Download App Section */}
        <div
          className="w-full py-8 md:py-12 lg:py-16 xl:py-20 2xl:py-24"
          style={{ backgroundColor: colors.backgroundPrimary }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-12 xl:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <h2
                  className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 md:mb-4 lg:mb-5"
                  style={{ color: colors.textPrimary }}
                >
                  Download Our App
                </h2>
                <p
                  className="text-sm md:text-base lg:text-lg xl:text-xl mb-4 md:mb-5 lg:mb-6"
                  style={{ color: colors.textSecondary }}
                >
                  Get the best car rental experience on the go. Book, manage,
                  and track your rentals with ease.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                  <img
                    src={downloadRemoveBgPreview}
                    alt="Download App"
                    className="max-w-full h-auto object-contain"
                    style={{ maxHeight: "120px" }}
                  />
                </div>
              </div>
              {/* Mobile View Image - Visible on all screen sizes */}
              <div className="flex flex-1 justify-center lg:justify-end items-center mt-6 lg:mt-0">
                <img
                  src={mobileViewImg2}
                  alt="Mobile App Preview"
                  className="max-w-full h-auto object-contain"
                  style={{ maxHeight: "600px" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer
          className="w-full py-8 md:pt-12 md:pb-4 lg:pt-16 lg:pb-6 xl:pt-20 xl:pb-8"
          style={{ backgroundColor: colors.backgroundTertiary }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 xl:gap-12 mb-6 md:mb-8 lg:mb-10">
              {/* Company Info */}
              <div>
                <h3
                  className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4"
                  style={{ color: colors.textWhite }}
                >
                  DriveOn
                </h3>
                <p
                  className="text-xs md:text-sm lg:text-base mb-3 md:mb-4 leading-relaxed"
                  style={{ color: colors.textSecondary }}
                >
                  Your trusted partner for premium car rentals. Experience
                  luxury and convenience at your fingertips.
                </p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: colors.textWhite }}
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: colors.textWhite }}
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: colors.textWhite }}
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4
                  className="text-base md:text-lg lg:text-xl font-semibold mb-3 md:mb-4"
                  style={{ color: colors.textWhite }}
                >
                  Quick Links
                </h4>
                <ul className="space-y-1.5 md:space-y-2">
                  {[
                    "About Us",
                    "How It Works",
                    "Pricing",
                    "Blog",
                    "Careers",
                  ].map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-xs md:text-sm lg:text-base transition-colors hover:opacity-80"
                        style={{ color: colors.textSecondary }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4
                  className="text-base md:text-lg lg:text-xl font-semibold mb-3 md:mb-4"
                  style={{ color: colors.textWhite }}
                >
                  Support
                </h4>
                <ul className="space-y-1.5 md:space-y-2">
                  {[
                    "Help Center",
                    "Contact Us",
                    "FAQs",
                    "Terms & Conditions",
                    "Privacy Policy",
                  ].map((link) => (
                    <li key={link}>
                      {link === "FAQs" ? (
                        <Link
                          to="/faq"
                          className="text-xs md:text-sm lg:text-base transition-colors hover:opacity-80"
                          style={{ color: colors.textSecondary }}
                        >
                          {link}
                        </Link>
                      ) : link === "Privacy Policy" ? (
                        <Link
                          to="/privacy-policy"
                          className="text-xs md:text-sm lg:text-base transition-colors hover:opacity-80"
                          style={{ color: colors.textSecondary }}
                        >
                          {link}
                        </Link>
                      ) : link === "Terms & Conditions" ? (
                        <Link
                          to="/terms"
                          className="text-xs md:text-sm lg:text-base transition-colors hover:opacity-80"
                          style={{ color: colors.textSecondary }}
                        >
                          {link}
                        </Link>
                      ) : (
                        <a
                          href="#"
                          className="text-xs md:text-sm lg:text-base transition-colors hover:opacity-80"
                          style={{ color: colors.textSecondary }}
                        >
                          {link}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4
                  className="text-base md:text-lg lg:text-xl font-semibold mb-3 md:mb-4"
                  style={{ color: colors.textWhite }}
                >
                  Contact
                </h4>
                <ul className="space-y-2 md:space-y-3">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: colors.textSecondary }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span
                      className="text-xs md:text-sm lg:text-base"
                      style={{ color: colors.textSecondary }}
                    >
                      support@driveon.com
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: colors.textSecondary }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span
                      className="text-xs md:text-sm lg:text-base"
                      style={{ color: colors.textSecondary }}
                    >
                      +1 (555) 123-4567
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: colors.textSecondary }}
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
                    <span
                      className="text-xs md:text-sm lg:text-base"
                      style={{ color: colors.textSecondary }}
                    >
                      123 Main Street, City, State 12345
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div
              className="pt-6 md:pt-8 md:pb-0 border-t"
              style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <p
                className="text-center text-xs md:text-sm lg:text-base md:mb-0"
                style={{ color: colors.textSecondary }}
              >
                © {new Date().getFullYear()} DriveOn. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Bottom Navbar - Overlay on top of container - Hidden on web */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default HomePage;
