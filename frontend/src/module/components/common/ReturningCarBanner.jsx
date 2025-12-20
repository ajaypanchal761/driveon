import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingService } from '../../../services/booking.service';
import { carService } from '../../../services/car.service';
import { useAppSelector } from '../../../hooks/redux';

const ReturningCarBanner = () => {
    const [status, setStatus] = useState('hidden'); // hidden | dynamic | static
    const [timeLeft, setTimeLeft] = useState('');
    const [booking, setBooking] = useState(null);
    const [carDetails, setCarDetails] = useState(null);

    const { user } = useAppSelector((state) => ({
        user: state.auth?.user || state.user?.user || state.user,
    }));

    const fetchUserBooking = useCallback(async () => {
        if (!user?._id) return;

        try {
            // Fetch user's bookings
            const response = await bookingService.getBookings({ userId: user._id });

            // Handle different response structures including pagination
            let bookings = [];
            if (Array.isArray(response)) {
                bookings = response;
            } else if (response && Array.isArray(response.bookings)) {
                bookings = response.bookings;
            } else if (response && Array.isArray(response.data)) {
                bookings = response.data;
            } else if (response && response.data && Array.isArray(response.data.bookings)) {
                bookings = response.data.bookings;
            } else if (response && response.data && Array.isArray(response.data.docs)) {
                bookings = response.data.docs;
            } else {
                bookings = [];
            }

            if (!Array.isArray(bookings)) {
                setStatus('hidden');
                return;
            }

            // Find a relevant booking:
            // 1. Status is not cancelled/completed
            // 2. End Date is TODAY
            const today = new Date();
            const activeBooking = bookings.find(b => {
                const status = b.status;
                if (status === 'cancelled' || status === 'completed') return false;

                // Handle tripEnd structure (could be string or object)
                const endDateVal = b.tripEnd?.date || b.tripEnd;
                if (!endDateVal) return false;

                const end = new Date(endDateVal);
                return end.toDateString() === today.toDateString();
            });

            if (activeBooking) {
                setBooking(activeBooking);

                // Fetch car details if 'car' is just an ID
                if (activeBooking.car && typeof activeBooking.car === 'string') {
                    try {
                        const carData = await carService.getCarDetails(activeBooking.car);
                        setCarDetails(carData.data || carData);
                    } catch (err) {
                        console.error("Error fetching car details for banner:", err);
                    }
                } else if (activeBooking.car && typeof activeBooking.car === 'object') {
                    setCarDetails(activeBooking.car);
                }
            } else {
                setStatus('hidden');
            }
        } catch (error) {
            console.error("Error fetching returning car banner data:", error);
            setStatus('hidden');
        }
    }, [user]);

    useEffect(() => {
        fetchUserBooking();
    }, [fetchUserBooking]);

    useEffect(() => {
        if (!booking) return;

        const calculateStatus = () => {
            const now = new Date();
            // Handle tripEnd structure robustly
            const endDateVal = booking.tripEnd?.date || booking.tripEnd;
            if (!endDateVal) return;

            const end = new Date(endDateVal);

            // Double check date matching
            const isSameDay = now.toDateString() === end.toDateString();
            if (!isSameDay) {
                setStatus('hidden');
                return;
            }

            // Check time
            if (now < end) {
                setStatus('dynamic');

                // Calculate remaining time
                const diff = end - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                if (hours > 0) {
                    setTimeLeft(`${hours} hours ${minutes > 0 ? `& ${minutes} mins` : ''}`);
                } else {
                    setTimeLeft(`${minutes} mins`);
                }
            } else {
                // Time passed - show static banner
                setStatus('static');
            }
        };

        // Calculate immediately
        calculateStatus();

        // Update every minute
        const timer = setInterval(calculateStatus, 60000);
        return () => clearInterval(timer);
    }, [booking]);

    if (status === 'hidden') return null;

    // Helper to get car details safely
    const displayCar = carDetails || booking?.car || {};
    const carName = displayCar.name || displayCar.brand || displayCar.modelName || booking?.carName || "Car";

    // Robust image extraction
    const getCarImageUrl = (carData) => {
        if (!carData) return null;
        if (carData.image && typeof carData.image === 'string') return carData.image;
        if (carData.image?.url) return carData.image.url;

        if (carData.images && Array.isArray(carData.images) && carData.images.length > 0) {
            const firstImg = carData.images[0];
            if (typeof firstImg === 'string') return firstImg;
            if (firstImg.url) return firstImg.url;
            if (firstImg.path) return firstImg.path;
        }
        return null;
    };

    const carImage = getCarImageUrl(displayCar) || booking?.carImage || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

    // Safety check for location
    const carLocation = booking?.pickupLocation?.address ?
        booking.pickupLocation.address :
        (booking?.location?.area ? `${booking.location.area}, ${booking.location.city}` : "Indore, MP");

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full"
            >
                {status === 'dynamic' ? (
                    // Dynamic Banner - Compact Version
                    <div className="relative overflow-hidden rounded-xl bg-gray-900 border border-gray-800 shadow-xl p-0">
                        {/* Background Gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                        <div className="flex flex-row items-center gap-3 p-3 relative z-10">
                            {/* Car Image Thumbnail - Smaller */}
                            <div className="flex-shrink-0 relative">
                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 shadow-md">
                                    <img
                                        src={carImage}
                                        alt={carName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Pulse Indicator - Adjusted */}
                                <div className="absolute -top-1 -right-1 w-3 h-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border-2 border-gray-900"></span>
                                </div>
                            </div>

                            {/* Content - Computed Layout */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-500/20 text-orange-400 tracking-wider uppercase border border-orange-500/20 whitespace-nowrap">
                                        Returning Soon
                                    </span>
                                    <h3 className="text-white font-bold text-base truncate">
                                        {carName}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-3 text-gray-400 text-xs">
                                    <div className="flex items-center gap-1 text-orange-300 font-medium whitespace-nowrap">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>In {timeLeft}</span>
                                    </div>

                                    <div className="flex items-center gap-1 opacity-80 truncate">
                                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="truncate">{carLocation}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action / Arrow - Compact */}
                            <div className="hidden sm:block">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Static Banner - Compact Version
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 shadow-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            {/* Static Banner Image (Now showing Car Image) */}
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-500/20 flex-shrink-0 shadow-md">
                                <img
                                    src={carImage}
                                    alt={carName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-bold text-sm">Car is now available!</h3>
                                <p className="text-emerald-200/80 text-xs truncate">
                                    <span className="font-semibold text-emerald-100">{carName}</span> is back at {carLocation.split(',')[0]}.
                                </p>
                            </div>
                            <div className="ml-auto">
                                <button className="px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors shadow-md shadow-emerald-900/20 whitespace-nowrap">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default ReturningCarBanner;
