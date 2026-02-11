"use client";

import { useEffect, useRef } from "react";

export function useHealthPoll(enabled = true, intervalMs = 5000) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const pollHealth = async () => {
      try {
        await fetch(`${apiUrl}/api/trigger/health`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method: "GET" }),
        });
      } catch (err) {
        console.error("Health poll failed:", err);
      }
    };

    // Initial poll after a short delay
    const timeout = setTimeout(pollHealth, 1000);

    // Set up interval
    intervalRef.current = setInterval(pollHealth, intervalMs);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, intervalMs]);
}
