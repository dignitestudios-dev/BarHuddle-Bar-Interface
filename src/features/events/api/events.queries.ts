import { useQuery } from "@tanstack/react-query";
import { eventService, EventQueryParams } from "./events.service";

export const eventsKeys = {
  all: ['events'] as const,
  lists: () => [...eventsKeys.all, 'list'] as const,
  list: (params?: EventQueryParams) => [...eventsKeys.lists(), params] as const,
  details: () => [...eventsKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventsKeys.details(), id] as const,
  performance: (id: string) => [...eventsKeys.all, 'performance', id] as const,
  boosted: (params?: { page?: number; limit?: number; venueId?: string }) => [...eventsKeys.all, 'boosted', params] as const,
};

export const useGetEventsQuery = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: eventsKeys.list(params),
    queryFn: () => eventService.getEvents(params),
  });
};

export const useGetEventDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: eventsKeys.detail(id),
    queryFn: () => eventService.getEventDetails(id),
    enabled: !!id,
  });
};

export const useGetEventPerformanceQuery = (id: string) => {
  return useQuery({
    queryKey: eventsKeys.performance(id),
    queryFn: () => eventService.getEventPerformance(id),
    enabled: !!id,
  });
};

export const useGetBoostedEventsQuery = (
  paramsOrPage?: { page?: number; limit?: number; venueId?: string } | number,
  limit: number = 10,
  venueId?: string
) => {
  const params = typeof paramsOrPage === "object"
    ? paramsOrPage
    : { page: paramsOrPage ?? 1, limit, ...(venueId ? { venueId } : {}) };

  return useQuery({
    queryKey: eventsKeys.boosted(params),
    queryFn: () => eventService.getBoostedEvents(params),
  });
};

