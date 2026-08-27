import { useQuery } from "@tanstack/react-query";
import { boostService } from "./boost.service";

export const eventBoostingKeys = {
  all: ['boosts'] as const,
  lists: () => [...eventBoostingKeys.all, 'list'] as const,
  list: (filters: string) => [...eventBoostingKeys.lists(), { filters }] as const,
  details: () => [...eventBoostingKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventBoostingKeys.details(), id] as const,
};

export const useGetBoostsQuery = () => {
  return useQuery({
    queryKey: eventBoostingKeys.lists(),
    queryFn: () => boostService.getBoosts(),
  });
};

export const useGetBoostDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: eventBoostingKeys.detail(id),
    queryFn: () => boostService.getBoostDetails(id),
    enabled: !!id,
  });
};

