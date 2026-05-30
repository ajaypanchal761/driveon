import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/driveon');
    console.log('Connected to MongoDB');

    const bookings = await mongoose.connection.db.collection('bookings').find({}).toArray();
    console.log('\n--- PUBLIC CUSTOMER BOOKINGS FULL ---');
    bookings.forEach(b => {
      console.log({
        _id: b._id,
        bookingId: b.bookingId,
        tripStart: b.tripStart,
        tripEnd: b.tripEnd,
        pricing: b.pricing
      });
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

check();
