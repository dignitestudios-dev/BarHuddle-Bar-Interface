import { useQuery } from "@tanstack/react-query";
import { analyticService } from "./analytics.service";

export const analyticsKeys = {
  all: ['analytics'] as const,
  lists: () => [...analyticsKeys.all, 'list'] as const,
  list: (filters: string) => [...analyticsKeys.lists(), { filters }] as const,
  details: () => [...analyticsKeys.all, 'detail'] as const,
  detail: (id: string) => [...analyticsKeys.details(), id] as const,
};

export const useGetDashboardQuery = () => {
  return useQuery({
    queryKey: analyticsKeys.lists(),
    queryFn: () => analyticService.getDashboard(),
  });
};

export const useGetVisitorAnalyticsQuery = () => {
  return useQuery({
    queryKey: analyticsKeys.lists(),
    queryFn: () => analyticService.getVisitorAnalytics(),
  });
};

export const useGetRetentionAnalyticsQuery = () => {
  return useQuery({
    queryKey: analyticsKeys.lists(),
    queryFn: () => analyticService.getRetentionAnalytics(),
  });
};

export const useGetSentimentAnalyticsQuery = () => {
  return useQuery({
    queryKey: analyticsKeys.lists(),
    queryFn: () => analyticService.getSentimentAnalytics(),
  });
};

export const useGetEventsAnalyticsQuery = () => {
  return useQuery({
    queryKey: analyticsKeys.lists(),
    queryFn: () => analyticService.getEventsAnalytics(),
  });
};

