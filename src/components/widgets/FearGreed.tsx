import React from 'react';
import { Gauge, Flame, AlertCircle } from 'lucide-react';
import { FearAndGreed } from '../../types';

export const DEFAULT_FEAR_GREED: FearAndGreed = {
  score: 72,
  label: 'Greed',
  stockVixScore: 16.4,
  stockVixLabel: 'Low Volatility / Complacency',
  lastUpdated: Date.now()
};

export const FearGreedWidget: React.FC = () => {
  const fg = DEFAULT_FEAR_GREED;

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-4 space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <h4 className="font-bold text-xs text-white uppercase tracking-wider">Fear & Greed Index</h4>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Live Sentiment</span>
      </div>

      {/* Gauge Meter Display */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="text-[10px] text-slate-400">Crypto Sentiment</div>
          <div className="text-xl font-extrabold text-emerald-400 font-mono flex items-center gap-1.5">
            <span>{fg.score} / 100</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {fg.label}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-400">Stock VIX Gauge</div>
          <div className="text-sm font-bold text-slate-200 font-mono">{fg.stockVixScore}</div>
          <div className="text-[10px] text-slate-400">{fg.stockVixLabel}</div>
        </div>
      </div>
    </div>
  );
};
