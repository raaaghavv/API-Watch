"use client";

import { Header } from "@/components/Header";
import { StatsBar } from "@/components/StatsBar";
import { APICard } from "@/components/APICard";
import { LatencyChart } from "@/components/LatencyChart";
import { RequestChart } from "@/components/RequestChart";
import { LogStream } from "@/components/LogStream";
import { useSSE } from "@/hooks/useSSE";
import { useHealthPoll } from "@/hooks/useHealthPoll";

const API_ENDPOINTS = [
  {
    id: "users",
    endpoint: "/users",
    method: "GET",
    description: "Fetch all users",
  },
  {
    id: "orders",
    endpoint: "/orders",
    method: "POST",
    description: "Create new order (random delay)",
  },
  {
    id: "inventory",
    endpoint: "/inventory",
    method: "GET",
    description: "Check inventory (may fail)",
  },
  {
    id: "health",
    endpoint: "/health",
    method: "GET",
    description: "Health check",
    isHealthCheck: true,
  },
];

export default function Dashboard() {
  const { logs, isConnected, stats, triggerAPI } = useSSE();

  // Enable health polling when connected
  useHealthPoll(isConnected, 5000);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header isConnected={isConnected} />

      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* Stats Bar */}
        <section className="mb-6">
          <StatsBar stats={stats} />
        </section>

        {/* Main Content Grid */}
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          {/* API Cards */}
          <div className="space-y-3 lg:col-span-1">
            <h2 className="text-sm font-semibold text-slate-900">
              API Endpoints
            </h2>
            {API_ENDPOINTS.map((api) => (
              <APICard
                key={api.id}
                endpoint={api.endpoint}
                method={api.method}
                description={api.description}
                isHealthCheck={api.isHealthCheck}
                onTrigger={() => triggerAPI(api.id, api.method)}
              />
            ))}
          </div>

          {/* Charts */}
          <div className="space-y-4 lg:col-span-2">
            <LatencyChart logs={logs} />
            <RequestChart logs={logs} />
          </div>
        </div>

        {/* Log Stream */}
        <section>
          <LogStream logs={logs} />
        </section>
      </main>
    </div>
  );
}
