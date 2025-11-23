import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

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
}

export function useRealtimeSubscription(
  userId: string | undefined,
  onChange: (sub: UserSubscription) => void
) {
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`user_subscriptions_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_subscriptions",
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<UserSubscription>) => {
          if ((payload.eventType === "INSERT" || payload.eventType === "UPDATE") && payload.new) {
            onChange(payload.new as UserSubscription);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onChange]);
}
