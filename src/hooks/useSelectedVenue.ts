"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedVenue, SelectedVenueData } from "@/store/slices/venue.slice";
import { useGetOwnerVenuesQuery, useMyClaimsQuery } from "@/features/venue-management/api/venue.queries";
import { cleanImageUrl } from "@/utils/image";

export interface OwnerVenueItem {
  id: string;
  name: string;
  address?: string;
  coverImage?: string;
  category?: string;
  rating?: number;
  isClaimed?: boolean;
}

export function useSelectedVenue() {
  const dispatch = useAppDispatch();
  const { selectedVenueId, selectedVenueName, selectedVenue } = useAppSelector((state) => state.venue);
  const { user } = useAppSelector((state) => state.auth);
  const { data: ownerVenuesData, isLoading: isLoadingOwnerVenues } = useGetOwnerVenuesQuery();
  const { data: rawClaims, isLoading: isLoadingClaims } = useMyClaimsQuery();

  // Normalize list of owner venues from API (venues & approved claims) or user context
  const venues: OwnerVenueItem[] = useMemo(() => {
    const list: OwnerVenueItem[] = [];
    const seen = new Set<string>();

    const addVenue = (item: any) => {
      if (!item) return;
      const v = item?.venue || item;
      const id = String(v?._id || v?.id || item?._id || item?.id || "");
      const name = String(v?.name || v?.title || item?.name || item?.title || "");
      if (!id && !name) return;
      const key = id || name;
      if (seen.has(key)) return;
      seen.add(key);

      const address = v?.address || item?.address || "";
      const coverImage = cleanImageUrl(v?.coverImage || item?.coverImage || (v?.images && v.images[0]) || "");
      const category = v?.category || item?.category || "";
      const rating = v?.rating ?? item?.rating;
      const isClaimed = v?.isClaimed ?? item?.isClaimed ?? true;

      list.push({
        id: key,
        name: name || "Unnamed Venue",
        address,
        coverImage,
        category,
        rating,
        isClaimed,
      });
    };

    // 1. From /venue-owner/venues
    const raw = ownerVenuesData as any;
    const rawList = Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.venues)
      ? raw.venues
      : Array.isArray(raw)
      ? raw
      : raw && typeof raw === "object" && (raw.name || raw._id || raw.id)
      ? [raw]
      : [];
    rawList.forEach(addVenue);

    // 2. From /venue-owner/claims
    const claimsArr = Array.isArray(rawClaims) ? rawClaims : (rawClaims as any)?.data || [];
    if (Array.isArray(claimsArr)) {
      claimsArr.forEach((c: any) => {
        if (c.status === "approved" && c.venue) {
          addVenue(c.venue);
        } else if (c.venueId && typeof c.venueId === "object") {
          addVenue(c.venueId);
        }
      });
    }

    // 3. Fallback to user profile venue in Redux
    if (user?.venue) {
      addVenue(user.venue);
    } else if ((user as any)?.venueId || (user as any)?.venueName) {
      addVenue({
        id: (user as any)?.venueId,
        name: (user as any)?.venueName,
      });
    }

    return list;
  }, [ownerVenuesData, rawClaims, user]);

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
    isLoading: isLoadingOwnerVenues || isLoadingClaims,
  };
}
