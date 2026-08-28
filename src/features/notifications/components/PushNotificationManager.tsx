"use client";

import { useEffect, useRef } from "react";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useAppSelector } from "@/store";

export function PushNotificationManager() {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { requestPermission } = usePushNotifications();
  const hasAttemptedRef = useRef(false);

  useEffect(() => {
    // Only attempt when user is logged in
    if (!accessToken) return;

    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      !hasAttemptedRef.current
    ) {
      hasAttemptedRef.current = true;
      requestPermission();
    }
  }, [accessToken, requestPermission]);

  return null;
}


export default PushNotificationManager;
