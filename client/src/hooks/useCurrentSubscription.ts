import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRealtimeSubscription, UserSubscription } from "./useRealtimeSubscription";

export interface Plan {
  id: string;
  name: string;
  code: string;
  billing_cycle: "monthly" | "yearly" | "lifetime";
  price: number;
  currency: string;
  description: string | null;
  features: any;
  is_active: boolean;
  sort_order: number;
}

export function useCurrentSubscription(userId: string | undefined) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch active or trialing subscription
      const { data: subData, error: subError } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", userId)
        .in("status", ["active", "trialing"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subError) throw subError;

      if (subData) {
        setSubscription(subData as UserSubscription);
        
        // Fetch associated plan
        const { data: planData, error: planError } = await supabase
          .from("plans")
          .select("*")
          .eq("id", subData.plan_id)
          .single();
          
        if (planError) throw planError;
        setPlan(planData as Plan);
      } else {
        setSubscription(null);
        setPlan(null);
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Realtime updates
  useRealtimeSubscription(userId, (newSub) => {
    // If we get a new active subscription, update state
    if (newSub.status === 'active' || newSub.status === 'trialing') {
      setSubscription(newSub);
      // Re-fetch plan if the plan_id changed
      if (!plan || plan.id !== newSub.plan_id) {
        supabase
          .from("plans")
          .select("*")
          .eq("id", newSub.plan_id)
          .single()
          .then(({ data }) => {
            if (data) setPlan(data as Plan);
          });
      }
    }
  });

  return { subscription, plan, loading, refresh: fetchSubscription };
}
