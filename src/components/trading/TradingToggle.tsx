import React from 'react';
import { ArrowLeftRight, Eye, ShieldCheck } from 'lucide-react';

interface TradingToggleProps {
  isTradingEnabled: boolean;
  onToggleTrading: () => void;
}

export const TradingToggle: React.FC<TradingToggleProps> = ({
  isTradingEnabled,
  onToggleTrading
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleTrading}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-extrabold transition shadow-sm ${
          isTradingEnabled
            ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white border border-emerald-400/50 shadow-emerald-500/20'
            : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
        }`}
        title="Toggle between Read-Only Dashboard and Opt-in Non-Custodial DEX Trading Mode"
      >
        {isTradingEnabled ? (
          <>
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span>Trading Mode ON</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
              DEX
            </span>
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Read-Only Mode</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
              Default
            </span>
          </>
        )}
      </button>
    </div>
  );
};
