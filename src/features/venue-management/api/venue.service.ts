import axiosInstance from "@/lib/axios";

// TypeScript definitions for venue API models
export interface VenueGender {
  male: number;
  female: number;
  nonBinary: number;
  malePercent: number;
  femalePercent: number;
  nonBinaryPercent: number;
  total: number;
}

export interface VenueLocationCoords {
  lat: number;
  lng: number;
}

export interface Venue {
  _id: string;
  id?: string;
  placeId?: string;
  name: string;
  category?: string;
  address?: string;
  description?: string;
  location?: string | VenueLocationCoords;
  coverImage?: string;
  images?: string[];
  icon?: string;
  iconBackgroundColor?: string;
  rating?: number;
  operatingHours?: any[];
  popularityCount?: number;
  isFavorite?: boolean;
  totalGoing?: number;
  medianAge?: number | null;
  gender?: VenueGender;
  friendsGoing?: any[];
  otherUsersCount?: number;
  isGoing?: boolean;
  isClaimed?: boolean;
  hasStories?: boolean;
  storiesCount?: number;
  status?: "pending" | "approved" | "rejected";
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
    return response.data?.data || response.data;
  },

  // Update Specific Venue Details
  updateVenue: async (id: string, data: { name?: string; address?: string }) => {
    const response = await axiosInstance.put(`/venue-owner/venues/${id}`, data);
    return response.data?.data || response.data;
  },

  // Add Image to Venue Gallery
  addGalleryImage: async (venueId: string, formData: FormData) => {
    const response = await axiosInstance.post(`/venue-owner/venues/${venueId}/gallery`, formData);
    return response.data?.data || response.data;
  },

  // Remove Image from Venue Gallery
  removeGalleryImage: async (venueId: string, image: string) => {
    const response = await axiosInstance.put(`/venue-owner/venues/${venueId}/gallery`, {
      image,
    });
    return response.data?.data || response.data;
  },

  // Get Venue Operating Hours
  getOperatingHours: async (venueId: string) => {
    const response = await axiosInstance.get(`/venue-owner/venues/${venueId}/hours`);
    return response.data?.data || response.data;
  },

  // Update Venue Operating Hours
  updateOperatingHours: async (venueId: string, data: { hours: any[] }) => {
    const response = await axiosInstance.put(`/venue-owner/venues/${venueId}/hours`, data);
    return response.data?.data || response.data;
  },
};
