import axiosInstance from "@/lib/axios";

export interface Analytics {
  id: string;
  // add other fields
}

export const analyticService = {
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
  getSentimentAnalytics: async () => {
    const response = await axiosInstance.get("/venue-owner/analytics/sentiment");
    return response.data;
  },
  getEventsAnalytics: async () => {
    const response = await axiosInstance.get("/venue-owner/analytics/events");
    return response.data;
  },
};
