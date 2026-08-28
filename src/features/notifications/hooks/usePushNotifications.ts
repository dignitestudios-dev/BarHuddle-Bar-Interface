"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { requestFcmToken, listenToForegroundMessages } from "@/lib/firebase-messaging";
import { notificationsKeys } from "../api/notifications.queries";
import { updateFcmToken } from "@/features/auth/api/auth.service";

export function usePushNotifications() {
  const queryClient = useQueryClient();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPermission = useCallback(async (customVapidKey?: string) => {
    setIsRequesting(true);
    try {
      const token = await requestFcmToken(customVapidKey);
      if (typeof window !== "undefined" && "Notification" in window) {
        setPermission(Notification.permission);
      }

      if (token) {
        setFcmToken(token);
        // Sync FCM token to backend POST /auth/update-fcm
        updateFcmToken(token);
        return token;
      }
      return null;
    } catch (error) {
      console.error("[Push Notifications] Error requesting permission:", error);
      return null;
    } finally {
      setIsRequesting(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      const stored = localStorage.getItem("fcm_device_token");
      if (stored) {
        setFcmToken(stored);
        updateFcmToken(stored);
      }

      if (Notification.permission === "granted") {
        handleRequestPermission();
      }
    }
  }, [handleRequestPermission]);

  // Listen for foreground push messages
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupListener = async () => {
      unsubscribe = await listenToForegroundMessages((payload) => {
        const title = payload.notification?.title || payload.data?.title || "New Notification";
        const body = payload.notification?.body || payload.data?.body || payload.data?.message || "";

        // Display rich in-app toast notification
        toast(title, {
          description: body,
          duration: 6000,
        });

        // Invalidate notifications query so dropdown/bell updates live
        queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
      });
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [queryClient]);

  return {
    fcmToken,
    permission,
    isRequesting,
    requestPermission: handleRequestPermission,
    isSupported: typeof window !== "undefined" && "Notification" in window,
  };
}
