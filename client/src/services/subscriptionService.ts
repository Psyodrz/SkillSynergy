import { supabase } from "../lib/supabaseClient";

export interface Plan {
  id: string;
  name: string;
  code: string;
  billing_cycle: "monthly" | "yearly" | "lifetime";
  price: number;
  currency: string;
  description: string | null;
  features: {
    projects_limit: number;
    connections_limit: number;
    [key: string]: any;
  };
  is_active: boolean;
  sort_order: number;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: "active" | "trialing" | "expired" | "canceled" | "past_due";
  started_at: string;
  current_period_start: string;
  current_period_end: string | null;
  cancel_at: string | null;
  created_at: string;
  updated_at: string;
  meta: any;
  plan?: Plan; // Joined plan data
}

export const subscriptionService = {
  /**
   * Fetch all active plans
   */
  async getPlans(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data as Plan[];
  },

  /**
   * Get the current user's active subscription with plan details
   */
  async getActiveSubscription(userId: string): Promise<UserSubscription | null> {
    // 1. Get the latest active/trialing subscription
    const { data: subData, error: subError } = await supabase
      .from("user_subscriptions")
      .select("*, plan:plans(*)") // Join with plans
      .eq("user_id", userId)
      .in("status", ["active", "trialing"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError) throw subError;
    if (!subData) return null;

    // Supabase returns the joined relation as a property, mapping it to our type
    const subscription = {
      ...subData,
      plan: subData.plan as unknown as Plan
    } as UserSubscription;

    return subscription;
  },

  /**
   * Subscribe to a plan (Switch/Upgrade/Downgrade)
   * Uses the secure RPC function
   */
  async subscribeToPlan(planCode: string): Promise<any> {
    const { data, error } = await supabase.rpc("subscribe_user_to_plan", {
      p_plan_code: planCode
    });

    if (error) throw error;
    return data;
  }
};
