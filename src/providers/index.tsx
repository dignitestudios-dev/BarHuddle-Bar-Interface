"use client";

import ReduxProvider from "./redux-provider";
import QueryProvider from "./query-provider";
import AuthRehydrator from "./auth-rehydrator";
import { PushNotificationManager } from "@/features/notifications/components/PushNotificationManager";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthRehydrator>
          <PushNotificationManager />
          {children}
        </AuthRehydrator>
      </QueryProvider>
    </ReduxProvider>
  );
}
