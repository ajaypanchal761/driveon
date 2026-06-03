import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('🔍 Testing Firebase Admin SDK Token Generation...');

try {
    const admin = (await import('firebase-admin')).default;
    const fs = await import('fs');

    const relativePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "config/newdriveon-firebase-adminsdk.json";
    const serviceAccountPath = path.resolve(relativePath);

    if (!fs.existsSync(serviceAccountPath)) {
        console.error(`❌ File not found at: ${serviceAccountPath}`);
        process.exit(1);
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    console.log(`🔑 Service Account Client Email: ${serviceAccount.client_email}`);
    console.log(`🔑 Key ID: ${serviceAccount.private_key_id}`);

    const credential = admin.credential.cert(serviceAccount);
    console.log('🔄 Fetching Google OAuth2 access token...');
    const accessTokenObj = await credential.getAccessToken();
    console.log('✅ SUCCESS: Access token fetched successfully!');
    console.log(`🎟️ Token Expires: ${accessTokenObj.expires_in} seconds`);
    process.exit(0);
} catch (error) {
    console.error('\n❌ ERROR: Failed to get OAuth2 access token!');
    console.error(error);
    process.exit(1);
}
