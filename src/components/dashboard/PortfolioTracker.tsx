import React, { useState } from 'react';
import { PieChart as PieIcon, Plus, Trash2, ShieldCheck, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { PortfolioItem, AssetPrice } from '../../types';
import { StorageService } from '../../services/storage';

interface PortfolioTrackerProps {
  assets: AssetPrice[];
  portfolio: PortfolioItem[];
  setPortfolio: (items: PortfolioItem[]) => void;
}

export const PortfolioTracker: React.FC<PortfolioTrackerProps> = ({
  assets,
  portfolio,
  setPortfolio
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState(assets[0]?.symbol || 'BTC');
  const [newAmount, setNewAmount] = useState('1');
  const [newBuyPrice, setNewBuyPrice] = useState('');

  // Update current live prices in portfolio
  const updatedPortfolio = portfolio.map(item => {
    const liveAsset = assets.find(a => a.symbol === item.symbol);
    const currentPrice = liveAsset ? liveAsset.price : item.currentPrice;
    const totalValue = item.amount * currentPrice;
    const costBasis = item.amount * item.buyPrice;
    const pnl = totalValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

    return {
      ...item,
      currentPrice,
      totalValue: parseFloat(totalValue.toFixed(2)),
      pnl: parseFloat(pnl.toFixed(2)),
      pnlPercent: parseFloat(pnlPercent.toFixed(2))
    };
  });

  const totalPortfolioValue = updatedPortfolio.reduce((acc, item) => acc + item.totalValue, 0);
  const totalPnL = updatedPortfolio.reduce((acc, item) => acc + item.pnl, 0);
  const totalCost = totalPortfolioValue - totalPnL;
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const liveAsset = assets.find(a => a.symbol === newSymbol);
    if (!liveAsset) return;

    const amount = parseFloat(newAmount) || 1;
    const buyPrice = parseFloat(newBuyPrice) || liveAsset.price;

    const newItem: PortfolioItem = {
      id: `p_${Date.now()}`,
      symbol: liveAsset.symbol,
      name: liveAsset.name,
      category: liveAsset.category,
      amount,
      buyPrice,
      currentPrice: liveAsset.price,
      totalValue: amount * liveAsset.price,
      pnl: (amount * liveAsset.price) - (amount * buyPrice),
      pnlPercent: ((liveAsset.price - buyPrice) / buyPrice) * 100
    };

    const nextPortfolio = [...portfolio, newItem];
    setPortfolio(nextPortfolio);
    StorageService.savePortfolio(nextPortfolio);
    setShowAddModal(false);
    setNewAmount('1');
    setNewBuyPrice('');
  };

  const removeItem = (id: string) => {
    const nextPortfolio = portfolio.filter(p => p.id !== id);
    setPortfolio(nextPortfolio);
    StorageService.savePortfolio(nextPortfolio);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-5 shadow-xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base font-outfit">Local Portfolio Tracker</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                100% Client-Side Private
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Manual Holdings P&L • Zero Wallet / Exchange Connection</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Holding</span>
        </button>
      </div>

      {/* Total Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">Total Portfolio Value</div>
          <div className="text-xl font-extrabold text-white font-mono">${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">Total Profit / Loss</div>
          <div className={`text-xl font-extrabold font-mono flex items-center ${totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">Total Return (%)</div>
          <div className={`text-xl font-extrabold font-mono ${totalPnLPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase border-y border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Asset</th>
              <th className="py-2.5 px-3">Holdings</th>
              <th className="py-2.5 px-3">Avg Buy</th>
              <th className="py-2.5 px-3">Current Price</th>
              <th className="py-2.5 px-3">Total Value</th>
              <th className="py-2.5 px-3">Unrealized P&L</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {updatedPortfolio.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-3">
                  <div className="font-bold text-white">{item.symbol}</div>
                  <div className="text-[10px] text-slate-400 font-sans">{item.name}</div>
                </td>
                <td className="py-3 px-3 font-semibold">{item.amount}</td>
                <td className="py-3 px-3">${item.buyPrice.toLocaleString()}</td>
                <td className="py-3 px-3 font-semibold text-white">${item.currentPrice.toLocaleString()}</td>
                <td className="py-3 px-3 font-bold text-white">${item.totalValue.toLocaleString()}</td>
                <td className={`py-3 px-3 font-bold ${item.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {item.pnl >= 0 ? '+' : ''}${item.pnl.toLocaleString()} ({item.pnlPercent >= 0 ? '+' : ''}{item.pnlPercent}%)
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Remove holding"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Holding Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form onSubmit={handleAddItem} className="bg-[#121723] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-outfit">Add Manual Holding</h3>
            
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Select Asset</label>
              <select
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 text-xs font-mono"
              >
                {assets.map(a => (
                  <option key={a.symbol} value={a.symbol}>{a.symbol} - {a.name} (${a.price})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Quantity / Amount Held</label>
              <input
                type="number"
                step="any"
                required
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Average Buy Price ($)</label>
              <input
                type="number"
                step="any"
                placeholder="Leave blank to use live price"
                value={newBuyPrice}
                onChange={(e) => setNewBuyPrice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 text-xs font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
              >
                Save Holding
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
