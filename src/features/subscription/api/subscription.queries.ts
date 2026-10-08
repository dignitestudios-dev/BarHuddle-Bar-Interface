import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  subscriptionService,
  SubscriptionPlansResponse,
  MySubscriptionResponse,
  BillingMode,
} from "./subscription.service";

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  plans: (billingMode?: BillingMode) =>
    [...subscriptionKeys.all, "plans", billingMode || "all"] as const,
  my: () => [...subscriptionKeys.all, "my"] as const,
};

export function useSubscriptionPlans(
  billingMode?: BillingMode,
  options?: Omit<
    UseQueryOptions<SubscriptionPlansResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<SubscriptionPlansResponse, Error>({
    queryKey: subscriptionKeys.plans(billingMode),
    queryFn: () => subscriptionService.getSubscriptionPlans(billingMode),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    ...options,
  });
}

export function useMySubscription(
  options?: Omit<
    UseQueryOptions<MySubscriptionResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<MySubscriptionResponse, Error>({
    queryKey: subscriptionKeys.my(),
    queryFn: () => subscriptionService.getMySubscription(),
    staleTime: 1000 * 30, // 30 seconds
    ...options,
  });
}
