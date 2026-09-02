import axiosInstance from "@/lib/axios";

export interface Event {
  id: string;
  // add other fields
}

export interface EventQueryParams {
  page?: number;
  limit?: number;
  venueId?: string;
  [key: string]: any;
}

export const eventService = {
  getEvents: async (params?: EventQueryParams) => {
    const queryParams = {
      page: 1,
      limit: 10,
      ...params,
    };
    const response = await axiosInstance.get("/venue-owner/events", {
      params: queryParams,
    });
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
  getBoostedEvents: async (
    paramsOrPage?: { page?: number; limit?: number; venueId?: string } | number,
    limit = 10,
    venueId?: string
  ) => {
    const params = typeof paramsOrPage === "object"
      ? { page: 1, limit: 10, ...paramsOrPage }
      : { page: paramsOrPage ?? 1, limit, ...(venueId ? { venueId } : {}) };

    const response = await axiosInstance.get("/venue-owner/boosts", {
      params,
    });
    return response.data;
  },
};
