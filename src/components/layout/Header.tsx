import React from 'react';
import { Activity, Search, ShieldAlert, Globe, Moon, Sun, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { AssetPrice } from '../../types';
import { TradingToggle } from '../trading/TradingToggle';

interface HeaderProps {
  assets: AssetPrice[];
  onOpenSearch: () => void;
  onOpenDisclaimers: () => void;
  onOpenAbout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  lang: 'EN' | 'ES';
  setLang: (lang: 'EN' | 'ES') => void;
  isTradingEnabled: boolean;
  onToggleTrading: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  assets,
  onOpenSearch,
  onOpenDisclaimers,
  onOpenAbout,
  darkMode,
  setDarkMode,
  lang,
  setLang,
  isTradingEnabled,
  onToggleTrading
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0a0d14]/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Ticker Marquee Bar */}
      <div className="bg-[#0e131f] border-b border-slate-800/50 py-1.5 overflow-hidden text-xs">
        <div className="animate-ticker flex items-center gap-8 px-4">
          {assets.map((asset) => (
            <div key={asset.symbol} className="inline-flex items-center gap-2 font-mono">
              <span className="font-semibold text-slate-200">{asset.symbol}</span>
              <span className="text-slate-100">${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.category === 'Forex' ? 4 : 2 })}</span>
              <span className={`inline-flex items-center text-[11px] font-semibold ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
              </span>
            </div>
          ))}
          {assets.map((asset) => (
            <div key={`dup-${asset.symbol}`} className="inline-flex items-center gap-2 font-mono">
              <span className="font-semibold text-slate-200">{asset.symbol}</span>
              <span className="text-slate-100">${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.category === 'Forex' ? 4 : 2 })}</span>
              <span className={`inline-flex items-center text-[11px] font-semibold ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenAbout}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight text-white font-outfit">MARKET PULSE</h1>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 rounded border border-blue-500/20 uppercase tracking-widest">v1.1</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">News & Confluence Signals • Crypto • Stocks • Forex • Metals</p>
          </div>
        </div>

        {/* Global Search Bar Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex-1 max-w-md hidden md:flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-xs shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search assets (BTC, XAU/USD, AAPL...) or news...</span>
          </div>
          <kbd className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono border border-slate-700">Ctrl K</kbd>
        </button>

        {/* Right Actions & Trading Mode Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Feature Flag Trading Toggle */}
          <TradingToggle
            isTradingEnabled={isTradingEnabled}
            onToggleTrading={onToggleTrading}
          />

          {/* Non-Advice Disclaimer Warning Badge */}
          <button
            onClick={onOpenDisclaimers}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition text-xs font-medium"
            title="Important Ground Rules & Disclaimers"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Disclaimers</span>
          </button>

          {/* About / Info */}
          <button
            onClick={onOpenAbout}
            className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/50 transition"
            title="About Spec v1.1 Architecture"
          >
            <Info className="w-4 h-4 text-blue-400" />
          </button>

          {/* Multi-language Toggle */}
          <button
            onClick={() => setLang(lang === 'EN' ? 'ES' : 'EN')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/50 text-xs font-semibold"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/50 transition"
            title="Toggle Dark/Light Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
