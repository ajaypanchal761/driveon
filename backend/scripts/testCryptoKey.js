import fs from 'fs';
import crypto from 'crypto';

try {
    const fileContent = fs.readFileSync('config/newdriveon-firebase-adminsdk-fbsvc-f91dd6e5d5.json', 'utf8');
    const obj = JSON.parse(fileContent);
    let key = obj.private_key;

    if (key) {
        key = key.replace(/\\n/g, '\n');
    }

    console.log('Testing crypto.createPrivateKey...');
    const privateKeyObj = crypto.createPrivateKey(key);
    console.log('✅ SUCCESS: crypto.createPrivateKey successfully parsed the key!');
    
    // Print details of the key
    console.log('Key Details:', {
        type: privateKeyObj.type,
        asymmetricKeyType: privateKeyObj.asymmetricKeyType,
    });
    
    process.exit(0);
} catch (error) {
    console.error('❌ ERROR parsing private key with crypto:', error);
    process.exit(1);
}
