import { useEffect, useMemo, useState } from 'react';
import { colors } from '../../module/theme/colors';
import api from '../../services/api';
import { Button } from '../../components/common';
import {
  getNumberOfDaysInclusive,
  isValidDateRange,
  rangesOverlapInclusive,
} from '../utils/fleetDateUtils';

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

const BookingModal = ({ open, onClose, car, existingBookings, onConfirm }) => {
  const [customerName, setCustomerName] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [licenseFile, setLicenseFile] = useState(null);
  const [licensePreview, setLicensePreview] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending | paid
  const [paymentMode, setPaymentMode] = useState('cash'); // cash | upi | card | bank_transfer
  const [paidAmount, setPaidAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setCustomerName('');
    setFromDate('');
    setToDate('');
    setLicenseFile(null);
    setLicensePreview('');
    setAadhaarFile(null);
    setAadhaarPreview('');
    setPaymentStatus('pending');
    setPaymentMode('cash');
    setPaidAmount('');
    setSubmitting(false);
    setError('');
  }, [open, car?.id]);

  const numberOfDays = useMemo(() => getNumberOfDaysInclusive(fromDate, toDate), [fromDate, toDate]);

  const totalPrice = useMemo(() => {
    if (!car) return 0;
    return numberOfDays * Number(car.pricePerDay || 0);
  }, [car, numberOfDays]);

  const hasOverlap = useMemo(() => {
    if (!fromDate || !toDate) return false;
    if (!isValidDateRange(fromDate, toDate)) return false;
    return (existingBookings || []).some((b) =>
      rangesOverlapInclusive(fromDate, toDate, b.fromDate, b.toDate)
    );
  }, [existingBookings, fromDate, toDate]);

  const canSubmit = useMemo(() => {
    if (!car) return false;
    if (!customerName.trim()) return false;
    if (!licenseFile || !licensePreview) return false;
    if (!fromDate || !toDate) return false;
    if (!isValidDateRange(fromDate, toDate)) return false;
    if (hasOverlap) return false;
    return true;
  }, [car, customerName, fromDate, toDate, licenseFile, licensePreview, hasOverlap]);

  const onPickFile = async (file) => {
    setError('');
    setLicenseFile(file);
    if (!file) {
      setLicensePreview('');
      return;
    }
    try {
      const url = await fileToDataUrl(file);
      setLicensePreview(String(url || ''));
    } catch (e) {
      setLicenseFile(null);
      setLicensePreview('');
      setError(e?.message || 'Failed to load image');
    }
  };

  const onPickAadhaar = async (file) => {
    setError('');
    setAadhaarFile(file);
    if (!file) {
      setAadhaarPreview('');
      return;
    }
    try {
      const url = await fileToDataUrl(file);
      setAadhaarPreview(String(url || ''));
    } catch (e) {
      setAadhaarFile(null);
      setAadhaarPreview('');
      setError(e?.message || 'Failed to load image');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.id = 'razorpay-checkout-js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Razorpay script loaded');
        resolve(true);
      };
      script.onerror = () => {
        console.error('❌ Razorpay script load failed');
        resolve(false);
      };
      document.head.appendChild(script);
    });
  };

  const handleConfirm = async () => {
    setError('');
    
    if (!customerName.trim()) {
      setError('Please enter customer name');
      return;
    }
    if (!fromDate || !toDate || !isValidDateRange(fromDate, toDate)) {
      setError('Please select a valid date range');
      return;
    }
    if (!licenseFile || !licensePreview) {
      setError('Please upload a driving license image');
      return;
    }
    if (hasOverlap) {
      setError('Car is already booked for these dates');
      return;
    }

    setSubmitting(true);
    try {
      const normalizedPaidAmount =
        paymentStatus === 'paid'
          ? Math.max(0, Math.min(totalPrice || 0, Number(paidAmount || totalPrice || 0)))
          : 0;
          
      const bookingPayload = {
        id: `out_book_${Date.now()}`,
        carId: car.id,
        carName: car.name,
        carType: car.type,
        carOwnerName: car.ownerName || '',
        customerName: customerName.trim(),
        licenseImage: licensePreview,
        aadhaarImage: aadhaarPreview || '',
        fromDate,
        toDate,
        totalPrice,
        paymentStatus,
        paymentMode: paymentStatus === 'paid' ? paymentMode : 'Cash',
        paidAmount: normalizedPaidAmount,
      };

      // Check for Razorpay flow
      if (paymentStatus === 'paid' && paymentMode === 'razorpay') {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          throw new Error('Could not load Razorpay. Please check your internet connection.');
        }

        // 1. Create Order on Backend
        const orderResponse = await api.post('/fleet/razorpay/create-order', {
          amount: normalizedPaidAmount,
        });

        if (!orderResponse.data.success) {
          throw new Error(orderResponse.data.message || 'Failed to initialize payment');
        }

        const order = orderResponse.data.data;

        // 2. Open Razorpay Checkout
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_8sYbzHWidwe5Zw',
          amount: order.amount,
          currency: 'INR',
          name: 'DriveOn Admin',
          description: `Fleet Booking: ${car.name}`,
          order_id: order.id,
          handler: async function (response) {
            try {
              // 3. Verify Payment
              const verifyRes = await api.post('/fleet/razorpay/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.data.success) {
                // 4. Save Booking to DB
                bookingPayload.paymentMode = 'Razorpay / Online';
                bookingPayload.paymentStatus = 'paid';
                bookingPayload.paidAmount = normalizedPaidAmount;
                
                await onConfirm(bookingPayload);
                onClose();
              } else {
                setError('Payment verification failed. Please contact admin.');
              }
            } catch (err) {
              console.error('Verify error:', err);
              setError('Error verifying payment.');
            } finally {
              setSubmitting(false);
            }
          },
          prefill: {
            name: customerName,
            contact: car.ownerPhone || '', 
          },
          theme: {
            color: '#3B82F6',
          },
          modal: {
            ondismiss: function() {
              setSubmitting(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

      } else {
        // Cash or Pending Flow (Direct Confirm)
        await onConfirm(bookingPayload);
        onClose();
      }
    } catch (e) {
      console.error('Booking Error:', e);
      setError(e?.message || 'Something went wrong');
      setSubmitting(false);
    }
  };

  if (!open || !car) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className="relative w-full max-w-xl rounded-xl shadow-xl border flex flex-col max-h-[90vh] overflow-hidden"
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
                Book Car
              </h2>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                {car.name} • ₹{car.pricePerDay}/day • {car.location}
              </p>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                Customer Name <span style={{ color: colors.accentRed }}>*</span>
              </label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                From Date <span style={{ color: colors.accentRed }}>*</span>
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                To Date <span style={{ color: colors.accentRed }}>*</span>
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                Driving License (Image) <span style={{ color: colors.accentRed }}>*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onPickFile(e.target.files?.[0] || null)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
              />
              {licensePreview ? (
                <img
                  src={licensePreview}
                  alt="License preview"
                  className="mt-3 h-36 w-full object-contain rounded-lg border"
                  style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                />
              ) : null}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                Aadhaar (Image) <span style={{ color: colors.textSecondary }}>(Optional)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onPickAadhaar(e.target.files?.[0] || null)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
              />
              {aadhaarPreview ? (
                <img
                  src={aadhaarPreview}
                  alt="Aadhaar preview"
                  className="mt-3 h-36 w-full object-contain rounded-lg border"
                  style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                />
              ) : null}
            </div>
          </div>

          <div
            className="rounded-lg border p-3 flex flex-wrap items-center justify-between gap-2"
            style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
          >
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              Days (inclusive): <span className="font-semibold">{numberOfDays || 0}</span>
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              Total Price:{' '}
              <span className="font-semibold" style={{ color: colors.textPrimary }}>
                ₹{totalPrice || 0}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => {
                  const next = e.target.value;
                  setPaymentStatus(next);
                  if (next === 'paid') {
                    setPaidAmount(String(totalPrice || 0));
                  } else {
                    setPaidAmount('');
                  }
                }}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                disabled={paymentStatus !== 'paid'}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{
                  borderColor: colors.borderMedium,
                  backgroundColor: colors.backgroundPrimary,
                  opacity: paymentStatus !== 'paid' ? 0.6 : 1,
                }}
              >
                <option value="cash">Cash</option>
                <option value="razorpay">Razorpay / Online</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                Paid Amount
              </label>
              <input
                type="number"
                min={0}
                max={totalPrice || 0}
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                disabled={paymentStatus !== 'paid'}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{
                  borderColor: colors.borderMedium,
                  backgroundColor: colors.backgroundPrimary,
                  opacity: paymentStatus !== 'paid' ? 0.6 : 1,
                }}
                placeholder={String(totalPrice || 0)}
              />
            </div>
          </div>

          {!isValidDateRange(fromDate, toDate) && fromDate && toDate ? (
            <p className="text-sm" style={{ color: colors.accentRed }}>
              Invalid date range. “From Date” must be before or same as “To Date”.
            </p>
          ) : null}

          {hasOverlap ? (
            <p className="text-sm" style={{ color: colors.accentRed }}>
              This car is already booked for the selected dates.
            </p>
          ) : null}

          {error ? (
            <p className="text-sm" style={{ color: colors.accentRed }}>
              {error}
            </p>
          ) : null}
        </div>

        <div className="p-5 border-t flex justify-end gap-2" style={{ borderTopColor: colors.borderMedium }}>
          <Button
            onClick={onClose}
            className="px-4 py-2"
            style={{
              backgroundColor: colors.backgroundLight,
              color: colors.textPrimary,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canSubmit || submitting}
            className="px-4 py-2"
            style={{
              backgroundColor: colors.backgroundTertiary,
              color: colors.textWhite,
              opacity: !canSubmit || submitting ? 0.6 : 1,
            }}
          >
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
