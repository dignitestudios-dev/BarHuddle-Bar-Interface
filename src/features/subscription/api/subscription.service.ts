import axiosInstance from "@/lib/axios";

export interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  features: string[];
  // ... other fields
}

export interface SubscriptionPlansResponse {
  success: boolean;
  message: string;
  data: {
    plans: SubscriptionPlan[];
    isSubscribed: boolean;
  };
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlansResponse> {
  const { data } = await axiosInstance.get("/subscriptions/plans");
  return data;
}
