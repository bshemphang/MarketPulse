import React from 'react';
import { Star, TrendingUp, TrendingDown, Bell, Eye } from 'lucide-react';
import { AssetPrice } from '../../types';
import { StorageService } from '../../services/storage';

interface WatchlistProps {
  assets: AssetPrice[];
  watchlist: string[];
  setWatchlist: (list: string[]) => void;
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export const Watchlist: React.FC<WatchlistProps> = ({
  assets,
  watchlist,
  setWatchlist,
  selectedSymbol,
  onSelectSymbol
}) => {

  const toggleStar = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    const updated = StorageService.toggleWatchlist(symbol);
    setWatchlist(updated);
  };

  const watchlistAssets = assets.filter(a => watchlist.includes(a.symbol));

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">Personal Watchlist</h3>
            <p className="text-[11px] text-slate-400">{watchlistAssets.length} Tracked Assets • Saved Locally</p>
          </div>
        </div>

        <span className="text-[10px] text-slate-500 font-mono">Click star to customize</span>
      </div>

      {/* Watchlist Items Grid */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {watchlistAssets.map((asset) => {
          const isSelected = selectedSymbol === asset.symbol;
          const isPositive = asset.change24h >= 0;

          return (
            <div
              key={asset.symbol}
              onClick={() => onSelectSymbol(asset.symbol)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              {/* Asset Left */}
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => toggleStar(e, asset.symbol)}
                  className="text-amber-400 hover:scale-110 transition"
                  title="Unstar from watchlist"
                >
                  <Star className="w-4 h-4 fill-amber-400" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white font-mono">{asset.symbol}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-800 text-slate-400">
                      {asset.category}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">{asset.name}</div>
                </div>
              </div>

              {/* Price & Change Right */}
              <div className="text-right font-mono">
                <div className="text-xs font-bold text-white">
                  ${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.category === 'Forex' ? 4 : 2 })}
                </div>
                <div className={`flex items-center justify-end text-[11px] font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
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
