import mongoose from 'mongoose';
import dotenv from 'dotenv';
import './models/Car.js'; // Ensure the schema is registered

dotenv.config({ path: './.env' });

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/driveon');
    console.log('Connected to MongoDB');

    const Car = mongoose.model('Car');
    const featuredCars = await Car.find({ isFeatured: true });
    console.log(`Found ${featuredCars.length} featured cars:`);
    featuredCars.forEach(car => {
      console.log({
        id: car._id,
        brand: car.brand,
        model: car.model,
        status: car.status,
        isAvailable: car.isAvailable,
        isFeatured: car.isFeatured
      });
    });

    const activeCars = await Car.find({ status: 'active' });
    console.log(`\nFound ${activeCars.length} active cars total.`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

check();
