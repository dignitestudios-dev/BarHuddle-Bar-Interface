import { useQuery } from "@tanstack/react-query";
import { venueService } from "./venue.service";

export const venueKeys = {
  all: ["venues"] as const,
  lists: () => [...venueKeys.all, "list"] as const,
  list: (filters: string) => [...venueKeys.lists(), { filters }] as const,
  details: () => [...venueKeys.all, "detail"] as const,
  detail: (id: string) => [...venueKeys.details(), id] as const,
  claims: () => [...venueKeys.all, "claims"] as const,
  hours: (id: string) => [...venueKeys.detail(id), "hours"] as const,
};

export const useMyVenuesQuery = () => {
  return useQuery({
    queryKey: venueKeys.lists(),
    queryFn: () => venueService.getMyVenues(),
  });
};

export const useVenueDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: venueKeys.detail(id),
    queryFn: () => venueService.getVenueDetails(id),
    enabled: !!id,
  });
};

export const useMyClaimsQuery = () => {
  return useQuery({
    queryKey: venueKeys.claims(),
    queryFn: () => venueService.getMyClaims(),
  });
};

export const useOperatingHoursQuery = (venueId: string) => {
  return useQuery({
    queryKey: venueKeys.hours(venueId),
    queryFn: () => venueService.getOperatingHours(venueId),
    enabled: !!venueId,
  });
};
