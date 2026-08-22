import { useQuery } from "@tanstack/react-query";
import { promotionService } from "./promotions.service";

export const promotionsKeys = {
  all: ['promotions'] as const,
  lists: () => [...promotionsKeys.all, 'list'] as const,
  list: (filters: string) => [...promotionsKeys.lists(), { filters }] as const,
  details: () => [...promotionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...promotionsKeys.details(), id] as const,
};

export const useGetPromotionsQuery = () => {
  return useQuery({
    queryKey: promotionsKeys.lists(),
    queryFn: () => promotionService.getPromotions(),
  });
};

export const useGetPromotionDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: promotionsKeys.detail(id),
    queryFn: () => promotionService.getPromotionDetails(id),
    enabled: !!id,
  });
};

