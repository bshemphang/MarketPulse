import React from 'react';
import { Wifi, RefreshCw, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  lastUpdated: number;
  source: string;
  isStreaming?: boolean;
  isStale?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  lastUpdated,
  source,
  isStreaming,
  isStale
}) => {
  const secondsAgo = Math.max(0, Math.floor((Date.now() - lastUpdated) / 1000));

  if (isStreaming) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        Live WS Stream ({source})
      </span>
    );
  }

  if (isStale || secondsAgo > 120) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Data source rate-limited or offline. Showing cached snapshot.">
        <AlertTriangle className="w-3 h-3" />
        Stale Data ({secondsAgo}s ago)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50">
      <RefreshCw className="w-3 h-3 text-blue-400 animate-spin-slow" />
      Updated {secondsAgo}s ago • {source}
    </span>
  );
};
