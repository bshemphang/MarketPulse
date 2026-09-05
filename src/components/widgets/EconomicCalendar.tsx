import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { EconomicEvent } from '../../types';

export const EVENTS: EconomicEvent[] = [
  { id: '1', title: 'US Core CPI Inflation (YoY)', country: 'USD', date: 'Tomorrow, 18:30', impact: 'High', forecast: '3.1%', previous: '3.2%' },
  { id: '2', title: 'Federal Reserve Monetary Rate Decision', country: 'USD', date: 'Sep 18, 2026', impact: 'High', forecast: '4.75%', previous: '5.00%' },
  { id: '3', title: 'US Non-Farm Payrolls (NFP)', country: 'USD', date: 'Friday, 18:30', impact: 'High', forecast: '165K', previous: '142K' },
  { id: '4', title: 'ECB Monetary Policy Meeting', country: 'EUR', date: 'Sep 12, 2026', impact: 'Medium', forecast: '3.25%', previous: '3.50%' }
];

export const EconomicCalendarWidget: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-4 space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          <h4 className="font-bold text-xs text-white uppercase tracking-wider">Economic Calendar</h4>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Macro Events</span>
      </div>

      <div className="space-y-2">
        {EVENTS.map((ev) => (
          <div key={ev.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">{ev.title}</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                ev.impact === 'High' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-amber-500/15 text-amber-400'
              }`}>
                {ev.impact}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{ev.date}</span>
              <span>FC: {ev.forecast} • Prev: {ev.previous}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
