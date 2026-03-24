import { useEffect, useMemo, useState } from 'react';
import { colors } from '../../module/theme/colors';
import { Button } from '../../components/common';
import { FLEET_CAR_TYPES } from '../constants/fleetConstants';

const isValidPhone = (value) => {
  if (!value) return false;
  const digits = String(value).replace(/\D/g, '');
  return digits.length >= 8;
};

const AddOutwardCarModal = ({ open, onClose, onCreate }) => {
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [carName, setCarName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setOwnerName('');
    setOwnerPhone('');
    setCarName('');
    setBrand('');
    setModel('');
    setLocation('');
    setPricePerDay('');
    setSubmitting(false);
    setError('');
  }, [open]);

  const canSubmit = useMemo(() => {
    if (!ownerName.trim()) return false;
    if (!isValidPhone(ownerPhone)) return false;
    if (!carName.trim()) return false;
    if (!brand.trim()) return false;
    if (!model.trim()) return false;
    if (!location.trim()) return false;
    const price = Number(pricePerDay);
    if (!Number.isFinite(price) || price <= 0) return false;
    return true;
  }, [ownerName, ownerPhone, carName, brand, model, location, pricePerDay]);

  const handleCreate = async () => {
    setError('');
    if (!canSubmit) {
      setError('Please fill all required fields with valid values.');
      return;
    }
    setSubmitting(true);
    try {
      const car = {
        id: `fleet_car_out_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        name: carName.trim(),
        brand: brand.trim(),
        model: model.trim(),
        pricePerDay: Number(pricePerDay),
        location: location.trim(),
        type: FLEET_CAR_TYPES.OUTWARD,
        ownerName: ownerName.trim(),
        ownerPhone: ownerPhone.trim(),
        createdAt: new Date().toISOString(),
      };
      await onCreate(car);
      onClose();
    } catch (e) {
      setError(e?.message || 'Failed to create car');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl rounded-xl shadow-xl border"
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
                Add Outward Car
              </h2>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                Enter owner details + car details (saved locally in this browser).
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
            <div>
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                Owner Name <span style={{ color: colors.accentRed }}>*</span>
              </label>
              <input
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                placeholder="Enter owner name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                Owner Number <span style={{ color: colors.accentRed }}>*</span>
              </label>
              <input
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                placeholder="Enter phone number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                Car Name <span style={{ color: colors.accentRed }}>*</span>
              </label>
              <input
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                placeholder="e.g. City Ride"
              />
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                Brand <span style={{ color: colors.accentRed }}>*</span>
              </label>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                placeholder="e.g. Maruti"
              />
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                Model <span style={{ color: colors.accentRed }}>*</span>
              </label>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                placeholder="e.g. Swift"
              />
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                Location <span style={{ color: colors.accentRed }}>*</span>
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                placeholder="e.g. Indore"
              />
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                Price/Day <span style={{ color: colors.accentRed }}>*</span>
              </label>
              <input
                type="number"
                min="1"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundPrimary }}
                placeholder="e.g. 1200"
              />
            </div>
          </div>

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
            onClick={handleCreate}
            disabled={!canSubmit || submitting}
            className="px-4 py-2"
            style={{
              backgroundColor: colors.backgroundTertiary,
              color: colors.textWhite,
              opacity: !canSubmit || submitting ? 0.6 : 1,
            }}
          >
            {submitting ? 'Saving...' : 'Add Car'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddOutwardCarModal;

