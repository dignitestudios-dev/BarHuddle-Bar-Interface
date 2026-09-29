import axiosInstance from "@/lib/axios";

export type SubscriptionPlanKey =
  | "venue_free"
  | "venue_premium"
  | "venue_executive"
  | "event_boost"
  | "vip"
  | string;

export type BillingMode = "subscription" | "one_time";

export interface SubscriptionPlan {
  _id: string;
  id?: string;
  key: SubscriptionPlanKey;
  billingMode?: BillingMode;
  label: string;
  name?: string;
  displayPrice: number;
  price?: number;
  currency: string;
  features: string[];
  trialDays?: number;
  limitations?: {
    flyers?: number | null;
    [key: string]: any;
  };
  sortOrder?: number;
  popular?: boolean;
  badge?: string;
}

export interface SubscriptionPlansResponse {
  success: boolean;
  message?: string;
  data: {
    plans: SubscriptionPlan[];
    isSubscribed?: boolean;
  } | SubscriptionPlan[];
}

export interface SubscriptionDetails {
  _id?: string;
  id?: string;
  planId?: string | SubscriptionPlan;
  planKey?: string;
  status:
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "incomplete"
    | string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  periodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  cancel_at_period_end?: boolean;
  paymentMethod?: {
    brand?: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
  };
  [key: string]: any;
}

export interface MySubscriptionResponse {
  success: boolean;
  message?: string;
  data: {
    subscription: SubscriptionDetails | null;
    isActive: boolean;
  };
}

export interface PurchasePlanPayload {
  planId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface PurchasePlanResponse {
  success: boolean;
  message?: string;
  data: {
    checkoutUrl: string;
  };
}

export interface ChangePlanPayload {
  newPlanId: string;
}

export interface UpdatePaymentMethodPayload {
  paymentMethodId: string;
}

export const subscriptionService = {
  /**
   * Fetch subscription plans filtered by role from the backend.
   * Optional billingMode parameter to filter by "subscription" or "one_time".
   */
  getSubscriptionPlans: async (
    billingMode?: BillingMode
  ): Promise<SubscriptionPlansResponse> => {
    const params = billingMode ? { billingMode } : {};
    const response = await axiosInstance.get("/subscriptions/plans", { params });
    return response.data;
  },

  /**
   * Fetch current authenticated user's active subscription status.
   */
  getMySubscription: async (): Promise<MySubscriptionResponse> => {
    const response = await axiosInstance.get("/subscriptions/my");
    return response.data;
  },

  /**
   * Initiate Stripe Checkout session for a subscription or one-time plan.
   * Returns a checkoutUrl hosted by Stripe.
   */
  purchasePlan: async ({
    planId,
    successUrl,
    cancelUrl,
  }: PurchasePlanPayload): Promise<PurchasePlanResponse> => {
    const response = await axiosInstance.post(`/subscriptions/purchase/${planId}`, {
      successUrl,
      cancelUrl,
    });
    return response.data;
  },

  /**
   * Cancel the current active subscription at the end of the billing period.
   */
  cancelSubscription: async (): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post("/subscriptions/cancel");
    return response.data;
  },

  /**
   * Change current active plan to a new plan tier.
   */
  changePlan: async ({
    newPlanId,
  }: ChangePlanPayload): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post("/subscriptions/change-plan", {
      newPlanId,
    });
    return response.data;
  },

  /**
   * Retry failed invoice payment for past_due subscriptions.
   */
  retryPayment: async (): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post("/subscriptions/retry-payment");
    return response.data;
  },

  /**
   * Update payment method via Stripe PaymentMethod ID.
   */
  updatePaymentMethod: async ({
    paymentMethodId,
  }: UpdatePaymentMethodPayload): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.patch(
      "/subscriptions/update-payment-method",
      { paymentMethodId }
    );
    return response.data;
  },
};

// Backwards compatibility export
export const getSubscriptionPlans = subscriptionService.getSubscriptionPlans;
export const getMySubscription = subscriptionService.getMySubscription;
