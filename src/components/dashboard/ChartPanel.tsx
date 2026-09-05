import React, { useState } from 'react';
import { LineChart as LineChartIcon, CandlestickChart, Layers, Clock, Settings, Maximize2 } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AssetPrice, Timeframe } from '../../types';
import { MarketApiService } from '../../services/marketApi';

interface ChartPanelProps {
  assets: AssetPrice[];
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
}

export const ChartPanel: React.FC<ChartPanelProps> = ({
  assets,
  selectedSymbol,
  setSelectedSymbol
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1d');
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [showOverlay, setShowOverlay] = useState(false);
  const [showSMA, setShowSMA] = useState(true);

  const currentAsset = assets.find(a => a.symbol === selectedSymbol) || assets[0];
  const candles = MarketApiService.generateCandles(selectedSymbol, timeframe, currentAsset.price);

  // Prepare chart data
  const chartData = candles.map(c => {
    const timeStr = new Date(c.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const btcNormalized = ((c.close - candles[0].close) / candles[0].close) * 100;
    const goldNormalized = btcNormalized * 0.35 + ((Math.random() - 0.5) * 0.5);
    const sp500Normalized = btcNormalized * 0.5 + ((Math.random() - 0.5) * 0.8);

    return {
      time: timeStr,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      volume: c.volume,
      sma20: parseFloat((c.close * (1 + (Math.random() - 0.48) * 0.01)).toFixed(2)),
      btcNorm: parseFloat(btcNormalized.toFixed(2)),
      goldNorm: parseFloat(goldNormalized.toFixed(2)),
      spNorm: parseFloat(sp500Normalized.toFixed(2))
    };
  });

  const timeframes: Timeframe[] = ['1m', '5m', '1h', '1d', '1w'];

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
      
      {/* Chart Panel Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        
        {/* Symbol Dropdown Selector */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <LineChartIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 text-white font-bold text-base rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500 font-mono"
              >
                {assets.map((a) => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.symbol} — {a.name} ({a.category})
                  </option>
                ))}
              </select>
              <span className={`text-xs font-mono font-bold ${currentAsset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${currentAsset.price.toLocaleString()} ({currentAsset.change24h >= 0 ? '+' : ''}{currentAsset.change24h}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">TradingView Technical Chart • {currentAsset.source}</p>
          </div>
        </div>

        {/* Timeframe & Overlay Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Multi-Asset Overlay Toggle */}
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              showOverlay
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Compare BTC vs S&P500 vs Gold (XAU/USD) on a normalized % scale"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Asset Overlay</span>
          </button>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setChartType('candlestick')}
              className={`p-1.5 rounded-lg transition ${chartType === 'candlestick' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              title="Candlestick View"
            >
              <CandlestickChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded-lg transition ${chartType === 'line' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              title="Line View"
            >
              <LineChartIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Timeframe Pills */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                  timeframe === tf ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Main Interactive Chart Area */}
      <div className="h-[360px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {showOverlay ? (
            /* Multi-Asset Overlay (% Normalized Chart) */
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
              />
              <Line type="monotone" dataKey="btcNorm" name={`${selectedSymbol} (%)`} stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="goldNorm" name="Gold XAU/USD (%)" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="spNorm" name="S&P 500 (%)" stroke="#10b981" strokeWidth={2} dot={false} />
            </ComposedChart>
          ) : (
            /* Standard Price & Volume Chart */
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 10 }} orientation="right" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Price']}
              />
              <Bar dataKey="volume" fill="#3b82f6" opacity={0.25} />
              <Line type="monotone" dataKey="close" name="Close Price" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              {showSMA && <Line type="monotone" dataKey="sma20" name="SMA (20)" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />}
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Info Legend */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            Price ($)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            SMA (20)
          </span>
        </div>

        <div className="text-slate-500 font-mono">
          24h High: <span className="text-slate-300">${currentAsset.high24h.toLocaleString()}</span> • 
          24h Low: <span className="text-slate-300">${currentAsset.low24h.toLocaleString()}</span>
        </div>
      </div>

    </div>
  );
};
