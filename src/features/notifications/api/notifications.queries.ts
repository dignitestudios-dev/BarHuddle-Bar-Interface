import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { notificationService } from "./notifications.service";

export const notificationsKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationsKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...notificationsKeys.lists(), { page, limit }] as const,
  infinite: (limit: number) => [...notificationsKeys.lists(), 'infinite', { limit }] as const,
};

export const useGetNotificationsQuery = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: notificationsKeys.list(page, limit),
    queryFn: () => notificationService.getNotifications(page, limit),
  });
};

export const useGetInfiniteNotificationsQuery = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: notificationsKeys.infinite(limit),
    queryFn: ({ pageParam = 1 }) => notificationService.getNotifications(pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const items = Array.isArray(lastPage?.data)
        ? lastPage.data
        : Array.isArray(lastPage?.data?.notifications)
        ? lastPage.data.notifications
        : Array.isArray(lastPage?.notifications)
        ? lastPage.notifications
        : Array.isArray(lastPage?.data?.data)
        ? lastPage.data.data
        : Array.isArray(lastPage)
        ? lastPage
        : [];

      const totalPages =
        lastPage?.totalPages ||
        lastPage?.data?.totalPages ||
        lastPage?.pagination?.totalPages ||
        lastPage?.meta?.totalPages;

      const currentPage =
        lastPage?.page ||
        lastPage?.data?.page ||
        lastPage?.pagination?.page ||
        lastPage?.meta?.page ||
        allPages.length;

      const hasMore =
        lastPage?.hasMore ??
        lastPage?.data?.hasMore ??
        lastPage?.hasNextPage ??
        lastPage?.pagination?.hasNextPage ??
        lastPage?.data?.hasNextPage;

      if (hasMore !== undefined) {
        return hasMore ? currentPage + 1 : undefined;
      }

      if (totalPages !== undefined) {
        return currentPage < totalPages ? currentPage + 1 : undefined;
      }

      return items.length >= limit ? allPages.length + 1 : undefined;
    },
  });
};
