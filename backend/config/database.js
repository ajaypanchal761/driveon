import mongoose from 'mongoose';

/**
 * Connect to MongoDB
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.error('Please add MONGODB_URI to your .env file');
      process.exit(1);
    }

    // Connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain at least 5 socket connections
      retryWrites: true,
      w: 'majority',
    };

    console.log('🔄 Attempting to connect to MongoDB...');
    console.log(`📍 Connection string: ${mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      if (err.message.includes('IP')) {
        console.error('\n⚠️  IP Whitelist Issue Detected!');
        console.error('📝 To fix this:');
        console.error('   1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
        console.error('   2. Navigate to Network Access');
        console.error('   3. Click "Add IP Address"');
        console.error('   4. Click "Allow Access from Anywhere" (0.0.0.0/0) for development');
        console.error('   5. Or add your current IP address');
      }
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error('\n❌ MongoDB connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('\n🔧 SOLUTION: IP Whitelist Issue');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Your IP address is not whitelisted in MongoDB Atlas.');
      console.error('\n📋 Steps to fix:');
      console.error('   1. Go to: https://cloud.mongodb.com/');
      console.error('   2. Select your cluster');
      console.error('   3. Click "Network Access" in the left sidebar');
      console.error('   4. Click "Add IP Address"');
      console.error('   5. For development, click "Allow Access from Anywhere" (0.0.0.0/0)');
      console.error('   6. Click "Confirm"');
      console.error('   7. Wait 1-2 minutes for changes to take effect');
      console.error('   8. Restart your backend server');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else if (error.message.includes('authentication')) {
      console.error('\n🔧 SOLUTION: Authentication Issue');
      console.error('Check your MongoDB username and password in MONGODB_URI');
    } else if (error.message.includes('timeout')) {
      console.error('\n🔧 SOLUTION: Connection Timeout');
      console.error('Possible causes:');
      console.error('   - IP not whitelisted (see above)');
      console.error('   - Network/firewall blocking connection');
      console.error('   - MongoDB Atlas cluster is paused (free tier)');
    }
    
    console.error('\n💡 Alternative: Use local MongoDB for development');
    console.error('   Change MONGODB_URI in .env to: mongodb://localhost:27017/driveon');
    console.error('   Make sure MongoDB is installed and running locally\n');
    
    process.exit(1);
  }
};

