import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('\n🔍 Testing Firebase Admin SDK Configuration...\n');
console.log(`   FIREBASE_SERVICE_ACCOUNT_PATH: ${process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'Not set'}`);

try {
    // Import the firebase service
    const { sendPushNotification } = await import('../services/firebase.service.js');
    const admin = (await import('firebase-admin')).default;

    if (admin.apps.length > 0) {
        console.log('\n✅ SUCCESS: Firebase Admin SDK initialized successfully!');
        console.log(`   App Name: ${admin.apps[0].name}`);
        console.log(`   Project ID: ${admin.apps[0].options.credential.projectId || 'Default'}`);
        process.exit(0);
    } else {
        console.error('\n❌ ERROR: Firebase Admin SDK was not initialized. Apps length is 0.');
        process.exit(1);
    }
} catch (error) {
    console.error('\n❌ ERROR: Firebase Admin SDK initialization failed!');
    console.error(`   Error details: ${error.message}`);
    process.exit(1);
}
