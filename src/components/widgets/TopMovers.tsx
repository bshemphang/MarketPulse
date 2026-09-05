import React, { useState } from 'react';
import { Award, TrendingUp, TrendingDown } from 'lucide-react';
import { AssetPrice } from '../../types';

interface TopMoversProps {
  assets: AssetPrice[];
  onSelectSymbol: (symbol: string) => void;
}

export const TopMoversWidget: React.FC<TopMoversProps> = ({ assets, onSelectSymbol }) => {
  const [tab, setTab] = useState<'gainers' | 'losers'>('gainers');

  const sorted = [...assets].sort((a, b) => {
    return tab === 'gainers' ? b.change24h - a.change24h : a.change24h - b.change24h;
  });

  const displayList = sorted.slice(0, 4);

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-4 space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <h4 className="font-bold text-xs text-white uppercase tracking-wider">Top Movers Leaderboard</h4>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
          <button
            onClick={() => setTab('gainers')}
            className={`px-2 py-0.5 rounded font-semibold transition ${tab === 'gainers' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'}`}
          >
            Gainers
          </button>
          <button
            onClick={() => setTab('losers')}
            className={`px-2 py-0.5 rounded font-semibold transition ${tab === 'losers' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400'}`}
          >
            Losers
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        {displayList.map((asset) => (
          <div
            key={asset.symbol}
            onClick={() => onSelectSymbol(asset.symbol)}
            className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-800/40 transition cursor-pointer text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{asset.symbol}</span>
              <span className="text-[10px] text-slate-500 font-sans">{asset.category}</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-white mr-2">${asset.price.toLocaleString()}</span>
              <span className={`font-bold ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
