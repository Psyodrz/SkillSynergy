import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// 1. Firebase Configuration (from Environment)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log("Initializing Firebase with:", { 
  projectId: firebaseConfig.projectId, 
  authDomain: firebaseConfig.authDomain 
});

// 2. Initialize App
// Check if config is present to avoid crash during setup
const isConfigured = firebaseConfig.projectId && firebaseConfig.apiKey;
const app = isConfigured ? initializeApp(firebaseConfig) : null;
const messaging = isConfigured ? getMessaging(app) : null;

// 3. Helper: Request Permission & Get Token
export const requestNotificationPermission = async (vapidKey) => {
  if (!messaging) {
    console.warn("Firebase not configured.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { 
        vapidKey: vapidKey || import.meta.env.VITE_FIREBASE_VAPID_KEY 
      });
      return token;
    } else {
      console.warn("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token.", error);
    return null;
  }
};

// 4. Helper: Listen for Foreground Messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { app, messaging };
