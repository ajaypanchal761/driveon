import axios from 'axios';

console.log('--- SERVER TIME DIAGNOSTIC ---');
console.log('Local Server Time:', new Date().toISOString());

try {
    const res = await axios.get('https://oauth2.googleapis.com/token');
} catch (err) {
    if (err.response && err.response.headers) {
        const googleTimeStr = err.response.headers.date;
        console.log('Google Server Time:', googleTimeStr);
        
        const localMs = Date.now();
        const googleMs = Date.parse(googleTimeStr);
        const diffSeconds = Math.abs(localMs - googleMs) / 1000;
        
        console.log(`Difference: ${diffSeconds} seconds`);
        
        if (diffSeconds > 300) {
            console.log('\n❌ WARNING: Clock skew is too high (> 5 minutes)!');
            console.log('Google will reject all JWT assertions with "Invalid JWT Signature" because of this.');
            console.log('\n👉 HOW TO FIX CLOCK SKEW ON LINUX:');
            console.log('Run one of these commands to sync your server clock:');
            console.log('1. sudo systemctl restart systemd-timesyncd');
            console.log('2. sudo ntpdate pool.ntp.org');
            console.log('3. sudo chronyc -a makestep');
        } else {
            console.log('\n✅ Clock skew is within acceptable limits (< 5 minutes).');
        }
    } else {
        console.error('Failed to contact Google:', err.message);
    }
}
