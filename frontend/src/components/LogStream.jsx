"use client";

import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";

const STATUS_COLORS = {
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
};

function getStatusColor(status) {
  if (status >= 200 && status < 300) return STATUS_COLORS.success;
  if (status >= 400 || status === 0) return STATUS_COLORS.error;
  return STATUS_COLORS.warning;
}

export function LogStream({ logs }) {
  const containerRef = useRef(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm shadow-orange-100">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">
          Log Stream
        </h3>
        <div className="flex h-48 items-center justify-center text-sm text-slate-400">
          Waiting for logs...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-orange-200 bg-white p-4 shadow-sm shadow-orange-100">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">Log Stream</h3>
      <div
        ref={containerRef}
        className="log-stream h-64 space-y-2 overflow-y-auto rounded-lg bg-slate-50 p-3"
      >
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-center gap-3 rounded-lg bg-white p-2 text-sm shadow-sm"
          >
            {/* Timestamp */}
            <span className="shrink-0 font-mono text-xs text-slate-400">
              {new Date(log.timestamp).toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>

            {/* Source */}
            <span
              className={`flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${
                log.source === "HEALTH"
                  ? "bg-slate-100 text-slate-600"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {log.source === "HEALTH" ? (
                <Bot className="h-3 w-3" />
              ) : (
                <User className="h-3 w-3" />
              )}
              {log.source}
            </span>

            {/* Method */}
            <span className="shrink-0 font-mono text-xs font-semibold text-slate-700">
              {log.method}
            </span>

            {/* Endpoint */}
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-600">
              {log.endpoint}
            </span>

            {/* Status */}
            <span
              className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${getStatusColor(log.status)}`}
            >
              {log.status === 0 ? "ERR" : log.status}
            </span>

            {/* Latency */}
            <span className="shrink-0 text-xs text-slate-400">
              {log.latency}ms
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
