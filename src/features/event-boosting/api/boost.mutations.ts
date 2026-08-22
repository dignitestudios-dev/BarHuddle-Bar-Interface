import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boostService } from "./boost.service";
import { eventBoostingKeys } from "./boost.queries";

export const useCreateBoostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => boostService.createBoost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventBoostingKeys.all });
    },
  });
};

export const useCheckoutBoostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: any }) => boostService.checkoutBoost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventBoostingKeys.all });
    },
  });
};

