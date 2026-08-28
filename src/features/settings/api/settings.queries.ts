import { useQuery } from "@tanstack/react-query";
import { settingsService } from "./settings.service";

export const settingsKeys = {
  all: ["settings"] as const,
  notificationSettings: () => [...settingsKeys.all, "notifications"] as const,
};

export const useGetNotificationSettingsQuery = () => {
  return useQuery({
    queryKey: settingsKeys.notificationSettings(),
    queryFn: () => settingsService.getNotificationSettings(),
  });
};
