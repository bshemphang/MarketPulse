export type AssetCategory = 'Crypto' | 'Stocks' | 'Forex' | 'Metals';

export interface AssetPrice {
  symbol: string;           // e.g. "BTC", "AAPL", "EUR/USD", "XAU/USD"
  name: string;             // e.g. "Bitcoin", "Apple Inc.", "Euro / US Dollar", "Gold"
  category: AssetCategory;
  price: number;
  change24h: number;        // percentage e.g. 2.45 or -1.12
  change24hAmount: number;  // price diff e.g. 1540.20
  high24h: number;
  low24h: number;
  volume24h: number;
  sparkline: number[];      // last 24 points for mini charts
  lastUpdated: number;      // Unix timestamp in ms
  source: string;           // e.g. "Binance WS", "CoinGecko", "Twelve Data"
  isStale?: boolean;
}

export interface Candle {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type Timeframe = '1m' | '5m' | '1h' | '1d' | '1w';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;          // e.g. "CoinTelegraph", "Reuters", "Kitco"
  category: AssetCategory | 'General';
  publishedAt: number;     // Unix timestamp in ms
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;  // -1.0 to +1.0
  relatedSymbols: string[];// e.g. ["BTC", "XAU/USD"]
  isStale?: boolean;
}

export interface TechnicalIndicators {
  rsi: number;              // 0 to 100
  rsiStatus: 'Oversold' | 'Neutral' | 'Overbought';
  sma20: number;
  sma50: number;
  ema12: number;
  ema26: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  volumeSpike: boolean;     // true if volume > 2x 20-period avg
  volatility24h: number;    // % volatility score
}

export interface ConfluenceSignal {
  symbol: string;
  category: AssetCategory;
  overallScore: number;     // -5 to +5 scale
  confluenceLabel: string;  // e.g. "4 of 5 Indicators Bullish", "Neutral / Consolidating"
  sentimentScore: number;
  indicators: TechnicalIndicators;
  summaryBullets: string[];
  disclaimer: string;
  lastUpdated: number;
}

export interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  amount: number;          // quantity held
  buyPrice: number;        // avg entry price
  currentPrice: number;
  totalValue: number;
  pnl: number;             // $ profit/loss
  pnlPercent: number;      // % profit/loss
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  date: string;
  impact: 'High' | 'Medium' | 'Low';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export interface FearAndGreed {
  score: number;            // 0 to 100
  label: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  stockVixScore: number;
  stockVixLabel: string;
  lastUpdated: number;
}

export interface AlertSetting {
  id: string;
  symbol: string;
  condition: 'price_above' | 'price_below' | 'change_greater' | 'news_mention';
  targetValue: number | string;
  enabled: boolean;
}

export interface FilterPreset {
  id: string;
  name: string;
  categories: AssetCategory[];
  keyword?: string;
  minSentiment?: number;
}

export type ViewMode = 'dashboard' | 'news' | 'charts' | 'digest' | 'portfolio' | 'trading';

// --- Spec v1.1 DEX Trading Types ---

export interface ChainConfig {
  id: string;
  name: string;
  chainId: number;
  type: 'evm' | 'solana';
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrl: string;
  explorerUrl: string;
  isLowFee: boolean;
  avgGasFee: string;
  gasWarning?: string;
  icon: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  chainType: 'evm' | 'solana' | null;
  walletName: string | null;
  balance: string;
  nativeSymbol: string;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  priceUsd: number;
}

export interface SwapQuote {
  payToken: TokenInfo;
  receiveToken: TokenInfo;
  payAmount: string;
  receiveAmount: string;
  exchangeRate: number;
  priceImpactPercent: number; // e.g. 0.15% or 4.5%
  estimatedGasUsd: number;
  route: string[];             // e.g. ["OKX DEX Aggregator", "Uniswap V3", "Raydium"]
  aggregatorName: string;      // e.g. "OKX DEX Aggregator API"
}

export interface GoPlusSecurityReport {
  tokenAddress: string;
  tokenName: string;
  isHoneypot: boolean;
  isMintable: boolean;
  buyTax: number;             // percentage
  sellTax: number;            // percentage
  isOpenSource: boolean;
  isSafe: boolean;
  riskSummary: string[];
}
