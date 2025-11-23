import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface UseRealtimeTableProps {
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
  onChange: (payload: RealtimePostgresChangesPayload<any>) => void;
}

export function useRealtimeTable({ table, event = "*", filter = "", onChange }: UseRealtimeTableProps) {
  useEffect(() => {
    if (!table) return;

    const channel = supabase
      .channel(`realtime-${table}-${filter}`)
      .on(
        "postgres_changes",
        {
          event: event as any,
          schema: "public",
          table,
          filter: filter || undefined,
        },
        (payload) => {
          onChange?.(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event, filter, onChange]);
}
