import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

async function query() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/driveon');
    console.log('Connected to MongoDB');

    const links = await mongoose.connection.db.collection('guarantorrequests').find({ status: 'accepted' }).toArray();
    console.log('\n--- ACCEPTED GUARANTOR LINKS ---');
    console.log(links.map(l => ({ user: l.user, guarantor: l.guarantor, status: l.status })));

    const bookingsWithGuarantor = await mongoose.connection.db.collection('bookings').find({ guarantor: { $ne: null } }).toArray();
    console.log('\n--- BOOKINGS WITH GUARANTOR ---');
    console.log(bookingsWithGuarantor.map(b => ({ _id: b._id, bookingId: b.bookingId, guarantor: b.guarantor })));

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

query();
