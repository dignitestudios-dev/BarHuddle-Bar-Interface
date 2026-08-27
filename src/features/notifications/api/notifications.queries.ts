import { useQuery } from "@tanstack/react-query";
import { notificationService } from "./notifications.service";

export const notificationsKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationsKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...notificationsKeys.lists(), { page, limit }] as const,
};

export const useGetNotificationsQuery = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: notificationsKeys.list(page, limit),
    queryFn: () => notificationService.getNotifications(page, limit),
  });
};
