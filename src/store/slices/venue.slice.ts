import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectedVenueData {
  id: string;
  name: string;
  address?: string;
  coverImage?: string;
}

interface VenueState {
  selectedVenueId: string | null;
  selectedVenueName: string | null;
  selectedVenue: SelectedVenueData | null;
}

const getStoredItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return null;
};

const getStoredVenue = (): SelectedVenueData | null => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("selected-venue-data");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  return null;
};

const initialStoredVenue = getStoredVenue();
const initialVenueId = initialStoredVenue?.id || getStoredItem("selected-venue-id");
const initialVenueName = initialStoredVenue?.name || getStoredItem("selected-venue-name");

const initialState: VenueState = {
  selectedVenueId: initialVenueId,
  selectedVenueName: initialVenueName,
  selectedVenue: initialStoredVenue,
};

const venueSlice = createSlice({
  name: "venue",
  initialState,
  reducers: {
    setSelectedVenue: (state, action: PayloadAction<SelectedVenueData>) => {
      state.selectedVenueId = action.payload.id;
      state.selectedVenueName = action.payload.name;
      state.selectedVenue = action.payload;

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("selected-venue-id", action.payload.id);
          localStorage.setItem("selected-venue-name", action.payload.name);
          localStorage.setItem("selected-venue-data", JSON.stringify(action.payload));
        } catch (e) {
          console.error("Failed to persist selected venue to localStorage", e);
        }
      }
    },
    clearSelectedVenue: (state) => {
      state.selectedVenueId = null;
      state.selectedVenueName = null;
      state.selectedVenue = null;

      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("selected-venue-id");
          localStorage.removeItem("selected-venue-name");
          localStorage.removeItem("selected-venue-data");
        } catch (e) {
          console.error("Failed to remove selected venue from localStorage", e);
        }
      }
    },
  },
});

export const { setSelectedVenue, clearSelectedVenue } = venueSlice.actions;
export default venueSlice.reducer;
