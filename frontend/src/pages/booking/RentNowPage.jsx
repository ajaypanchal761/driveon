import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../../theme/theme.constants';
import { carService } from '../../services/car.service';
import toastUtils from '../../config/toast';

/**
 * RentNowPage Component
 * Booking page that opens when "Rent Now" is clicked from car details page
 * Based on document.txt booking flow requirements
 * Responsive for both mobile and web views
 */
const RentNowPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropDate, setDropDate] = useState('');
  const [dropTime, setDropTime] = useState('');
  const [paymentOption, setPaymentOption] = useState('advance'); // Only 'advance' option available
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [guarantorEmail, setGuarantorEmail] = useState('');
  const [hasGuarantor] = useState(true); // Always mandatory
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Fetch car details from backend
  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!carId) {
        setError('Car ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await carService.getCarDetails(carId);
        
        if (response.success && response.data?.car) {
          const carData = response.data.car;
          
          // Format car data for display
          let images = [];
          if (carData.images && Array.isArray(carData.images)) {
            images = carData.images.map(img => {
              if (typeof img === 'string') return img;
              return img.url || img.path || null;
            }).filter(img => img);
          } else if (carData.primaryImage) {
            images = [carData.primaryImage];
          }
          
          const formattedCar = {
            id: carData._id || carData.id,
            brand: carData.brand || '',
            model: carData.model || '',
            variant: carData.variant || carData.model || '',
            year: carData.year || new Date().getFullYear(),
            price: carData.pricePerDay || 0,
            images: images.length > 0 ? images[0] : null,
            seats: carData.seatingCapacity || 5,
            transmission: carData.transmission === 'automatic' ? 'Automatic' : carData.transmission === 'manual' ? 'Manual' : carData.transmission || 'Manual',
            fuelType: carData.fuelType === 'petrol' ? 'Petrol' : carData.fuelType === 'diesel' ? 'Diesel' : carData.fuelType === 'electric' ? 'Electric' : carData.fuelType === 'hybrid' ? 'Hybrid' : carData.fuelType || 'Petrol',
            color: carData.color || 'N/A',
            carType: carData.carType || 'Sedan',
            rating: carData.averageRating || 0,
            location: (() => {
              if (typeof carData.location === 'string') {
                return carData.location;
              } else if (carData.location && typeof carData.location === 'object') {
                const parts = [];
                if (carData.location.city) parts.push(carData.location.city);
                if (carData.location.state) parts.push(carData.location.state);
                return parts.length > 0 ? parts.join(', ') : (carData.location.address || 'N/A');
              }
              return carData.city || 'N/A';
            })(),
            ownerName: carData.owner?.name || 'DriveOn Premium',
            ownerRating: carData.owner?.rating || 4.5,
            description: carData.description || 'Premium car available for rent.',
            features: carData.features || ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging', 'Leather Seats'],
          };
          
          setCar(formattedCar);
          // Set default pickup location to car location
          setPickupLocation(formattedCar.location);
        } else {
          setError('Car not found');
          toastUtils.error('Car not found');
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError('Failed to load car details');
        toastUtils.error('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  // Calculate dynamic price based on document.txt requirements
  const calculatePrice = () => {
    if (!pickupDate || !dropDate || !car) return { basePrice: 0, totalDays: 0, totalPrice: 0, securityDeposit: 0, advancePayment: 0, remainingPayment: 0 };

    const pickup = new Date(pickupDate);
    const drop = new Date(dropDate);
    const diffTime = Math.abs(drop - pickup);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const basePrice = car.price || 0;
    let totalPrice = basePrice * totalDays;

    // Dynamic pricing based on document.txt:
    // - Weekend multiplier
    // - Holiday multiplier
    // - Time of day multiplier
    // - Demand surge

    // Weekend multiplier
    const pickupDay = pickup.getDay();
    const dropDay = drop.getDay();
    const isWeekend = pickupDay === 0 || pickupDay === 6 || dropDay === 0 || dropDay === 6;
    const weekendMultiplier = isWeekend ? 0.2 : 0; // 20% weekend surcharge

    // Time of day multiplier (peak hours: 8 AM - 10 AM, 5 PM - 7 PM)
    const pickupHour = pickupTime ? parseInt(pickupTime.split(':')[0]) : 10;
    const isPeakHour = (pickupHour >= 8 && pickupHour < 10) || (pickupHour >= 17 && pickupHour < 19);
    const timeOfDayMultiplier = isPeakHour ? 0.1 : 0; // 10% peak hour surcharge

    // Apply multipliers
    totalPrice = totalPrice * (1 + weekendMultiplier + timeOfDayMultiplier);

    // Security deposit (10% of total)
    const securityDeposit = Math.round(totalPrice * 0.1);

    // Advance payment (35%)
    const advancePayment = Math.round(totalPrice * 0.35);
    const remainingPayment = totalPrice - advancePayment;

    return {
      basePrice,
      totalDays,
      totalPrice: Math.round(totalPrice),
      securityDeposit,
      advancePayment,
      remainingPayment: Math.round(remainingPayment),
      weekendMultiplier,
      timeOfDayMultiplier,
    };
  };

  const priceDetails = calculatePrice();

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!pickupDate || !dropDate || !pickupTime || !dropTime) {
      toastUtils.error('Please select pickup and drop date & time');
      return;
    }

    if (!pickupLocation) {
      toastUtils.error('Please enter pickup location');
      return;
    }

    if (!agreeToTerms) {
      toastUtils.error('Please agree to terms and conditions');
      return;
    }

    if (!guarantorName || !guarantorPhone || !guarantorEmail) {
      toastUtils.error('Please fill all guarantor details');
      return;
    }

    // Navigate to payment page with booking data
    navigate(`/booking/${carId}/payment`, {
      state: {
        car,
        pickupDate,
        pickupTime,
        dropDate,
        dropTime,
        paymentOption,
        pickupLocation,
        dropLocation: dropLocation || pickupLocation,
        specialRequests,
        guarantorName,
        guarantorPhone,
        guarantorEmail,
        hasGuarantor,
        priceDetails,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: theme.colors.primary }}></div>
          <p className="text-gray-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Car not found'}</p>
          <button
            onClick={() => navigate('/cars')}
            className="px-6 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: theme.colors.primary }}
          >
            Browse Cars
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 md:pb-24 bg-gray-50 -mt-4 md:mt-0" style={{ marginTop: '-1rem' }}>
      {/* Header */}
      <header className="text-white relative overflow-hidden sticky top-0 z-40" style={{ backgroundColor: theme.colors.primary }}>
        <div className="relative px-4 py-2 md:px-6 md:py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 md:p-2 -ml-1 touch-target hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white">Book Your Car</h1>
              <div className="w-8 md:w-12"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Car Summary Card */}
      <div className="px-4 pt-6 pb-2 md:pt-6 md:pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 flex items-center gap-4 md:gap-6 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
            {car.images && (
              <img 
                src={car.images} 
                alt={`${car.brand} ${car.model}`} 
                className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base md:text-lg lg:text-xl truncate" style={{ color: theme.colors.textPrimary }}>
                {car.brand} {car.model}
              </h3>
              {car.variant && (
                <p className="text-xs md:text-sm text-gray-500 truncate">{car.variant}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm md:text-base font-semibold" style={{ color: theme.colors.primary }}>
                  Rs. {car.price}
                </span>
                <span className="text-xs md:text-sm text-gray-500">/day</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs md:text-sm text-gray-600">
                <span>{car.seats} Seats</span>
                <span>•</span>
                <span>{car.transmission}</span>
                <span>•</span>
                <span>{car.fuelType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 lg:gap-8 space-y-4 md:space-y-6 lg:space-y-0">
            {/* Left Column */}
            <div className="space-y-4 md:space-y-6">
              {/* Date & Time Selection */}
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6 space-y-4 md:space-y-5 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                <h2 className="font-semibold text-base md:text-lg lg:text-xl mb-2" style={{ color: theme.colors.primary }}>
                  Select Date & Time
                </h2>
          
                {/* Pickup Date & Time */}
                <div className="space-y-2">
                  <label className="text-sm md:text-base font-medium block" style={{ color: theme.colors.textSecondary }}>
                    Pickup Date & Time
                  </label>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={getMinDate()}
                      className="px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white border text-sm md:text-base focus:outline-none transition-colors"
                      style={{ 
                        borderColor: theme.colors.borderDefault,
                        color: theme.colors.textPrimary,
                      }}
                      onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                      onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                      required
                    />
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white border text-sm md:text-base focus:outline-none transition-colors"
                      style={{ 
                        borderColor: theme.colors.borderDefault,
                        color: theme.colors.textPrimary,
                      }}
                      onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                      onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                      required
                    />
                  </div>
                </div>

                {/* Drop Date & Time */}
                <div className="space-y-2">
                  <label className="text-sm md:text-base font-medium block" style={{ color: theme.colors.textSecondary }}>
                    Drop Date & Time
                  </label>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <input
                      type="date"
                      value={dropDate}
                      onChange={(e) => setDropDate(e.target.value)}
                      min={pickupDate || getMinDate()}
                      className="px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white border text-sm md:text-base focus:outline-none transition-colors"
                      style={{ 
                        borderColor: theme.colors.borderDefault,
                        color: theme.colors.textPrimary,
                      }}
                      onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                      onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                      required
                    />
                    <input
                      type="time"
                      value={dropTime}
                      onChange={(e) => setDropTime(e.target.value)}
                      className="px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white border text-sm md:text-base focus:outline-none transition-colors"
                      style={{ 
                        borderColor: theme.colors.borderDefault,
                        color: theme.colors.textPrimary,
                      }}
                      onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                      onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6 space-y-3 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                <label className="text-sm md:text-base font-medium block" style={{ color: theme.colors.textSecondary }}>
                  Pickup Location
                </label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white border text-sm md:text-base focus:outline-none transition-colors"
                  style={{ 
                    borderColor: theme.colors.borderDefault,
                    color: theme.colors.textPrimary,
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                  placeholder="Enter pickup location"
                  required
                />
                <label className="text-sm md:text-base font-medium block pt-2" style={{ color: theme.colors.textSecondary }}>
                  Drop Location (Optional)
                </label>
                <input
                  type="text"
                  value={dropLocation}
                  onChange={(e) => setDropLocation(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white border text-sm md:text-base focus:outline-none transition-colors"
                  style={{ 
                    borderColor: theme.colors.borderDefault,
                    color: theme.colors.textPrimary,
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                  placeholder="Enter drop location (same as pickup if not specified)"
                />
              </div>

              {/* Payment Option */}
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                <h2 className="font-semibold text-base md:text-lg lg:text-xl mb-3 md:mb-4" style={{ color: theme.colors.primary }}>
                  Payment Option
                </h2>
                <div className="p-3 md:p-4 rounded-lg md:rounded-xl border-2" style={{ borderColor: theme.colors.primary, backgroundColor: theme.colors.backgroundSecondary }}>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: theme.colors.primary }}>
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm md:text-base block" style={{ color: theme.colors.textPrimary }}>35% Advance Payment</span>
                      <p className="text-xs md:text-sm mt-1" style={{ color: theme.colors.textSecondary }}>Pay 35% now, rest later</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantor Section - Mandatory */}
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h2 className="font-semibold text-base md:text-lg lg:text-xl" style={{ color: theme.colors.primary }}>
                    Guarantor Details <span className="text-red-500">*</span>
                  </h2>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={guarantorName}
                    onChange={(e) => setGuarantorName(e.target.value)}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white border text-sm md:text-base focus:outline-none transition-colors"
                    style={{ 
                      borderColor: theme.colors.borderDefault,
                      color: theme.colors.textPrimary,
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                    onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                    placeholder="Guarantor Name"
                    required
                  />
                  <input
                    type="tel"
                    value={guarantorPhone}
                    onChange={(e) => setGuarantorPhone(e.target.value)}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white border text-sm md:text-base focus:outline-none transition-colors"
                    style={{ 
                      borderColor: theme.colors.borderDefault,
                      color: theme.colors.textPrimary,
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                    onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                    placeholder="Guarantor Phone"
                    required
                  />
                  <input
                    type="email"
                    value={guarantorEmail}
                    onChange={(e) => setGuarantorEmail(e.target.value)}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white border text-sm md:text-base focus:outline-none transition-colors"
                    style={{ 
                      borderColor: theme.colors.borderDefault,
                      color: theme.colors.textPrimary,
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                    onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                    placeholder="Guarantor Email"
                    required
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                <label className="text-sm md:text-base font-medium mb-2 md:mb-3 block" style={{ color: theme.colors.textSecondary }}>
                  Special Requests (Optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={3}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white border text-sm md:text-base focus:outline-none transition-colors resize-none"
                  style={{ 
                    borderColor: theme.colors.borderDefault,
                    color: theme.colors.textPrimary,
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                  placeholder="Any special requests or notes..."
                />
              </div>

              {/* Terms & Conditions */}
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 md:w-5 md:h-5 mt-0.5 rounded flex-shrink-0"
                    style={{ accentColor: theme.colors.primary }}
                    required
                  />
                  <span className="text-xs md:text-sm text-gray-600">
                    I agree to the terms and conditions, privacy policy, and rental agreement. I understand that I am responsible for the vehicle during the rental period and will allow live tracking during the trip.
                  </span>
                </label>
              </div>
            </div>

            {/* Right Column - Price Breakdown */}
            <div className="space-y-4 md:space-y-6">
              {/* Price Breakdown */}
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6 shadow-md hover:shadow-lg transition-shadow border sticky top-24" style={{ borderColor: theme.colors.borderLight }}>
                <h2 className="font-semibold text-base md:text-lg lg:text-xl mb-3 md:mb-4" style={{ color: theme.colors.primary }}>
                  Price Breakdown
                </h2>
                {priceDetails.totalDays > 0 ? (
                  <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                    <div className="flex justify-between" style={{ color: theme.colors.textSecondary }}>
                      <span>Base Price ({priceDetails.totalDays} {priceDetails.totalDays === 1 ? 'day' : 'days'})</span>
                      <span className="font-medium">Rs. {priceDetails.basePrice * priceDetails.totalDays}</span>
                    </div>
                    {priceDetails.weekendMultiplier > 0 && (
                      <div className="flex justify-between" style={{ color: theme.colors.textSecondary }}>
                        <span>Weekend Surcharge (20%)</span>
                        <span className="font-medium">Rs. {Math.round((priceDetails.basePrice * priceDetails.totalDays) * priceDetails.weekendMultiplier)}</span>
                      </div>
                    )}
                    {priceDetails.timeOfDayMultiplier > 0 && (
                      <div className="flex justify-between" style={{ color: theme.colors.textSecondary }}>
                        <span>Peak Hour Surcharge (10%)</span>
                        <span className="font-medium">Rs. {Math.round((priceDetails.basePrice * priceDetails.totalDays) * priceDetails.timeOfDayMultiplier)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-2 md:pt-3 border-t text-base md:text-lg" style={{ color: theme.colors.primary, borderColor: theme.colors.borderLight }}>
                      <span>Total Amount</span>
                      <span>Rs. {priceDetails.totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm pt-1" style={{ color: theme.colors.textSecondary }}>
                      <span>Security Deposit (10%)</span>
                      <span>Rs. {priceDetails.securityDeposit}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 md:pt-3 border-t text-base md:text-lg" style={{ color: theme.colors.primary, borderColor: theme.colors.borderLight }}>
                      <span>Advance Payment (35%)</span>
                      <span>Rs. {priceDetails.advancePayment}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>
                      <span>Remaining Amount</span>
                      <span>Rs. {priceDetails.remainingPayment}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Select dates to see price breakdown</p>
                )}
              </div>

              {/* Car Features */}
              {car.features && car.features.length > 0 && (
                <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                  <h2 className="font-semibold text-base md:text-lg lg:text-xl mb-3 md:mb-4" style={{ color: theme.colors.primary }}>
                    Car Features
                  </h2>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm md:text-base" style={{ color: theme.colors.textSecondary }}>
                        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" style={{ color: theme.colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Submit Button - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 border-t-2 border-white/20 px-4 md:px-6 py-4 md:py-5 z-[60] shadow-2xl" style={{ backgroundColor: theme.colors.primary }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between max-w-md md:max-w-none md:justify-center md:gap-6 mx-auto">
            <div className="flex items-baseline gap-1">
              <span className="text-lg md:text-2xl lg:text-3xl font-bold text-white">
                Rs. {car.price}
              </span>
              <span className="text-xs md:text-sm text-white/80">/ day</span>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 md:px-10 lg:px-12 py-3 md:py-4 rounded-lg md:rounded-xl font-bold text-sm md:text-base lg:text-lg shadow-xl touch-target active:scale-95 transition-transform hover:shadow-2xl hover:scale-105"
              style={{
                backgroundColor: '#ffffff',
                color: theme.colors.primary,
                boxShadow: '0 4px 14px 0 rgba(255, 255, 255, 0.3)',
              }}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentNowPage;

