import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "./events.service";
import { eventsKeys } from "./events.queries";

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => eventService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
  });
};

export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: any }) => eventService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
  });
};

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; data?: any }) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
  });
};

