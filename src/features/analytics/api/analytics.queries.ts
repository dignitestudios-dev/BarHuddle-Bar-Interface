import { useQuery } from "@tanstack/react-query";
import { analyticService, AnalyticsFilterParams } from "./analytics.service";

export const analyticsKeys = {
  all: ['analytics'] as const,
  lists: () => [...analyticsKeys.all, 'list'] as const,
  list: (filters: any) => [...analyticsKeys.lists(), { filters }] as const,
  details: () => [...analyticsKeys.all, 'detail'] as const,
  detail: (id: string) => [...analyticsKeys.details(), id] as const,
  overview: (params?: AnalyticsFilterParams) => [...analyticsKeys.all, 'overview', params] as const,
  visitorsGraph: (params?: AnalyticsFilterParams) => [...analyticsKeys.all, 'visitors-graph', params] as const,
  timeOfDayGraph: (params?: AnalyticsFilterParams) => [...analyticsKeys.all, 'time-of-day-graph', params] as const,
  customerBreakdownGraph: (params?: AnalyticsFilterParams) => [...analyticsKeys.all, 'customer-breakdown-graph', params] as const,
  retentionDashboard: (params?: AnalyticsFilterParams) => [...analyticsKeys.all, 'retention-dashboard', params] as const,
  avgDurationDashboard: (params?: AnalyticsFilterParams) => [...analyticsKeys.all, 'avg-duration-dashboard', params] as const,
  visitorSentimentDashboard: (params?: AnalyticsFilterParams) => [...analyticsKeys.all, 'visitor-sentiment-dashboard', params] as const,
  eventsOverview: (params?: AnalyticsFilterParams) => [...analyticsKeys.all, 'events-overview', params] as const,
  eventsAttendance: (params?: AnalyticsFilterParams) => [...analyticsKeys.all, 'events-attendance', params] as const,
  bestPerformingEvents: (params?: AnalyticsFilterParams) => [...analyticsKeys.all, 'best-performing-events', params] as const,
  performanceSummary: (params?: AnalyticsFilterParams) => [...analyticsKeys.all, 'performance-summary', params] as const,
  boostedOverview: (params?: AnalyticsFilterParams) => [...analyticsKeys.all, 'boosted-overview', params] as const,
  organicVsBoosted: (params?: AnalyticsFilterParams) => [...analyticsKeys.all, 'organic-vs-boosted', params] as const,
  boostedEvents: (params?: { page?: number; limit?: number; venueId?: string }) => [...analyticsKeys.all, 'boosted-events', params] as const,
  boostedEventVisitors: (params?: { page?: number; limit?: number; venueId?: string }) => [...analyticsKeys.all, 'boosted-event-visitors', params] as const,
  normalEvents: (params?: { page?: number; limit?: number; venueId?: string }) => [...analyticsKeys.all, 'normal-events', params] as const,
  boostedSentimentEvents: (params?: { page?: number; limit?: number; venueId?: string }) => [...analyticsKeys.all, 'boosted-sentiment-events', params] as const,
};

export const useGetOverviewQuery = (params?: AnalyticsFilterParams) => {
  return useQuery({
    queryKey: analyticsKeys.overview(params),
    queryFn: () => analyticService.getOverview(params),
  });
};

export const useGetVisitorsGraphQuery = (params?: AnalyticsFilterParams) => {
  return useQuery({
    queryKey: analyticsKeys.visitorsGraph(params),
    queryFn: () => analyticService.getVisitorsGraph(params),
  });
};

export const useGetTimeOfDayGraphQuery = (params?: AnalyticsFilterParams) => {
  return useQuery({
    queryKey: analyticsKeys.timeOfDayGraph(params),
    queryFn: () => analyticService.getTimeOfDayGraph(params),
  });
};

export const useGetCustomerBreakdownGraphQuery = (params?: AnalyticsFilterParams) => {
  return useQuery({
    queryKey: analyticsKeys.customerBreakdownGraph(params),
    queryFn: () => analyticService.getCustomerBreakdownGraph(params),
  });
};

export const useGetRetentionDashboardQuery = (params?: AnalyticsFilterParams) => {
  return useQuery({
    queryKey: analyticsKeys.retentionDashboard(params),
    queryFn: () => analyticService.getRetentionDashboard(params),
  });
};

export const useGetAvgDurationDashboardQuery = (params?: AnalyticsFilterParams) => {
  return useQuery({
    queryKey: analyticsKeys.avgDurationDashboard(params),
    queryFn: () => analyticService.getAvgDurationDashboard(params),
  });
};

export const useGetVisitorSentimentDashboardQuery = (params?: AnalyticsFilterParams) => {
  const finalParams: AnalyticsFilterParams = {
    ...params,
    filter: params?.filter || "weekly",
  };
  return useQuery({
    queryKey: analyticsKeys.visitorSentimentDashboard(finalParams),
    queryFn: () => analyticService.getVisitorSentimentDashboard(finalParams),
  });
};

export const useGetEventsOverviewQuery = (params?: AnalyticsFilterParams) => {
  return useQuery({
    queryKey: analyticsKeys.eventsOverview(params),
    queryFn: () => analyticService.getEventsOverview(params),
  });
};

export const useGetEventsAttendanceQuery = (params?: AnalyticsFilterParams) => {
  return useQuery({
    queryKey: analyticsKeys.eventsAttendance(params),
    queryFn: () => analyticService.getEventsAttendance(params),
  });
};

export const useGetBestPerformingEventsQuery = (params?: AnalyticsFilterParams) => {
  return useQuery({
    queryKey: analyticsKeys.bestPerformingEvents(params),
    queryFn: () => analyticService.getBestPerformingEvents(params),
  });
};

export const useGetBestPerformanceQuery = useGetBestPerformingEventsQuery;

export const useGetPerformanceSummaryQuery = (params?: AnalyticsFilterParams) => {
  return useQuery({
    queryKey: analyticsKeys.performanceSummary(params),
    queryFn: () => analyticService.getPerformanceSummary(params),
  });
};

export const useGetBoostedOverviewQuery = (params?: AnalyticsFilterParams) => {
  return useQuery({
    queryKey: analyticsKeys.boostedOverview(params),
    queryFn: () => analyticService.getBoostedOverview(params),
  });
};

export const useGetOrganicVsBoostedQuery = (params?: AnalyticsFilterParams) => {
  return useQuery({
    queryKey: analyticsKeys.organicVsBoosted(params),
    queryFn: () => analyticService.getOrganicVsBoosted(params),
  });
};

export const useGetBoostedEventsQuery = (params?: { page?: number; limit?: number; venueId?: string }) => {
  return useQuery({
    queryKey: analyticsKeys.boostedEvents(params),
    queryFn: () => analyticService.getBoostedEvents(params),
  });
};

export const useGetBoostedEventVisitorsQuery = (params?: { page?: number; limit?: number; venueId?: string }) => {
  return useQuery({
    queryKey: analyticsKeys.boostedEventVisitors(params),
    queryFn: () => analyticService.getBoostedEventVisitors(params),
  });
};

export const useGetNormalEventsQuery = (params?: { page?: number; limit?: number; venueId?: string }) => {
  return useQuery({
    queryKey: analyticsKeys.normalEvents(params),
    queryFn: () => analyticService.getNormalEvents(params),
  });
};

export const useGetBoostedSentimentEventsQuery = (params?: { page?: number; limit?: number; venueId?: string }) => {
  return useQuery({
    queryKey: analyticsKeys.boostedSentimentEvents(params),
    queryFn: () => analyticService.getBoostedSentimentEvents(params),
  });
};

