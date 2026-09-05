import React, { useState, useEffect } from 'react';
import { ArrowDownUp, ShieldCheck, ShieldAlert, AlertTriangle, Zap, Settings, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { WalletState, TokenInfo, SwapQuote, GoPlusSecurityReport, ChainConfig } from '../../types';
import { DexService, SUPPORTED_TOKENS } from '../../services/dexService';
import { SecurityService } from '../../services/securityService';
import chainsConfig from '../../config/chains.json';

const chains = chainsConfig as ChainConfig[];

interface DexSwapModuleProps {
  walletState: WalletState;
  onConnectWallet: () => void;
}

export const DexSwapModule: React.FC<DexSwapModuleProps> = ({ walletState, onConnectWallet }) => {
  const currentChain = chains.find(c => c.chainId === walletState.chainId) || chains[0];
  const tokenList = SUPPORTED_TOKENS[currentChain.id] || SUPPORTED_TOKENS.base;

  const [payToken, setPayToken] = useState<TokenInfo>(tokenList[0]);
  const [receiveToken, setReceiveToken] = useState<TokenInfo>(tokenList[1] || tokenList[0]);
  const [payAmount, setPayAmount] = useState<string>('0.1');

  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [securityReport, setSecurityReport] = useState<GoPlusSecurityReport | null>(null);
  const [slippage, setSlippage] = useState<number>(0.5); // 0.5%
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [swapResult, setSwapResult] = useState<{ success: boolean; hash: string; msg: string } | null>(null);

  // Update quote & GoPlus Security Report on token / amount change
  useEffect(() => {
    let isSubscribed = true;

    async function updateQuoteAndSecurity() {
      if (!payAmount || parseFloat(payAmount) <= 0) {
        setQuote(null);
        return;
      }

      setIsLoading(true);
      try {
        const newQuote = await DexService.getQuote(payToken, receiveToken, payAmount, currentChain.type);
        const report = await SecurityService.checkTokenSecurity(receiveToken.address, currentChain.chainId);

        if (isSubscribed) {
          setQuote(newQuote);
          setSecurityReport(report);
        }
      } catch (err) {
        console.warn('[DEX Swap] Quote error:', err);
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    }

    updateQuoteAndSecurity();
    return () => { isSubscribed = false; };
  }, [payToken, receiveToken, payAmount, currentChain]);

  // Handle Swap Signature Trigger
  const handleExecuteSwap = async () => {
    if (!walletState.isConnected || !walletState.address) {
      onConnectWallet();
      return;
    }
    if (!quote) return;

    setIsLoading(true);
    setSwapResult(null);

    try {
      const result = await DexService.executeNonCustodialSwap(quote, walletState.address);
      setSwapResult({
        success: result.success,
        hash: result.txHash,
        msg: result.message
      });
    } catch (err) {
      console.warn('[DEX Swap] Swap execution failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchTokens = () => {
    setPayToken(receiveToken);
    setReceiveToken(payToken);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-lg mx-auto space-y-5 shadow-2xl relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <ArrowDownUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base font-outfit">OKX DEX Aggregator</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                Non-Custodial
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Optimal Route • GoPlus Security Verified</p>
          </div>
        </div>

        {/* Slippage Settings */}
        <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 text-xs font-mono">
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 text-[10px]">Slippage:</span>
          <button
            onClick={() => setSlippage(slippage === 0.5 ? 1.0 : 0.5)}
            className="font-bold text-blue-400 hover:underline"
          >
            {slippage}%
          </button>
        </div>
      </div>

      {/* Mainnet High-Gas Warning Banner */}
      {!currentChain.isLowFee && currentChain.gasWarning && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Ethereum Mainnet High-Gas Warning</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {currentChain.gasWarning}
          </p>
        </div>
      )}

      {/* Low-Fee Chain Badge */}
      {currentChain.isLowFee && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Zap className="w-4 h-4 text-emerald-400" />
            Low-Fee Chain: {currentChain.name}
          </span>
          <span className="text-[11px] text-slate-400">Est Gas: {currentChain.avgGasFee}</span>
        </div>
      )}

      {/* Pay Token Box */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>You Pay</span>
          <span>Balance: {walletState.balance} {payToken.symbol}</span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="number"
            step="any"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            placeholder="0.0"
            className="flex-1 bg-transparent text-xl font-mono font-extrabold text-white focus:outline-none"
          />

          <select
            value={payToken.symbol}
            onChange={(e) => {
              const selected = tokenList.find(t => t.symbol === e.target.value);
              if (selected) setPayToken(selected);
            }}
            className="bg-slate-800 border border-slate-700 text-white font-bold rounded-xl px-3 py-1.5 text-sm font-mono focus:outline-none"
          >
            {tokenList.map(t => (
              <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
            ))}
          </select>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          ~${(parseFloat(payAmount || '0') * payToken.priceUsd).toFixed(2)} USD
        </div>
      </div>

      {/* Switch Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleSwitchTokens}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition shadow-md"
          title="Switch Pay & Receive Tokens"
        >
          <ArrowDownUp className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      {/* Receive Token Box */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>You Receive (Estimated)</span>
          <span>OKX DEX Route</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 text-xl font-mono font-extrabold text-white">
            {isLoading ? <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" /> : (quote ? quote.receiveAmount : '0.0')}
          </div>

          <select
            value={receiveToken.symbol}
            onChange={(e) => {
              const selected = tokenList.find(t => t.symbol === e.target.value);
              if (selected) setReceiveToken(selected);
            }}
            className="bg-slate-800 border border-slate-700 text-white font-bold rounded-xl px-3 py-1.5 text-sm font-mono focus:outline-none"
          >
            {tokenList.map(t => (
              <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
            ))}
          </select>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          ~${(parseFloat(quote?.receiveAmount || '0') * receiveToken.priceUsd).toFixed(2)} USD
        </div>
      </div>

      {/* GoPlus Security Audit Card */}
      {securityReport && (
        <div className={`p-3.5 rounded-xl border space-y-1 text-xs font-mono ${
          securityReport.isSafe
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              {securityReport.isSafe ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
              GoPlus Security Audit: {securityReport.isSafe ? 'VERIFIED SAFE' : 'RISK DETECTED'}
            </span>
            <span className="text-[10px]">Sell Tax: {securityReport.sellTax}%</span>
          </div>
          <div className="text-[11px] text-slate-300">
            {securityReport.riskSummary.join(' • ')}
          </div>
        </div>
      )}

      {/* Quote Route Details */}
      {quote && (
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs text-slate-400 font-mono">
          <div className="flex justify-between">
            <span>Exchange Rate</span>
            <span className="text-slate-200">1 {payToken.symbol} = {quote.exchangeRate} {receiveToken.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span>Aggregator Route</span>
            <span className="text-blue-400 font-semibold">{quote.route.join(' → ')}</span>
          </div>
          <div className="flex justify-between">
            <span>Est. Network Fee</span>
            <span className="text-slate-200">${quote.estimatedGasUsd} USD</span>
          </div>
        </div>
      )}

      {/* Confirmation Success Alert */}
      {swapResult && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 space-y-1 text-xs">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Wallet Signature Confirmed!</span>
          </div>
          <p className="text-[11px]">{swapResult.msg}</p>
          <div className="text-[10px] text-slate-400 font-mono pt-1">
            Tx Hash: {swapResult.hash.slice(0, 16)}...
          </div>
        </div>
      )}

      {/* Action Swap Button */}
      <button
        onClick={handleExecuteSwap}
        disabled={isLoading || !payAmount || parseFloat(payAmount) <= 0}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
      >
        {!walletState.isConnected ? (
          <span>Connect Wallet to Swap</span>
        ) : isLoading ? (
          <RefreshCw className="w-5 h-5 animate-spin text-white" />
        ) : (
          <>
            <span>Swap via OKX DEX</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Non-Custodial Mandatory Signature Disclosure */}
      <div className="text-[10px] text-center text-slate-500 leading-relaxed">
        🔒 Non-custodial execution. Every transaction requires an explicit signature pop-up in your wallet extension.
      </div>

    </div>
  );
};
