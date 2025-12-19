import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Car from '../models/Car.js';
import { connectDB } from '../config/database.js';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const listBookings = async () => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('car', 'brand model name')
      .sort({ createdAt: -1 })
      .limit(50);

    if (bookings.length === 0) {
      console.log('📭 No bookings found!\n');
      return [];
    }

    console.log('\n📋 All Bookings (Latest 50):\n');
    console.log('═'.repeat(120));
    
    bookings.forEach((booking, index) => {
      const userName = booking.user?.name || booking.user?.email || 'Unknown';
      const userEmail = booking.user?.email || 'N/A';
      const carName = booking.car?.name || `${booking.car?.brand || ''} ${booking.car?.model || ''}`.trim() || 'Unknown Car';
      const status = booking.status || 'pending';
      const bookingId = booking.bookingId || booking._id.toString().slice(-8);
      
      console.log(`${(index + 1).toString().padStart(2, ' ')}. Booking ID: ${bookingId}`);
      console.log(`    User: ${userName} (${userEmail})`);
      console.log(`    Car: ${carName}`);
      console.log(`    Status: ${status.toUpperCase()}`);
      console.log(`    Trip: ${formatDate(booking.tripStart?.date)} → ${formatDate(booking.tripEnd?.date)}`);
      console.log(`    Created: ${formatDate(booking.createdAt)}`);
      console.log(`    MongoDB ID: ${booking._id}`);
      console.log('─'.repeat(120));
    });

    return bookings;
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    return [];
  }
};

const deleteBooking = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate('user', 'name email phone')
      .populate('car', 'name brand model');
    
    if (!booking) {
      console.log('❌ Booking not found!\n');
      return false;
    }

    console.log('\n⚠️  Booking Details to Delete:');
    console.log('═'.repeat(120));
    console.log(`Booking ID: ${booking.bookingId || booking._id}`);
    console.log(`User: ${booking.user?.name || 'Unknown'} (${booking.user?.email || 'N/A'})`);
    console.log(`Car: ${booking.car?.name || `${booking.car?.brand || ''} ${booking.car?.model || ''}`.trim() || 'Unknown'}`);
    console.log(`Status: ${booking.status}`);
    console.log(`Trip Start: ${formatDate(booking.tripStart?.date)} at ${booking.tripStart?.time || 'N/A'}`);
    console.log(`Trip End: ${formatDate(booking.tripEnd?.date)} at ${booking.tripEnd?.time || 'N/A'}`);
    console.log(`Total Days: ${booking.totalDays || 'N/A'}`);
    console.log(`Total Price: ₹${booking.pricing?.totalPrice || booking.pricing?.finalPrice || 'N/A'}`);
    console.log(`Created: ${formatDate(booking.createdAt)}`);
    console.log('═'.repeat(120));

    const confirm = await question('\n❓ Are you sure you want to delete this booking? (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Deletion cancelled.\n');
      return false;
    }

    await Booking.findByIdAndDelete(bookingId);
    console.log('✅ Booking deleted successfully!\n');
    return true;
  } catch (error) {
    console.error('❌ Error deleting booking:', error.message);
    return false;
  }
};

const main = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    let continueDeleting = true;

    while (continueDeleting) {
      const bookings = await listBookings();
      
      if (bookings.length === 0) {
        console.log('📭 No more bookings to delete.\n');
        break;
      }

      const choice = await question(`\n📝 Enter booking number to delete (1-${bookings.length}), or "exit" to quit: `);
      
      if (choice.toLowerCase() === 'exit' || choice.toLowerCase() === 'quit' || choice.toLowerCase() === 'q') {
        console.log('\n👋 Exiting...\n');
        break;
      }

      const index = parseInt(choice) - 1;
      
      if (isNaN(index) || index < 0 || index >= bookings.length) {
        console.log('❌ Invalid selection. Please enter a number between 1 and ' + bookings.length + '.\n');
        continue;
      }

      const bookingId = bookings[index]._id;
      await deleteBooking(bookingId);
      
      const continueChoice = await question('🔄 Delete another booking? (yes/no): ');
      if (continueChoice.toLowerCase() !== 'yes' && continueChoice.toLowerCase() !== 'y') {
        console.log('\n👋 Exiting...\n');
        continueDeleting = false;
      }
    }

    await mongoose.connection.close();
    rl.close();
    console.log('✅ Database connection closed.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.connection.close();
    rl.close();
    process.exit(1);
  }
};

main();

