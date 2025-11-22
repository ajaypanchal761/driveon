import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Active Booking Page - Trip Details
 * Shows detailed information about user's active booking/trip
 * Based on document.txt specifications
 * Uses website theme (#3d096d purple)
 */
const ActiveBookingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - In real app, fetch from API using booking id
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockBookings = [
        {
          id: '1',
          bookingId: 'BK001',
          car: {
            id: 'car1',
            brand: 'Toyota',
            model: 'Camry',
            year: 2022,
            seats: 5,
            transmission: 'Automatic',
            fuelType: 'Petrol',
            color: 'White',
            features: ['GPS Navigation', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Parking Sensors', 'Reverse Camera'],
            rating: 4.7,
            owner: {
              name: 'Mike Johnson',
              phone: '+91 98765 43230',
              email: 'mike.j@example.com',
            },
          },
          pickupDate: '2024-01-15',
          pickupTime: '10:00 AM',
          dropDate: '2024-01-17',
          dropTime: '10:00 AM',
          pickupLocation: '8502 Preston Rd. Inglewood, CA 90301',
          dropLocation: '8502 Preston Rd. Inglewood, CA 90301',
          duration: '2 days',
          days: 2,
          bookingDate: '2024-01-10T10:00:00',
          status: 'active',
          paymentStatus: 'paid',
          paymentType: 'full', // 'full' or 'partial' (35% advance)
          totalPrice: 4500,
          paidAmount: 4500,
          remainingAmount: 0,
          basePrice: 3500,
          weekendMultiplier: 0.15,
          holidayMultiplier: 0,
          timeOfDayMultiplier: 0.1,
          demandSurge: 0.05,
          durationPrice: 1000,
          // Live Tracking Info
          trackingEnabled: true,
          currentLocation: '8502 Preston Rd. Inglewood, CA 90301',
          currentSpeed: 45,
          distanceTraveled: 120,
          totalDistance: 250,
          tripStartTime: '2024-01-15T10:00:00',
          tripDuration: '2h 15m',
          // User Info
          user: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+91 98765 43210',
          },
          // Guarantor Info
          guarantor: {
            name: 'Rajesh Kumar',
            phone: '+91 98765 43220',
            id: 'g1',
          },
        },
      ];

      const foundBooking = mockBookings.find((b) => b.id === id) || mockBookings[0];
      setBooking(foundBooking);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#3d096d' }}></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Not Found</h2>
          <p className="text-gray-600 mb-6">The trip details you're looking for could not be found.</p>
          <button
            onClick={() => navigate('/bookings')}
            className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all"
            style={{ backgroundColor: '#3d096d' }}
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Section - Purple Background */}
      <header className="bg-[#3d096d] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
        </div>

        <div className="relative px-4 py-3">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/bookings')}
              className="p-1.5 -ml-1 touch-target"
              aria-label="Go back"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-white">Trip Details</h1>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-medium">
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            {booking.trackingEnabled && (
              <span className="px-3 py-1 bg-green-500/30 rounded-lg text-xs font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live Tracking ON
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4">
        {/* Live Tracking Information */}
        {booking.trackingEnabled && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-[#3d096d] p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-base font-semibold text-gray-900">Live Tracking Active</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Current Location</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">📍 {booking.currentLocation}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Current Speed</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{booking.currentSpeed} km/h</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Distance Traveled</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {booking.distanceTraveled} / {booking.totalDistance} km
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Trip Duration</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{booking.tripDuration}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                <span>Started: {new Date(booking.tripStartTime).toLocaleString()}</span>
                <span>•</span>
                <span>Start: {booking.pickupLocation}</span>
                <span>→</span>
                <span>End: {booking.dropLocation}</span>
              </div>
            </div>
          </div>
        )}

        {/* Trip Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-3" style={{ color: '#3d096d' }}>
            Trip Information
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Pickup Date & Time</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {new Date(booking.pickupDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-gray-600">{booking.pickupTime}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Drop Date & Time</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {new Date(booking.dropDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-gray-600">{booking.dropTime}</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Pickup Location</label>
              <p className="text-sm font-semibold text-gray-900 mt-1">{booking.pickupLocation}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Drop Location</label>
              <p className="text-sm font-semibold text-gray-900 mt-1">{booking.dropLocation}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Duration</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{booking.duration}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Booking Date</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Car Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-3" style={{ color: '#3d096d' }}>
            Car Information
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Car Name</label>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {booking.car.brand} {booking.car.model} {booking.car.year}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Seats</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{booking.car.seats}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Transmission</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{booking.car.transmission}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Fuel Type</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{booking.car.fuelType}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Color</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{booking.car.color}</p>
              </div>
            </div>
            {booking.car.features && booking.car.features.length > 0 && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Features</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {booking.car.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="pt-3 border-t border-gray-200">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Car Owner</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{booking.car.owner.name}</p>
                <p className="text-xs text-gray-600 mt-1">{booking.car.owner.phone}</p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500 uppercase">Rating</label>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold text-gray-900">{booking.car.rating}</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-3" style={{ color: '#3d096d' }}>
            Payment Details
          </h2>
          <div className="space-y-3">
            <div className="pb-3 border-b border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="text-lg font-bold text-gray-900">₹{booking.totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Paid Amount</span>
                <span className="text-sm font-semibold text-green-600">₹{booking.paidAmount.toLocaleString('en-IN')}</span>
              </div>
              {booking.remainingAmount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="text-sm font-semibold text-orange-600">₹{booking.remainingAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">Payment Type</label>
              <span
                className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
                  booking.paymentType === 'full'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {booking.paymentType === 'full' ? 'Full Payment' : '35% Advance Payment'}
              </span>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">Payment Status</label>
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </span>
            </div>

            {/* Dynamic Pricing Breakdown */}
            <div className="pt-3 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-900 mb-2">Pricing Breakdown</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price</span>
                  <span className="text-gray-900">₹{booking.basePrice?.toLocaleString('en-IN') || 'N/A'}</span>
                </div>
                {booking.weekendMultiplier > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekend Multiplier ({(booking.weekendMultiplier * 100).toFixed(0)}%)</span>
                    <span className="text-gray-900">+₹{((booking.basePrice || 0) * booking.weekendMultiplier).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {booking.timeOfDayMultiplier > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Multiplier ({(booking.timeOfDayMultiplier * 100).toFixed(0)}%)</span>
                    <span className="text-gray-900">+₹{((booking.basePrice || 0) * booking.timeOfDayMultiplier).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {booking.demandSurge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Demand Surge ({(booking.demandSurge * 100).toFixed(0)}%)</span>
                    <span className="text-gray-900">+₹{((booking.basePrice || 0) * booking.demandSurge).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {booking.durationPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration Price</span>
                    <span className="text-gray-900">+₹{booking.durationPrice.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{booking.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantor Information */}
        {booking.guarantor && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3" style={{ color: '#3d096d' }}>
              Guarantor Information
            </h2>
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{booking.guarantor.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{booking.guarantor.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Guarantor ID</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{booking.guarantor.id}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => navigate(`/booking/${booking.id}/active`)}
            className="flex-1 px-4 py-3 bg-[#3d096d] text-white rounded-lg font-medium text-sm hover:bg-[#3d096d]/90 transition-colors"
          >
            Track Trip
          </button>
          <button
            onClick={() => navigate('/bookings')}
            className="flex-1 px-4 py-3 bg-white border-2 border-[#3d096d] text-[#3d096d] rounded-lg font-medium text-sm hover:bg-[#3d096d]/10 transition-colors"
          >
            Back to Bookings
          </button>
        </div>
      </main>
    </div>
  );
};

export default ActiveBookingPage;
