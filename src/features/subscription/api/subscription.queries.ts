import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlans } from "./subscription.service";

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: getSubscriptionPlans,
  });
}
