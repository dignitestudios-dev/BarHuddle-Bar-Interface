import { useQuery } from "@tanstack/react-query";
import { promotionService, PromotionQueryParams } from "./promotions.service";

export const promotionsKeys = {
  all: ['promotions'] as const,
  lists: () => [...promotionsKeys.all, 'list'] as const,
  list: (params?: PromotionQueryParams) => [...promotionsKeys.lists(), params] as const,
  details: () => [...promotionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...promotionsKeys.details(), id] as const,
  analytics: (venueId?: string) => [...promotionsKeys.all, 'analytics', venueId] as const,
};

export const useGetPromotionsQuery = (
  paramsOrPage?: PromotionQueryParams | number,
  limit: number = 10,
  venueId?: string
) => {
  const params = typeof paramsOrPage === "object"
    ? paramsOrPage
    : { page: paramsOrPage ?? 1, limit, ...(venueId ? { venueId } : {}) };

  return useQuery({
    queryKey: promotionsKeys.list(params),
    queryFn: () => promotionService.getPromotions(params),
  });
};

export const useGetPromotionDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: promotionsKeys.detail(id),
    queryFn: () => promotionService.getPromotionDetails(id),
    enabled: !!id,
  });
};

export const useGetPromotionAnalyticsQuery = (venueId?: string) => {
  return useQuery({
    queryKey: promotionsKeys.analytics(venueId),
    queryFn: () => promotionService.getPromotionAnalytics(venueId),
  });
};

