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

  // Normalize list of owner venues from API (venues & claims) or user context
  const venues: OwnerVenueItem[] = useMemo(() => {
    const list: OwnerVenueItem[] = [];
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();

    const addCandidate = (candidate: any) => {
      if (!candidate) return;

      const venueObj =
        candidate.venue && typeof candidate.venue === "object"
          ? candidate.venue
          : candidate.venueId && typeof candidate.venueId === "object"
          ? candidate.venueId
          : candidate.details && typeof candidate.details === "object"
          ? candidate.details
          : candidate;

      const id = String(
        venueObj._id ||
        venueObj.id ||
        (typeof candidate.venue === "string" ? candidate.venue : "") ||
        (typeof candidate.venueId === "string" ? candidate.venueId : "") ||
        venueObj.placeId ||
        candidate._id ||
        candidate.id ||
        ""
      ).trim();

      const name = String(
        venueObj.name ||
        venueObj.title ||
        candidate.name ||
        candidate.title ||
        ""
      ).trim();

      if (!id && !name) return;

      // Only skip explicitly rejected claims
      const status = String(candidate.status || venueObj.status || "").toLowerCase();
      if (status === "rejected" || status === "denied" || status === "cancelled") {
        return;
      }

      const nameKey = name.toLowerCase();
      if (id && seenIds.has(id)) return;
      if (nameKey && seenNames.has(nameKey)) return;

      if (id) seenIds.add(id);
      if (nameKey) seenNames.add(nameKey);

      const address = venueObj.address || candidate.address || "";
      const coverImage = cleanImageUrl(
        venueObj.coverImage ||
        candidate.coverImage ||
        (Array.isArray(venueObj.images) && venueObj.images[0]) ||
        (Array.isArray(candidate.images) && candidate.images[0]) ||
        ""
      );
      const category = venueObj.category || candidate.category || "";
      const rating = venueObj.rating ?? candidate.rating;
      const isClaimed = venueObj.isClaimed ?? candidate.isClaimed ?? true;

      list.push({
        id: id || name,
        name: name || "Unnamed Venue",
        address,
        coverImage,
        category,
        rating,
        isClaimed,
      });
    };

    // 1. From /venue-owner/venues (handle all response shapes)
    const raw = ownerVenuesData as any;
    const rawList = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.venues)
      ? raw.venues
      : Array.isArray(raw?.data?.venues)
      ? raw.data.venues
      : Array.isArray(raw?.data?.data)
      ? raw.data.data
      : Array.isArray(raw?.result)
      ? raw.result
      : raw && typeof raw === "object" && (raw.name || raw._id || raw.id || raw.venue)
      ? [raw]
      : [];
    rawList.forEach(addCandidate);

    // 2. From /venue-owner/claims (handle all response shapes)
    const rawClaimsData = rawClaims as any;
    const claimsArr = Array.isArray(rawClaimsData)
      ? rawClaimsData
      : Array.isArray(rawClaimsData?.data)
      ? rawClaimsData.data
      : Array.isArray(rawClaimsData?.claims)
      ? rawClaimsData.claims
      : Array.isArray(rawClaimsData?.data?.claims)
      ? rawClaimsData.data.claims
      : Array.isArray(rawClaimsData?.data?.data)
      ? rawClaimsData.data.data
      : Array.isArray(rawClaimsData?.result)
      ? rawClaimsData.result
      : rawClaimsData && typeof rawClaimsData === "object" && (rawClaimsData.name || rawClaimsData._id || rawClaimsData.venue || rawClaimsData.venueId)
      ? [rawClaimsData]
      : [];
    claimsArr.forEach(addCandidate);

    // 3. From user profile venue in Redux
    if (user) {
      if (Array.isArray(user.venues)) {
        user.venues.forEach(addCandidate);
      }
      if (Array.isArray(user.claimedVenues)) {
        user.claimedVenues.forEach(addCandidate);
      }
      if (user.venue) {
        if (Array.isArray(user.venue)) {
          user.venue.forEach(addCandidate);
        } else {
          addCandidate(user.venue);
        }
      }
      if (user.claimedVenue) {
        addCandidate(user.claimedVenue);
      }
      if (user.venueId || user.venueName) {
        addCandidate({
          id: user.venueId,
          _id: user.venueId,
          name: user.venueName,
        });
      }
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
