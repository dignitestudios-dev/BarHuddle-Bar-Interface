/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyAolivM-M9ayhv8fOouLHdQBdaRZKjSA6w",
  authDomain: "barhuddle-7a6b4.firebaseapp.com",
  projectId: "barhuddle-7a6b4",
  storageBucket: "barhuddle-7a6b4.firebasestorage.app",
  messagingSenderId: "561550923046",
  appId: "1:561550923046:web:543ea4485235ea5d425de7",
  measurementId: "G-X1FJ83S64R",
};

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);

  const notificationTitle =
    payload.notification?.title || payload.data?.title || "BarHuddle Notification";
  const notificationOptions = {
    body:
      payload.notification?.body ||
      payload.data?.body ||
      payload.data?.message ||
      "",
    icon: payload.notification?.icon || "/images/bar-huddle-logo.png",
    badge: "/images/bar-huddle-logo.png",
    data: payload.data || {},
    vibrate: [200, 100, 200],
    requireInteraction: true,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const clickAction =
    event.notification.data?.click_action ||
    event.notification.data?.url ||
    "/app/dashboard";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(clickAction);
      }
    })
  );
});
