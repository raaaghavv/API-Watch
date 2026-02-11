"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function LatencyChart({ logs }) {
  const chartData = useMemo(() => {
    // Group last 20 logs for the chart
    return logs.slice(-20).map((log, index) => ({
      time: new Date(log.timestamp).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      latency: log.latency || 0,
      status: log.status,
    }));
  }, [logs]);

  return (
    <div className="rounded-xl border border-orange-200 bg-white p-4 shadow-sm shadow-orange-100">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">
        Latency Over Time
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f6821f" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f6821f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              unit="ms"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="latency"
              stroke="#f6821f"
              strokeWidth={2}
              fill="url(#latencyGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
