import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Fix misspelled role names in CRMRole collection and Staff collection
 * TELICALLER → TELECALLER
 * MANEGER → MANAGER
 */
const fixRoleSpellings = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ MONGODB_URI not found in .env');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Fix in CRMRole collection (roleName field)
    console.log('\n📝 Fixing CRMRole collection...');

    const rolesFixes = [
      { from: 'TELICALLER', to: 'TELECALLER' },
      { from: 'Telicaller', to: 'Telecaller' },
      { from: 'telicaller', to: 'telecaller' },
      { from: 'MANEGER', to: 'MANAGER' },
      { from: 'Maneger', to: 'Manager' },
      { from: 'maneger', to: 'manager' },
    ];

    for (const fix of rolesFixes) {
      // Fix in crmroles collection
      const roleResult = await db.collection('crmroles').updateMany(
        { roleName: fix.from },
        { $set: { roleName: fix.to } }
      );
      if (roleResult.modifiedCount > 0) {
        console.log(`  ✅ CRMRole: "${fix.from}" → "${fix.to}" (${roleResult.modifiedCount} updated)`);
      }

      // Fix in staffs collection (role field)
      const staffResult = await db.collection('staffs').updateMany(
        { role: fix.from },
        { $set: { role: fix.to } }
      );
      if (staffResult.modifiedCount > 0) {
        console.log(`  ✅ Staff: "${fix.from}" → "${fix.to}" (${staffResult.modifiedCount} updated)`);
      }
    }

    // Also check with case-insensitive regex for any other variations
    const telicallResult = await db.collection('crmroles').updateMany(
      { roleName: { $regex: /^telicaller$/i } },
      { $set: { roleName: 'TELECALLER' } }
    );
    if (telicallResult.modifiedCount > 0) {
      console.log(`  ✅ CRMRole (regex): "telicaller" variants → "TELECALLER" (${telicallResult.modifiedCount} updated)`);
    }

    const manegerResult = await db.collection('crmroles').updateMany(
      { roleName: { $regex: /^maneger$/i } },
      { $set: { roleName: 'MANAGER' } }
    );
    if (manegerResult.modifiedCount > 0) {
      console.log(`  ✅ CRMRole (regex): "maneger" variants → "MANAGER" (${manegerResult.modifiedCount} updated)`);
    }

    // Fix staff collection with regex too
    const staffTelicallResult = await db.collection('staffs').updateMany(
      { role: { $regex: /^telicaller$/i } },
      { $set: { role: 'TELECALLER' } }
    );
    if (staffTelicallResult.modifiedCount > 0) {
      console.log(`  ✅ Staff (regex): "telicaller" variants → "TELECALLER" (${staffTelicallResult.modifiedCount} updated)`);
    }

    const staffManegerResult = await db.collection('staffs').updateMany(
      { role: { $regex: /^maneger$/i } },
      { $set: { role: 'MANAGER' } }
    );
    if (staffManegerResult.modifiedCount > 0) {
      console.log(`  ✅ Staff (regex): "maneger" variants → "MANAGER" (${staffManegerResult.modifiedCount} updated)`);
    }

    console.log('\n✅ Done! Role spellings fixed.');
    console.log('🔄 Please refresh the CRM page to see updated roles.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixRoleSpellings();
