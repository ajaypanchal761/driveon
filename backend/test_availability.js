import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/Booking.js';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const debugAvailability = async () => {
    await connectDB();

    // Booking 1 from user log:
    // Car: 693ffd280638c774e33025f1
    // Start: 2025-12-23T12:00:00.000Z (17:30 IST)
    // End: 2025-12-24T05:00:00.000Z (10:30 IST)

    // Simulation: User searches for 2025-12-23 18:00 IST to 20:00 IST
    // 18:00 IST = 12:30 UTC
    // 20:00 IST = 14:30 UTC

    const start = new Date("2025-12-23T12:30:00.000Z");
    const end = new Date("2025-12-23T14:30:00.000Z");

    console.log("--- DEBUG START ---");
    console.log("Search Period (UTC):");
    console.log("Start:", start.toISOString());
    console.log("End:", end.toISOString());

    // 1. Check if the specific car booking exists and matches our expectations
    const carId = "693ffd280638c774e33025f1";
    console.log(`\nChecking all bookings for Car ID: ${carId}`);
    const carBookings = await Booking.find({ car: carId });

    carBookings.forEach(b => {
        console.log(`\nBooking ID: ${b._id}`);
        console.log(`Status: ${b.status}`);
        console.log(`Trip Start Date: ${b.tripStart.date} (ISO: ${b.tripStart.date.toISOString()})`);
        console.log(`Trip End Date: ${b.tripEnd.date} (ISO: ${b.tripEnd.date.toISOString()})`);

        const isStartOverlap = b.tripStart.date < end;
        const isEndOverlap = b.tripEnd.date > start;
        console.log(`TripStart < SearchEnd? ${isStartOverlap}`);
        console.log(`TripEnd > SearchStart? ${isEndOverlap}`);
        console.log(`Is Overlapping? ${isStartOverlap && isEndOverlap}`);
    });

    // 2. Run the actual overlap query
    console.log("\nRunning Overlap Query for ALL cars...");
    const bookings = await Booking.find({
        status: { $in: ['pending', 'confirmed', 'active'] },
        $or: [
            {
                'tripStart.date': { $lt: end },
                'tripEnd.date': { $gt: start }
            }
        ]
    });

    console.log(`Found ${bookings.length} overlapping bookings in total.`);
    const foundOurCar = bookings.find(b => b.car.toString() === carId);
    console.log(`Was our car found in the overlap query? ${foundOurCar ? 'YES' : 'NO'}`);

    process.exit();
};

debugAvailability();
