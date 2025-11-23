import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { subscriptionService } from "../services/subscriptionService";
import type { UserSubscription, Plan } from "../services/subscriptionService";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export function useSubscription(userId: string | undefined) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch initial state
  const fetchSubscription = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const sub = await subscriptionService.getActiveSubscription(userId);
      setSubscription(sub);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial load
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Realtime Listener
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`sub-updates-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to INSERT, UPDATE, DELETE
          schema: "public",
          table: "user_subscriptions",
          filter: `user_id=eq.${userId}`,
        },
        async (payload: RealtimePostgresChangesPayload<UserSubscription>) => {
          // When a change happens, the safest bet is to re-fetch the full joined data
          // because the payload won't have the 'plan' relation data.
          console.log("Subscription update received:", payload);
          await fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchSubscription]);

  // Actions
  const subscribeToPlan = async (planCode: string) => {
    try {
      await subscriptionService.subscribeToPlan(planCode);
      // The realtime listener will trigger the update, but we can also fetch immediately
      await fetchSubscription();
      return true;
    } catch (err) {
      console.error("Subscribe failed:", err);
      throw err;
    }
  };

  return {
    subscription,
    plan: subscription?.plan,
    loading,
    error,
    subscribeToPlan,
    refresh: fetchSubscription,
    // Helper to check limits
    checkLimit: (feature: 'projects_limit' | 'connections_limit', currentCount: number) => {
      if (!subscription?.plan?.features) return false; // Default to restrictive if no plan
      const limit = subscription.plan.features[feature];
      return limit === -1 || currentCount < limit; // -1 for unlimited
    }
  };
}
