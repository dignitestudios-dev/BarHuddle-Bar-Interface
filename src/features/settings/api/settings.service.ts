import axiosInstance from "@/lib/axios";

export interface NotificationSettingsData {
  _id?: string;
  user?: string;
  enableAll: boolean;
  eventUpdates: boolean;
  venueActivityAlerts: boolean;
  subscriptionBilling: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationSettingsResponse {
  message: string;
  data: NotificationSettingsData;
}

export interface UpdateNotificationSettingsPayload {
  enableAll: boolean;
  eventUpdates: boolean;
  venueActivityAlerts: boolean;
  subscriptionBilling: boolean;
}

export const settingsService = {
  getNotificationSettings: async (): Promise<NotificationSettingsResponse> => {
    const { data } = await axiosInstance.get<NotificationSettingsResponse>(
      "/venue-owner/notification-settings"
    );
    return data;
  },

  updateNotificationSettings: async (
    payload: UpdateNotificationSettingsPayload
  ): Promise<NotificationSettingsResponse> => {
    const { data } = await axiosInstance.put<NotificationSettingsResponse>(
      "/venue-owner/notification-settings",
      payload
    );
    return data;
  },
};
