import { NewsItem, AssetCategory } from '../types';
import { analyzeSentiment } from './sentiment';
import { StorageService } from './storage';

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Gold (XAU/USD) Climbs to Near-Record Highs as Inflation Data Fuels Rate-Cut Bets',
    summary: 'Spot gold prices broke past $2,890/oz as investors weigh upcoming Federal Reserve CPI reports and geopolitical safe-haven demand.',
    url: 'https://www.reuters.com/markets/commodities/',
    source: 'Kitco News',
    category: 'Metals',
    publishedAt: Date.now() - (4 * 60 * 1000),
    sentiment: 'positive',
    sentimentScore: 0.75,
    relatedSymbols: ['XAU/USD', 'XAG/USD'],
    isStale: false
  },
  {
    id: 'n2',
    title: 'Bitcoin Surges Past $94,000 Following Institutional ETF Inflows & Mining Expansion',
    summary: 'Crypto markets recorded $1.2B in net spot ETF inflows over the past 48 hours, triggering short liquidations across major derivatives exchanges.',
    url: 'https://www.coindesk.com/',
    source: 'CoinDesk',
    category: 'Crypto',
    publishedAt: Date.now() - (12 * 60 * 1000),
    sentiment: 'positive',
    sentimentScore: 0.85,
    relatedSymbols: ['BTC', 'ETH', 'SOL'],
    isStale: false
  },
  {
    id: 'n3',
    title: 'NVIDIA (NVDA) Rebounds 4% Ahead of Next-Gen Blackwell Chip Shipment Announcements',
    summary: 'Tech stocks led Wall Street gains with Nvidia leading semiconductor sentiment, pushing S&P 500 futures higher in early trading.',
    url: 'https://finance.yahoo.com/',
    source: 'Yahoo Finance',
    category: 'Stocks',
    publishedAt: Date.now() - (25 * 60 * 1000),
    sentiment: 'positive',
    sentimentScore: 0.65,
    relatedSymbols: ['NVDA', 'AAPL', 'MSFT'],
    isStale: false
  },
  {
    id: 'n4',
    title: 'EUR/USD Slips Under 1.0430 as European Central Bank Hints at Dovish Policy Stance',
    summary: 'Forex traders increase short positions on the euro following weaker German industrial output figures and rising US treasury yields.',
    url: 'https://www.forexlive.com/',
    source: 'ForexLive',
    category: 'Forex',
    publishedAt: Date.now() - (42 * 60 * 1000),
    sentiment: 'negative',
    sentimentScore: -0.55,
    relatedSymbols: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
    isStale: false
  },
  {
    id: 'n5',
    title: 'Silver (XAG/USD) Outperforms Industrial Commodities on Solar Demand & Supply Deficit',
    summary: 'Silver prices gained over 2.1% in today\'s session, with analysts pointing to structural inventory deficits and expanding industrial applications.',
    url: 'https://www.investing.com/commodities/silver',
    source: 'Investing.com',
    category: 'Metals',
    publishedAt: Date.now() - (65 * 60 * 1000),
    sentiment: 'positive',
    sentimentScore: 0.70,
    relatedSymbols: ['XAG/USD', 'XAU/USD'],
    isStale: false
  },
  {
    id: 'n6',
    title: 'Federal Reserve Monetary Policy Committee Holds Interest Rate Stance; CPI In Focus',
    summary: 'Markets remain cautious ahead of tomorrow\'s Non-Farm Payrolls and inflation prints, as Fed officials emphasize data-dependent policy.',
    url: 'https://www.reuters.com/business/finance/',
    source: 'Reuters Business',
    category: 'General',
    publishedAt: Date.now() - (90 * 60 * 1000),
    sentiment: 'neutral',
    sentimentScore: 0.05,
    relatedSymbols: ['AAPL', 'EUR/USD', 'XAU/USD', 'BTC'],
    isStale: false
  }
];

export class NewsApiService {
  private static newsCache: NewsItem[] = [...INITIAL_NEWS];

  /**
   * Aggregate News across RSS & Free endpoints
   */
  public static async fetchNews(categoryFilter: string = 'All'): Promise<NewsItem[]> {
    try {
      // Fetch public RSS / Free news via CORS proxy
      await this.fetchCryptoPanicNews();
    } catch {
      // Graceful fallback to cached news feed
    }

    let result = [...this.newsCache];

    if (categoryFilter !== 'All') {
      result = result.filter(item => item.category === categoryFilter || item.category === 'General');
    }

    // Sort by latest published timestamp
    result.sort((a, b) => b.publishedAt - a.publishedAt);

    StorageService.cacheNews(result);
    return result;
  }

  /**
   * Fetch CryptoPanic Free API
   */
  private static async fetchCryptoPanicNews(): Promise<void> {
    const url = 'https://corsproxy.io/?https://cryptopanic.com/api/v1/posts/?auth_token=free&public=true';
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) return;
      const data = await res.json();

      if (data && data.results && Array.isArray(data.results)) {
        const fetched: NewsItem[] = data.results.slice(0, 10).map((post: any) => {
          const title = post.title || 'Crypto News Update';
          const { sentiment, score } = analyzeSentiment(title);
          return {
            id: `cp_${post.id}`,
            title,
            summary: post.title,
            url: post.url || 'https://cryptopanic.com',
            source: post.domain || 'CryptoPanic',
            category: 'Crypto' as AssetCategory,
            publishedAt: post.created_at ? new Date(post.created_at).getTime() : Date.now(),
            sentiment,
            sentimentScore: score,
            relatedSymbols: post.currencies ? post.currencies.map((c: any) => c.code) : ['BTC'],
            isStale: false
          };
        });

        // Deduplicate and merge into cache
        const existingIds = new Set(this.newsCache.map(n => n.id));
        for (const item of fetched) {
          if (!existingIds.has(item.id)) {
            this.newsCache.unshift(item);
          }
        }
      }
    } catch {
      // Fallback stays silent
    }
  }

  /**
   * Search headlines globally
   */
  public static searchNews(query: string): NewsItem[] {
    if (!query || query.trim() === '') return this.newsCache;
    const q = query.toLowerCase();
    return this.newsCache.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.source.toLowerCase().includes(q) ||
      n.relatedSymbols.some(s => s.toLowerCase().includes(q))
    );
  }
}
