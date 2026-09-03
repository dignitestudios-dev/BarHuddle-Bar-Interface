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

export const useUpdateVenueMutation = (defaultId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id?: string; data: { name?: string; address?: string } } | any) => {
      const targetId = params?.id || defaultId;
      const payload = params?.data !== undefined ? params.data : params;
      return venueService.updateVenue(targetId, payload);
    },
    onSuccess: (_, variables) => {
      const targetId = variables?.id || defaultId;
      if (targetId) queryClient.invalidateQueries({ queryKey: venueKeys.detail(targetId) });
      queryClient.invalidateQueries({ queryKey: [...venueKeys.all, "owner-venues"] });
      queryClient.invalidateQueries({ queryKey: venueKeys.claims() });
    },
  });
};

export const useAddGalleryImageMutation = (defaultId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { venueId?: string; formData: FormData } | FormData) => {
      const isParamObj = params && !(params instanceof FormData) && "venueId" in params;
      const targetId = isParamObj ? params.venueId : defaultId;
      const formData = isParamObj ? params.formData : (params as FormData);
      return venueService.addGalleryImage(targetId!, formData);
    },
    onSuccess: (_, variables) => {
      const isParamObj = variables && !(variables instanceof FormData) && "venueId" in variables;
      const targetId = isParamObj ? variables.venueId : defaultId;
      if (targetId) {
        queryClient.invalidateQueries({ queryKey: venueKeys.detail(targetId) });
      }
    },
  });
};

export const useRemoveGalleryImageMutation = (defaultId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { venueId?: string; image?: string; imageId?: string } | string) => {
      if (typeof params === "string") {
        return venueService.removeGalleryImage(defaultId!, params);
      }
      const targetId = params?.venueId || defaultId;
      const imageValue = params?.image || params?.imageId || "";
      return venueService.removeGalleryImage(targetId!, imageValue);
    },
    onSuccess: (_, variables) => {
      const targetId = typeof variables === "string" ? defaultId : (variables?.venueId || defaultId);
      if (targetId) {
        queryClient.invalidateQueries({ queryKey: venueKeys.detail(targetId) });
        queryClient.invalidateQueries({ queryKey: venueKeys.all });
      }
    },
  });
};

export const useUpdateOperatingHoursMutation = (defaultId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { venueId?: string; data: { hours: any[] } } | any) => {
      const targetId = params?.venueId || defaultId;
      const payload = params?.data !== undefined ? params.data : params;
      return venueService.updateOperatingHours(targetId, payload);
    },
    onSuccess: (_, variables) => {
      const targetId = variables?.venueId || defaultId;
      if (targetId) {
        queryClient.invalidateQueries({ queryKey: venueKeys.hours(targetId) });
        queryClient.invalidateQueries({ queryKey: venueKeys.detail(targetId) });
      }
    },
  });
};
