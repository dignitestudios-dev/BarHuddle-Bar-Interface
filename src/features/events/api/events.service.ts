import axiosInstance from "@/lib/axios";

export interface Event {
  id: string;
  // add other fields
}

export const eventService = {
  getEvents: async () => {
    const response = await axiosInstance.get("/venue-owner/events");
    return response.data;
  },
  createEvent: async (data: FormData) => {
    const response = await axiosInstance.post("/venue-owner/events", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  getEventDetails: async (id: string) => {
    const response = await axiosInstance.get(`/venue-owner/events/${id}`);
    return response.data;
  },
  updateEvent: async (id: string, data: any) => {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const response = await axiosInstance.put(`/venue-owner/events/${id}`, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return response.data;
  },
  deleteEvent: async (id: string) => {
    const response = await axiosInstance.delete(`/venue-owner/events/${id}`);
    return response.data;
  },
  getEventPerformance: async (id: string) => {
    const response = await axiosInstance.get(`/venue-owner/events/${id}/performance`);
    return response.data;
  },
  getBoostedEvents: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get("/venue-owner/boosts", {
      params: { page, limit },
    });
    return response.data;
  },
};
