"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useSSE() {
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const eventSource = new EventSource(`${apiUrl}/api/logs/stream`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const log = JSON.parse(event.data);
        setLogs((prev) => [...prev.slice(-99), log]); // Keep last 100 logs
      } catch (err) {
        console.error("Failed to parse SSE message:", err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Compute stats from logs
  const stats = {
    totalRequests: logs.length,
    errors: logs.filter((l) => l.status >= 400 || l.status === 0).length,
    avgLatency:
      logs.length > 0
        ? Math.round(
            logs.reduce((sum, l) => sum + (l.latency || 0), 0) / logs.length,
          )
        : 0,
    uptime:
      logs.length > 0
        ? Math.round(
            (logs.filter((l) => l.status >= 200 && l.status < 400).length /
              logs.length) *
              100,
          )
        : 100,
  };

  const triggerAPI = useCallback(async (endpoint, method = "GET") => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    try {
      await fetch(`${apiUrl}/api/trigger/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method }),
      });
    } catch (err) {
      console.error("Failed to trigger API:", err);
    }
  }, []);

  return { logs, isConnected, stats, triggerAPI };
}
