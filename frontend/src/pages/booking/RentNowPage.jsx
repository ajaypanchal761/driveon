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

      // Check if it's a mock car ID (like "car1", "car2", etc.)
      // If it is, use mock data directly without API call
      if (carId.startsWith('car')) {
        const carNumber = parseInt(carId.replace(/\D/g, '')) || 1;
        
        // Create mock car data based on car number
        const mockCarData = {
          id: carId,
          brand: ['Toyota', 'Honda', 'Maruti', 'Hyundai', 'Tata', 'Mahindra', 'Ford'][(carNumber - 1) % 7] || 'Car',
          model: ['Camry', 'City', 'Swift', 'i20', 'Nexon', 'XUV700', 'EcoSport'][(carNumber - 1) % 7] || 'Model',
          variant: '',
          year: new Date().getFullYear(),
          price: [3500, 3200, 1800, 2800, 2600, 2750, 3000][(carNumber - 1) % 7] || 2500,
          images: null,
          seats: 5,
          transmission: 'Manual',
          fuelType: 'Petrol',
          color: 'White',
          carType: 'Sedan',
          rating: [4.7, 4.8, 4.4, 4.3, 4.9, 4.6, 4.5][(carNumber - 1) % 7] || 4.5,
          location: 'Mumbai, Maharashtra',
          ownerName: 'DriveOn Premium',
          ownerRating: 4.5,
          description: 'Premium car available for rent.',
          features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging', 'Leather Seats'],
        };
        
        setCar(mockCarData);
        setError(null);
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
        } else {
          setError('Car not found');
          // Don't show toast for now since backend might not be ready
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        // For real car IDs that fail, show error but don't show toast (backend might not be ready)
        setError('Failed to load car details. Please try browsing cars.');
        // Don't show toast to avoid annoying errors when backend is not ready
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  // Calculate dynamic price based on document.txt requirements
  const calculatePrice = () => {
    if (!pickupDate || !dropDate || !car) return { basePrice: 0, totalDays: 0, totalPrice: 0, advancePayment: 0, remainingPayment: 0 };

    const pickup = new Date(pickupDate);
    const drop = new Date(dropDate);
    const diffTime = Math.abs(drop - pickup);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const basePrice = car.price || 0;
    let totalPrice = basePrice * totalDays;

    // Dynamic pricing based on document.txt:
    // - Weekend multiplier
    // - Holiday multiplier
    // - Demand surge

    // No peak hour surcharge applied

    // Advance payment (35%)
    const advancePayment = Math.round(totalPrice * 0.35);
    const remainingPayment = totalPrice - advancePayment;

    return {
      basePrice,
      totalDays,
      totalPrice: Math.round(totalPrice),
      advancePayment,
      remainingPayment: Math.round(remainingPayment),
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

    if (!agreeToTerms) {
      toastUtils.error('Please agree to terms and conditions');
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
        specialRequests,
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
    <div className="min-h-screen pb-28 bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="text-white relative overflow-hidden sticky top-0 z-40 shadow-lg" style={{ backgroundColor: theme.colors.primary }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
        </div>
        <div className="relative px-4 py-3 md:px-6 md:py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 touch-target hover:bg-white/15 rounded-xl transition-all active:scale-95"
                aria-label="Go back"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-white tracking-tight">Book Your Car</h1>
              <div className="w-10"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Car Summary Card */}
      <div className="px-4 pt-4 pb-3">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-lg border border-gray-100">
            {car.images && (
              <div className="flex-shrink-0">
                <img 
                  src={car.images} 
                  alt={`${car.brand} ${car.model}`} 
                  className="w-24 h-24 object-contain rounded-xl bg-gray-50 p-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate mb-0.5" style={{ color: theme.colors.textPrimary }}>
                {car.brand} {car.model}
              </h3>
              {car.variant && (
                <p className="text-xs text-gray-500 truncate mb-2">{car.variant}</p>
              )}
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                  ₹{car.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-500">/day</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-600">
                <span className="px-2 py-0.5 bg-gray-100 rounded-md">{car.seats} Seats</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded-md">{car.transmission}</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded-md">{car.fuelType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="px-4 pb-6 space-y-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            {/* Date & Time Selection */}
            <div className="bg-white rounded-2xl p-5 space-y-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                <h2 className="font-bold text-lg" style={{ color: theme.colors.textPrimary }}>
                  Select Date & Time
                </h2>
              </div>
          
              {/* Pickup Date & Time */}
              <div className="space-y-2">
                <label className="text-sm font-semibold block" style={{ color: theme.colors.textSecondary }}>
                  Pickup Date & Time
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={getMinDate()}
                    className="px-4 py-3 rounded-xl bg-gray-50 border-2 text-sm focus:outline-none transition-all"
                    style={{ 
                      borderColor: theme.colors.borderDefault,
                      color: theme.colors.textPrimary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary;
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.colors.borderDefault;
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-gray-50 border-2 text-sm focus:outline-none transition-all"
                    style={{ 
                      borderColor: theme.colors.borderDefault,
                      color: theme.colors.textPrimary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary;
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.colors.borderDefault;
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
              </div>

              {/* Drop Date & Time */}
              <div className="space-y-2">
                <label className="text-sm font-semibold block" style={{ color: theme.colors.textSecondary }}>
                  Drop Date & Time
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={dropDate}
                    onChange={(e) => setDropDate(e.target.value)}
                    min={pickupDate || getMinDate()}
                    className="px-4 py-3 rounded-xl bg-gray-50 border-2 text-sm focus:outline-none transition-all"
                    style={{ 
                      borderColor: theme.colors.borderDefault,
                      color: theme.colors.textPrimary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary;
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.colors.borderDefault;
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                  <input
                    type="time"
                    value={dropTime}
                    onChange={(e) => setDropTime(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-gray-50 border-2 text-sm focus:outline-none transition-all"
                    style={{ 
                      borderColor: theme.colors.borderDefault,
                      color: theme.colors.textPrimary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary;
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.colors.borderDefault;
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Option */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                <h2 className="font-bold text-lg" style={{ color: theme.colors.textPrimary }}>
                  Payment Option
                </h2>
              </div>
              <div className="p-4 rounded-xl border-2" style={{ borderColor: theme.colors.primary, backgroundColor: `${theme.colors.primary}08` }}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: theme.colors.primary }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-base block" style={{ color: theme.colors.textPrimary }}>35% Advance Payment</span>
                    <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>Pay 35% now, rest later in office</p>
                  </div>
                </div>
              </div>
            </div>


            {/* Special Requests */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <label className="text-sm font-semibold mb-3 block" style={{ color: theme.colors.textSecondary }}>
                Special Requests <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 text-sm focus:outline-none transition-all resize-none"
                style={{ 
                  borderColor: theme.colors.borderDefault,
                  color: theme.colors.textPrimary,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary;
                  e.target.style.backgroundColor = 'white';
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.borderDefault;
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Any special requests or notes..."
              />
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded flex-shrink-0 transition-all"
                  style={{ accentColor: theme.colors.primary }}
                  required
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I agree to the terms and conditions, privacy policy, and rental agreement. I understand that I am responsible for the vehicle during the rental period and will allow live tracking during the trip. <span className="text-red-500 font-semibold">*</span>
                </span>
              </label>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 shadow-lg border-2" style={{ borderColor: theme.colors.primary + '30' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                <h2 className="font-bold text-lg" style={{ color: theme.colors.textPrimary }}>
                  Price Breakdown
                </h2>
              </div>
              {priceDetails.totalDays > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm" style={{ color: theme.colors.textSecondary }}>
                    <span>Base Price ({priceDetails.totalDays} {priceDetails.totalDays === 1 ? 'day' : 'days'})</span>
                    <span className="font-semibold">₹{priceDetails.basePrice * priceDetails.totalDays}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-3 border-t-2 text-lg" style={{ color: theme.colors.primary, borderColor: theme.colors.borderLight }}>
                    <span>Total Amount</span>
                    <span>₹{priceDetails.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-3 border-t text-base" style={{ color: theme.colors.textPrimary, borderColor: theme.colors.borderLight }}>
                    <span>Advance Payment (35%)</span>
                    <span>₹{priceDetails.advancePayment.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1" style={{ color: theme.colors.textSecondary }}>
                    <span>Remaining Amount</span>
                    <span>₹{priceDetails.remainingPayment.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">Select dates to see price breakdown</p>
                </div>
              )}
            </div>

            {/* Car Features */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                  <h2 className="font-bold text-lg" style={{ color: theme.colors.textPrimary }}>
                    Car Features
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm" style={{ color: theme.colors.textSecondary }}>
                      <svg className="w-5 h-5 flex-shrink-0" style={{ color: theme.colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Submit Button - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 z-50 shadow-2xl backdrop-blur-lg bg-white/95 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
                ₹{priceDetails.totalDays > 0 ? priceDetails.advancePayment.toLocaleString('en-IN') : car.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-500">
                {priceDetails.totalDays > 0 ? 'Advance Payment' : '/ day'}
              </span>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!agreeToTerms}
              className="px-8 py-4 rounded-2xl font-bold text-base shadow-lg touch-target active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: agreeToTerms ? theme.colors.primary : '#cbd5e1',
                color: '#ffffff',
                boxShadow: agreeToTerms ? `0 4px 20px ${theme.colors.primary}40` : 'none',
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

