"use client";

import { useState } from "react";
import { Play, Loader2 } from "lucide-react";

const METHOD_COLORS = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
};

export function APICard({
  endpoint,
  method,
  description,
  onTrigger,
  isHealthCheck = false,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await onTrigger();
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-white p-4 shadow-sm shadow-orange-100">
      <div className="flex items-center gap-3">
        <span
          className={`rounded-md px-2 py-1 text-xs font-semibold ${METHOD_COLORS[method] || "bg-slate-100 text-slate-700"}`}
        >
          {method}
        </span>
        <div>
          <p className="font-mono text-sm font-medium text-slate-900">
            {endpoint}
          </p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        {isHealthCheck && (
          <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
            Auto
          </span>
        )}
      </div>

      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
