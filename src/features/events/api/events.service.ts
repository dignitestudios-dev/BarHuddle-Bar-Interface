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
  createEvent: async (data: any) => {
    const response = await axiosInstance.post("/venue-owner/events", data);
    return response.data;
  },
  getEventDetails: async (id: string) => {
    const response = await axiosInstance.get(`/venue-owner/events/${id}`);
    return response.data;
  },
  updateEvent: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/venue-owner/events/${id}`, data);
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
};
