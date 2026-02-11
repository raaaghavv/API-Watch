"use client";

import { useState, useCallback, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function useSSE() {
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const eventSourceRef = useRef(null);

  const connect = useCallback(() => {
    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(`${API_URL}/api/logs/stream`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const log = JSON.parse(event.data);
        setTotalRequests((prev) => prev + 1);
        if (log.status >= 400 || log.status === 0) {
          setTotalErrors((prev) => prev + 1);
        }
        setLogs((prev) => [...prev.slice(-99), log]);
      } catch (err) {
        console.error("Failed to parse SSE message:", err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };
  }, []);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Compute stats from logs
  const stats = {
    totalRequests,
    errors: totalErrors,
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
    try {
      await fetch(`${API_URL}/api/trigger/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method }),
      });
    } catch (err) {
      console.error("Failed to trigger API:", err);
    }
  }, []);

  return { logs, isConnected, stats, triggerAPI, connect, disconnect };
}
