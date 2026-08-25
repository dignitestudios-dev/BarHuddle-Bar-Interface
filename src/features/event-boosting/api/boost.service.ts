import axiosInstance from "@/lib/axios";

export interface Boost {
  id: string;
  // add other fields
}

export const boostService = {
  getBoosts: async () => {
    const response = await axiosInstance.get("/venue-owner/boosts");
    return response.data;
  },
  createBoost: async (data: any) => {
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
