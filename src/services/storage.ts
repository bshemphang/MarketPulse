import { AssetPrice, NewsItem, PortfolioItem, AlertSetting, FilterPreset } from '../types';

const STORAGE_KEYS = {
  WATCHLIST: 'lmn_watchlist',
  PORTFOLIO: 'lmn_portfolio',
  ALERTS: 'lmn_alerts',
  PRESETS: 'lmn_presets',
  CACHED_PRICES: 'lmn_cached_prices',
  CACHED_NEWS: 'lmn_cached_news',
  THEME: 'lmn_theme',
  LANG: 'lmn_lang'
};

// Default initial watchlists
const DEFAULT_WATCHLIST = ['BTC', 'ETH', 'SOL', 'AAPL', 'NVDA', 'EUR/USD', 'XAU/USD', 'XAG/USD'];

export class StorageService {
  // Watchlist
  public static getWatchlist(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return data ? JSON.parse(data) : DEFAULT_WATCHLIST;
    } catch {
      return DEFAULT_WATCHLIST;
    }
  }

  public static setWatchlist(list: string[]): void {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(list));
  }

  public static toggleWatchlist(symbol: string): string[] {
    const list = this.getWatchlist();
    const index = list.indexOf(symbol);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(symbol);
    }
    this.setWatchlist(list);
    return list;
  }

  // Portfolio
  public static getPortfolio(): PortfolioItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
      if (data) return JSON.parse(data);
      
      // Default demo portfolio
      return [
        { id: '1', symbol: 'BTC', name: 'Bitcoin', category: 'Crypto', amount: 0.25, buyPrice: 85000, currentPrice: 94250, totalValue: 23562.5, pnl: 2312.5, pnlPercent: 10.88 },
        { id: '2', symbol: 'NVDA', name: 'NVIDIA Corp', category: 'Stocks', amount: 15, buyPrice: 120, currentPrice: 138.5, totalValue: 2077.5, pnl: 277.5, pnlPercent: 15.42 },
        { id: '3', symbol: 'XAU/USD', name: 'Gold (Ounce)', category: 'Metals', amount: 3.5, buyPrice: 2650, currentPrice: 2895.4, totalValue: 10133.9, pnl: 858.9, pnlPercent: 9.26 }
      ];
    } catch {
      return [];
    }
  }

  public static savePortfolio(items: PortfolioItem[]): void {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(items));
  }

  // Price & News Cache
  public static cachePrices(prices: AssetPrice[]): void {
    localStorage.setItem(STORAGE_KEYS.CACHED_PRICES, JSON.stringify({
      timestamp: Date.now(),
      prices
    }));
  }

  public static getCachedPrices(): { timestamp: number; prices: AssetPrice[] } | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_PRICES);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public static cacheNews(news: NewsItem[]): void {
    localStorage.setItem(STORAGE_KEYS.CACHED_NEWS, JSON.stringify({
      timestamp: Date.now(),
      news
    }));
  }

  public static getCachedNews(): { timestamp: number; news: NewsItem[] } | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_NEWS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Alerts
  public static getAlerts(): AlertSetting[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveAlerts(alerts: AlertSetting[]): void {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }
}
