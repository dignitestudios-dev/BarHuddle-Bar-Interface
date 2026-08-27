import axiosInstance from "@/lib/axios";

export interface Promotion {
  id: string;
  // add other fields
}

export const promotionService = {
  getPromotions: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get("/venue-owner/promotions", {
      params: { page, limit },
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
