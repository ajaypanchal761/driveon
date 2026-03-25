import { useMemo, useState, useEffect } from 'react';
import BookingModal from '../components/BookingModal';
import CarCard from '../components/CarCard';
import { useFleet } from '../context/FleetContext';
import { FLEET_CAR_TYPES } from '../constants/fleetConstants';
import { isTodayWithinRangeInclusive } from '../utils/fleetDateUtils';
import Card from '../../components/common/Card';
import { colors } from '../../module/theme/colors';
import { Button } from '../../components/common';
import AddOutwardCarModal from '../components/AddOutwardCarModal';
import { crmService } from '../../services/crm.service';

const OutwardCarsPage = () => {
  const { cars, getBookingsForCar, addBooking, addCar } = useFleet();
  const [selectedCar, setSelectedCar] = useState(null);
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [showAddCar, setShowAddCar] = useState(false);

  const outwardCars = useMemo(
    () => cars.filter((c) => c.type === FLEET_CAR_TYPES.OUTWARD),
    [cars]
  );

  const [dbVendors, setDbVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await crmService.getVendors();
        if (response.success && response.data?.vendors) {
          setDbVendors(response.data.vendors);
        }
      } catch (error) {
        console.error("Failed to fetch vendors", error);
      }
    };
    fetchVendors();
  }, []);

  const ownerOptions = useMemo(() => {
    const fromCars = outwardCars.map((c) => c.ownerName).filter(Boolean);
    const fromDb = dbVendors.map(v => v.name);
    return Array.from(new Set([...fromCars, ...fromDb])).sort((a, b) => String(a).localeCompare(String(b)));
  }, [outwardCars, dbVendors]);

  const visibleCars = useMemo(() => {
    if (ownerFilter === 'all') return outwardCars;
    return outwardCars.filter((c) => c.ownerName === ownerFilter);
  }, [outwardCars, ownerFilter]);

  const onConfirm = async (payload) => {
    if (!selectedCar) return;
    addBooking({
      ...payload,
      carId: selectedCar.id,
      carName: selectedCar.name,
      carType: selectedCar.type,
      carOwnerName: selectedCar.ownerName || '',
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              Outward Cars
            </h2>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              External owners’ cars (owner details shown below).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Button
              onClick={() => setShowAddCar(true)}
              className="px-4 py-2"
              style={{
                backgroundColor: colors.backgroundTertiary,
                color: colors.textWhite,
              }}
            >
              Add Outward Car
            </Button>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                Owner:
              </label>
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundSecondary }}
              >
                <option value="all">All Owners</option>
                {ownerOptions.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleCars.map((car) => {
          const bookings = getBookingsForCar(car.id);
          const isBookedNow = bookings.some((b) => isTodayWithinRangeInclusive(b.fromDate, b.toDate));
          return (
            <CarCard
              key={car.id}
              car={car}
              isBookedNow={isBookedNow}
              onBook={() => setSelectedCar(car)}
            />
          );
        })}
      </div>

      <BookingModal
        open={Boolean(selectedCar)}
        onClose={() => setSelectedCar(null)}
        car={selectedCar}
        existingBookings={selectedCar ? getBookingsForCar(selectedCar.id) : []}
        onConfirm={onConfirm}
      />

      <AddOutwardCarModal
        open={showAddCar}
        onClose={() => setShowAddCar(false)}
        onCreate={(car) => addCar(car)}
        vendors={dbVendors}
      />
    </div>
  );
};

export default OutwardCarsPage;
