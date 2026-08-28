import { getMessaging, getToken, onMessage, isSupported, Messaging } from "firebase/messaging";
import { app } from "./firebase";

let messagingPromise: Promise<Messaging | null> | null = null;

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") return null;

  if (!messagingPromise) {
    messagingPromise = isSupported()
      .then((supported) => {
        if (supported && app) {
          console.log("%c[FCM] Firebase Messaging is supported in this browser.", "color: #a855f7; font-weight: bold;");
          return getMessaging(app);
        }
        console.warn("[FCM] Firebase Messaging is NOT supported in this browser.");
        return null;
      })
      .catch((err) => {
        console.warn("[FCM] Error checking Firebase Messaging support:", err);
        return null;
      });
  }

  return messagingPromise;
};

/**
 * Requests notification permission from user and retrieves FCM device registration token
 */
export const requestFcmToken = async (vapidKey?: string): Promise<string | null> => {
  if (typeof window === "undefined") return null;

  try {
    if (!("Notification" in window)) {
      console.warn("[FCM] Desktop notifications are not supported in this browser.");
      return null;
    }

    let permission = Notification.permission;
    console.log(`[FCM] Current notification permission state: ${permission}`);

    if (permission === "denied") {
      console.warn(
        "[FCM] Notification permission is currently 'denied' in your browser settings. To enable notifications, click the site settings / lock icon in your browser address bar and set Notifications to 'Allow'."
      );
      return null;
    }

    if (permission !== "granted") {
      console.log("[FCM] Requesting notification permission prompt...");
      permission = await Notification.requestPermission();
    }

    if (permission !== "granted") {
      console.warn(`[FCM] Notification permission was not granted (status: ${permission}). Cannot generate FCM token.`);
      return null;
    }

    console.log("[FCM] Notification permission granted. Initializing messaging and service worker...");

    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      console.warn("[FCM] Firebase Messaging instance could not be initialized.");
      return null;
    }

    let swRegistration: ServiceWorkerRegistration | undefined;
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
        swRegistration = await navigator.serviceWorker.ready;
        console.log("[FCM] Service Worker registered and ready:", swRegistration.scope);
      } catch (swErr) {
        console.warn("[FCM] Warning: Could not register /firebase-messaging-sw.js:", swErr);
      }
    }

    const effectiveVapidKey =
      vapidKey ||
      process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ||
      "BBfFsORQHZdttpHlivy0a_QtmsESpqGSvDLodmmO__E2Nfsp43jWO9cw5gP1c0x2FKRcN8EyJ406V0dR_vrn6t8";

    console.log("[FCM] Fetching FCM device registration token with VAPID key...");

    const token = await getToken(messaging, {
      vapidKey: effectiveVapidKey,
      serviceWorkerRegistration: swRegistration,
    });

    if (token) {
      console.log(
        `%c[FCM] Device Registration Token:\n%c${token}`,
        "color: #00ff85; font-weight: bold; font-size: 13px;",
        "color: #38bdf8; font-family: monospace; font-size: 11px;"
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("fcm_device_token", token);
      }
      return token;
    } else {
      console.warn("[FCM] No registration token returned. Permission might be required or VAPID key mismatched.");
      return null;
    }
  } catch (error) {
    console.error("[FCM] Error occurred while retrieving FCM token:", error);
    return null;
  }
};

/**
 * Attaches a listener for foreground messages when the web app is open
 */
export const listenToForegroundMessages = async (
  onMessageReceived: (payload: any) => void
): Promise<(() => void) | null> => {
  if (typeof window === "undefined") return null;

  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    console.log("[FCM] Attaching foreground push message listener...");
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log(
        "%c[FCM] Foreground Message Received!",
        "color: #ec4899; font-weight: bold; font-size: 13px;",
        payload
      );
      onMessageReceived(payload);
    });

    return unsubscribe;
  } catch (error) {
    console.error("[FCM] Error listening to foreground messages:", error);
    return null;
  }
};
