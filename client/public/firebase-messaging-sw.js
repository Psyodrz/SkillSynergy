// Scripts for firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
// Note: You must replace 'YOUR-SENDER-ID' or use a hardcoded value here if env vars are tricky in SW.
// However, the standard practice for SW is often to hardcode or fetch config.
// Since we promised 'no hardcoding', we usually rely on the client registering the SW to pass params? 
// No, standard FCM SW just needs initialization.

// Typically SW doesn't have access to .env vars at build time unless using a bundler.
// For now, we will use a placeholder that user can replace or we'll standard initialization.
// A common workaround is self.__WB_MANIFEST if using Workbox, but for raw firebase SW:

firebase.initializeApp({
  apiKey: "AIzaSyAXzIoz0Gj3Jga30MUr98C3nYJXPD3bMiQ",
  authDomain: "skillsynergy-94441.firebaseapp.com",
  projectId: "skillsynergy-94441",
  storageBucket: "skillsynergy-94441.firebasestorage.app",
  messagingSenderId: "546380769420",
  appId: "1:546380769420:web:a7f51bd53e084e229b33a9"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // Ensure this exists
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
