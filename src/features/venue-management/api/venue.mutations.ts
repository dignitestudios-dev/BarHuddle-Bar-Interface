import { useMutation, useQueryClient } from "@tanstack/react-query";
import { venueService, ClaimVenuePayload } from "./venue.service";
import { venueKeys } from "./venue.queries";

export const useClaimVenueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClaimVenuePayload) => venueService.claimVenue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.claims() });
      queryClient.invalidateQueries({ queryKey: venueKeys.lists() });
    },
  });
};

export const useUpdateVenueMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => venueService.updateVenue(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: venueKeys.lists() });
    },
  });
};

export const useAddGalleryImageMutation = (venueId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => venueService.addGalleryImage(venueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.detail(venueId) });
    },
  });
};

export const useRemoveGalleryImageMutation = (venueId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) => venueService.removeGalleryImage(venueId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.detail(venueId) });
    },
  });
};

export const useUpdateOperatingHoursMutation = (venueId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => venueService.updateOperatingHours(venueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.hours(venueId) });
    },
  });
};

export const useCreateVenueStoryMutation = () => {
  return useMutation({
    mutationFn: (data: FormData) => venueService.createVenueStory(data),
    // onSuccess invalidate specific story queries if needed
  });
};
