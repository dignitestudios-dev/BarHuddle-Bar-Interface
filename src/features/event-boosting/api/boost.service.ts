import axiosInstance from "@/lib/axios";

export interface Boost {
  id: string;
  // add other fields
}

export interface CreateBoostPayload {
  eventId: string;
  startAt: string;
  endAt: string;
  amount: number;
}

export interface BoostQueryParams {
  page?: number;
  limit?: number;
  venueId?: string;
  [key: string]: any;
}

export const boostService = {
  getBoosts: async (
    paramsOrPage?: BoostQueryParams | number,
    limit = 10,
    venueId?: string
  ) => {
    const params = typeof paramsOrPage === "object"
      ? { page: 1, limit: 10, ...paramsOrPage }
      : paramsOrPage !== undefined
      ? { page: paramsOrPage, limit, ...(venueId ? { venueId } : {}) }
      : { page: 1, limit: 10 };

    const response = await axiosInstance.get("/venue-owner/boosts", { params });
    return response.data;
  },
  createBoost: async (data: CreateBoostPayload) => {
    const response = await axiosInstance.post("/venue-owner/boosts", data);
    return response.data;
  },
  getBoostDetails: async (id: string) => {
    const response = await axiosInstance.get(`/venue-owner/boosts/${id}`);
    return response.data;
  },
  checkoutBoost: async (id: string, data: any) => {
    const response = await axiosInstance.post(`/venue-owner/boosts/${id}/checkout`, data);
    return response.data;
  },
};
