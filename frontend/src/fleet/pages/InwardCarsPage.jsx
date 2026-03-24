import { useMemo, useState } from 'react';
import BookingModal from '../components/BookingModal';
import CarCard from '../components/CarCard';
import { useFleet } from '../context/FleetContext';
import { FLEET_CAR_TYPES } from '../constants/fleetConstants';
import { isTodayWithinRangeInclusive } from '../utils/fleetDateUtils';

const InwardCarsPage = () => {
  const { cars, getBookingsForCar, addBooking } = useFleet();
  const [selectedCar, setSelectedCar] = useState(null);

  const inwardCars = useMemo(
    () => cars.filter((c) => c.type === FLEET_CAR_TYPES.INWARD),
    [cars]
  );

  const onConfirm = async (payload) => {
    if (!selectedCar) return;
    addBooking({
      id: `fleet_booking_${Date.now()}`,
      carId: selectedCar.id,
      carName: selectedCar.name,
      carType: selectedCar.type,
      customerName: payload.customerName,
      licenseImage: payload.licenseImage,
      aadhaarImage: payload.aadhaarImage || '',
      fromDate: payload.fromDate,
      toDate: payload.toDate,
      totalPrice: payload.totalPrice,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {inwardCars.map((car) => {
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
    </div>
  );
};

export default InwardCarsPage;
