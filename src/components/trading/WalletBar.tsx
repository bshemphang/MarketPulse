import React from 'react';
import { Wallet, LogOut, ChevronDown, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { WalletState, ChainConfig } from '../../types';
import chainsConfig from '../../config/chains.json';

const chains = chainsConfig as ChainConfig[];

interface WalletBarProps {
  walletState: WalletState;
  onConnectEVM: () => void;
  onConnectSolana: () => void;
  onDisconnect: () => void;
  onSwitchChain: (chainId: number) => void;
}

export const WalletBar: React.FC<WalletBarProps> = ({
  walletState,
  onConnectEVM,
  onConnectSolana,
  onDisconnect,
  onSwitchChain
}) => {
  const currentChain = chains.find(c => c.chainId === walletState.chainId) || chains[0];

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xl">
      
      {/* Network & Chain Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="text-sm">{currentChain.icon}</span>
          <select
            value={walletState.chainId || 8453}
            onChange={(e) => onSwitchChain(Number(e.target.value))}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            {chains.map((c) => (
              <option key={c.id} value={c.chainId} className="bg-slate-900 text-white">
                {c.name} {c.isLowFee ? '(Low Fee)' : '(Mainnet)'}
              </option>
            ))}
          </select>
        </div>

        {/* Chain Fee Status Badge */}
        {currentChain.isLowFee ? (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            Low Gas ({currentChain.avgGasFee})
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1" title={currentChain.gasWarning}>
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            High Gas Alert ({currentChain.avgGasFee})
          </span>
        )}
      </div>

      {/* Wallet Connection Status */}
      <div className="flex items-center gap-2">
        {walletState.isConnected ? (
          <div className="flex items-center gap-3 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="text-xs font-mono font-bold text-slate-100">{walletState.address}</span>
            </div>

            <div className="text-xs font-mono text-emerald-400 font-semibold border-l border-slate-800 pl-3">
              {walletState.balance} {walletState.nativeSymbol}
            </div>

            <button
              onClick={onDisconnect}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 transition ml-1"
              title="Disconnect Wallet"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onConnectEVM}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect OKX / EVM</span>
            </button>

            <button
              onClick={onConnectSolana}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-lg shadow-purple-600/20"
            >
              <Zap className="w-4 h-4 text-purple-200" />
              <span>OKX Solana</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
