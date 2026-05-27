import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// VAPID Key from user
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const requestForToken = async () => {
    try {
        if (!VAPID_KEY) {
            return null;
        }

        // Check if notification permission is already denied — skip silently
        if (Notification.permission === 'denied') {
            return null;
        }

        // Register service worker
        let registration;
        try {
            if ('serviceWorker' in navigator) {
                registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            } else {
                return null;
            }
        } catch (swError) {
            console.error('❌ Service Worker Registration Failed:', swError);
            return null;
        }

        const currentToken = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration
        });

        return currentToken || null;

    } catch (err) {
        // Silently ignore expected browser permission errors
        const ignoredCodes = [
            'messaging/permission-blocked',
            'messaging/permission-default',
            'messaging/notifications-blocked',
        ];
        if (err?.code && ignoredCodes.includes(err.code)) {
            return null;
        }
        // Log genuine unexpected errors only
        console.error("❌ FCM token error:", err?.message || err);
        return null;
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log("payload", payload);
            resolve(payload);
        });
    });

export { messaging };
