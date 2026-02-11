"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function RequestChart({ logs }) {
  const chartData = useMemo(() => {
    // Group logs by time intervals (every 5 seconds)
    const grouped = {};

    logs.forEach((log) => {
      const date = new Date(log.timestamp);
      // Round to nearest 5 seconds
      const seconds = Math.floor(date.getSeconds() / 5) * 5;
      date.setSeconds(seconds, 0);
      const key = date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      if (!grouped[key]) {
        grouped[key] = { time: key, success: 0, errors: 0 };
      }

      if (log.status >= 200 && log.status < 400) {
        grouped[key].success++;
      } else {
        grouped[key].errors++;
      }
    });

    return Object.values(grouped).slice(-10);
  }, [logs]);

  return (
    <div className="rounded-xl border border-orange-200 bg-white p-4 shadow-sm shadow-orange-100">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">
        Requests by Status
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
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
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="success"
              name="Success"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="errors"
              name="Errors"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
