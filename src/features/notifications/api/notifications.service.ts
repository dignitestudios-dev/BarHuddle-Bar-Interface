import axiosInstance from "@/lib/axios";

export interface NotificationItem {
  _id?: string;
  id?: string;
  isRead?: boolean;
  notificationContent?: {
    title?: string;
    body?: string;
  };
  title?: string;
  message?: string;
  time?: string;
  createdAt?: string;
}

export const notificationService = {
  getNotifications: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get("/venue-owner/notifications", {
      params: { page, limit },
    });
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.post("/venue-owner/notifications/read-all");
    return response.data;
  },
};
