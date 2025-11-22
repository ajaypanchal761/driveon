import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../../theme/theme.constants';
import carImg1 from '../../assets/car_img1-removebg-preview.png';
import carImg2 from '../../assets/car_img2-removebg-preview.png';
import carImg3 from '../../assets/car_img3-removebg-preview.png';
import carImg4 from '../../assets/car_img4-removebg-preview.png';
import carImg5 from '../../assets/car_img5-removebg-preview.png';
import carImg6 from '../../assets/car_img6-removebg-preview.png';
import carImg7 from '../../assets/car_img7-removebg-preview.png';

/**
 * BookingFormPage Component
 * Booking form page - Mobile-optimized with all booking fields
 * Based on document.txt booking flow requirements
 */
const BookingFormPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropDate, setDropDate] = useState('');
  const [dropTime, setDropTime] = useState('');
  const [paymentOption, setPaymentOption] = useState('full'); // 'full' or 'advance'
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [guarantorEmail, setGuarantorEmail] = useState('');
  const [hasGuarantor, setHasGuarantor] = useState(false);
  const [location, setLocation] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Mock car data
  const carsData = {
    '1': { id: '1', brand: 'Tesla', model: 'Model X', price: 180, image: carImg1 },
    '2': { id: '2', brand: 'Mercedes-Benz', model: 'S-Class', price: 220, image: carImg2 },
    '3': { id: '3', brand: 'BMW', model: '7 Series', price: 200, image: carImg3 },
    '4': { id: '4', brand: 'Audi', model: 'A8 L', price: 210, image: carImg4 },
    '5': { id: '5', brand: 'Jaguar', model: 'XF', price: 175, image: carImg5 },
    '6': { id: '6', brand: 'Lexus', model: 'LS 500', price: 195, image: carImg6 },
    '7': { id: '7', brand: 'Porsche', model: 'Panamera', price: 250, image: carImg7 },
  };

  const car = carsData[carId];

  // Calculate dynamic price
  const calculatePrice = () => {
    if (!pickupDate || !dropDate) return { basePrice: 0, totalDays: 0, totalPrice: 0 };

    const pickup = new Date(pickupDate);
    const drop = new Date(dropDate);
    const diffTime = Math.abs(drop - pickup);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const basePrice = car?.price || 0;
    let totalPrice = basePrice * totalDays;

    // Dynamic pricing based on day of week (weekend multiplier)
    const pickupDay = pickup.getDay();
    const dropDay = drop.getDay();
    const isWeekend = pickupDay === 0 || pickupDay === 6 || dropDay === 0 || dropDay === 6;
    
    if (isWeekend) {
      totalPrice = totalPrice * 1.2; // 20% weekend surcharge
    }

    // Security deposit (10% of total)
    const securityDeposit = totalPrice * 0.1;

    return {
      basePrice,
      totalDays,
      totalPrice: Math.round(totalPrice),
      securityDeposit: Math.round(securityDeposit),
      advancePayment: Math.round(totalPrice * 0.35),
      remainingPayment: Math.round(totalPrice * 0.65),
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
    if (!agreeToTerms) {
      alert('Please agree to terms and conditions');
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
        location,
        specialRequests,
        guarantorName,
        guarantorPhone,
        guarantorEmail,
        hasGuarantor,
        priceDetails,
      },
    });
  };

  useEffect(() => {
    if (!car) {
      navigate('/cars');
    }
  }, [car, navigate]);

  if (!car) {
    return null;
  }

  return (
    <div className="min-h-screen pb-24 bg-white">
      {/* Header */}
      <header className="text-white relative overflow-hidden" style={{ backgroundColor: theme.colors.primary }}>
        <div className="relative px-4 pt-3 pb-2 md:px-6 md:py-4">
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
              <h1 className="text-lg md:text-2xl font-bold text-white">Book Car</h1>
              <div className="w-8 md:w-12"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Car Summary Card */}
      <div className="px-4 pt-4 pb-2 md:pt-6 md:pb-2">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-5 flex items-center gap-3 md:gap-4 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
            <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-16 h-16 md:w-24 md:h-24 object-contain" />
            <div className="flex-1">
              <h3 className="font-bold text-base md:text-lg" style={{ color: theme.colors.textPrimary }}>{car.brand} {car.model}</h3>
              <p className="text-sm md:text-base" style={{ color: theme.colors.textSecondary }}>Rs. {car.price} /day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="px-4 py-4 md:py-6 space-y-4 md:space-y-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 md:gap-6 space-y-4 md:space-y-0">
            {/* Left Column */}
            <div className="space-y-4 md:space-y-5">
              {/* Date & Time Selection */}
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 space-y-4 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                <h2 className="font-semibold text-base md:text-lg mb-3 md:mb-4" style={{ color: theme.colors.primary }}>Select Date & Time</h2>
          
                {/* Pickup Date & Time */}
                <div className="space-y-2">
                  <label className="text-sm md:text-base font-medium" style={{ color: theme.colors.textSecondary }}>Pickup Date & Time</label>
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
                      placeholder="Pickup Date"
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
                  <label className="text-sm md:text-base font-medium" style={{ color: theme.colors.textSecondary }}>Drop Date & Time</label>
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
                      placeholder="Drop Date"
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
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                <label className="text-sm md:text-base font-medium mb-2 md:mb-3 block" style={{ color: theme.colors.textSecondary }}>Pickup Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
              </div>

              {/* Payment Option */}
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                <h2 className="font-semibold text-base md:text-lg mb-3 md:mb-4" style={{ color: theme.colors.primary }}>Payment Option</h2>
                <div className="space-y-2 md:space-y-3">
                  <label className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl cursor-pointer border-2 transition-all hover:bg-gray-50" style={{ borderColor: paymentOption === 'full' ? theme.colors.primary : theme.colors.borderLight }}>
                    <input
                      type="radio"
                      name="paymentOption"
                      value="full"
                      checked={paymentOption === 'full'}
                      onChange={(e) => setPaymentOption(e.target.value)}
                      className="w-4 h-4 md:w-5 md:h-5"
                      style={{ accentColor: theme.colors.primary }}
                    />
                    <div className="flex-1">
                      <span className="font-medium text-sm md:text-base" style={{ color: theme.colors.textPrimary }}>Full Payment</span>
                      <p className="text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>Pay complete amount upfront</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl cursor-pointer border-2 transition-all hover:bg-gray-50" style={{ borderColor: paymentOption === 'advance' ? theme.colors.primary : theme.colors.borderLight }}>
                    <input
                      type="radio"
                      name="paymentOption"
                      value="advance"
                      checked={paymentOption === 'advance'}
                      onChange={(e) => setPaymentOption(e.target.value)}
                      className="w-4 h-4 md:w-5 md:h-5"
                      style={{ accentColor: theme.colors.primary }}
                    />
                    <div className="flex-1">
                      <span className="font-medium text-sm md:text-base" style={{ color: theme.colors.textPrimary }}>35% Advance Payment</span>
                      <p className="text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>Pay 35% now, rest later</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 md:space-y-5">

              {/* Price Breakdown */}
              {priceDetails.totalDays > 0 && (
                <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                  <h2 className="font-semibold text-base md:text-lg mb-3 md:mb-4" style={{ color: theme.colors.primary }}>Price Breakdown</h2>
                  <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                    <div className="flex justify-between" style={{ color: theme.colors.textSecondary }}>
                      <span>Base Price ({priceDetails.totalDays} {priceDetails.totalDays === 1 ? 'day' : 'days'})</span>
                      <span className="font-medium">Rs. {priceDetails.basePrice * priceDetails.totalDays}</span>
                    </div>
                    {priceDetails.totalPrice > priceDetails.basePrice * priceDetails.totalDays && (
                      <div className="flex justify-between" style={{ color: theme.colors.textSecondary }}>
                        <span>Weekend Surcharge</span>
                        <span className="font-medium">Rs. {priceDetails.totalPrice - (priceDetails.basePrice * priceDetails.totalDays)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-2 md:pt-3 border-t text-base md:text-lg" style={{ color: theme.colors.primary, borderColor: theme.colors.borderLight }}>
                      <span>Total Amount</span>
                      <span>Rs. {priceDetails.totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm pt-1" style={{ color: theme.colors.textSecondary }}>
                      <span>Security Deposit</span>
                      <span>Rs. {priceDetails.securityDeposit}</span>
                    </div>
                    {paymentOption === 'advance' && (
                      <>
                        <div className="flex justify-between font-semibold pt-2 md:pt-3 border-t text-base md:text-lg" style={{ color: theme.colors.primary, borderColor: theme.colors.borderLight }}>
                          <span>Advance Payment (35%)</span>
                          <span>Rs. {priceDetails.advancePayment}</span>
                        </div>
                        <div className="flex justify-between text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>
                          <span>Remaining Amount</span>
                          <span>Rs. {priceDetails.remainingPayment}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Guarantor Section */}
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h2 className="font-semibold text-base md:text-lg" style={{ color: theme.colors.primary }}>Guarantor Details</h2>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasGuarantor}
                      onChange={(e) => setHasGuarantor(e.target.checked)}
                      className="w-4 h-4 md:w-5 md:h-5 rounded"
                      style={{ accentColor: theme.colors.primary }}
                    />
                    <span className="text-sm md:text-base" style={{ color: theme.colors.textSecondary }}>Add Guarantor</span>
                  </label>
                </div>
                {hasGuarantor && (
                  <div className="space-y-3 mt-3">
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
                      required={hasGuarantor}
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
                      required={hasGuarantor}
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
                      required={hasGuarantor}
                    />
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                <label className="text-sm md:text-base font-medium mb-2 md:mb-3 block" style={{ color: theme.colors.textSecondary }}>Special Requests (Optional)</label>
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
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow border" style={{ borderColor: theme.colors.borderLight }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 md:w-5 md:h-5 mt-0.5 rounded"
                    style={{ accentColor: theme.colors.primary }}
                    required
                  />
                  <span className="text-sm md:text-base" style={{ color: theme.colors.textSecondary }}>
                    I agree to the terms and conditions, privacy policy, and rental agreement. I understand that I am responsible for the vehicle during the rental period.
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button - Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 border-t-2 border-white/20 px-4 md:px-6 py-4 md:py-5 z-50 shadow-2xl" style={{ backgroundColor: theme.colors.primary }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between max-w-md md:max-w-none md:justify-center md:gap-6 mx-auto">
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-bold text-white">
                  Rs. {paymentOption === 'advance' ? priceDetails.advancePayment : priceDetails.totalPrice}
                </span>
                <span className="text-xs md:text-sm text-white/80">
                  {paymentOption === 'advance' ? 'Advance Payment' : 'Total Amount'}
                </span>
              </div>
              <button
                type="submit"
                className="px-8 md:px-10 py-3.5 md:py-4 rounded-lg md:rounded-xl font-bold text-sm md:text-base shadow-xl touch-target active:scale-95 transition-transform hover:shadow-2xl hover:scale-105"
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
      </form>
    </div>
  );
};

export default BookingFormPage;

