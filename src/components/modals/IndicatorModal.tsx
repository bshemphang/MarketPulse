import React from 'react';
import { X, Calculator, Info } from 'lucide-react';
import { TechnicalIndicators } from '../../types';

interface IndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicators?: TechnicalIndicators;
  symbol?: string;
}

export const IndicatorModal: React.FC<IndicatorModalProps> = ({
  isOpen,
  onClose,
  indicators,
  symbol = 'BTC'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121723] border border-blue-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-outfit">Indicator Transparency & Formula Math</h2>
              <p className="text-xs text-slate-400">Underlying Confluence Math for {symbol}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Math Formula Explanations */}
        <div className="space-y-4 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
          
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-semibold text-blue-400 text-sm">1. Relative Strength Index (RSI - 14 Period)</div>
            <p className="text-[11px] text-slate-400">
              Formula: <code className="text-blue-300 font-mono">RSI = 100 - (100 / (1 + (Average Gain / Average Loss)))</code>
            </p>
            <p className="text-[11px] text-slate-300">
              Current Value: <strong className="text-white font-mono">{indicators?.rsi ?? 50} ({indicators?.rsiStatus ?? 'Neutral'})</strong>. Values &lt; 35 signal oversold potential; &gt; 65 signal overbought potential.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-semibold text-emerald-400 text-sm">2. Simple Moving Averages (SMA-20 & SMA-50)</div>
            <p className="text-[11px] text-slate-400">
              Formula: <code className="text-emerald-300 font-mono">SMA(N) = Sum of Last N Close Prices / N</code>
            </p>
            <p className="text-[11px] text-slate-300">
              SMA-20: <span className="font-mono text-white">${indicators?.sma20.toLocaleString()}</span> • SMA-50: <span className="font-mono text-white">${indicators?.sma50.toLocaleString()}</span>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-semibold text-purple-400 text-sm">3. Exponential Moving Averages (EMA-12 & EMA-26)</div>
            <p className="text-[11px] text-slate-400">
              Formula: <code className="text-purple-300 font-mono">EMA = (Close * Weight) + (Previous EMA * (1 - Weight))</code>
            </p>
            <p className="text-[11px] text-slate-300">
              EMA-12: <span className="font-mono text-white">${indicators?.ema12.toLocaleString()}</span> • EMA-26: <span className="font-mono text-white">${indicators?.ema26.toLocaleString()}</span>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-semibold text-amber-400 text-sm">4. Moving Average Convergence Divergence (MACD)</div>
            <p className="text-[11px] text-slate-400">
              Formula: <code className="text-amber-300 font-mono">MACD Line = EMA(12) - EMA(26)</code>
            </p>
            <p className="text-[11px] text-slate-300">
              Histogram: <span className="font-mono text-white">{indicators?.macd.histogram}</span>. Positive histogram indicates expanding bullish momentum.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs">
            Close Math Guide
          </button>
        </div>

      </div>
    </div>
  );
};
