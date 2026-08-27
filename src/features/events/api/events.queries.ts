import { useQuery } from "@tanstack/react-query";
import { eventService } from "./events.service";

export const eventsKeys = {
  all: ['events'] as const,
  lists: () => [...eventsKeys.all, 'list'] as const,
  list: (filters: string) => [...eventsKeys.lists(), { filters }] as const,
  details: () => [...eventsKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventsKeys.details(), id] as const,
  performance: (id: string) => [...eventsKeys.all, 'performance', id] as const,
};

export const useGetEventsQuery = () => {
  return useQuery({
    queryKey: eventsKeys.lists(),
    queryFn: () => eventService.getEvents(),
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

export const useGetBoostedEventsQuery = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [...eventsKeys.all, 'boosted', { page, limit }],
    queryFn: () => eventService.getBoostedEvents(page, limit),
  });
};

