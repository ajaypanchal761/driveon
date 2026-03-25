import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import { carService } from '../../services/car.service';
import { adminService } from '../../services/admin.service';
import { FLEET_CAR_TYPES } from '../constants/fleetConstants';

const FleetContext = createContext(null);

export const FleetProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const fetchFleetData = async () => {
      try {
        const [outwardCarsRes, outwardBookingsRes, inwardCarsRes, regularBookingsRes] = await Promise.all([
          api.get('/fleet/outward-cars'),
          api.get('/fleet/outward-bookings'),
          carService.getCars(),
          adminService.getAllBookings()
        ]);
        
        let allCars = [];
        let allBookings = [];

        // Process Outward Cars
        if (outwardCarsRes.data.success) {
          allCars = [...outwardCarsRes.data.data];
        }
        
        // Process Inward Cars (from regular inventory)
        if (inwardCarsRes.success && inwardCarsRes.data?.cars) {
          const mappedInward = inwardCarsRes.data.cars.map(car => ({
            id: car._id,
            name: `${car.brand} ${car.model}`,
            brand: car.brand,
            model: car.model,
            pricePerDay: car.pricePerDay,
            location: car.location?.city || car.location || '-',
            type: FLEET_CAR_TYPES.INWARD,
            ownerName: car.owner?.name || 'DriveOn Admin',
            ownerPhone: car.owner?.phone || '-',
            images: car.images
          }));
          allCars = [...allCars, ...mappedInward];
        }

        // Process Outward Bookings
        if (outwardBookingsRes.data.success) {
          // Ensure bookings from DB have the correct carType field if missing
          const outwardB = outwardBookingsRes.data.data.map(b => ({
            ...b,
            carType: b.carType || FLEET_CAR_TYPES.OUTWARD
          }));
          allBookings = [...allBookings, ...outwardB];
        }

        // Process Inward Bookings (Regular bookings from regular cars)
        if (regularBookingsRes.success && regularBookingsRes.data?.bookings) {
          const mappedRegular = regularBookingsRes.data.bookings.map(b => {
            const carBrand = b.car?.brand || 'DriveOn';
            const carModel = b.car?.model || 'Car';
            
            return {
              id: b.bookingId || b._id,
              carId: b.car?._id || b.car,
              carName: b.car?.name || `${carBrand} ${carModel}`,
              carType: FLEET_CAR_TYPES.INWARD, 
              customerName: b.user?.name || 'Customer',
              fromDate: b.tripStart?.date ? new Date(b.tripStart.date).toISOString().split('T')[0] : (b.fromDate || '-'),
              toDate: b.tripEnd?.date ? new Date(b.tripEnd.date).toISOString().split('T')[0] : (b.toDate || '-'),
              totalPrice: b.pricing?.totalPrice || b.pricing?.finalPrice || 0,
              status: b.status || 'unknown',
              paymentStatus: b.paymentStatus || 'unknown',
              paymentMode: b.paymentMode || 'Online',
              paidAmount: b.pricing?.paidAmount || 0,
              createdAt: b.createdAt
            };
          });
          allBookings = [...allBookings, ...mappedRegular];
        }

        setCars(allCars);
        setBookings(allBookings);
      } catch (error) {
        console.error("Failed to load fleet data", error);
      } finally {
        setHydrated(true);
      }
    };

    fetchFleetData();
  }, []);

  const addCar = async (car) => {
    try {
      const response = await api.post('/fleet/outward-cars', car);
      if (response.data.success) {
        setCars((prev) => [car, ...prev]);
        return response.data.data;
      }
      throw new Error("Failed to save to database");
    } catch (error) {
      console.error("Add fleet car error", error);
      throw error;
    }
  };

  const addBooking = async (booking) => {
    try {
      const response = await api.post('/fleet/outward-bookings', booking);
      if (response.data.success) {
        setBookings((prev) => [booking, ...prev]);
        return response.data.data;
      }
      throw new Error("Failed to save booking to database");
    } catch (error) {
      console.error("Add fleet booking error", error);
      throw error;
    }
  };

  const clearAllBookings = () => {
    setBookings([]);
  }

  const value = useMemo(
    () => ({
      cars,
      bookings,
      hydrated,
      getCarById: (carId) => cars.find((c) => c.id === carId),
      getBookingsForCar: (carId) => bookings.filter((b) => b.carId === carId),
      addBooking,
      addCar,
      clearAllBookings,
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
