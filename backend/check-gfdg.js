import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Staff from './models/Staff.js';
import Notification from './models/Notification.js';

dotenv.config({ path: './.env' });

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Get all notifications matching title 'gfdg'
    const notifications = await Notification.find({ title: /gfdg/i });

    console.log(`\n--- GFDG NOTIFICATIONS COUNT: ${notifications.length} ---`);
    for (const n of notifications) {
      let recipientDetails = null;
      if (n.recipient) {
        let rec = await User.findById(n.recipient);
        if (!rec) {
          rec = await Staff.findById(n.recipient);
        }
        if (rec) {
          recipientDetails = {
            id: rec._id,
            name: rec.name,
            phone: rec.phone,
            fcmToken: rec.fcmToken,
            fcmTokenMobile: rec.fcmTokenMobile,
          };
        }
      }
      console.log({
        id: n._id,
        recipient: recipientDetails || 'None',
        title: n.title,
        message: n.message,
        isSent: n.isSent,
        createdAt: n.createdAt,
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

check();
