import React from 'react';
import { X, ShieldCheck, Database, Cpu, Layers, ArrowDownUp } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121723] border border-blue-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-outfit">Project Spec v1.1 Architecture</h2>
              <p className="text-xs text-slate-400">Read-Only Default • Opt-In Non-Custodial DEX Module</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ArrowDownUp className="w-4 h-4" />
                <span>OKX DEX Aggregator API</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Primary swap quoter supporting Base, Arbitrum, Solana, BNB, Polygon, and Ethereum Mainnet.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>GoPlus Security Audit</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Audits tokens for honeypot risks, sell taxes &gt; 10%, and unrenounced mint contracts before swapping.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Database className="w-4 h-4" />
                <span>Gold & Metals (XAU/USD, XAG/USD)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Twelve Data free tier endpoints for Gold/Silver forex pairs, GoldAPI fallback, Kitco & Investing.com RSS feeds.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-400 font-semibold">
                <Cpu className="w-4 h-4" />
                <span>Low-Fee Chain Prioritization</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Recommends Base, Arbitrum, and Solana ($0.01–$0.10 gas). Displays gas warnings for Ethereum Mainnet.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-between items-center text-[11px] text-slate-500">
          <span>v1.1 • Open Data & Non-Custodial DEX Module</span>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
