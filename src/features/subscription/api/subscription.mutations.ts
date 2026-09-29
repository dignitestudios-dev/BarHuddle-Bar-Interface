import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  subscriptionService,
  PurchasePlanPayload,
  ChangePlanPayload,
  UpdatePaymentMethodPayload,
} from "./subscription.service";
import { subscriptionKeys } from "./subscription.queries";

export function usePurchasePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PurchasePlanPayload) =>
      subscriptionService.purchasePlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.my() });
    },
  });
}

export function useCancelSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => subscriptionService.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.my() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
}

export function useChangePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangePlanPayload) =>
      subscriptionService.changePlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.my() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
}

export function useRetryPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => subscriptionService.retryPayment(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.my() });
    },
  });
}

export function useUpdatePaymentMethodMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePaymentMethodPayload) =>
      subscriptionService.updatePaymentMethod(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.my() });
    },
  });
}
