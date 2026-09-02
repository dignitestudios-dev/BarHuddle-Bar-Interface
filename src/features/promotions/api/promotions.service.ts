import axiosInstance from "@/lib/axios";

export interface Promotion {
  id: string;
  // add other fields
}

export interface PromotionQueryParams {
  page?: number;
  limit?: number;
  venueId?: string;
  [key: string]: any;
}

export const promotionService = {
  getPromotions: async (
    paramsOrPage?: PromotionQueryParams | number,
    limit = 10,
    venueId?: string
  ) => {
    const params = typeof paramsOrPage === "object"
      ? { page: 1, limit: 10, ...paramsOrPage }
      : { page: paramsOrPage ?? 1, limit, ...(venueId ? { venueId } : {}) };

    const response = await axiosInstance.get("/venue-owner/promotions", {
      params,
    });
    return response.data;
  },
  createPromotion: async (data: any) => {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const response = await axiosInstance.post("/venue-owner/promotions", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return response.data;
  },
  getPromotionDetails: async (id: string) => {
    const response = await axiosInstance.get(`/venue-owner/promotions/${id}`);
    return response.data;
  },
  getPromotionAnalytics: async (venueId?: string) => {
    const response = await axiosInstance.get("/venue-owner/analytics/promotions", {
      params: venueId ? { venueId } : undefined,
    });
    return response.data;
  },
  updatePromotion: async (id: string, data: any) => {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const response = await axiosInstance.put(`/venue-owner/promotions/${id}`, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return response.data;
  },
  deletePromotion: async (id: string) => {
    const response = await axiosInstance.delete(`/venue-owner/promotions/${id}`);
    return response.data;
  },
};
