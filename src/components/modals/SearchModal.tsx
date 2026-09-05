import React, { useState, useEffect } from 'react';
import { Search, X, TrendingUp, Newspaper, ArrowRight } from 'lucide-react';
import { AssetPrice, NewsItem } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: AssetPrice[];
  news: NewsItem[];
  onSelectAsset: (symbol: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  news,
  onSelectAsset
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssets = query.trim() === '' ? assets.slice(0, 4) : assets.filter(a =>
    a.symbol.toLowerCase().includes(query.toLowerCase()) ||
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNews = query.trim() === '' ? news.slice(0, 4) : news.filter(n =>
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    n.source.toLowerCase().includes(query.toLowerCase()) ||
    n.relatedSymbols.some(s => s.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121723] border border-slate-700/80 rounded-2xl max-w-2xl w-full p-4 shadow-2xl space-y-4">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 focus-within:border-blue-500 transition">
          <Search className="w-5 h-5 text-blue-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search crypto, stocks, forex, gold (BTC, XAU/USD, NVDA) or news headlines..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
          
          {/* Asset Results */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Assets ({filteredAssets.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.symbol}
                  onClick={() => {
                    onSelectAsset(asset.symbol);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-800/60 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-blue-400 font-mono">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-white group-hover:text-blue-400 transition">{asset.symbol}</div>
                      <div className="text-[10px] text-slate-400">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs font-semibold text-white">${asset.price.toLocaleString()}</div>
                    <div className={`text-[10px] ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* News Results */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Headlines ({filteredNews.length})</h4>
            <div className="space-y-2">
              {filteredNews.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-800/60 transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-slate-200 group-hover:text-blue-400 transition line-clamp-2">
                        {item.title}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span className="text-slate-500">{new Date(item.publishedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
          <span>Press ESC to close</span>
          <button onClick={onClose} className="hover:text-slate-300">Close</button>
        </div>

      </div>
    </div>
  );
};
