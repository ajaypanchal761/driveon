import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import GuarantorPoints from '../models/GuarantorPoints.js';
import User from '../models/User.js';

dotenv.config();

/**
 * Migration script to fix rounded guarantor points values
 * Recalculates totalPoolAmount and pointsAllocated with exact decimals
 */
const fixGuarantorPointsDecimals = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();

    console.log('\n🔍 Finding all guarantor points records...');
    const allPoints = await GuarantorPoints.find({});
    
    console.log(`📊 Found ${allPoints.length} guarantor points records\n`);

    if (allPoints.length === 0) {
      console.log('✅ No records to update');
      process.exit(0);
    }

    let updatedCount = 0;
    let skippedCount = 0;
    const userPointsUpdates = new Map(); // Track user points changes

    for (const pointsRecord of allPoints) {
      try {
        // Recalculate exact values from bookingAmount
        const exactTotalPool = pointsRecord.bookingAmount * 0.1; // 10% exact
        const exactPointsPerGuarantor = exactTotalPool / pointsRecord.totalGuarantors; // Exact division

        // Check if values need updating (if they're rounded)
        const needsUpdate = 
          pointsRecord.totalPoolAmount !== exactTotalPool ||
          pointsRecord.pointsAllocated !== exactPointsPerGuarantor;

        if (needsUpdate) {
          const oldTotalPool = pointsRecord.totalPoolAmount;
          const oldPointsAllocated = pointsRecord.pointsAllocated;
          const pointsDifference = exactPointsPerGuarantor - oldPointsAllocated;

          // Update the record
          pointsRecord.totalPoolAmount = exactTotalPool;
          pointsRecord.pointsAllocated = exactPointsPerGuarantor;
          await pointsRecord.save();

          console.log(`✅ Updated record ${pointsRecord._id}:`);
          console.log(`   Booking Amount: ₹${pointsRecord.bookingAmount}`);
          console.log(`   Total Pool: ₹${oldTotalPool} → ₹${exactTotalPool}`);
          console.log(`   Points Allocated: ${oldPointsAllocated} → ${exactPointsPerGuarantor}`);
          console.log(`   Difference: ${pointsDifference > 0 ? '+' : ''}${pointsDifference}\n`);

          // Track user points update (only for active records)
          if (pointsRecord.status === 'active') {
            const guarantorId = pointsRecord.guarantor.toString();
            const currentDiff = userPointsUpdates.get(guarantorId) || 0;
            userPointsUpdates.set(guarantorId, currentDiff + pointsDifference);
          }

          updatedCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating record ${pointsRecord._id}:`, error.message);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Updated: ${updatedCount} records`);
    console.log(`   Skipped: ${skippedCount} records (already correct)`);
    console.log(`   Users to update: ${userPointsUpdates.size}\n`);

    // Update user points balances
    if (userPointsUpdates.size > 0) {
      console.log('🔄 Updating user points balances...\n');
      
      for (const [guarantorId, pointsDifference] of userPointsUpdates.entries()) {
        try {
          const user = await User.findById(guarantorId);
          if (user) {
            const oldBalance = user.points || 0;
            const newBalance = oldBalance + pointsDifference;
            
            // Ensure balance doesn't go negative
            user.points = Math.max(0, newBalance);
            
            // Recalculate totalPointsEarned from all active points records
            const activePoints = await GuarantorPoints.find({
              guarantor: guarantorId,
              status: 'active',
            });
            const exactTotalEarned = activePoints.reduce((sum, r) => {
              const exactPool = r.bookingAmount * 0.1;
              const exactPoints = exactPool / r.totalGuarantors;
              return sum + exactPoints;
            }, 0);
            
            user.totalPointsEarned = exactTotalEarned;
            await user.save();

            console.log(`✅ Updated user ${guarantorId}:`);
            console.log(`   Points balance: ${oldBalance} → ${user.points}`);
            console.log(`   Total earned: ${user.totalPointsEarned}\n`);
          } else {
            console.log(`⚠️  User not found: ${guarantorId}`);
          }
        } catch (error) {
          console.error(`❌ Error updating user ${guarantorId}:`, error.message);
        }
      }
    }

    console.log('✅ Migration completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

fixGuarantorPointsDecimals();

