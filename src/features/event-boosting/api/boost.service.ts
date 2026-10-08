import axiosInstance from "@/lib/axios";

export interface Boost {
  id: string;
  // add other fields
}

export interface CreateBoostPayload {
  eventId: string;
  planId?: string;
  startAt?: string;
  endAt?: string;
  amount?: number;
}

export interface BoostQueryParams {
  page?: number;
  limit?: number;
  venueId?: string;
  [key: string]: any;
}

export const boostService = {
  /**
   * Fetch all boosts for the venue owner.
   */
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

  /**
   * Create a single event boost.
   * Endpoint: POST /venue-owner/boosts
   * Body: { "eventId": "..." }
   * Note: Price and 7-day duration are calculated server-side based on the venue owner's active plan.
   */
  createBoost: async (data: CreateBoostPayload) => {
    const response = await axiosInstance.post("/venue-owner/boosts", data);
    return response.data;
  },

  /**
   * Get boost details by ID.
   * Endpoint: GET /venue-owner/boosts/:id
   */
  getBoostDetails: async (id: string) => {
    const response = await axiosInstance.get(`/venue-owner/boosts/${id}`);
    return response.data;
  },

  /**
   * Checkout boost session.
   * Endpoint: POST /venue-owner/boosts/:id/checkout
   */
  checkoutBoost: async (id: string, data: any) => {
    const response = await axiosInstance.post(`/venue-owner/boosts/${id}/checkout`, data);
    return response.data;
  },
};
