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
            console.error("❌ Firebase VAPID Key is missing in environment variables!");
            return null;
        }

        console.log("Requesting FCM Token with VAPID Key:", VAPID_KEY);

        // Explicitly register service worker to ensure correct scope and file
        let registration;
        try {
            if ('serviceWorker' in navigator) {
                registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                console.log('✅ Service Worker Registered:', registration);
            } else {
                console.error('❌ Service Worker not supported in this browser.');
                return null;
            }
        } catch (swError) {
            console.error('❌ Service Worker Registration Failed:', swError);
            throw swError;
        }

        const currentToken = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration
        });
        if (currentToken) {
            console.log("✅ FCM Token Generated:", currentToken);
            return currentToken;
        } else {
            console.warn("⚠️ No registration token available. Request permission to generate one.");
            return null;
        }
    } catch (err) {
        console.error("❌ An error occurred while retrieving token: ", err);
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
