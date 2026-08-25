import { useMutation, useQueryClient } from "@tanstack/react-query";
import { promotionService } from "./promotions.service";
import { promotionsKeys } from "./promotions.queries";

export const useCreatePromotionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => promotionService.createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionsKeys.all });
    },
  });
};

export const useUpdatePromotionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: any }) => promotionService.updatePromotion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionsKeys.all });
    },
  });
};

export const useDeletePromotionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; data?: any }) => promotionService.deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionsKeys.all });
    },
  });
};

