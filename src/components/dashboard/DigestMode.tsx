import React from 'react';
import { Sparkles, ArrowLeft, CheckCircle2, TrendingUp, TrendingDown, Gem, Coins } from 'lucide-react';
import { NewsItem, AssetPrice } from '../../types';

interface DigestModeProps {
  news: NewsItem[];
  assets: AssetPrice[];
  onBack: () => void;
}

export const DigestMode: React.FC<DigestModeProps> = ({ news, assets, onBack }) => {
  const topBullishNews = news.filter(n => n.sentiment === 'positive').slice(0, 3);
  const topBearishNews = news.filter(n => n.sentiment === 'negative').slice(0, 2);

  const gold = assets.find(a => a.symbol === 'XAU/USD');
  const btc = assets.find(a => a.symbol === 'BTC');
  const nvda = assets.find(a => a.symbol === 'NVDA');

  return (
    <div className="glass-panel rounded-2xl border border-purple-500/30 p-6 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-outfit">Daily Executive Briefing Digest</h2>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full">
                AI Briefing
              </span>
            </div>
            <p className="text-xs text-slate-400">Condensed Market Intelligence • High-Impact Bullet Highlights</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Stream</span>
        </button>
      </div>

      {/* Key Market Takeaways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Macro Gold Takeaway */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Gem className="w-4 h-4" />
            <span>Precious Metals Focus</span>
          </div>
          <div className="text-sm font-semibold text-white">
            Gold (XAU/USD) at ${gold?.price.toLocaleString() ?? '2,895.40'} ({gold && gold.change24h >= 0 ? '+' : ''}{gold?.change24h}%)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Safe-haven inflows continue to accelerate following Fed CPI expectations and rate-cut bets. Spot silver (XAG/USD) tracks industrial solar gains.
          </p>
        </div>

        {/* Crypto Takeaway */}
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
            <Coins className="w-4 h-4" />
            <span>Crypto Momentum</span>
          </div>
          <div className="text-sm font-semibold text-white">
            Bitcoin (BTC) at ${btc?.price.toLocaleString() ?? '94,250'} ({btc && btc.change24h >= 0 ? '+' : ''}{btc?.change24h}%)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Institutional spot ETF net inflows exceeded $1.2B this week. Technical confluence points to 4 of 5 bullish indicators.
          </p>
        </div>

        {/* Stock Market Takeaway */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Equity Sentiment</span>
          </div>
          <div className="text-sm font-semibold text-white">
            Tech Rally Led by NVDA (${nvda?.price ?? '138.50'})
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Wall Street futures post solid gains as semiconductor sentiment rebounds prior to Non-Farm Payrolls and corporate earnings prints.
          </p>
        </div>

      </div>

      {/* Top Bullish Briefings */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Top Bullish Headlines Summary</span>
        </h3>
        <div className="space-y-2">
          {topBullishNews.map((item) => (
            <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-100">{item.title}</h4>
                <p className="text-[11px] text-slate-400">{item.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
