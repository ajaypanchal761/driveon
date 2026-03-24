import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadFleetState, saveFleetState } from '../services/fleetStorage';

const FleetContext = createContext(null);

export const FleetProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const state = loadFleetState();
    setCars(state.cars);
    setBookings(state.bookings);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveFleetState({ cars, bookings });
  }, [cars, bookings, hydrated]);

  const value = useMemo(
    () => ({
      cars,
      bookings,
      hydrated,
      getCarById: (carId) => cars.find((c) => c.id === carId),
      getBookingsForCar: (carId) => bookings.filter((b) => b.carId === carId),
      addBooking: (booking) => setBookings((prev) => [booking, ...prev]),
      addCar: (car) => setCars((prev) => [car, ...prev]),
      clearAllBookings: () => setBookings([]),
    }),
    [cars, bookings, hydrated]
  );

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
};

export const useFleet = () => {
  const ctx = useContext(FleetContext);
  if (!ctx) throw new Error('useFleet must be used within FleetProvider');
  return ctx;
};
