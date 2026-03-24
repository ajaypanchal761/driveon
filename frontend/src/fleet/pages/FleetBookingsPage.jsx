import { useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import { colors } from '../../module/theme/colors';
import { useFleet } from '../context/FleetContext';
import { FLEET_BOOKING_FILTERS } from '../constants/fleetConstants';

const FleetBookingsPage = () => {
  const { bookings } = useFleet();
  const [typeFilter, setTypeFilter] = useState(FLEET_BOOKING_FILTERS.ALL);

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
            <Card key={b.id} className="p-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                    {b.carName}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    Customer: <span className="font-medium">{b.customerName}</span>
                  </p>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    Dates: {b.fromDate} → {b.toDate}
                  </p>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    Type: <span className="font-medium">{b.carType}</span>
                  </p>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    Total: <span className="font-semibold">₹{b.totalPrice}</span>
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
    </div>
  );
};

export default FleetBookingsPage;
