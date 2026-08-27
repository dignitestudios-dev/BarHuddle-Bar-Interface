import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boostService, CreateBoostPayload } from "./boost.service";
import { eventBoostingKeys } from "./boost.queries";
import { eventsKeys } from "@/features/events/api/events.queries";

export const useCreateBoostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBoostPayload) => boostService.createBoost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventBoostingKeys.all });
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
  });
};

export const useCheckoutBoostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: any }) => boostService.checkoutBoost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventBoostingKeys.all });
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
  });
};

