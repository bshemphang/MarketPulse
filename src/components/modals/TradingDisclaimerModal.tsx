import React from 'react';
import { X, ShieldAlert, Lock, Zap, AlertTriangle, ArrowRight } from 'lucide-react';

interface TradingDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmEnable: () => void;
}

export const TradingDisclaimerModal: React.FC<TradingDisclaimerModalProps> = ({
  isOpen,
  onClose,
  onConfirmEnable
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121723] border border-emerald-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Top Glow Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-outfit">Enable Opt-In DEX Trading Module</h2>
              <p className="text-xs text-slate-400">Spec v1.1 Non-Custodial Trading Rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules Body */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Lock className="w-4 h-4" />
              <span>100% Non-Custodial Safeguard</span>
            </div>
            <p>
              This app never sees, requests, stores, or transmits your private keys or seed phrases. Your wallet extension handles key security directly.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>Low-Fee Chain Recommendation</span>
            </div>
            <p>
              We prioritize <strong>Base</strong>, <strong>Arbitrum</strong>, and <strong>Solana</strong> for fast swaps with sub-cent gas fees ($0.01 - $0.10).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Explicit Wallet Signature Required</span>
            </div>
            <p>
              Every transaction requires an explicit wallet signature pop-up. The app cannot move funds on its own. Signals in the app never auto-trigger trades.
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition"
          >
            Stay in Read-Only Mode
          </button>

          <button
            onClick={onConfirmEnable}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition"
          >
            <span>I Accept & Enable Trading</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
