import React, { useState } from 'react';
import { Newspaper, ExternalLink, Tag, Search, Filter, Sparkles, Clock, TrendingUp, TrendingDown, MinusCircle } from 'lucide-react';
import { NewsItem, AssetCategory } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface NewsFeedProps {
  news: NewsItem[];
  categoryFilter: AssetCategory | 'All';
  setCategoryFilter: (cat: AssetCategory | 'All') => void;
  lastUpdated: number;
  onOpenDigest: () => void;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({
  news,
  categoryFilter,
  setCategoryFilter,
  lastUpdated,
  onOpenDigest
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative'>('all');

  const filteredNews = news.filter(item => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter || item.category === 'General';
    const matchesSearch = searchTerm.trim() === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.relatedSymbols.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSentiment = sentimentFilter === 'all' || item.sentiment === sentimentFilter;

    return matchesCategory && matchesSearch && matchesSentiment;
  });

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base font-outfit">Live Market News Feed</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                {filteredNews.length} Stories
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Aggregated RSS & Public Feeds • VADER Sentiment Tagged</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Digest Briefing Button */}
          <button
            onClick={onOpenDigest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-purple-300 border border-purple-500/40 hover:from-purple-600/40 hover:to-blue-600/40 transition text-xs font-semibold shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Digest Mode</span>
          </button>

          {/* Latency Status Badge */}
          <StatusBadge lastUpdated={lastUpdated} source="RSS Aggregator" />
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter news by asset (XAU/USD, BTC) or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
          />
        </div>

        {/* Sentiment Filter */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setSentimentFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${sentimentFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setSentimentFilter('positive')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${sentimentFilter === 'positive' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Bullish
          </button>
          <button
            onClick={() => setSentimentFilter('negative')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${sentimentFilter === 'negative' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <TrendingDown className="w-3 h-3 text-rose-400" /> Bearish
          </button>
        </div>
      </div>

      {/* News List Feed */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No news stories found matching your filter criteria.
          </div>
        ) : (
          filteredNews.map((item) => {
            const minutesAgo = Math.floor((Date.now() - item.publishedAt) / 60000);
            
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-800/40 transition-all space-y-2 group"
              >
                {/* Headline Top Metadata */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Source Tag */}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {item.source}
                    </span>

                    {/* Category */}
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.category}
                    </span>
                  </div>

                  {/* VADER Sentiment Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      item.sentiment === 'positive'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : item.sentiment === 'negative'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.sentiment === 'positive' && <TrendingUp className="w-3 h-3" />}
                      {item.sentiment === 'negative' && <TrendingDown className="w-3 h-3" />}
                      {item.sentiment === 'neutral' && <MinusCircle className="w-3 h-3" />}
                      {item.sentiment.toUpperCase()} ({item.sentimentScore > 0 ? '+' : ''}{item.sentimentScore})
                    </span>

                    <span className="text-[10px] text-slate-500 font-mono">
                      {minutesAgo < 1 ? 'Just now' : `${minutesAgo}m ago`}
                    </span>
                  </div>
                </div>

                {/* Main Headline Title */}
                <h4 className="font-semibold text-sm text-slate-100 group-hover:text-blue-400 transition leading-snug">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                    <span>{item.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition shrink-0 text-blue-400" />
                  </a>
                </h4>

                {/* Summary */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>

                {/* Related Asset Tags */}
                <div className="flex items-center gap-1.5 pt-1">
                  <Tag className="w-3 h-3 text-slate-500" />
                  {item.relatedSymbols.map((sym) => (
                    <span key={sym} className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800/80 text-blue-300 border border-slate-700/60">
                      ${sym}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
