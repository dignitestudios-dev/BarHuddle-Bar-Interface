"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store";
import { rehydrate } from "@/store/slices/auth.slice";

export default function AuthRehydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const userStr = localStorage.getItem("auth-user");
    const user = userStr ? JSON.parse(userStr) : null;

    dispatch(rehydrate({ token, user }));
    setIsReady(true);
  }, [dispatch]);

  // Optionally, you can return a loader here while not ready, 
  // but returning children immediately allows Next.js to render faster, 
  // while state syncing happens post-mount.
  if (!isReady) return null; // Avoid hydration mismatch on initial load with auth specific UI

  return <>{children}</>;
}
