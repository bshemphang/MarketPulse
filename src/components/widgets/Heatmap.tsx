import React from 'react';
import { Grid, Flame } from 'lucide-react';
import { AssetPrice } from '../../types';

interface HeatmapProps {
  assets: AssetPrice[];
  onSelectSymbol: (symbol: string) => void;
}

export const HeatmapWidget: React.FC<HeatmapProps> = ({ assets, onSelectSymbol }) => {
  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-4 space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-purple-400" />
          <h4 className="font-bold text-xs text-white uppercase tracking-wider">Cross-Asset 24h Volatility Heatmap</h4>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Crypto • Stocks • Forex • Metals</span>
      </div>

      {/* Heatmap Matrix Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {assets.map((asset) => {
          const isPositive = asset.change24h >= 0;
          const absChange = Math.abs(asset.change24h);

          // Heatmap color intensity scale
          let bgColor = 'bg-slate-900/80';
          let textColor = 'text-slate-200';
          let borderColor = 'border-slate-800';

          if (isPositive) {
            if (absChange > 5) {
              bgColor = 'bg-emerald-600/30';
              borderColor = 'border-emerald-500/50';
              textColor = 'text-emerald-300';
            } else if (absChange > 1.5) {
              bgColor = 'bg-emerald-600/20';
              borderColor = 'border-emerald-500/30';
              textColor = 'text-emerald-400';
            } else {
              bgColor = 'bg-emerald-500/10';
              borderColor = 'border-emerald-500/20';
              textColor = 'text-emerald-400';
            }
          } else {
            if (absChange > 5) {
              bgColor = 'bg-rose-600/30';
              borderColor = 'border-rose-500/50';
              textColor = 'text-rose-300';
            } else if (absChange > 1.5) {
              bgColor = 'bg-rose-600/20';
              borderColor = 'border-rose-500/30';
              textColor = 'text-rose-400';
            } else {
              bgColor = 'bg-rose-500/10';
              borderColor = 'border-rose-500/20';
              textColor = 'text-rose-400';
            }
          }

          return (
            <div
              key={asset.symbol}
              onClick={() => onSelectSymbol(asset.symbol)}
              className={`p-3 rounded-xl border ${bgColor} ${borderColor} hover:scale-[1.02] transition cursor-pointer flex flex-col justify-between h-20 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white font-mono">{asset.symbol}</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase">{asset.category}</span>
              </div>

              <div className="text-right">
                <div className="text-xs font-semibold text-white font-mono">
                  ${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.category === 'Forex' ? 4 : 2 })}
                </div>
                <div className={`text-[11px] font-extrabold font-mono ${textColor}`}>
                  {isPositive ? '+' : ''}{asset.change24h}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
