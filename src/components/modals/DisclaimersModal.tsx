import React from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2, Clock, Lock, ArrowLeftRight } from 'lucide-react';

interface DisclaimersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimersModal: React.FC<DisclaimersModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121723] border border-amber-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-outfit">Spec v1.1 Ground Rules & Disclaimers</h2>
              <p className="text-xs text-slate-400">Read-Only Default • Opt-In Non-Custodial DEX Module</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Not Financial Advice</span>
            </div>
            <p>
              This tool aggregates public market data, news feeds, and computed technical indicators. <strong>It is NOT financial advice</strong> and does not guarantee accuracy, uptime, or trading outcomes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <ArrowLeftRight className="w-4 h-4" />
              <span>Spec v1.1 Non-Custodial Trading Rules</span>
            </div>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li><strong>Read-Only Dashboard Default</strong>: Pure read-only mode with zero wallet connections required.</li>
              <li><strong>Opt-In Trading Mode</strong>: Feature-flagged DEX module for self-directed swaps.</li>
              <li><strong>100% Non-Custodial</strong>: The app never sees, stores, or transmits private keys. Every swap requires an explicit wallet signature pop-up.</li>
              <li><strong>Low-Fee Chain Focus</strong>: Optimized for Base, Arbitrum, and Solana ($0.01–$0.10 gas fees).</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
              <Clock className="w-4 h-4" />
              <span>Near-Real-Time Data Latency</span>
            </div>
            <p>
              Data is updated periodically (15–60s) depending on free-tier rate limits. Binance WebSocket streams provide zero-latency updates for crypto assets when active.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30">
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
