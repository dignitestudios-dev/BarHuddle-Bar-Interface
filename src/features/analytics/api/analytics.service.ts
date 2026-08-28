import axiosInstance from "@/lib/axios";

export interface AnalyticsFilterParams {
  filter?: string;
  startDate?: string;
  endDate?: string;
}


export interface OverviewDashboardData {
  totalCheckIns: number;
  totalVisitors: number;
  avgStay: number;
  newCustomers: number;
  repeatCustomers: number;
  lostCustomers: number;
  eventAttendance: number;
  avgRating: number;
}

export interface VisitorsGraphItem {
  date: string;
  visitors: number;
  checkIns: number;
  retention: number;
}

export interface TimeOfDayGraphData {
  morning: number;
  afternoon: number;
  evening: number;
  latenight?: number;
  lateNight?: number;
}

export interface CustomerBreakdownGraphData {
  totalCustomers: number;
  newCustomers: {
    count: number;
    percentage: number;
  };
  repeatCustomers: {
    count: number;
    percentage: number;
  };
  lostCustomers: {
    count: number;
    percentage: number;
  };
}

export interface RetentionDashboardData {
  newCustomers: number;
  repeatCustomers: number;
  lostCustomers: number;
}

export interface DurationTimeSlot {
  hours: number;
  minutes: number;
  totalMinutes: number;
}

export interface AvgDurationDashboardData {
  overall: DurationTimeSlot;
  monThu?: DurationTimeSlot;
  fri?: DurationTimeSlot;
  sat?: DurationTimeSlot;
  sun?: DurationTimeSlot;
}

export interface SentimentCategory {
  count: number;
  percentage: number;
}

export interface VisitorSentimentDashboardData {
  totalResponses: number;
  worthIt: SentimentCategory;
  mid: SentimentCategory;
  notWorthIt: SentimentCategory;
}

export interface EventsOverviewData {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  boostedEvents: number;
}

export interface EventAttendanceItem {
  date: string;
  attendance: number;
}

export interface BestPerformingEventItem {
  _id?: string;
  id?: string;
  title?: string;
  date?: string;
  startAt?: string;
  image?: string;
  banner?: string;
  attendees?: number;
  engagement?: number;
}

export interface PerformanceSummaryData {
  bestPerformingEvent?: {
    eventId?: string | null;
    title?: string | null;
    attendance?: number;
    engagementPercentage?: number;
  } | null;
  peakHours?: string | null;
  peakDay?: string | null;
  topSegment?: {
    ageRange?: string | null;
    count?: number;
    percentage?: number;
  } | null;
  bestDay?: {
    day?: string | null;
    avgVisitors?: number;
  } | null;
  satisfaction?: {
    totalReviews?: number;
    score?: string;
  } | null;
}

export interface BoostedOverviewData {
  totalReach: number;
  totalReachDefinition?: string;
  totalViews?: number | null;
  avgEngagement?: number | null;
  trackingPending?: boolean;
  trackingNote?: string;
}

export interface OrganicVsBoostedItem {
  date: string;
  organic: number;
  boosted: number;
}

export interface BoostedEventItem {
  boostId?: string;
  eventName?: string;
  boostedDate?: string;
  boostEndDate?: string;
  status?: string;
  reach?: number | null;
  views?: number | null;
  engagement?: number | null;
  trackingPending?: boolean;
}

export interface BoostedEventsResponseData {
  success?: boolean;
  message?: string;
  data: BoostedEventItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NormalEventReportItem {
  eventId?: string;
  eventName?: string;
  date?: string;
  attendance?: number;
  sentiment?: number | string | null;
  status?: string;
}

export interface NormalEventsReportResponse {
  success?: boolean;
  message?: string;
  data: NormalEventReportItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BoostedSentimentEventItem {
  eventId?: string;
  eventName?: string;
  date?: string;
  attendance?: number;
  sentiment?: number | string | null;
  status?: string;
}

export interface BoostedSentimentEventsResponse {
  success?: boolean;
  message?: string;
  data: BoostedSentimentEventItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BoostedEventVisitorItem {
  _id?: string;
  venue?: string;
  status?: string;
  boostId?: string;
  eventId?: string;
  eventName?: string;
  boostedDate?: string;
  boostEndDate?: string;
  checkIns?: number;
  totalVisitors?: number;
  newVisitors?: number;
  avgStay?: {
    hours?: number;
    minutes?: number;
    totalMinutes?: number;
  };
}

export interface BoostedEventVisitorsResponse {
  success?: boolean;
  message?: string;
  data: BoostedEventVisitorItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface VenueOwnerSentimentData {
  avgDwellMinutes?: number;
  avgRating?: number;
  retentionRate?: number;
  returningUsers?: number;
  sentimentScore?: {
    score: number;
    worthIt: number;
    mid: number;
    notWorthIt: number;
  };
}

export interface AnalyticsApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const analyticService = {
  getOverview: async (params?: AnalyticsFilterParams): Promise<AnalyticsApiResponse<OverviewDashboardData>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<OverviewDashboardData>>(
      "/analytics/overview",
      { params }
    );
    return response.data;
  },

  getVisitorsGraph: async (params?: AnalyticsFilterParams): Promise<AnalyticsApiResponse<VisitorsGraphItem[]>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<VisitorsGraphItem[]>>(
      "/analytics/overview/vistors-graph",
      { params }
    );
    return response.data;
  },

