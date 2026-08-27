import axiosInstance from "@/lib/axios";

// TypeScript definitions for venue API models
export interface Venue {
  id: string;
  name: string;
  description: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  // add other fields as per your backend schema
}

export type ClaimVenuePayload = FormData;

export const venueService = {
  // 3. Venue Management Endpoints

  // List My Venues
  getMyVenues: async (page = 1, limit = 10, search = ""): Promise<Venue[]> => {
    const response = await axiosInstance.get("/venues", {
      params: { page, limit, search }
    });
    return response.data?.data || [];
  },

  getOwnerVenues: async (): Promise<Venue[]> => {
    const response = await axiosInstance.get("/venue-owner/venues");
    return response.data?.data || response.data || [];
  },

  claimVenue: async (data: ClaimVenuePayload) => {
    const response = await axiosInstance.post("/venue-owner/claim", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // List My Claims
  getMyClaims: async () => {
    const response = await axiosInstance.get("/venue-owner/claims");
    return response.data;
  },

  // Get Specific Venue Details
  getVenueDetails: async (id: string): Promise<Venue> => {
    const response = await axiosInstance.get(`/venue-owner/venues/${id}`);
    return response.data;
  },

  // Update Specific Venue Details
  updateVenue: async (id: string, data: Partial<Venue>) => {
    const response = await axiosInstance.put(`/venue-owner/venues/${id}`, data);
    return response.data;
  },

  // Add Image to Venue Gallery
  addGalleryImage: async (venueId: string, formData: FormData) => {
    const response = await axiosInstance.post(`/venue-owner/venues/${venueId}/gallery`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Remove Image from Venue Gallery
  removeGalleryImage: async (venueId: string, imageId: string) => {
    const response = await axiosInstance.delete(`/venue-owner/venues/${venueId}/gallery/${imageId}`);
    return response.data;
  },

  // Get Venue Operating Hours
  getOperatingHours: async (venueId: string) => {
    const response = await axiosInstance.get(`/venue-owner/venues/${venueId}/hours`);
    return response.data;
  },

  // Update Venue Operating Hours
  updateOperatingHours: async (venueId: string, data: any) => {
    const response = await axiosInstance.put(`/venue-owner/venues/${venueId}/hours`, data);
    return response.data;
  },

  // Create Venue Story
  createVenueStory: async (data: FormData) => {
    const response = await axiosInstance.post("/venue-owner/stories", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
