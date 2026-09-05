import React from 'react';
import { ShieldAlert, Heart, Lock, Clock, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenDisclaimers: () => void;
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDisclaimers, onOpenAbout }) => {
  return (
    <footer className="bg-[#080b11] border-t border-slate-800/80 mt-12 py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Disclaimers Highlight Bar */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-[11px] text-slate-300">
              <strong>Ground Rules & Explicit Disclaimers:</strong> This tool aggregates public market data and computed indicators. <strong>It is NOT financial advice</strong> and does not guarantee accuracy or trading outcomes. Near-real-time data updated every 15–60 seconds.
            </div>
          </div>

          <button
            onClick={onOpenDisclaimers}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-semibold whitespace-nowrap transition"
          >
            Read Ground Rules
          </button>
        </div>

        {/* Footer Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
          
          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-sm font-outfit">MARKET PULSE</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Near-real-time live market news, technical signals, and portfolio tracking across Crypto, Stocks, Forex, and Metals (XAU/USD, XAG/USD).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Asset Classes</h4>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>• Crypto (BTC, ETH, SOL, BNB, XRP)</li>
              <li>• Stocks (NVDA, AAPL, TSLA, MSFT)</li>
              <li>• Forex (EUR/USD, GBP/USD, USD/JPY)</li>
              <li>• Gold & Metals (XAU/USD, XAG/USD)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Safe-by-Design</h4>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>✓ 100% Client-Side Privacy</li>
              <li>✓ Zero Login / Password Needed</li>
              <li>✓ Zero Wallet / Exchange API Keys</li>
              <li>✓ LocalStorage Persistence</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">System Architecture</h4>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div>Central Rate-Limit Stagger Scheduler active.</div>
              <div>Binance Public WebSocket streaming.</div>
              <button onClick={onOpenAbout} className="text-blue-400 hover:underline inline-flex items-center gap-1 mt-1">
                <span>View Full Spec & Architecture</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} Live Market News & Signals Dashboard • Free Tier Edition</div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenDisclaimers} className="hover:text-slate-300">Disclaimers</button>
            <button onClick={onOpenAbout} className="hover:text-slate-300">About</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
