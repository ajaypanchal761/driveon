import { useEffect, useMemo, useState } from 'react';
import { colors } from '../../module/theme/colors';
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

  const handleConfirm = async () => {
    setError('');
    if (!canSubmit) {
      setError('Please fill all required fields with valid dates.');
      return;
    }
    setSubmitting(true);
    try {
      await onConfirm({
        customerName: customerName.trim(),
        fromDate,
        toDate,
        licenseImage: licensePreview,
        aadhaarImage: aadhaarPreview || '',
        totalPrice,
      });
      onClose();
    } catch (e) {
      setError(e?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !car) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className="relative w-full max-w-xl rounded-xl shadow-xl border"
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

        <div className="p-5 space-y-4">
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
