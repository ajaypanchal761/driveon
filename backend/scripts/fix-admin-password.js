import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import Admin from '../models/Admin.js';

dotenv.config();

const fixAdminPassword = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();

    const email = 'panchalajay717@gmail.com';
    const newPassword = '123456';

    console.log(`\n🔍 Looking for admin with email: ${email}`);
    
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      console.error('❌ Admin not found with email:', email);
      process.exit(1);
    }

    console.log('✅ Admin found:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    });

    console.log('\n🔐 Updating password...');
    admin.password = newPassword;
    await admin.save();

    console.log('✅ Password updated successfully!');
    console.log('📝 Admin can now login with:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}\n`);

    console.log('🔍 Verifying password...');
    const isPasswordValid = await admin.comparePassword(newPassword);
    
    if (isPasswordValid) {
      console.log('✅ Password verification successful!\n');
    } else {
      console.error('❌ Password verification failed!\n');
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

fixAdminPassword();
