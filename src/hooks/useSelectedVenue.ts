"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedVenue, SelectedVenueData } from "@/store/slices/venue.slice";
import { useGetOwnerVenuesQuery } from "@/features/venue-management/api/venue.queries";
import { cleanImageUrl } from "@/utils/image";

export interface OwnerVenueItem {
  id: string;
  name: string;
  address?: string;
  coverImage?: string;
}

export function useSelectedVenue() {
  const dispatch = useAppDispatch();
  const { selectedVenueId, selectedVenueName, selectedVenue } = useAppSelector((state) => state.venue);
  const { user } = useAppSelector((state) => state.auth);
  const { data: ownerVenuesData, isLoading } = useGetOwnerVenuesQuery();

  // Normalize list of owner venues from API or user context
  const venues: OwnerVenueItem[] = useMemo(() => {
    const raw = ownerVenuesData as any;
    if (!raw && !user) return [];

    const list = Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.venues)
      ? raw.venues
      : Array.isArray(raw)
      ? raw
      : raw?.data && typeof raw.data === "object"
      ? [raw.data]
      : raw && typeof raw === "object" && (raw.name || raw._id || raw.id)
      ? [raw]
      : [];

    const mapped: OwnerVenueItem[] = list
      .map((item: any) => {
        const id = String(item?.venue?._id || item?.venue?.id || item?._id || item?.id || "");
        const name = String(item?.venue?.name || item?.venue?.title || item?.name || item?.title || "");
        const address = item?.venue?.address || item?.address || "";
        const coverImage = cleanImageUrl(item?.venue?.coverImage || item?.coverImage || "");
        if (!id && !name) return null;
        return {
          id: id || name,
          name: name || "Unnamed Venue",
          address,
          coverImage,
        };
      })
      .filter((v: any): v is OwnerVenueItem => v !== null);

    // If no venues returned from API list, check if user object has claimed venue
    if (mapped.length === 0) {
      const fallbackId = (user as any)?.venueId || (user as any)?.claimedVenueId || (user as any)?.venue?._id || (user as any)?.venue?.id || "";
      const fallbackName = (user as any)?.venue?.name || (user as any)?.venueName || (user as any)?.claimedVenue?.name || (user as any)?.venue?.title || "";
      if (fallbackId || fallbackName) {
        mapped.push({
          id: String(fallbackId || "default-venue"),
          name: fallbackName || "My Venue",
        });
      }
    }

    return mapped;
  }, [ownerVenuesData, user]);

  // Current active venue matching selectedVenueId, or fallback to first
  const activeVenue = useMemo<OwnerVenueItem | null>(() => {
    if (venues.length === 0) return null;
    if (selectedVenueId) {
      const found = venues.find((v) => v.id === selectedVenueId);
      if (found) return found;
    }
    return venues[0];
  }, [venues, selectedVenueId]);

  // If no venue is selected in state but venues are loaded, automatically select the first one
  useEffect(() => {
    if (venues.length > 0) {
      const matched = selectedVenueId ? venues.find((v) => v.id === selectedVenueId) : null;
      if (!matched) {
        const first = venues[0];
        dispatch(
          setSelectedVenue({
            id: first.id,
            name: first.name,
            address: first.address,
            coverImage: first.coverImage,
          })
        );
      } else if (!selectedVenueName || selectedVenueName !== matched.name) {
        dispatch(
          setSelectedVenue({
            id: matched.id,
            name: matched.name,
            address: matched.address,
            coverImage: matched.coverImage,
          })
        );
      }
    }
  }, [venues, selectedVenueId, selectedVenueName, dispatch]);

  const selectVenue = (venue: OwnerVenueItem) => {
    dispatch(
      setSelectedVenue({
        id: venue.id,
        name: venue.name,
        address: venue.address,
        coverImage: venue.coverImage,
      })
    );
  };

  const effectiveVenueId = activeVenue?.id || selectedVenueId || "";
  const effectiveVenueName = activeVenue?.name || selectedVenueName || "My Venue";

  return {
    selectedVenueId: effectiveVenueId,
    selectedVenueName: effectiveVenueName,
    selectedVenue: activeVenue || selectedVenue,
    venues,
    selectVenue,
    isLoading,
  };
}