  getTimeOfDayGraph: async (params?: AnalyticsFilterParams): Promise<AnalyticsApiResponse<TimeOfDayGraphData>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<TimeOfDayGraphData>>(
      "/analytics/overview/time-of-day-graph",
      { params }
    );
    return response.data;
  },

  getCustomerBreakdownGraph: async (
    params?: AnalyticsFilterParams
  ): Promise<AnalyticsApiResponse<CustomerBreakdownGraphData>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<CustomerBreakdownGraphData>>(
      "/analytics/overview/customer-breakdown-graph",
      { params }
    );
    return response.data;
  },

  getRetentionDashboard: async (
    params?: AnalyticsFilterParams
  ): Promise<AnalyticsApiResponse<RetentionDashboardData>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<RetentionDashboardData>>(
      "/analytics/retention/retention-dashboard",
      { params }
    );
    return response.data;
  },

  getAvgDurationDashboard: async (
    params?: AnalyticsFilterParams
  ): Promise<AnalyticsApiResponse<AvgDurationDashboardData>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<AvgDurationDashboardData>>(
      "/analytics/retention/avg-duration-dashboard",
      { params }
    );
    return response.data;
  },

  getVisitorSentimentDashboard: async (
    params?: AnalyticsFilterParams
  ): Promise<AnalyticsApiResponse<VisitorSentimentDashboardData>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<VisitorSentimentDashboardData>>(
      "/analytics/retention/visitor-sentiment-dashboard",
      { params }
    );
    return response.data;
  },

  getEventsOverview: async (
    params?: AnalyticsFilterParams
  ): Promise<AnalyticsApiResponse<EventsOverviewData>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<EventsOverviewData>>(
      "/analytics/events/overview",
      { params }
    );
    return response.data;
  },

  getEventsAttendance: async (
    params?: AnalyticsFilterParams
  ): Promise<AnalyticsApiResponse<EventAttendanceItem[]>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<EventAttendanceItem[]>>(
      "/analytics/events/attendance",
      { params }
    );
    return response.data;
  },

  getBestPerformingEvents: async (
    params?: AnalyticsFilterParams
  ): Promise<AnalyticsApiResponse<BestPerformingEventItem[]>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<BestPerformingEventItem[]>>(
      "/analytics/events/best-performing",
      { params }
    );
    return response.data;
  },

  getPerformanceSummary: async (
    params?: AnalyticsFilterParams
  ): Promise<AnalyticsApiResponse<PerformanceSummaryData>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<PerformanceSummaryData>>(
      "/analytics/performance-summary",
      { params }
    );
    return response.data;
  },

  getBoostedOverview: async (
    params?: AnalyticsFilterParams
  ): Promise<AnalyticsApiResponse<BoostedOverviewData>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<BoostedOverviewData>>(
      "/analytics/boosted/overview",
      { params }
    );
    return response.data;
  },

  getOrganicVsBoosted: async (
    params?: AnalyticsFilterParams
  ): Promise<AnalyticsApiResponse<OrganicVsBoostedItem[]>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<OrganicVsBoostedItem[]>>(
      "/analytics/boosted/organic-vs-boosted",
      { params }
    );
    return response.data;
  },

  getBoostedEvents: async (
    params?: { page?: number; limit?: number }
  ): Promise<BoostedEventsResponseData> => {
    const response = await axiosInstance.get<BoostedEventsResponseData>(
      "/analytics/boosted/events",
      { params }
    );
    return response.data;
  },

  getBoostedEventVisitors: async (
    params?: { page?: number; limit?: number }
  ): Promise<BoostedEventVisitorsResponse> => {
    const response = await axiosInstance.get<BoostedEventVisitorsResponse>(
      "/analytics/boosted/events/visitors",
      { params }
    );
    return response.data;
  },

  getNormalEvents: async (
    params?: { page?: number; limit?: number }
  ): Promise<NormalEventsReportResponse> => {
    const response = await axiosInstance.get<NormalEventsReportResponse>(
      "/analytics/events/normal",
      { params }
    );
    return response.data;
  },

  getBoostedSentimentEvents: async (
    params?: { page?: number; limit?: number }
  ): Promise<BoostedSentimentEventsResponse> => {
    const response = await axiosInstance.get<BoostedSentimentEventsResponse>(
      "/analytics/events/boosted-sentiment",
      { params }
    );
    return response.data;
  },

  getSentimentAnalytics: async (
    params?: AnalyticsFilterParams
  ): Promise<AnalyticsApiResponse<VenueOwnerSentimentData>> => {
    const response = await axiosInstance.get<AnalyticsApiResponse<VenueOwnerSentimentData>>(
      "/venue-owner/analytics/sentiment",
      { params }
    );
    return response.data;
  },

  getDashboard: async () => {
    const response = await axiosInstance.get("/venue-owner/dashboard");
    return response.data;
  },
  getVisitorAnalytics: async () => {
    const response = await axiosInstance.get("/venue-owner/analytics/visitors");
    return response.data;
  },
  getRetentionAnalytics: async () => {
    const response = await axiosInstance.get("/venue-owner/analytics/retention");
    return response.data;
  },
  getEventsAnalytics: async () => {
    const response = await axiosInstance.get("/venue-owner/analytics/events");
    return response.data;
  },
};
