import { useEffect } from 'react';
import { colors } from '../../theme/colors';

/**
 * BookingDetailsModal Component
 * Shows comprehensive booking details in a popup modal
 * Based on document.txt booking schema requirements
 */
const BookingDetailsModal = ({ booking, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Format time
  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
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

  // Calculate delay and additional charges
  const calculateDelay = (dropDate, dropTime) => {
    if (!dropDate) return null;
    
    // Combine date and time to get exact end datetime
    const dropDateTime = new Date(dropDate);
    if (dropTime) {
      const [hours, minutes] = dropTime.split(':');
      dropDateTime.setHours(parseInt(hours) || 0, parseInt(minutes) || 0, 0, 0);
    }
    
    const now = new Date();
    const delayMs = now - dropDateTime;
    
    // Only show delay if trip end date has passed
    if (delayMs <= 0) return null;
    
    const delayHours = Math.floor(delayMs / (1000 * 60 * 60));
    const delayDays = Math.floor(delayHours / 24);
    const remainingHours = delayHours % 24;
    
    // Calculate additional charges (dummy data)
    // Base rate: ₹500 per hour for first 24 hours, then ₹1000 per day
    let additionalCharges = 0;
    if (delayDays === 0) {
      // Less than 24 hours: ₹500 per hour
      additionalCharges = delayHours * 500;
    } else {
      // First 24 hours: ₹500 per hour
      additionalCharges = 24 * 500;
      // After 24 hours: ₹1000 per day
      additionalCharges += delayDays * 1000;
      // Remaining hours: ₹500 per hour
      if (remainingHours > 0) {
        additionalCharges += remainingHours * 500;
      }
    }
    
    return {
      delayHours,
      delayDays,
      remainingHours,
      additionalCharges,
      delayText: delayDays > 0 
        ? `${delayDays} day${delayDays > 1 ? 's' : ''} ${remainingHours > 0 ? `and ${remainingHours} hour${remainingHours > 1 ? 's' : ''}` : ''}`
        : `${delayHours} hour${delayHours > 1 ? 's' : ''}`
    };
  };

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

  // Get payment status label
  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'partial':
        return 'Partial';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };

  if (!booking) return null;

  const days = calculateDays(booking.pickupDate, booking.dropDate);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: colors.backgroundSecondary }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between p-4 border-b"
          style={{
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.backgroundPrimary,
          }}
        >
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            Booking Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              style={{ color: colors.textPrimary }}
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

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Car Image and Info */}
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img
              src={booking.car?.image}
              alt={`${booking.car?.brand} ${booking.car?.model}`}
              className="w-full h-48 object-cover"
            />
            <div
              className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
              style={{ backgroundColor: getStatusColor(booking.status) }}
            >
              {getStatusLabel(booking.status)}
            </div>
          </div>

          {/* Car Details */}
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
                {booking.car?.brand} {booking.car?.model}
              </h3>
              <div className="flex items-center gap-3 text-sm" style={{ color: colors.textSecondary }}>
                <span>{booking.car?.seats} Seats</span>
                <span>•</span>
                <span>{booking.car?.transmission}</span>
                <span>•</span>
                <span>{booking.car?.fuelType}</span>
              </div>
            </div>

            {/* Booking ID */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: colors.backgroundPrimary }}>
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                Booking ID
              </p>
              <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                {booking.bookingId || 'N/A'}
              </p>
            </div>

            {/* Delay Message - Show if trip end date has passed */}
            {(() => {
              const delayInfo = calculateDelay(booking.dropDate, booking.dropTime);
              if (!delayInfo || booking.status === 'completed' || booking.status === 'cancelled') return null;
              
              return (
                <div className="p-4 rounded-lg border-2" style={{
                  backgroundColor: colors.warning + '15',
                  borderColor: colors.warning + '40'
                }}>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.warning }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        Trip End Date Passed
                      </p>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: colors.textSecondary }}>
                        Your trip end date has passed by {delayInfo.delayText}. Additional charges will be applied.
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: colors.warning + '30' }}>
                        <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                          Additional Charges:
                        </span>
                        <span className="text-sm font-bold" style={{ color: colors.warning }}>
                          ₹{delayInfo.additionalCharges.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Pending Status Note for Physical Verification */}
            {booking.status === 'pending' && (
              <div
                className="p-4 rounded-lg space-y-2"
                style={{
                  backgroundColor: '#FFF3E0',
                  borderLeft: '4px solid #FF9800',
                }}
              >
                <div className="flex items-start gap-2">
                  <svg 
                    className="w-5 h-5 flex-shrink-0 mt-0.5" 
                    style={{ color: '#FF9800' }}
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
                    <p className="text-sm font-bold mb-1" style={{ color: '#FF9800' }}>
                      Booking Status: Pending
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: '#333' }}>
                      Your booking is currently showing as <span className="font-semibold">Pending</span> because physical document verification at the office is still pending. Once your documents are verified at the office, your booking status will be updated to <span className="font-semibold">Confirmed</span>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trip Details */}
          <div className="space-y-3">
            <h4 className="text-base font-bold" style={{ color: colors.textPrimary }}>
              Trip Details
            </h4>
            <div className="space-y-3">
              {/* Pickup */}
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.backgroundPrimary }}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.backgroundSecondary }}>
                    <svg
                      className="w-5 h-5"
                      style={{ color: colors.success }}
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
                  </div>
                  <div className="flex-1">
                    <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                      Pickup
                    </p>
                    <p className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {formatDate(booking.pickupDate)} at {formatTime(booking.pickupTime)}
                    </p>
                    {booking.pickupLocation && (
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        {booking.pickupLocation}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Drop */}
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.backgroundPrimary }}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.backgroundSecondary }}>
                    <svg
                      className="w-5 h-5"
                      style={{ color: colors.error }}
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
                  </div>
                  <div className="flex-1">
                    <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                      Drop
                    </p>
                    <p className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {formatDate(booking.dropDate)} at {formatTime(booking.dropTime)}
                    </p>
                    {booking.dropLocation && (
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        {booking.dropLocation}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.backgroundPrimary }}>
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Duration
                  </p>
                  <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    {days} {days === 1 ? 'day' : 'days'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3">
            <h4 className="text-base font-bold" style={{ color: colors.textPrimary }}>
              Payment Details
            </h4>
            <div className="p-3 rounded-lg space-y-2" style={{ backgroundColor: colors.backgroundPrimary }}>
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Payment Status
                </p>
                <span
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{
                    backgroundColor:
                      booking.paymentStatus === 'paid'
                        ? colors.success + '20'
                        : booking.paymentStatus === 'partial'
                        ? colors.warning + '20'
                        : colors.error + '20',
                    color:
                      booking.paymentStatus === 'paid'
                        ? colors.success
                        : booking.paymentStatus === 'partial'
                        ? colors.warning
                        : colors.error,
                  }}
                >
                  {getPaymentStatusLabel(booking.paymentStatus)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Payment Option
                </p>
                <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {booking.paymentOption === 'advance' ? '35% Advance' : 'Full Payment'}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: colors.backgroundSecondary }}>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Total Amount
                </p>
                <p className="text-base font-bold" style={{ color: colors.backgroundTertiary }}>
                  ₹{booking.totalPrice?.toLocaleString('en-IN') || '0'}
                </p>
              </div>
              {booking.paidAmount > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Paid Amount
                  </p>
                  <p className="text-sm font-semibold" style={{ color: colors.success }}>
                    ₹{booking.paidAmount?.toLocaleString('en-IN') || '0'}
                  </p>
                </div>
              )}
              {booking.remainingAmount > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Remaining Amount
                  </p>
                  <p className="text-sm font-semibold" style={{ color: colors.warning }}>
                    ₹{booking.remainingAmount?.toLocaleString('en-IN') || '0'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Breakdown (if available) */}
          {booking.pricing && (
            <div className="space-y-3">
              <h4 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                Pricing Breakdown
              </h4>
              <div className="p-3 rounded-lg space-y-2" style={{ backgroundColor: colors.backgroundPrimary }}>
                {booking.pricing.basePrice && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Base Price
                    </p>
                    <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      ₹{booking.pricing.basePrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
                {booking.pricing.weekendMultiplier > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Weekend Surcharge
                    </p>
                    <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      +₹{booking.pricing.weekendMultiplier.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
                {booking.pricing.holidayMultiplier > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Holiday Surcharge
                    </p>
                    <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      +₹{booking.pricing.holidayMultiplier.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
                {booking.pricing.demandSurge > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Demand Surge
                    </p>
                    <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      +₹{booking.pricing.demandSurge.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
                {booking.pricing.discount > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: colors.success }}>
                      Discount
                    </p>
                    <p className="text-sm font-semibold" style={{ color: colors.success }}>
                      -₹{booking.pricing.discount.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
                {booking.pricing.couponCode && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Coupon Code
                    </p>
                    <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {booking.pricing.couponCode}
                    </p>
                  </div>
                )}
                {booking.pricing.finalPrice && (
                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: colors.backgroundSecondary }}>
                    <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Final Price
                    </p>
                    <p className="text-base font-bold" style={{ color: colors.backgroundTertiary }}>
                      ₹{booking.pricing.finalPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Trip Status */}
          <div className="space-y-3">
            <h4 className="text-base font-bold" style={{ color: colors.textPrimary }}>
              Trip Status
            </h4>
            <div className="p-3 rounded-lg" style={{ backgroundColor: colors.backgroundPrimary }}>
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Status
                </p>
                <span
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: getStatusColor(booking.tripStatus || booking.status) + '20',
                    color: getStatusColor(booking.tripStatus || booking.status),
                  }}
                >
                  {getStatusLabel(booking.tripStatus || booking.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Date */}
          {booking.createdAt && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: colors.backgroundPrimary }}>
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Booking Date
                </p>
                <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {formatDate(booking.createdAt)}
                </p>
              </div>
            </div>
          )}

          {/* Guarantor Info (if available) */}
          {booking.guarantor && (
            <div className="space-y-3">
              <h4 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                Guarantor Information
              </h4>
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.backgroundPrimary }}>
                <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
                  Name
                </p>
                <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {booking.guarantor.name || 'N/A'}
                </p>
                {booking.guarantor.phone && (
                  <>
                    <p className="text-sm mt-2 mb-1" style={{ color: colors.textSecondary }}>
                      Phone
                    </p>
                    <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {booking.guarantor.phone}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t" style={{ borderColor: colors.backgroundPrimary, backgroundColor: colors.backgroundSecondary }}>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-95"
            style={{ backgroundColor: colors.backgroundTertiary }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;

