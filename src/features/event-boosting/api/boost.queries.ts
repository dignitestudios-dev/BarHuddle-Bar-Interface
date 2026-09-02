import { useQuery } from "@tanstack/react-query";
import { boostService, BoostQueryParams } from "./boost.service";

export const eventBoostingKeys = {
  all: ['boosts'] as const,
  lists: () => [...eventBoostingKeys.all, 'list'] as const,
  list: (params?: BoostQueryParams) => [...eventBoostingKeys.lists(), params] as const,
  details: () => [...eventBoostingKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventBoostingKeys.details(), id] as const,
};

export const useGetBoostsQuery = (
  paramsOrPage?: BoostQueryParams | number,
  limit: number = 10,
  venueId?: string
) => {
  const params = typeof paramsOrPage === "object"
    ? paramsOrPage
    : paramsOrPage !== undefined
    ? { page: paramsOrPage, limit, ...(venueId ? { venueId } : {}) }
    : undefined;

  return useQuery({
    queryKey: eventBoostingKeys.list(params),
    queryFn: () => boostService.getBoosts(params),
  });
};

export const useGetBoostDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: eventBoostingKeys.detail(id),
    queryFn: () => boostService.getBoostDetails(id),
    enabled: !!id,
  });
};

