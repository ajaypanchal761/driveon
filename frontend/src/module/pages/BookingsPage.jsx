import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../theme/colors';
import SearchHeader from '../components/layout/SearchHeader';
import BottomNavbar from '../components/layout/BottomNavbar';
import BookingDetailsModal from '../components/common/BookingDetailsModal';
import useInViewAnimation from '../hooks/useInViewAnimation';

// Import car images for mock data
import carImg1 from '../../assets/car_img1-removebg-preview.png';
import carImg2 from '../../assets/car_img2.png';
import carImg4 from '../../assets/car_img4-removebg-preview.png';
import carImg5 from '../../assets/car_img5-removebg-preview.png';
import carImg6 from '../../assets/car_img6-removebg-preview.png';
import carImg8 from '../../assets/car_img8.png';

const carImages = [carImg1, carImg2, carImg4, carImg5, carImg6, carImg8];

/**
 * BookingCard Component - Individual booking card with scroll-based animation
 */
const BookingCard = ({ booking, index, navigate, setSelectedBooking, setShowDetailsModal, setCancellationBooking, setShowCancellationModal, getStatusColor, getStatusLabel, calculateDays, colors }) => {
  const [cardRef, isCardInView] = useInViewAnimation({ threshold: 0.1 });
  const [imageRef, isImageInView] = useInViewAnimation({ threshold: 0.1 });
  
  return (
    <div
      key={booking.id}
      ref={cardRef}
      className="rounded-2xl overflow-hidden shadow-lg md:max-w-none"
      style={{ 
        backgroundColor: colors.backgroundSecondary,
        opacity: isCardInView ? 1 : 0,
        transform: isCardInView ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`,
      }}
      onClick={() => {
        setSelectedBooking(booking);
        setShowDetailsModal(true);
      }}
    >
      {/* Car Image and Status Badge */}
      <div className="relative h-48 overflow-hidden">
        <img
          ref={imageRef}
          src={booking.car.image}
          alt={`${booking.car.brand} ${booking.car.model}`}
          className="w-full h-full object-cover"
          style={{
            opacity: isImageInView ? 1 : 0,
            transform: isImageInView ? 'scale(1)' : 'scale(1.1)',
            transition: `opacity 0.6s ease-out ${index * 0.1 + 0.2}s, transform 0.6s ease-out ${index * 0.1 + 0.2}s`,
          }}
        />
        {/* Status Badge */}
        <div 
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
          style={{ backgroundColor: getStatusColor(booking.status) }}
        >
          {getStatusLabel(booking.status)}
        </div>
      </div>

      {/* Booking Details */}
      <div className="p-4">
        {/* Car Info */}
        <div className="mb-3">
          <h3 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
            {booking.car.brand} {booking.car.model}
          </h3>
          <div className="flex items-center gap-3 text-xs" style={{ color: colors.textSecondary }}>
            <span>{booking.car.seats} Seats</span>
            <span>•</span>
            <span>{booking.car.transmission}</span>
            <span>•</span>
            <span>{booking.car.fuelType}</span>
          </div>
        </div>

        {/* Booking ID */}
        <div className="mb-3 pb-3 border-b" style={{ borderColor: colors.backgroundPrimary }}>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            Booking ID: <span className="font-semibold" style={{ color: colors.textPrimary }}>{booking.bookingId}</span>
          </p>
        </div>

        {/* Duration & Price */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: colors.backgroundPrimary }}>
          <div>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              {calculateDays(booking.pickupDate, booking.dropDate)} {calculateDays(booking.pickupDate, booking.dropDate) === 1 ? 'day' : 'days'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: colors.textSecondary }}>Total Amount</p>
            <p className="text-lg font-bold" style={{ color: colors.backgroundTertiary }}>
              ₹{booking.totalPrice.toLocaleString('en-IN')}
            </p>
            {booking.paymentStatus === 'partial' && booking.status !== 'confirmed' && (
              <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                Paid: ₹{booking.paidAmount.toLocaleString('en-IN')} | Remaining: ₹{booking.remainingAmount.toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {booking.status === 'confirmed' && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBooking(booking);
                setShowDetailsModal(true);
              }}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95"
              style={{ backgroundColor: colors.backgroundTertiary }}
            >
              View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCancellationBooking(booking);
                setShowCancellationModal(true);
              }}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95"
              style={{ backgroundColor: colors.error }}
            >
              Cancel
            </button>
          </div>
        )}
        {booking.status === 'active' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBooking(booking);
              setShowDetailsModal(true);
            }}
            className="w-full mt-3 py-2.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95"
            style={{ backgroundColor: colors.backgroundTertiary }}
          >
            View Details
          </button>
        )}
        {booking.status === 'completed' && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBooking(booking);
                setShowDetailsModal(true);
              }}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95"
              style={{ 
                backgroundColor: colors.backgroundPrimary,
                color: colors.textPrimary,
                border: `1px solid ${colors.backgroundTertiary}40`
              }}
            >
              View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/write-review/${booking.id}`, { state: { booking } });
              }}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95"
              style={{ 
                backgroundColor: colors.backgroundTertiary,
                boxShadow: `0 2px 8px ${colors.backgroundTertiary}40`
              }}
            >
              Write Review
            </button>
          </div>
        )}
        {booking.status === 'cancelled' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBooking(booking);
              setShowDetailsModal(true);
            }}
            className="w-full mt-3 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95"
            style={{ 
              backgroundColor: colors.backgroundPrimary,
              color: colors.textPrimary,
              border: `1px solid ${colors.error}40`
            }}
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * BookingsPage Component
 * My Bookings page for module frontend
 * Based on document.txt booking schema requirements
 * Shows bookings with status, trip status, payment details
 */
const BookingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed', 'cancelled'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cancellationBooking, setCancellationBooking] = useState(null);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  
  // Cancellation reasons
  const cancellationReasons = [
    'Change of plans',
    'Found a better option',
    'Financial constraints',
    'Car not available anymore',
    'Emergency situation',
    'Travel dates changed',
    'Other'
  ];

  // Function to fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock bookings data
    const mockBookings = [
        {
          id: '1',
          bookingId: 'BK001',
          car: {
            id: '1',
            brand: 'Ferrari',
            model: 'FF',
            image: carImg1,
            seats: 4,
            transmission: 'Automatic',
            fuelType: 'Petrol',
          },
          status: 'confirmed',
          tripStatus: 'not_started',
          paymentStatus: 'partial',
          pickupDate: '2024-01-15',
          pickupTime: '10:00',
          dropDate: '2024-01-18',
          dropTime: '18:00',
          totalPrice: 6000,
          paidAmount: 2100,
          remainingAmount: 3900,
          isTrackingActive: false,
          createdAt: '2024-01-10',
        },
        {
          id: '2',
          bookingId: 'BK002',
          car: {
            id: '2',
            brand: 'Tesla',
            model: 'Model S',
            image: carImg2,
            seats: 5,
            transmission: 'Automatic',
            fuelType: 'Electric',
          },
          status: 'active',
          tripStatus: 'in_progress',
          paymentStatus: 'paid',
          pickupDate: '2024-01-12',
          pickupTime: '09:00',
          dropDate: '2024-01-14',
          dropTime: '20:00',
          totalPrice: 3000,
          paidAmount: 3000,
          remainingAmount: 0,
          isTrackingActive: true,
          createdAt: '2024-01-08',
        },
        {
          id: '3',
          bookingId: 'BK003',
          car: {
            id: '3',
            brand: 'BMW',
            model: 'Series 3',
            image: carImg4,
            seats: 5,
            transmission: 'Automatic',
            fuelType: 'Petrol',
          },
          status: 'completed',
          tripStatus: 'completed',
          paymentStatus: 'paid',
          pickupDate: '2023-12-20',
          pickupTime: '11:00',
          dropDate: '2023-12-22',
          dropTime: '19:00',
          totalPrice: 4500,
          paidAmount: 4500,
          remainingAmount: 0,
          isTrackingActive: false,
          createdAt: '2023-12-15',
        },
        {
          id: '4',
          bookingId: 'BK004',
          car: {
            id: '4',
            brand: 'Audi',
            model: 'A4',
            image: carImg4,
            seats: 5,
            transmission: 'Automatic',
            fuelType: 'Diesel',
          },
          status: 'cancelled',
          tripStatus: 'cancelled',
          paymentStatus: 'refunded',
          pickupDate: '2024-01-20',
          pickupTime: '10:00',
          dropDate: '2024-01-22',
          dropTime: '18:00',
          totalPrice: 5400,
          paidAmount: 0,
          remainingAmount: 0,
          isTrackingActive: false,
          createdAt: '2024-01-05',
        },
      ];
      
      // Get bookings from localStorage
      try {
        const localBookings = JSON.parse(localStorage.getItem('localBookings') || '[]');
        
        // Merge local bookings with mock bookings (local bookings first)
        const allBookings = [...localBookings, ...mockBookings];
        
        setBookings(allBookings);
      } catch (error) {
        console.error('Error reading bookings from localStorage:', error);
        // If error, just use mock bookings
        setBookings(mockBookings);
      }
      
      setLoading(false);
    };

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle booking cancellation
  const handleCancelBooking = () => {
    if (!selectedReason) {
      alert('Please select a cancellation reason');
      return;
    }

    try {
      // Get bookings from localStorage
      const localBookings = JSON.parse(localStorage.getItem('localBookings') || '[]');
      
      // Update the booking status
      const updatedBookings = localBookings.map((booking) => {
        if (booking.id === cancellationBooking.id) {
          return {
            ...booking,
            status: 'cancelled',
            tripStatus: 'cancelled',
            cancellationReason: selectedReason,
            cancelledAt: new Date().toISOString(),
            cancelledBy: 'user',
          };
        }
        return booking;
      });
      
      // Save updated bookings to localStorage
      localStorage.setItem('localBookings', JSON.stringify(updatedBookings));
      
      // Update state
      setBookings((prevBookings) => {
        return prevBookings.map((booking) => {
          if (booking.id === cancellationBooking.id) {
            return {
              ...booking,
              status: 'cancelled',
              tripStatus: 'cancelled',
              cancellationReason: selectedReason,
              cancelledAt: new Date().toISOString(),
              cancelledBy: 'user',
            };
          }
          return booking;
        });
      });
      
      // Close modal and reset
      setShowCancellationModal(false);
      setCancellationBooking(null);
      setSelectedReason('');
      
      // Show success message
      alert('Booking cancelled successfully!');
      
      // Switch to cancelled tab
      setActiveTab('cancelled');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error cancelling booking. Please try again.');
    }
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return booking.status === 'confirmed' || booking.status === 'active';
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return colors.info;
      case 'active':
        return colors.success;
      case 'completed':
        return colors.textSecondary;
      case 'cancelled':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return colors.textTertiary;
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Format time
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${minute} ${period}`;
  };

  // Calculate days
  const calculateDays = (pickupDate, dropDate) => {
    if (!pickupDate || !dropDate) return 0;
    const pickup = new Date(pickupDate);
    const drop = new Date(dropDate);
    const diffTime = Math.abs(drop - pickup);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  return (
    <div 
      className="min-h-screen w-full pb-20 md:pb-8"
      style={{ backgroundColor: colors.backgroundPrimary }}
    >
      {/* Header */}
      <SearchHeader title="Bookings" />

      {/* Web container - max-width and centered on larger screens */}
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="px-4 md:px-6 lg:px-8 pt-4 md:pt-6 pb-3 md:pb-4">
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
          My Bookings
        </h1>
        <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
          Manage and track your car rentals
        </p>
        </div>

        {/* Tabs */}
        <div className="px-4 md:px-6 lg:px-8 mb-4 md:mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? colors.backgroundTertiary : colors.backgroundSecondary,
                color: activeTab === tab.id ? colors.backgroundSecondary : colors.textPrimary,
                boxShadow: activeTab === tab.id ? `0 2px 8px ${colors.backgroundTertiary}30` : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        </div>

        {/* Bookings List */}
        {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.backgroundTertiary }}
            ></div>
            <p style={{ color: colors.textSecondary }}>Loading bookings...</p>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <svg 
            className="w-20 h-20 mb-4"
            style={{ color: colors.textTertiary }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
            />
          </svg>
          <p className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>
            No bookings found
          </p>
          <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
            {activeTab === 'all' 
              ? "You don't have any bookings yet"
              : `No ${activeTab} bookings found`
            }
          </p>
        </div>
      ) : (
        <div className="px-4 md:px-6 lg:px-8 space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6 pb-4 md:pb-6">
          {filteredBookings.map((booking, index) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              index={index}
              navigate={navigate}
              setSelectedBooking={setSelectedBooking}
              setShowDetailsModal={setShowDetailsModal}
              setCancellationBooking={setCancellationBooking}
              setShowCancellationModal={setShowCancellationModal}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
              calculateDays={calculateDays}
              colors={colors}
            />
          ))}
        </div>
        )}
      </div>

      {/* Bottom Navbar - Hidden on web */}
      <div className="md:hidden">
        <BottomNavbar />
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBooking(null);
          }}
        />
      )}

      {/* Cancellation Modal */}
      {showCancellationModal && cancellationBooking && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowCancellationModal(false);
            setCancellationBooking(null);
            setSelectedReason('');
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              Cancel Booking
            </h2>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              Please select a reason for cancellation:
            </p>
            
            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {cancellationReasons.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center p-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    backgroundColor: selectedReason === reason ? colors.backgroundTertiary + '20' : colors.backgroundPrimary,
                    border: `1px solid ${selectedReason === reason ? colors.backgroundTertiary : 'transparent'}`,
                  }}
                >
                  <input
                    type="radio"
                    name="cancellationReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mr-3"
                    style={{ accentColor: colors.backgroundTertiary }}
                  />
                  <span style={{ color: colors.textPrimary }}>{reason}</span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancellationModal(false);
                  setCancellationBooking(null);
                  setSelectedReason('');
                }}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95"
                style={{
                  backgroundColor: colors.backgroundPrimary,
                  color: colors.textPrimary,
                  border: `1px solid ${colors.backgroundTertiary}40`
                }}
              >
                Close
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={!selectedReason}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.error }}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(1.1);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default BookingsPage;

