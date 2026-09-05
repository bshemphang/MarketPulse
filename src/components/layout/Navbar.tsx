import React from 'react';
import { LayoutDashboard, Newspaper, LineChart, Sparkles, PieChart, Coins, TrendingUp, DollarSign, Gem, Layers, ArrowDownUp } from 'lucide-react';
import { AssetCategory, ViewMode } from '../../types';

interface NavbarProps {
  activeCategory: AssetCategory | 'All';
  setActiveCategory: (cat: AssetCategory | 'All') => void;
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  isTradingEnabled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  setActiveCategory,
  activeView,
  setActiveView,
  isTradingEnabled
}) => {
  const categories: { id: AssetCategory | 'All'; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'All', label: 'All Markets', icon: <Layers className="w-4 h-4" />, color: 'text-blue-400' },
    { id: 'Crypto', label: 'Crypto', icon: <Coins className="w-4 h-4" />, color: 'text-purple-400' },
    { id: 'Stocks', label: 'Stocks', icon: <TrendingUp className="w-4 h-4" />, color: 'text-emerald-400' },
    { id: 'Forex', label: 'Forex', icon: <DollarSign className="w-4 h-4" />, color: 'text-indigo-400' },
    { id: 'Metals', label: 'Gold & Metals (XAU/XAG)', icon: <Gem className="w-4 h-4" />, color: 'text-amber-400' }
  ];

  const views: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'news', label: 'Live News', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'charts', label: 'Interactive Charts', icon: <LineChart className="w-4 h-4" /> },
    { id: 'digest', label: 'Digest Briefing', icon: <Sparkles className="w-4 h-4" />, badge: 'AI' },
    { id: 'portfolio', label: 'Local P&L Tracker', icon: <PieChart className="w-4 h-4" /> }
  ];

  if (isTradingEnabled) {
    views.push({
      id: 'trading',
      label: 'DEX Swap',
      icon: <ArrowDownUp className="w-4 h-4 text-emerald-400" />,
      badge: 'OKX'
    });
  }

  return (
    <nav className="bg-[#0e131f]/90 border-b border-slate-800/80 sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 py-2">
          
          {/* Asset Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className={isActive ? cat.color : 'text-slate-400'}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto no-scrollbar">
            {views.map((v) => {
              const isActive = activeView === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveView(v.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {v.icon}
                  <span>{v.label}</span>
                  {v.badge && (
                    <span className={`px-1 py-0.2 text-[9px] font-extrabold rounded ${
                      v.id === 'trading' ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white' : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                    }`}>
                      {v.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
};
