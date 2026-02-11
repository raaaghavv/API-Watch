"use client";

import { BarChart3, AlertTriangle, Clock, CheckCircle } from "lucide-react";

export function StatsBar({ stats }) {
  const statItems = [
    {
      label: "Total Requests",
      value: stats.totalRequests,
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Errors",
      value: stats.errors,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Avg Latency",
      value: `${stats.avgLatency}ms`,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Uptime",
      value: `${stats.uptime}%`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-4 rounded-xl border border-orange-200 bg-white p-4 shadow-sm shadow-orange-100"
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bgColor}`}
          >
            <item.icon className={`h-6 w-6 ${item.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{item.value}</p>
            <p className="text-sm text-slate-500">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
