import { useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import { colors } from '../../module/theme/colors';
import { useFleet } from '../context/FleetContext';
import { FLEET_BOOKING_FILTERS } from '../constants/fleetConstants';

const RUPEE = '\u20B9';
const DOT = '\u2022';
const ARROW = '\u2192';

const formatCurrency = (value) => {
  const num = Number(value || 0);
  const safe = Number.isFinite(num) ? num : 0;
  return `${RUPEE}${new Intl.NumberFormat('en-IN').format(safe)}`;
};

const formatDateTime = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
};

const getTodayStr = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(
    2,
    '0'
  )}`;
};

const getBookingStatus = (booking) => {
  const todayStr = getTodayStr();
  const fromDate = booking?.fromDate || '';
  const toDate = booking?.toDate || '';
  if (!fromDate || !toDate) return 'unknown';
  if (todayStr < fromDate) return 'upcoming';
  if (todayStr > toDate) return 'completed';
  return 'active';
};

const BookingDetailsModal = ({ open, booking, onClose }) => {
  if (!open || !booking) return null;

  const bookingStatus = getBookingStatus(booking);
  const paymentStatus = booking.paymentStatus || 'pending';
  const paymentMode = booking.paymentMode || '';
  const paidAmount = Number(booking.paidAmount || 0);
  const totalPrice = Number(booking.totalPrice || 0);
  const safePaidAmount = Math.max(
    0,
    Math.min(Number.isFinite(totalPrice) ? totalPrice : 0, Number.isFinite(paidAmount) ? paidAmount : 0)
  );
  const dueAmount = Math.max(0, (Number.isFinite(totalPrice) ? totalPrice : 0) - safePaidAmount);
  const bookingStatusLabel = bookingStatus ? `${String(bookingStatus).charAt(0).toUpperCase()}${String(bookingStatus).slice(1)}` : '';
  const paymentStatusLabel =
    paymentStatus === 'paid' ? 'Paid' : 'Pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className="relative w-full max-w-4xl rounded-xl shadow-xl border flex flex-col max-h-[90vh] overflow-hidden"
        style={{
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.borderMedium,
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 border-b" style={{ borderBottomColor: colors.borderMedium }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                Booking Details
              </h2>
              <p className="hidden" style={{ color: colors.textSecondary }}>
                {booking.carName} â€¢ {booking.customerName}
              </p>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                {booking.carName} {DOT} {booking.customerName}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full border"
                  style={{
                    color: colors.textPrimary,
                    borderColor: colors.borderMedium,
                    backgroundColor: colors.backgroundPrimary,
                  }}
                >
                  Status: {bookingStatusLabel}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full border"
                  style={{
                    color: colors.textPrimary,
                    borderColor: colors.borderMedium,
                    backgroundColor: colors.backgroundPrimary,
                  }}
                >
                  Payment: {paymentStatusLabel}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full border"
                  style={{
                    color: colors.textPrimary,
                    borderColor: colors.borderMedium,
                    backgroundColor: colors.backgroundPrimary,
                  }}
                >
                  Total: {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border"
              style={{ borderColor: colors.borderMedium, color: colors.textPrimary }}
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4 flex-1 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4" padding={false}>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Booking ID:{' '}
                <span className="break-all" style={{ color: colors.textPrimary }}>
                  {booking.id}
                </span>
              </p>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                Car ID:{' '}
                <span className="break-all" style={{ color: colors.textPrimary }}>
                  {booking.carId}
                </span>
              </p>
              {booking.carOwnerName ? (
                <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                  Owner: <span style={{ color: colors.textPrimary }}>{booking.carOwnerName}</span>
                </p>
              ) : null}
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                Type: <span style={{ color: colors.textPrimary }}>{booking.carType}</span>
              </p>
              <p className="hidden" style={{ color: colors.textSecondary }}>
                Dates:{' '}
                <span style={{ color: colors.textPrimary }}>
                  {booking.fromDate} â†’ {booking.toDate}
                </span>
              </p>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                Dates:{' '}
                <span style={{ color: colors.textPrimary }}>
                  {booking.fromDate} {ARROW} {booking.toDate}
                </span>
              </p>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                Status: <span style={{ color: colors.textPrimary }}>{bookingStatusLabel}</span>
              </p>
              {booking.createdAt ? (
                <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                  Created: <span style={{ color: colors.textPrimary }}>{formatDateTime(booking.createdAt)}</span>
                </p>
              ) : null}
              <p className="hidden" style={{ color: colors.textSecondary }}>
                Total: <span style={{ color: colors.textPrimary }}>â‚¹{booking.totalPrice}</span>
              </p>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                Total: <span style={{ color: colors.textPrimary }}>{formatCurrency(totalPrice)}</span>
              </p>
            </Card>

            <Card className="p-4" padding={false}>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Payment Status:{' '}
                <span style={{ color: colors.textPrimary }}>{paymentStatusLabel}</span>
              </p>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                Payment Mode:{' '}
                <span style={{ color: colors.textPrimary }}>{paymentMode || '-'}</span>
              </p>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                Total: <span style={{ color: colors.textPrimary }}>{formatCurrency(totalPrice)}</span>
              </p>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                Paid: <span style={{ color: colors.textPrimary }}>{formatCurrency(safePaidAmount)}</span>
              </p>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                Due: <span style={{ color: colors.textPrimary }}>{formatCurrency(dueAmount)}</span>
              </p>
              <p className="hidden" style={{ color: colors.textSecondary }}>
                Paid Amount: <span style={{ color: colors.textPrimary }}>â‚¹{paidAmount}</span>
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                Driving License
              </p>
              {booking.licenseImage ? (
                <img
                  src={booking.licenseImage}
                  alt="License"
                  className="h-56 md:h-64 w-full object-contain rounded-lg border"
                  style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                />
              ) : (
                <div
                  className="h-56 md:h-64 w-full rounded-lg border flex items-center justify-center text-sm"
                  style={{ borderColor: colors.borderMedium, color: colors.textSecondary }}
                >
                  No image
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                Aadhaar
              </p>
              {booking.aadhaarImage ? (
                <img
                  src={booking.aadhaarImage}
                  alt="Aadhaar"
                  className="h-56 md:h-64 w-full object-contain rounded-lg border"
                  style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                />
              ) : (
                <div
                  className="h-56 md:h-64 w-full rounded-lg border flex items-center justify-center text-sm"
                  style={{ borderColor: colors.borderMedium, color: colors.textSecondary }}
                >
                  Not provided
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FleetBookingsPage = () => {
  const { bookings } = useFleet();
  const [typeFilter, setTypeFilter] = useState(FLEET_BOOKING_FILTERS.ALL);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = useMemo(() => {
    if (typeFilter === FLEET_BOOKING_FILTERS.ALL) return bookings;
    return bookings.filter((b) => b.carType === typeFilter);
  }, [bookings, typeFilter]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            All Bookings
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium" style={{ color: colors.textPrimary }}>
              Filter:
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundSecondary }}
            >
              <option value={FLEET_BOOKING_FILTERS.ALL}>All</option>
              <option value={FLEET_BOOKING_FILTERS.OUTWARD}>Outward</option>
              <option value={FLEET_BOOKING_FILTERS.INWARD}>Inward</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.length === 0 ? (
          <Card className="p-6">
            <p style={{ color: colors.textSecondary }}>No bookings found.</p>
          </Card>
        ) : (
          filteredBookings.map((b) => (
            <Card
              key={b.id}
              className="p-4"
              variant="clickable"
              onClick={() => setSelectedBooking(b)}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                    {b.carName}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    Customer: <span className="font-medium">{b.customerName}</span>
                  </p>
                  <p className="hidden" style={{ color: colors.textSecondary }}>
                    Dates: {b.fromDate} → {b.toDate}
                  </p>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    Dates: {b.fromDate} {ARROW} {b.toDate}
                  </p>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    Type: <span className="font-medium">{b.carType}</span>
                  </p>
                  <p className="hidden" style={{ color: colors.textSecondary }}>
                    Total: <span className="font-semibold">₹{b.totalPrice}</span>
                  </p>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    Total: <span className="font-semibold">{formatCurrency(b.totalPrice)}</span>
                  </p>
                </div>

                <div className="w-full md:w-64">
                  <p className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    License Preview
                  </p>
                  {b.licenseImage ? (
                    <img
                      src={b.licenseImage}
                      alt="License"
                      className="h-36 w-full object-contain rounded-lg border"
                      style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                    />
                  ) : (
                    <div
                      className="h-36 w-full rounded-lg border flex items-center justify-center text-sm"
                      style={{ borderColor: colors.borderMedium, color: colors.textSecondary }}
                    >
                      No image
                    </div>
                  )}
                </div>

                <div className="w-full md:w-64">
                  <p className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    Aadhaar Preview
                  </p>
                  {b.aadhaarImage ? (
                    <img
                      src={b.aadhaarImage}
                      alt="Aadhaar"
                      className="h-36 w-full object-contain rounded-lg border"
                      style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                    />
                  ) : (
                    <div
                      className="h-36 w-full rounded-lg border flex items-center justify-center text-sm"
                      style={{ borderColor: colors.borderMedium, color: colors.textSecondary }}
                    >
                      Not provided
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <BookingDetailsModal
        open={Boolean(selectedBooking)}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
};

export default FleetBookingsPage;
