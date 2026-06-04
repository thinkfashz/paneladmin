export type SubscriptionStatus = "trial" | "active" | "past_due" | "cancelled" | "blocked";
export type PaymentStatus = "pending" | "approved" | "rejected" | "refunded" | "cancelled" | "manual_confirmed";

export type Plan = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  interval: "month" | "year" | "lifetime";
  features?: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  business_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end?: boolean;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  business_id: string;
  subscription_id?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string | null;
  transaction_id?: string | null; // e.g. Stripe or MercadoPago ID
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type WalletTransaction = {
  id: string;
  business_id: string;
  amount: number; // positive for credits, negative for debits
  currency: string;
  description: string;
  reference_id?: string | null; // payment_id or related item
  created_at: string;
};
