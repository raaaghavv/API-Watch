"use client";

import { Activity, Wifi, WifiOff } from "lucide-react";

export function Header({ isConnected, onToggleConnection }) {
  return (
    <header className="sticky top-4 z-50 mx-auto mt-4 flex max-w-360 items-center justify-between rounded-full border border-orange-200 bg-card/80 px-6 py-3 shadow-lg shadow-orange-100/50 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
          <Activity className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-base font-bold text-slate-900">API Watch</h1>
        <span
          className="hidden text-xs italic text-slate-400 sm:inline"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          — watching your APIs, so you don&apos;t have to
        </span>
      </div>

      <button
        onClick={onToggleConnection}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 transition-colors hover:bg-slate-100"
      >
        <span
          className={`inline-block h-2 w-2 rounded-full ${isConnected ? "animate-pulse bg-green-500" : "bg-red-500"}`}
        />
        <span
          className={`text-xs font-medium ${isConnected ? "text-green-600" : "text-red-600"}`}
        >
          {isConnected ? "Live" : "Offline"}
        </span>
      </button>
    </header>
  );
}
