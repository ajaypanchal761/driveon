import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import razorpayService from "../../services/razorpay.service";
import bookingService from "../../services/booking.service";
import { userService } from "../../services/user.service";
import { useAppSelector } from "../../hooks/redux";
import CarDetailsHeader from "../components/layout/CarDetailsHeader";
import BookingConfirmationModal from "../components/common/BookingConfirmationModal";
import CustomSelect from "../components/common/CustomSelect";
import { colors } from "../theme/colors";
import { motion } from "framer-motion";
import { getAddOnServicesPrices, calculateAddOnServicesTotal } from "../../utils/addOnServices";

// Import car images for mock data
import carImg1 from "../../assets/car_img1-removebg-preview.png";
import carImg4 from "../../assets/car_img4-removebg-preview.png";
import carImg5 from "../../assets/car_img5-removebg-preview.png";
import carImg6 from "../../assets/car_img6-removebg-preview.png";
import carImg8 from "../../assets/car_img8.png";

/**
 * Helper function to extract numeric price from price string or number
 */
const extractPrice = (price) => {
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    // Extract number from strings like "Rs. 200" or "200" or "Rs.200"
    const match = price.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
  return 0;
};

/**
 * BookNowPage Component
 * Premium booking page for car rental
 * Based on document.txt requirements with premium UI design
 */
const BookNowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => ({
    isAuthenticated: state.auth?.isAuthenticated,
    user: state.auth?.user || state.user?.user || state.user,
  }));

  // Get car data from navigation state, session cache, or use mock data as fallback
  const getCarData = () => {
    // First, try to get car from navigation state (when coming from search or car details)
    if (location.state?.car) {
      const stateCar = location.state.car;
      return {
        id: stateCar.id || stateCar._id || id,
        name:
          stateCar.name ||
          `${stateCar.brand || ""} ${stateCar.model || ""}`.trim(),
        brand: stateCar.brand,
        model: stateCar.model,
        image: stateCar.image || stateCar.images?.[0] || carImg1,
        images: stateCar.images || [stateCar.image || carImg1],
        price: extractPrice(stateCar.price || stateCar.pricePerDay || 0),
        pricePerDay: extractPrice(stateCar.pricePerDay || stateCar.price || 0),
        seats: stateCar.seats || 4,
        transmission: stateCar.transmission || "Automatic",
        fuelType: stateCar.fuelType || "Petrol",
        rating: stateCar.rating || stateCar.averageRating || 5.0,
        location: stateCar.location || "Location",
      };
    }

    // Next, try to get cached car from sessionStorage (set in CarCard/CarDetails)
    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem("driveon:selectedCar");
        if (raw) {
          const cached = JSON.parse(raw);
          const matchesRoute =
            cached && (cached.id === id || cached._id === id);
          if (cached && (matchesRoute || !id)) {
            return {
              id: cached.id || cached._id || id,
              name:
                cached.name ||
                `${cached.brand || ""} ${cached.model || ""}`.trim(),
              brand: cached.brand,
              model: cached.model,
              image: cached.image || cached.images?.[0] || carImg1,
              images: cached.images || [cached.image || carImg1],
              price: extractPrice(cached.price || cached.pricePerDay || 0),
              pricePerDay: extractPrice(
                cached.pricePerDay || cached.price || 0
              ),
              seats: cached.seats || 4,
              transmission: cached.transmission || "Automatic",
              fuelType: cached.fuelType || "Petrol",
              rating: cached.rating || cached.averageRating || 5.0,
              location: cached.location || "Location",
            };
          }
        }
      } catch (err) {
        // ignore cache errors
      }
    }

    // Fallback to mock data if no state car
    const cars = {
      1: {
        id: 1,
        name: "Ferrari-FF",
        image: carImg1,
        price: 200,
        seats: 4,
        transmission: "Automatic",
        fuelType: "Petrol",
        rating: 5.0,
        location: "Washington DC",
      },
      2: {
        id: 2,
        name: "Tesla Model S",
        image: carImg6,
        price: 100,
        seats: 5,
        transmission: "Automatic",
        fuelType: "Electric",
        rating: 5.0,
        location: "Chicago, USA",
      },
      3: {
        id: 3,
        name: "BMW",
        image: carImg8,
        price: 150,
        seats: 5,
        transmission: "Automatic",
        fuelType: "Petrol",
        rating: 5.0,
        location: "New York",
      },
      4: {
        id: 4,
        name: "Lamborghini Aventador",
        image: carImg4,
        price: 250,
        seats: 2,
        transmission: "Automatic",
        fuelType: "Petrol",
        rating: 4.9,
        location: "New York",
      },
      5: {
        id: 5,
        name: "BMW GTS3 M2",
        image: carImg5,
        price: 150,
        seats: 5,
        transmission: "Automatic",
        fuelType: "Petrol",
        rating: 5.0,
        location: "Los Angeles",
      },
    };
    return cars[id] || cars["1"];
  };

  const car = getCarData();

  // Page load animation state - animations trigger only once on mount
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations on page load
    setIsPageLoaded(true);
  }, []);

  // Form state
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [dropTime, setDropTime] = useState("");

  // Auto-fill dates from location state (when navigating from car details or search filter)
  useEffect(() => {
    if (location.state) {
      // Check for dates from navigation state
      if (location.state.pickupDate) {
        setPickupDate(location.state.pickupDate);
      }
      if (location.state.pickupTime) {
        setPickupTime(location.state.pickupTime);
      }
      if (location.state.dropDate) {
        setDropDate(location.state.dropDate);
      }
      if (location.state.dropTime) {
        setDropTime(location.state.dropTime);
      }
    }

    // Also check localStorage for dates (in case dates were selected in filter)
    // This allows dates to persist across navigation
    try {
      const storedDates = localStorage.getItem("selectedBookingDates");
      if (storedDates) {
        const dates = JSON.parse(storedDates);
        if (dates.pickupDate && !location.state?.pickupDate) {
          setPickupDate(dates.pickupDate);
        }
        if (dates.pickupTime && !location.state?.pickupTime) {
          setPickupTime(dates.pickupTime);
        }
        if (dates.dropDate && !location.state?.dropDate) {
          setDropDate(dates.dropDate);
        }
        if (dates.dropTime && !location.state?.dropTime) {
          setDropTime(dates.dropTime);
        }
      }
    } catch (error) {
      console.error("Error reading dates from localStorage:", error);
    }
  }, [location.state]);
  const [paymentOption, setPaymentOption] = useState("advance"); // Only 'advance' option available
  const [specialRequests, setSpecialRequests] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [bookingPurpose, setBookingPurpose] = useState(""); // 'job', 'business', 'student'
  const [isPersonal, setIsPersonal] = useState(false); // Separate checkbox for personal
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
  });
  const [currentAddress, setCurrentAddress] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  const [businessDetails, setBusinessDetails] = useState("");
  const [studentId, setStudentId] = useState("");
  const [documentPhoto, setDocumentPhoto] = useState(null);
  const [documentPhotoPreview, setDocumentPhotoPreview] = useState(null);

  // Fetch user profile and auto-fill personal details
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await userService.getProfile();
        const userProfile = response?.data?.user || response?.user || user;

        if (userProfile) {
          // Auto-fill personal details from user profile
          setPersonalDetails((prev) => ({
            name: userProfile.name || userProfile.fullName || prev.name || "",
            phone:
              userProfile.phone ||
              userProfile.mobile ||
              userProfile.phoneNumber ||
              prev.phone ||
              "",
            email: userProfile.email || prev.email || "",
            age: userProfile.age ? String(userProfile.age) : prev.age || "",
            gender: userProfile.gender || prev.gender || "",
          }));

          // Auto-fill current address if available
          if (userProfile.address) {
            setCurrentAddress(userProfile.address);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback to Redux user data if API fails
        if (user) {
          setPersonalDetails((prev) => ({
            name: user.name || user.fullName || prev.name || "",
            phone:
              user.phone || user.mobile || user.phoneNumber || prev.phone || "",
            email: user.email || prev.email || "",
            age: user.age ? String(user.age) : prev.age || "",
            gender: user.gender || prev.gender || "",
          }));
          if (user.address) {
            setCurrentAddress(user.address);
          }
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user]);
  // Add-on services with quantities
  const [addOnServices, setAddOnServices] = useState({
    driver: 0,
    bodyguard: 0,
    gunmen: 0,
    bouncer: 0,
  });
  const [addOnServicesPrices, setAddOnServicesPrices] = useState({
    driver: 500,
    bodyguard: 1000,
    gunmen: 1500,
    bouncer: 800,
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitWarning, setSubmitWarning] = useState("");

  // Load add-on services prices
  useEffect(() => {
    const prices = getAddOnServicesPrices();
    setAddOnServicesPrices(prices);
    
    // Listen for storage changes (when admin updates prices)
    const handleStorageChange = (e) => {
      if (e.key === 'addon_services_prices') {
        const newPrices = getAddOnServicesPrices();
        setAddOnServicesPrices(newPrices);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically (for same-tab updates)
    const interval = setInterval(() => {
      const currentPrices = getAddOnServicesPrices();
      setAddOnServicesPrices(currentPrices);
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Booking confirmation modal state (shown after successful Razorpay payment)
  const [showBookingConfirmationModal, setShowBookingConfirmationModal] =
    useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState(null);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // Combined date-time picker modal state
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const [dateTimePickerTarget, setDateTimePickerTarget] = useState(null); // 'pickup' or 'drop'
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState(30);
  const [selectedPeriod, setSelectedPeriod] = useState("am");

  // Time picker modal state (for editing time when clicking clock icon)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  // Helper: Convert date string (YYYY-MM-DD) to Date object in local timezone
  // Use noon (12:00) to avoid timezone shift issues
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const day = parseInt(parts[2], 10);
      // Create date at noon to avoid timezone shift issues
      return new Date(year, month, day, 12, 0, 0);
    }
    return null;
  };

  // Helper: Convert Date object to date string (YYYY-MM-DD) in local timezone
  const formatLocalDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper: format time as HH:mm (24h) from Date
  const formatLocalTime = (date) => {
    if (!date) return "";
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  // Helper: basic ObjectId validation
  const isValidObjectId = (val) => /^[0-9a-fA-F]{24}$/.test(val || "");

  // Calculate dynamic price based on document.txt requirements
  const calculatePrice = () => {
    if (!pickupDate || !dropDate || !car) {
      return {
        basePrice: 0,
        totalDays: 0,
        totalPrice: 0,
        advancePayment: 0,
        remainingPayment: 0,
        discount: 0,
        finalPrice: 0,
      };
    }

    // Parse dates in local timezone to avoid timezone shift
    const pickup = parseLocalDate(pickupDate) || new Date();
    const drop = parseLocalDate(dropDate) || new Date();
    const diffTime = Math.abs(drop - pickup);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Extract numeric price (handles both number and string formats)
    const basePrice = extractPrice(car.price || car.pricePerDay || 0);
    let totalPrice = basePrice * totalDays;

    // Apply dynamic pricing multipliers (from document.txt)
    const dayOfWeek = pickup.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendMultiplier = isWeekend ? 1.2 : 1.0; // 20% increase on weekends

    totalPrice = totalPrice * weekendMultiplier;

    // Apply coupon discount if available
    const discount = couponDiscount || 0;
    const finalPrice = Math.max(0, totalPrice - discount);

    // Payment options
    const advancePayment = Math.round(finalPrice * 0.35); // 35% advance
    const remainingPayment = finalPrice - advancePayment;

    return {
      basePrice,
      totalDays,
      totalPrice: Math.round(totalPrice),
      discount: Math.round(discount),
      finalPrice: Math.round(finalPrice),
      advancePayment,
      remainingPayment: Math.round(remainingPayment),
    };
  };

  const priceDetails = calculatePrice();

  // Get minimum date (today) - using local timezone
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Combined date-time picker helpers
  const openDateTimePicker = (target) => {
    setDateTimePickerTarget(target);

    // Set date
    const existingDate = target === "pickup" ? pickupDate : dropDate;
    let baseDate;
    if (existingDate) {
      baseDate = parseLocalDate(existingDate);
      if (!baseDate) baseDate = new Date();
    } else if (target === "drop" && pickupDate) {
      baseDate = parseLocalDate(pickupDate);
      if (!baseDate) baseDate = new Date();
    } else {
      baseDate = new Date();
    }
    setCalendarMonth(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));
    setCalendarSelectedDate(baseDate);

    // Set time
    const existingTime = target === "pickup" ? pickupTime : dropTime;
    if (existingTime) {
      const [hour, minute] = existingTime.split(":").map(Number);
      if (hour >= 12) {
        setSelectedPeriod("pm");
        setSelectedHour(hour === 12 ? 12 : hour - 12);
      } else {
        setSelectedPeriod("am");
        setSelectedHour(hour === 0 ? 12 : hour);
      }
      setSelectedMinute(minute || 0);
    } else {
      setSelectedHour(10);
      setSelectedMinute(30);
      setSelectedPeriod("am");
    }

    setIsDateTimePickerOpen(true);
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "Select Date";
    // Parse date string directly to avoid timezone issues
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const day = parseInt(parts[2], 10);
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${String(day).padStart(2, "0")} ${monthNames[month]} ${year}`;
    }
    // Fallback for other formats
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("default", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i += 1) {
      days.push(null);
    }
    // Create dates at noon (12:00) to avoid timezone shift issues
    // This ensures the date stays the same regardless of timezone
    for (let d = 1; d <= daysInMonth; d += 1) {
      days.push(new Date(year, month, d, 12, 0, 0));
    }
    return days;
  };

  const formatDisplayTime = (timeStr) => {
    if (!timeStr) return "Select Time";
    const [hour, minute] = timeStr.split(":").map(Number);
    const period = hour >= 12 ? "pm" : "am";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  const handleDateTimePickerDone = () => {
    if (!dateTimePickerTarget) {
      setIsDateTimePickerOpen(false);
      return;
    }

    // Save date
    if (calendarSelectedDate) {
      // Use local date components instead of toISOString to avoid timezone shift
      const dateStr = formatLocalDate(calendarSelectedDate);
      if (dateTimePickerTarget === "pickup") {
        setPickupDate(dateStr);
        // Compare dates properly
        if (dropDate) {
          const dropDateObj = parseLocalDate(dropDate);
          if (dropDateObj && dropDateObj < calendarSelectedDate) {
            setDropDate("");
          }
        }
      } else if (dateTimePickerTarget === "drop") {
        setDropDate(dateStr);
      }
    }

    // Save time
    let hour24 = selectedHour;
    if (selectedPeriod === "pm" && selectedHour !== 12) {
      hour24 = selectedHour + 12;
    } else if (selectedPeriod === "am" && selectedHour === 12) {
      hour24 = 0;
    }

    const timeStr = `${hour24.toString().padStart(2, "0")}:${selectedMinute
      .toString()
      .padStart(2, "0")}`;

    if (dateTimePickerTarget === "pickup") {
      setPickupTime(timeStr);
    } else if (dateTimePickerTarget === "drop") {
      setDropTime(timeStr);
    }

    setIsDateTimePickerOpen(false);
  };

  // Handle coupon application (mock for now)
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      alert("Please enter a coupon code");
      return;
    }

    // Mock coupon validation
    if (couponCode.toUpperCase() === "SAVE10") {
      const discount = priceDetails.totalPrice * 0.1; // 10% discount
      setAppliedCoupon({ code: "SAVE10", discount: discount });
      setCouponDiscount(discount);
      alert("Coupon applied successfully!");
    } else {
      alert("Invalid coupon code");
      setAppliedCoupon(null);
      setCouponDiscount(0);
    }
  };

  // Handle form submission with backend + Razorpay
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    setSubmitWarning("");

    // Helper: build a local Date object from date (YYYY-MM-DD) and time (HH:mm)
    const buildLocalDateTime = (dateStr, timeStr) => {
      if (!dateStr) return null;
      const base = parseLocalDate(dateStr) || new Date(dateStr);
      const [h = "0", m = "0"] = (timeStr || "00:00").split(":");
      base.setHours(parseInt(h, 10) || 0, parseInt(m, 10) || 0, 0, 0);
      return base;
    };

    const now = new Date();
    now.setSeconds(0, 0);
    let startDateObj = buildLocalDateTime(pickupDate, pickupTime);
    let endDateObj = buildLocalDateTime(dropDate, dropTime);

    if (!pickupDate || !dropDate || !pickupTime || !dropTime) {
      alert("Please select pickup and drop date & time");
      setSubmitWarning("Pickup and drop date/time are required.");
      return;
    }

    if (!startDateObj || !endDateObj) {
      alert("Please select valid pickup and drop date & time");
      setSubmitWarning("Invalid pickup/drop date or time.");
      return;
    }

    let adjusted = false;

    if (startDateObj < now) {
      // Auto-adjust pickup to next 30 minutes
      const adjustedStart = new Date(now.getTime() + 30 * 60 * 1000);
      startDateObj = adjustedStart;
      adjusted = true;
    }

    if (endDateObj <= startDateObj) {
      // Ensure drop is at least 2 hours after pickup
      const adjustedEnd = new Date(startDateObj.getTime() + 2 * 60 * 60 * 1000);
      endDateObj = adjustedEnd;
      adjusted = true;
    }

    if (adjusted) {
      const newPickupDate = formatLocalDate(startDateObj);
      const newPickupTime = formatLocalTime(startDateObj);
      const newDropDate = formatLocalDate(endDateObj);
      const newDropTime = formatLocalTime(endDateObj);

      setPickupDate(newPickupDate);
      setPickupTime(newPickupTime);
      setDropDate(newDropDate);
      setDropTime(newDropTime);

      alert(
        "Pickup or drop time was in the past/invalid. We've adjusted it to the next available time."
      );
    }

    if (!agreeToTerms) {
      alert("Please agree to terms and conditions");
      setSubmitWarning("You must accept Terms & Conditions to continue.");
      return;
    }

    // Ensure user is logged in before proceeding to payment
    if (!isAuthenticated) {
      alert("Please login to continue with payment");
      navigate("/login");
      return;
    }

    // Validate Additional Details section (now mandatory)
    if (!currentAddress || !currentAddress.trim()) {
      alert("Please enter your current address");
      return;
    }

    // At least one mode must be selected: Personal OR specific purpose
    if (!isPersonal && !bookingPurpose) {
      alert(
        "Please select Personal or a booking purpose (Job/Business/Student)"
      );
      return;
    }

    // If Personal is selected, all personal details are required
    if (isPersonal) {
      const { name, phone, email, age, gender } = personalDetails;
      if (!name.trim() || !phone.trim() || !email.trim() || !age || !gender) {
        alert(
          "Please fill all Personal Details (Name, Phone, Email, Age, Gender)"
        );
        return;
      }
    }

    // If a specific purpose is selected (Job/Business/Student), validate its fields
    if (!isPersonal && bookingPurpose) {
      if (bookingPurpose === "job") {
        if (!jobDetails.trim()) {
          alert("Please enter your job details");
          return;
        }
        if (!documentPhotoPreview) {
          alert("Please upload your job document photo");
          return;
        }
      }

      if (bookingPurpose === "business") {
        if (!businessDetails.trim()) {
          alert("Please enter your business details");
          return;
        }
        if (!documentPhotoPreview) {
          alert("Please upload your business document photo");
          return;
        }
      }

      if (bookingPurpose === "student") {
        if (!studentId.trim()) {
          alert("Please enter your student ID");
          return;
        }
        if (!documentPhotoPreview) {
          alert("Please upload your student ID / document photo");
          return;
        }
      }
    }

    // Parse car name to extract brand and model
    let brand = car.name;
    let model = "";
    if (car.name.includes("-")) {
      const parts = car.name.split("-");
      brand = parts[0];
      model = parts.slice(1).join(" ");
    } else if (car.name.includes(" ")) {
      const parts = car.name.split(" ");
      brand = parts[0];
      model = parts.slice(1).join(" ");
    }

    const pickupDateStr = formatLocalDate(startDateObj);
    const pickupTimeStr = formatLocalTime(startDateObj);
    const dropDateStr = formatLocalDate(endDateObj);
    const dropTimeStr = formatLocalTime(endDateObj);

    const effectiveCarId = car.id || car._id || id;
    if (!isValidObjectId(effectiveCarId)) {
      alert("This car cannot be booked right now. Please select another car.");
      setSubmitWarning(
        "This demo car cannot be booked. Please choose another car."
      );
      return;
    }

    // Build booking payload for API (use effective adjusted values)
    const bookingPayload = {
      carId: effectiveCarId,
      tripStart: {
        location: car.location || "Pickup location",
        coordinates: {},
        date: pickupDateStr,
        time: pickupTimeStr || "10:00",
      },
      tripEnd: {
        location: car.location || "Drop location",
        coordinates: {},
        date: dropDateStr,
        time: dropTimeStr || "18:00",
      },
      paymentOption: paymentOption || "advance",
      specialRequests: specialRequests || "",
      couponCode: appliedCoupon?.code || null,
      couponDiscount: couponDiscount,
      // Additional details for verification and reporting
      bookingPurpose: isPersonal ? "personal" : bookingPurpose || null,
      personalDetails: isPersonal ? personalDetails : null,
      currentAddress: currentAddress || null,
      jobDetails: bookingPurpose === "job" ? jobDetails : null,
      businessDetails: bookingPurpose === "business" ? businessDetails : null,
      studentId: bookingPurpose === "student" ? studentId : null,
      documentPhoto: documentPhoto ? documentPhotoPreview : null,
      addOnServices,
    };

    const amountToPay =
      paymentOption === "advance"
        ? priceDetails.advancePayment
        : priceDetails.finalPrice;

    setIsProcessing(true);

    try {
      const bookingResponse = await bookingService.createBooking(
        bookingPayload
      );
      const booking = bookingResponse?.data?.booking || bookingResponse?.data;
      const bookingId =
        booking?._id ||
        booking?.id ||
        booking?.bookingId ||
        bookingResponse?.bookingId;

      if (!bookingId) {
        throw new Error("Booking ID missing from server response");
      }

      await razorpayService.processBookingPayment({
        bookingId: bookingId.toString(),
        amount: amountToPay,
        description: `Car booking payment - ${brand} ${model}`.trim(),
        name: user?.name || user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || user?.mobile || user?.phoneNumber || "",
        onSuccess: () => {
          // Build a rich booking payload for the confirmation modal / PDF
          const bookingIdFormatted =
            booking?.bookingId ||
            booking?.bookingNumber ||
            `BK${bookingId.toString().slice(-6).toUpperCase()}`;
          const bookingDataForPdf = {
            // Booking core
            bookingId: bookingIdFormatted,
            _id: bookingId.toString(),
            id: bookingId.toString(),
            createdAt: booking?.createdAt || new Date().toISOString(),

            // Car information
            car: {
              id: car.id || car._id,
              _id: car.id || car._id,
              brand: brand || car.brand,
              model: model || car.model,
              name: car.name || `${brand || car.brand} ${model || car.model}`,
              image: car.image || car.images?.[0] || carImg1,
              images: car.images || (car.image ? [car.image] : [carImg1]),
              seats: car.seats || 4,
              seatingCapacity: car.seats || 4,
              transmission: car.transmission || "Automatic",
              fuelType: car.fuelType || "Petrol",
              registrationNumber: car.registrationNumber,
            },

            // Trip details
            pickupDate: pickupDateStr,
            pickupTime: pickupTimeStr,
            dropDate: dropDateStr,
            dropTime: dropTimeStr,

            // Additional details
            bookingPurpose: bookingPayload.bookingPurpose,
            personalDetails: bookingPayload.personalDetails,
            currentAddress: bookingPayload.currentAddress,
            jobDetails: bookingPayload.jobDetails,
            businessDetails: bookingPayload.businessDetails,
            studentId: bookingPayload.studentId,
            addOnServices: bookingPayload.addOnServices,
            specialRequests: bookingPayload.specialRequests,

            // Pricing details
            totalPrice: priceDetails.totalPrice,
            paidAmount: amountToPay,
            remainingAmount:
              (priceDetails.finalPrice || 0) - (amountToPay || 0),
            couponCode: bookingPayload.couponCode,
            couponDiscount: bookingPayload.couponDiscount,
            paymentOption: bookingPayload.paymentOption,

            // Status information
            status: booking?.status || "pending",
            paymentStatus:
              booking?.paymentStatus ||
              (paymentOption === "advance" ? "partial" : "full"),
            tripStatus: booking?.tripStatus || "pending",
          };

          setIsProcessing(false);

          // Save booking to localStorage so it shows up immediately on bookings page
          try {
            const existingBookings = JSON.parse(
              localStorage.getItem("localBookings") || "[]"
            );
            const newBooking = {
              ...bookingDataForPdf,
              // Ensure all required fields for bookings page
              id: bookingId.toString(),
              _id: bookingId.toString(),
            };
            existingBookings.unshift(newBooking); // Add to beginning
            localStorage.setItem(
              "localBookings",
              JSON.stringify(existingBookings)
            );
            console.log("✅ Booking saved to localStorage");
          } catch (error) {
            console.error("Error saving booking to localStorage:", error);
          }

          // Wait a moment for Razorpay modal to fully close, then show our confirmation modal
          setTimeout(() => {
            console.log("🎉 Showing booking confirmation modal now!");
            setConfirmedBookingId(bookingId.toString());
            setConfirmedBookingData(bookingDataForPdf);
            setShowBookingConfirmationModal(true);
          }, 500); // 500ms delay to ensure Razorpay modal is closed
        },
        onError: (error) => {
          console.error("Payment error:", error);
          setIsProcessing(false);
          if (error?.message === "PAYMENT_CANCELLED") return;
          alert(error?.message || "Payment failed. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error during booking/payment:", error);
      setIsProcessing(false);
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      const friendly =
        serverMessage || "Failed to process booking. Please try again.";
      setSubmitWarning(friendly);
      alert(friendly);
    }
  };

  return (
    <div
      className="min-h-screen w-full relative pb-24 md:pb-8"
      style={{ backgroundColor: colors.backgroundPrimary }}
    >
      {/* Header */}
      <CarDetailsHeader />

      {/* Web container - max-width and centered on larger screens */}
      <div className="max-w-4xl mx-auto">
        {/* Car Summary Card - Premium Design */}
        <div className="px-4 md:px-6 lg:px-8 pt-3 md:pt-6 pb-2 md:pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isPageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-3 shadow-lg border"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.borderMedium,
            }}
          >
            <div className="flex items-center gap-3">
              {car.image && (
                <div className="flex-shrink-0">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-20 h-20 object-contain rounded-lg bg-gray-50 p-1.5"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-bold text-base mb-0.5"
                  style={{ color: colors.textPrimary }}
                >
                  {car.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1.5">
                  <span
                    className="text-lg font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    Rs. {extractPrice(car.price || car.pricePerDay || 0)}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    /day
                  </span>
                </div>
                <div
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  <span
                    className="px-1.5 py-0.5 rounded-md"
                    style={{ backgroundColor: colors.backgroundPrimary }}
                  >
                    {car.seats} Seats
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded-md"
                    style={{ backgroundColor: colors.backgroundPrimary }}
                  >
                    {car.transmission}
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded-md"
                    style={{ backgroundColor: colors.backgroundPrimary }}
                  >
                    {car.fuelType}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 space-y-3 md:space-y-4"
        >
          {/* Date & Time Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isPageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl p-3 shadow-lg"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <h2
              className="text-base font-bold mb-3"
              style={{ color: colors.textPrimary }}
            >
              Pickup & Drop Details
            </h2>

            {/* Pickup Date & Time */}
            <div className="mb-3">
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: colors.textPrimary }}
              >
                Pickup Date & Time
              </label>
              <button
                type="button"
                onClick={() => openDateTimePicker("pickup")}
                className="w-full px-3 py-2.5 rounded-lg border-2 text-left"
                style={{
                  borderColor:
                    pickupDate && pickupTime
                      ? colors.backgroundTertiary
                      : colors.borderMedium,
                  backgroundColor:
                    pickupDate && pickupTime
                      ? colors.backgroundPrimary
                      : colors.backgroundSecondary,
                }}
              >
                <div
                  className="font-semibold text-sm"
                  style={{ color: colors.textPrimary }}
                >
                  {pickupDate && pickupTime
                    ? `${formatDisplayDate(pickupDate)} • ${formatDisplayTime(
                        pickupTime
                      )}`
                    : "Select Date & Time"}
                </div>
              </button>
            </div>

            {/* Drop Date & Time */}
            <div>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: colors.textPrimary }}
              >
                Drop Date & Time
              </label>
              <button
                type="button"
                onClick={() => openDateTimePicker("drop")}
                className="w-full px-3 py-2.5 rounded-lg border-2 text-left"
                style={{
                  borderColor:
                    dropDate && dropTime
                      ? colors.backgroundTertiary
                      : colors.borderMedium,
                  backgroundColor:
                    dropDate && dropTime
                      ? colors.backgroundPrimary
                      : colors.backgroundSecondary,
                }}
              >
                <div
                  className="font-semibold text-sm"
                  style={{ color: colors.textPrimary }}
                >
                  {dropDate && dropTime
                    ? `${formatDisplayDate(dropDate)} • ${formatDisplayTime(
                        dropTime
                      )}`
                    : "Select Date & Time"}
                </div>
              </button>
            </div>
          </motion.div>

          {/* Payment Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isPageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl p-3 shadow-lg"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <h2
              className="text-base font-bold mb-3"
              style={{ color: colors.textPrimary }}
            >
              Payment Option
            </h2>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setPaymentOption("advance")}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  paymentOption === "advance" ? "shadow-md" : ""
                }`}
                style={{
                  borderColor:
                    paymentOption === "advance"
                      ? colors.backgroundTertiary
                      : colors.borderMedium,
                  backgroundColor:
                    paymentOption === "advance"
                      ? colors.backgroundPrimary
                      : colors.backgroundSecondary,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className="font-bold text-sm mb-0.5"
                      style={{ color: colors.textPrimary }}
                    >
                      35% Advance Payment
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      Pay 35% now, rest later
                    </div>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor:
                        paymentOption === "advance"
                          ? colors.backgroundTertiary
                          : colors.borderCheckbox,
                    }}
                  >
                    {paymentOption === "advance" && (
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: colors.backgroundTertiary }}
                      ></div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Coupon Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isPageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl p-3 shadow-lg"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <h2
              className="text-base font-bold mb-3"
              style={{ color: colors.textPrimary }}
            >
              Coupon Code
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                style={{
                  borderColor: colors.borderMedium,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                  maxWidth: "60%",
                }}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-8 py-2 rounded-lg text-white font-semibold text-sm"
                style={{ backgroundColor: colors.backgroundTertiary }}
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <div
                className="mt-2 p-2 rounded-lg"
                style={{ backgroundColor: `${colors.success}20` }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: colors.success }}
                  >
                    {appliedCoupon.code} Applied
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: colors.success }}
                  >
                    -Rs. {couponDiscount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Special Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isPageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl p-3 shadow-lg"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <h2
              className="text-base font-bold mb-3"
              style={{ color: colors.textPrimary }}
            >
              Special Requests
            </h2>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requests or instructions..."
              rows="3"
              className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none resize-none text-sm"
              style={{
                borderColor: colors.borderMedium,
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary,
              }}
            />
          </motion.div>

          {/* Price Summary */}
          {priceDetails.totalDays > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                isPageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: 0.5 }}
              className="rounded-2xl p-4 shadow-xl"
              style={{ backgroundColor: colors.backgroundTertiary }}
            >
              <h2
                className="text-base font-bold mb-3"
                style={{ color: colors.backgroundSecondary }}
              >
                Price Summary
              </h2>
              <div className="space-y-1.5 mb-3">
                <div
                  className="flex justify-between text-sm"
                  style={{ color: colors.backgroundSecondary, opacity: 0.9 }}
                >
                  <span>Base Price ({priceDetails.totalDays} days)</span>
                  <span className="font-semibold">
                    Rs. {priceDetails.totalPrice}
                  </span>
                </div>
                {priceDetails.discount > 0 && (
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: colors.backgroundSecondary, opacity: 0.9 }}
                  >
                    <span>Discount</span>
                    <span
                      className="font-semibold"
                      style={{ color: colors.success }}
                    >
                      -Rs. {priceDetails.discount}
                    </span>
                  </div>
                )}
                <div
                  className="border-t pt-1.5 mt-1.5"
                  style={{ borderColor: colors.overlayWhiteLight }}
                >
                  <div
                    className="flex justify-between font-bold"
                    style={{ color: colors.backgroundSecondary }}
                  >
                    <span className="text-base">Total Amount</span>
                    <span className="text-base">
                      Rs. {priceDetails.finalPrice}
                    </span>
                  </div>
                </div>
                {paymentOption === "advance" && (
                  <div
                    className="mt-2 pt-2 border-t"
                    style={{ borderColor: colors.overlayWhiteLight }}
                  >
                    <div
                      className="flex justify-between mb-0.5 text-xs"
                      style={{
                        color: colors.backgroundSecondary,
                        opacity: 0.9,
                      }}
                    >
                      <span>Advance Payment (35%)</span>
                      <span className="font-semibold">
                        Rs. {priceDetails.advancePayment}
                      </span>
                    </div>
                    <div
                      className="flex justify-between text-xs"
                      style={{
                        color: colors.backgroundSecondary,
                        opacity: 0.9,
                      }}
                    >
                      <span>Remaining Amount</span>
                      <span className="font-semibold">
                        Rs. {priceDetails.remainingPayment}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Additional Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isPageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.55 }}
            className="rounded-2xl p-4 shadow-lg space-y-4"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <h2
              className="text-base font-bold"
              style={{ color: colors.textPrimary }}
            >
              Additional Details
            </h2>

            {/* Personal Purpose Checkbox */}
            <div
              className="flex items-start gap-2 p-3 rounded-lg border-2"
              style={{
                borderColor: colors.borderMedium,
                backgroundColor: colors.backgroundSecondary,
              }}
            >
              <input
                type="checkbox"
                id="personal-purpose"
                checked={isPersonal}
                onChange={(e) => {
                  setIsPersonal(e.target.checked);
                  if (e.target.checked) {
                    // Clear other purpose if personal is selected
                    setBookingPurpose("");
                    setJobDetails("");
                    setBusinessDetails("");
                    setStudentId("");
                    setDocumentPhoto(null);
                    setDocumentPhotoPreview(null);
                  } else {
                    // Clear personal details if unchecked
                    setPersonalDetails({
                      name: "",
                      phone: "",
                      email: "",
                      age: "",
                      gender: "",
                    });
                  }
                }}
                className="mt-0.5 w-4 h-4 rounded border-2"
                style={{
                  borderColor: isPersonal
                    ? colors.backgroundTertiary
                    : colors.borderCheckbox,
                }}
              />
              <label
                htmlFor="personal-purpose"
                className="text-sm font-semibold cursor-pointer"
                style={{ color: colors.textPrimary }}
              >
                Personal
              </label>
            </div>

            {/* Personal Details Fields */}
            {isPersonal && (
              <div
                className="space-y-3 p-3 rounded-lg"
                style={{ backgroundColor: `${colors.backgroundTertiary}10` }}
              >
                <h4
                  className="text-xs font-bold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Personal Details
                </h4>

                {/* Name */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: colors.textPrimary }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    value={personalDetails.name}
                    onChange={(e) =>
                      setPersonalDetails((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter your name"
                    autoComplete="off"
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                    style={{
                      borderColor: colors.borderMedium,
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: colors.textPrimary }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={personalDetails.phone}
                    onChange={(e) =>
                      setPersonalDetails((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="Enter your phone number"
                    autoComplete="off"
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                    style={{
                      borderColor: colors.borderMedium,
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: colors.textPrimary }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={personalDetails.email}
                    onChange={(e) =>
                      setPersonalDetails((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Enter your email"
                    autoComplete="off"
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                    style={{
                      borderColor: colors.borderMedium,
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                {/* Age */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: colors.textPrimary }}
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    value={personalDetails.age}
                    onChange={(e) =>
                      setPersonalDetails((prev) => ({
                        ...prev,
                        age: e.target.value,
                      }))
                    }
                    placeholder="Enter your age"
                    min="18"
                    autoComplete="off"
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                    style={{
                      borderColor: colors.borderMedium,
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: colors.textPrimary }}
                  >
                    Gender
                  </label>
                  <CustomSelect
                    value={personalDetails.gender}
                    onChange={(value) =>
                      setPersonalDetails((prev) => ({ ...prev, gender: value }))
                    }
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                      { label: "Other", value: "other" },
                    ]}
                    placeholder="Select gender"
                  />
                </div>
              </div>
            )}

            {/* Booking Purpose Dropdown (Job, Business, Student only) */}
            <div>
              <CustomSelect
                value={bookingPurpose}
                onChange={(value) => {
                  setBookingPurpose(value);
                  // Clear personal if other purpose is selected
                  if (value) {
                    setIsPersonal(false);
                  }
                  // Reset conditional fields when purpose changes
                  setJobDetails("");
                  setBusinessDetails("");
                  setStudentId("");
                  setDocumentPhoto(null);
                  setDocumentPhotoPreview(null);
                }}
                options={[
                  { label: "Job", value: "job" },
                  { label: "Business", value: "business" },
                  { label: "Student", value: "student" },
                ]}
                placeholder="Select purpose (Job/Business/Student)"
              />
            </div>

            {/* Current Address */}
            <div>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: colors.textPrimary }}
              >
                Current Address
              </label>
              <textarea
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                placeholder="Enter your current address"
                rows="3"
                className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none resize-none text-sm"
                style={{
                  borderColor: colors.borderMedium,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                }}
              />
            </div>

            {/* Conditional Fields based on Purpose */}
            {bookingPurpose === "job" && (
              <div
                className="space-y-3 p-3 rounded-lg"
                style={{ backgroundColor: `${colors.backgroundTertiary}10` }}
              >
                <label
                  className="block text-xs font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  Job Details
                </label>
                <input
                  type="text"
                  value={jobDetails}
                  onChange={(e) => setJobDetails(e.target.value)}
                  placeholder="Enter your job details (e.g., Company name, designation)"
                  className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                  style={{
                    borderColor: colors.borderMedium,
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                  }}
                />
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: colors.textPrimary }}
                  >
                    Job Document Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setDocumentPhoto(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setDocumentPhotoPreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                    style={{
                      borderColor: colors.borderMedium,
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textPrimary,
                    }}
                  />
                  {documentPhotoPreview && (
                    <div className="mt-2">
                      <img
                        src={documentPhotoPreview}
                        alt="Document preview"
                        className="w-32 h-32 object-cover rounded-lg border-2"
                        style={{ borderColor: colors.borderMedium }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setDocumentPhoto(null);
                          setDocumentPhotoPreview(null);
                        }}
                        className="mt-1 text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {bookingPurpose === "business" && (
              <div
                className="space-y-3 p-3 rounded-lg"
                style={{ backgroundColor: `${colors.backgroundTertiary}10` }}
              >
                <label
                  className="block text-xs font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  Business Details
                </label>
                <input
                  type="text"
                  value={businessDetails}
                  onChange={(e) => setBusinessDetails(e.target.value)}
                  placeholder="Enter your business details (e.g., Business name, type)"
                  className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                  style={{
                    borderColor: colors.borderMedium,
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                  }}
                />
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: colors.textPrimary }}
                  >
                    Business Document Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setDocumentPhoto(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setDocumentPhotoPreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                    style={{
                      borderColor: colors.borderMedium,
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textPrimary,
                    }}
                  />
                  {documentPhotoPreview && (
                    <div className="mt-2">
                      <img
                        src={documentPhotoPreview}
                        alt="Document preview"
                        className="w-32 h-32 object-cover rounded-lg border-2"
                        style={{ borderColor: colors.borderMedium }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setDocumentPhoto(null);
                          setDocumentPhotoPreview(null);
                        }}
                        className="mt-1 text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {bookingPurpose === "student" && (
              <div
                className="space-y-3 p-3 rounded-lg"
                style={{ backgroundColor: `${colors.backgroundTertiary}10` }}
              >
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: colors.textPrimary }}
                  >
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter your student ID"
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                    style={{
                      borderColor: colors.borderMedium,
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textPrimary,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: colors.textPrimary }}
                  >
                    Student ID Document Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setDocumentPhoto(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setDocumentPhotoPreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                    style={{
                      borderColor: colors.borderMedium,
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textPrimary,
                    }}
                  />
                  {documentPhotoPreview && (
                    <div className="mt-2">
                      <img
                        src={documentPhotoPreview}
                        alt="Document preview"
                        className="w-32 h-32 object-cover rounded-lg border-2"
                        style={{ borderColor: colors.borderMedium }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setDocumentPhoto(null);
                          setDocumentPhotoPreview(null);
                        }}
                        className="mt-1 text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Add-on Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isPageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.55 }}
            className="rounded-2xl p-3 shadow-lg space-y-3"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <h2
              className="text-base font-bold"
              style={{ color: colors.textPrimary }}
            >
              Add-on Services (Optional)
            </h2>

            <div className="space-y-3">
              {/* Driver */}
              <div
                className="flex items-center justify-between p-3 rounded-lg border-2"
                style={{
                  borderColor: colors.borderMedium,
                  backgroundColor: colors.backgroundSecondary,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${colors.backgroundTertiary}15`,
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: colors.backgroundTertiary }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      Driver
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      Professional driver service
                    </p>
                    <p
                      className="text-xs font-medium mt-0.5"
                      style={{ color: colors.backgroundTertiary }}
                    >
                      ₹{addOnServicesPrices.driver} per unit
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {addOnServices.driver > 0 && (
                    <span
                      className="text-xs font-semibold mr-2"
                      style={{ color: colors.backgroundTertiary }}
                    >
                      ₹{addOnServices.driver * addOnServicesPrices.driver}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setAddOnServices((prev) => ({
                        ...prev,
                        driver: Math.max(0, prev.driver - 1),
                      }))
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center border-2"
                    style={{
                      borderColor: colors.borderMedium,
                      color: colors.textPrimary,
                    }}
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
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span
                    className="w-8 text-center text-sm font-semibold"
                    style={{ color: colors.textPrimary }}
                  >
                    {addOnServices.driver}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setAddOnServices((prev) => ({
                        ...prev,
                        driver: prev.driver + 1,
                      }))
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center border-2"
                    style={{
                      borderColor: colors.borderMedium,
                      color: colors.textPrimary,
                    }}
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Bodyguard */}
              <div
                className="flex items-center justify-between p-3 rounded-lg border-2"
                style={{
                  borderColor: colors.borderMedium,
                  backgroundColor: colors.backgroundSecondary,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${colors.backgroundTertiary}15`,
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: colors.backgroundTertiary }}
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
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      Bodyguard
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      Security personnel
                    </p>
                    <p
                      className="text-xs font-medium mt-0.5"
                      style={{ color: colors.backgroundTertiary }}
                    >
                      ₹{addOnServicesPrices.bodyguard} per unit
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {addOnServices.bodyguard > 0 && (
                    <span
                      className="text-xs font-semibold mr-2"
                      style={{ color: colors.backgroundTertiary }}
                    >
                      ₹{addOnServices.bodyguard * addOnServicesPrices.bodyguard}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setAddOnServices((prev) => ({
                        ...prev,
                        bodyguard: Math.max(0, prev.bodyguard - 1),
                      }))
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center border-2"
                    style={{
                      borderColor: colors.borderMedium,
                      color: colors.textPrimary,
                    }}
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
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span
                    className="w-8 text-center text-sm font-semibold"
                    style={{ color: colors.textPrimary }}
                  >
                    {addOnServices.bodyguard}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setAddOnServices((prev) => ({
                        ...prev,
                        bodyguard: prev.bodyguard + 1,
                      }))
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center border-2"
                    style={{
                      borderColor: colors.borderMedium,
                      color: colors.textPrimary,
                    }}
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Gun men */}
              <div
                className="flex items-center justify-between p-3 rounded-lg border-2"
                style={{
                  borderColor: colors.borderMedium,
                  backgroundColor: colors.backgroundSecondary,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${colors.backgroundTertiary}15`,
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: colors.backgroundTertiary }}
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
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      Gun men
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      Armed security personnel
                    </p>
                    <p
                      className="text-xs font-medium mt-0.5"
                      style={{ color: colors.backgroundTertiary }}
                    >
                      ₹{addOnServicesPrices.gunmen} per unit
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {addOnServices.gunmen > 0 && (
                    <span
                      className="text-xs font-semibold mr-2"
                      style={{ color: colors.backgroundTertiary }}
                    >
                      ₹{addOnServices.gunmen * addOnServicesPrices.gunmen}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setAddOnServices((prev) => ({
                        ...prev,
                        gunmen: Math.max(0, prev.gunmen - 1),
                      }))
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center border-2"
                    style={{
                      borderColor: colors.borderMedium,
                      color: colors.textPrimary,
                    }}
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
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span
                    className="w-8 text-center text-sm font-semibold"
                    style={{ color: colors.textPrimary }}
                  >
                    {addOnServices.gunmen}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setAddOnServices((prev) => ({
                        ...prev,
                        gunmen: prev.gunmen + 1,
                      }))
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center border-2"
                    style={{
                      borderColor: colors.borderMedium,
                      color: colors.textPrimary,
                    }}
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Bouncer */}
              <div
                className="flex items-center justify-between p-3 rounded-lg border-2"
                style={{
                  borderColor: colors.borderMedium,
                  backgroundColor: colors.backgroundSecondary,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${colors.backgroundTertiary}15`,
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: colors.backgroundTertiary }}
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
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      Bouncer
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      Event security personnel
                    </p>
                    <p
                      className="text-xs font-medium mt-0.5"
                      style={{ color: colors.backgroundTertiary }}
                    >
                      ₹{addOnServicesPrices.bouncer} per unit
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {addOnServices.bouncer > 0 && (
                    <span
                      className="text-xs font-semibold mr-2"
                      style={{ color: colors.backgroundTertiary }}
                    >
                      ₹{addOnServices.bouncer * addOnServicesPrices.bouncer}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setAddOnServices((prev) => ({
                        ...prev,
                        bouncer: Math.max(0, prev.bouncer - 1),
                      }))
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center border-2"
                    style={{
                      borderColor: colors.borderMedium,
                      color: colors.textPrimary,
                    }}
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
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span
                    className="w-8 text-center text-sm font-semibold"
                    style={{ color: colors.textPrimary }}
                  >
                    {addOnServices.bouncer}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setAddOnServices((prev) => ({
                        ...prev,
                        bouncer: prev.bouncer + 1,
                      }))
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center border-2"
                    style={{
                      borderColor: colors.borderMedium,
                      color: colors.textPrimary,
                    }}
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Physical Document Verification Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isPageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.55 }}
            className="rounded-2xl p-4 shadow-lg"
            style={{
              backgroundColor: "#FFF3E0",
              border: "1px solid #FFE0B2",
            }}
          >
            <div className="flex items-start gap-3 mb-3">
              {/* Warning Icon */}
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: "#FF9800" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <h3
                  className="text-sm font-bold mb-2"
                  style={{ color: "#333" }}
                >
                  Important: Physical Document Verification Required
                </h3>
                <p
                  className="text-xs leading-relaxed mb-3"
                  style={{ color: "#333" }}
                >
                  Your booking will only be confirmed and finalized when you
                  physically visit our office to complete document verification.
                  This step is mandatory before you can start your trip.
                </p>
                <div className="flex items-start gap-2">
                  {/* Warning Icon */}
                  <svg
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: "#FF9800" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p
                    className="text-xs leading-relaxed font-semibold"
                    style={{ color: "#FF9800" }}
                  >
                    If you fail to complete physical document verification, 30%
                    of the paid amount will be refunded and the booking will be
                    cancelled.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Terms & Conditions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isPageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-start gap-2"
          >
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-2"
              style={{
                borderColor: agreeToTerms
                  ? colors.backgroundTertiary
                  : colors.borderCheckbox,
              }}
            />
            <label
              htmlFor="terms"
              className="text-xs"
              style={{ color: colors.textSecondary }}
            >
              I agree to the{" "}
              <span
                className="font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span
                className="font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Privacy Policy
              </span>
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={
              isPageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.7 }}
            type="submit"
            className="w-full py-3 rounded-xl text-white font-bold text-base shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: colors.backgroundTertiary }}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Proceed to Payment"}
          </motion.button>
          {submitWarning && (
            <p className="mt-3 text-sm text-red-500 text-center">
              {submitWarning}
            </p>
          )}
        </form>
      </div>

      {/* Combined Date-Time Picker Modal */}
      {isDateTimePickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsDateTimePickerOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <div className="p-4">
              {/* Time Selection Button */}
              <div className="mb-4">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Time
                </label>
                {/* Time Button - Clickable to edit time */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTimePickerOpen(true);
                    }}
                    className="w-auto px-4 py-2.5 rounded-xl border-2 flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      borderColor: colors.backgroundTertiary,
                      backgroundColor: colors.backgroundTertiary,
                      color: colors.backgroundSecondary,
                    }}
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
                      {selectedHour.toString().padStart(2, "0")} :{" "}
                      {selectedMinute.toString().padStart(2, "0")}{" "}
                      {selectedPeriod}
                    </span>
                  </button>
                </div>
              </div>

              {/* Calendar */}
              <div className="mb-4">
                <div className="mb-3 flex items-center justify-between">
                  <button
                    onClick={() => {
                      const newMonth = new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth() - 1,
                        1
                      );
                      setCalendarMonth(newMonth);
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100"
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
                    className="text-base font-semibold"
                    style={{ color: colors.textPrimary }}
                  >
                    {calendarMonth.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h4>
                  <button
                    onClick={() => {
                      const newMonth = new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth() + 1,
                        1
                      );
                      setCalendarMonth(newMonth);
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100"
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

                <div className="grid grid-cols-7 gap-1 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-semibold py-1"
                        style={{ color: colors.textSecondary }}
                      >
                        {day}
                      </div>
                    )
                  )}
                  {getCalendarDays().map((date, idx) => {
                    if (!date) return <div key={idx}></div>;
                    // Use local date components for comparison to avoid timezone issues
                    const dateStr = formatLocalDate(date);
                    const dateYear = date.getFullYear();
                    const dateMonth = date.getMonth();
                    const dateDay = date.getDate();

                    // Check if this date is selected - compare using date components
                    let isSelected = false;
                    if (calendarSelectedDate) {
                      const selectedYear = calendarSelectedDate.getFullYear();
                      const selectedMonth = calendarSelectedDate.getMonth();
                      const selectedDay = calendarSelectedDate.getDate();
                      isSelected =
                        dateYear === selectedYear &&
                        dateMonth === selectedMonth &&
                        dateDay === selectedDay;
                    }

                    // Check if date is in the past (compare dates, not times)
                    const today = new Date();
                    const todayYear = today.getFullYear();
                    const todayMonth = today.getMonth();
                    const todayDay = today.getDate();
                    const isPast =
                      dateYear < todayYear ||
                      (dateYear === todayYear && dateMonth < todayMonth) ||
                      (dateYear === todayYear &&
                        dateMonth === todayMonth &&
                        dateDay < todayDay);
                    const isMinDate = dateStr === getMinDate();
                    const isCurrentMonth =
                      dateMonth === calendarMonth.getMonth();

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!isPast && isCurrentMonth) {
                            // Ensure date is at noon to avoid timezone issues
                            const selectedDate = new Date(
                              dateYear,
                              dateMonth,
                              dateDay,
                              12,
                              0,
                              0
                            );
                            setCalendarSelectedDate(selectedDate);
                          }
                        }}
                        disabled={isPast && !isMinDate}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? "text-white"
                            : isPast && !isMinDate
                            ? "cursor-not-allowed"
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
                            : isPast && !isMinDate
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

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDateTimePickerOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm"
                  style={{
                    borderColor: colors.backgroundTertiary,
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDateTimePickerDone}
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm"
                  style={{ backgroundColor: colors.backgroundTertiary }}
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Time Picker Modal - Opens when clicking clock icon */}
      {isTimePickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsTimePickerOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-2xl shadow-2xl"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <div className="p-6">
              <h3
                className="text-lg font-bold mb-4 text-center"
                style={{ color: colors.textPrimary }}
              >
                Select Time
              </h3>

              {/* Time Selection */}
              <div className="flex items-center justify-center gap-4 mb-6">
                {/* Hour Selection */}
                <div className="flex flex-col items-center">
                  <label
                    className="text-xs font-semibold mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Hour
                  </label>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => setSelectedHour(hour)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedHour === hour ? "text-white" : ""
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
                        {hour.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>

                <span
                  className="text-2xl font-bold mt-8"
                  style={{ color: colors.textPrimary }}
                >
                  :
                </span>

                {/* Minute Selection */}
                <div className="flex flex-col items-center">
                  <label
                    className="text-xs font-semibold mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Minute
                  </label>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                      <button
                        key={minute}
                        type="button"
                        onClick={() => setSelectedMinute(minute)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          selectedMinute === minute ? "text-white" : ""
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
                        {minute.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AM/PM Selection */}
                <div className="flex flex-col items-center">
                  <label
                    className="text-xs font-semibold mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Period
                  </label>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPeriod("am")}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        selectedPeriod === "am" ? "text-white" : ""
                      }`}
                      style={{
                        backgroundColor:
                          selectedPeriod === "am"
                            ? colors.backgroundTertiary
                            : "transparent",
                        color:
                          selectedPeriod === "am"
                            ? colors.backgroundSecondary
                            : colors.textPrimary,
                      }}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPeriod("pm")}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        selectedPeriod === "pm" ? "text-white" : ""
                      }`}
                      style={{
                        backgroundColor:
                          selectedPeriod === "pm"
                            ? colors.backgroundTertiary
                            : "transparent",
                        color:
                          selectedPeriod === "pm"
                            ? colors.backgroundSecondary
                            : colors.textPrimary,
                      }}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected Time Display */}
              <div
                className="mb-4 p-3 rounded-lg text-center"
                style={{ backgroundColor: colors.backgroundPrimary }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: colors.textPrimary }}
                >
                  {selectedHour.toString().padStart(2, "0")} :{" "}
                  {selectedMinute.toString().padStart(2, "0")} {selectedPeriod}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsTimePickerOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm"
                  style={{
                    borderColor: colors.backgroundTertiary,
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsTimePickerOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm"
                  style={{ backgroundColor: colors.backgroundTertiary }}
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {showBookingConfirmationModal && (
        <BookingConfirmationModal
          bookingId={confirmedBookingId}
          bookingData={confirmedBookingData}
          onClose={() => {
            setShowBookingConfirmationModal(false);
            setConfirmedBookingId(null);
            setConfirmedBookingData(null);
          }}
        />
      )}
    </div>
  );
};

export default BookNowPage;
