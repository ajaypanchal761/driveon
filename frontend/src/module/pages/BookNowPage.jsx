import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CarDetailsHeader from '../components/layout/CarDetailsHeader';
import { colors } from '../theme/colors';
import { motion } from 'framer-motion';

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
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
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
  
  // Get car data from navigation state or use mock data as fallback
  const getCarData = () => {
    // First, try to get car from navigation state (when coming from search or car details)
    if (location.state?.car) {
      const stateCar = location.state.car;
      return {
        id: stateCar.id || stateCar._id || id,
        name: stateCar.name || `${stateCar.brand || ''} ${stateCar.model || ''}`.trim(),
        brand: stateCar.brand,
        model: stateCar.model,
        image: stateCar.image || stateCar.images?.[0] || carImg1,
        images: stateCar.images || [stateCar.image || carImg1],
        price: extractPrice(stateCar.price || stateCar.pricePerDay || 0),
        pricePerDay: extractPrice(stateCar.pricePerDay || stateCar.price || 0),
        seats: stateCar.seats || 4,
        transmission: stateCar.transmission || 'Automatic',
        fuelType: stateCar.fuelType || 'Petrol',
        rating: stateCar.rating || stateCar.averageRating || 5.0,
        location: stateCar.location || 'Location',
      };
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
  const [paymentOption, setPaymentOption] = useState("advance"); // Only 'advance' option available
  const [specialRequests, setSpecialRequests] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!pickupDate || !dropDate || !pickupTime || !dropTime) {
      alert("Please select pickup and drop date & time");
      return;
    }

    if (!agreeToTerms) {
      alert("Please agree to terms and conditions");
      return;
    }

    // Generate unique booking ID
    const bookingId = `BK${Date.now().toString().slice(-6)}`;

    // Parse car name to extract brand and model
    let brand = car.name;
    let model = "";
    if (car.name.includes("-")) {
      // Format: "Ferrari-FF"
      const parts = car.name.split("-");
      brand = parts[0];
      model = parts.slice(1).join(" ");
    } else if (car.name.includes(" ")) {
      // Format: "Tesla Model S" or "BMW GTS3 M2"
      const parts = car.name.split(" ");
      brand = parts[0];
      model = parts.slice(1).join(" ");
    }
    // If no separator, use full name as brand (e.g., "BMW")

    // Create booking object matching BookingsPage structure
    const newBooking = {
      id: `booking_${Date.now()}`,
      bookingId: bookingId,
      car: {
        id: car.id.toString(),
        brand: brand,
        model: model || brand,
        image: car.image,
        seats: car.seats,
        transmission: car.transmission,
        fuelType: car.fuelType,
      },
      status: "confirmed",
      tripStatus: "not_started",
      paymentStatus: "partial",
      pickupDate: pickupDate,
      pickupTime: pickupTime,
      dropDate: dropDate,
      dropTime: dropTime,
      totalPrice: priceDetails.finalPrice,
      paidAmount: priceDetails.advancePayment,
      remainingAmount: priceDetails.remainingPayment,
      isTrackingActive: false,
      createdAt: new Date().toISOString().split("T")[0],
      paymentOption: paymentOption,
      specialRequests: specialRequests,
      couponCode: appliedCoupon?.code || null,
      couponDiscount: couponDiscount,
    };

    // Save to localStorage
    try {
      const existingBookings = JSON.parse(
        localStorage.getItem("localBookings") || "[]"
      );
      existingBookings.unshift(newBooking); // Add to beginning
      localStorage.setItem("localBookings", JSON.stringify(existingBookings));

      // Show success message and navigate to bookings page
      alert("Booking confirmed! Redirecting to bookings...");
      navigate("/bookings");
    } catch (error) {
      console.error("Error saving booking to localStorage:", error);
      alert("Error saving booking. Please try again.");
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
            className="w-full py-3 rounded-xl text-white font-bold text-base shadow-xl"
            style={{ backgroundColor: colors.backgroundTertiary }}
          >
            Proceed to Payment
          </motion.button>
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
    </div>
  );
};

export default BookNowPage;
