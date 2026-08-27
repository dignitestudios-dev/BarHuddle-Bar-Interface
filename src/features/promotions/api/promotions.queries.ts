import { useQuery } from "@tanstack/react-query";
import { promotionService } from "./promotions.service";

export const promotionsKeys = {
  all: ['promotions'] as const,
  lists: () => [...promotionsKeys.all, 'list'] as const,
  list: (filters: string) => [...promotionsKeys.lists(), { filters }] as const,
  details: () => [...promotionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...promotionsKeys.details(), id] as const,
};

export const useGetPromotionsQuery = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [...promotionsKeys.lists(), { page, limit }],
    queryFn: () => promotionService.getPromotions(page, limit),
  });
};

export const useGetPromotionDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: promotionsKeys.detail(id),
    queryFn: () => promotionService.getPromotionDetails(id),
    enabled: !!id,
  });
};

export const useGetPromotionAnalyticsQuery = () => {
  return useQuery({
    queryKey: [...promotionsKeys.all, 'analytics'],
    queryFn: () => promotionService.getPromotionAnalytics(),
  });
};

