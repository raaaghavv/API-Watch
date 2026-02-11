"use client";

import { Activity, Wifi, WifiOff } from "lucide-react";

export function Header({ isConnected }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">API Watch</h1>
          <p className="text-sm text-slate-500">
            Real-time monitoring dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <Wifi className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Connected
            </span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">
              Disconnected
            </span>
          </>
        )}
      </div>
    </header>
  );
}
