import { TechnicalIndicators, ConfluenceSignal, AssetCategory } from '../types';

/**
 * Calculates Technical Indicators on price series array
 */
export function calculateIndicators(prices: number[], volumes?: number[]): TechnicalIndicators {
  if (prices.length < 2) {
    return {
      rsi: 50,
      rsiStatus: 'Neutral',
      sma20: prices[0] || 0,
      sma50: prices[0] || 0,
      ema12: prices[0] || 0,
      ema26: prices[0] || 0,
      macd: { macdLine: 0, signalLine: 0, histogram: 0 },
      volumeSpike: false,
      volatility24h: 1.2
    };
  }

  // 1. Calculate RSI (14)
  const period = Math.min(14, prices.length - 1);
  let gains = 0;
  let losses = 0;

  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const rsi = Math.round(100 - (100 / (1 + rs)));

  let rsiStatus: 'Oversold' | 'Neutral' | 'Overbought' = 'Neutral';
  if (rsi <= 30) rsiStatus = 'Oversold';
  else if (rsi >= 70) rsiStatus = 'Overbought';

  // 2. Simple Moving Averages (SMA)
  const calculateSMA = (n: number) => {
    const slice = prices.slice(-n);
    const sum = slice.reduce((a, b) => a + b, 0);
    return sum / slice.length;
  };

  const sma20 = parseFloat(calculateSMA(Math.min(20, prices.length)).toFixed(4));
  const sma50 = parseFloat(calculateSMA(Math.min(50, prices.length)).toFixed(4));

  // 3. Exponential Moving Averages (EMA)
  const calculateEMA = (n: number) => {
    const k = 2 / (n + 1);
    let ema = prices[0];
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * k) + (ema * (1 - k));
    }
    return ema;
  };

  const ema12 = parseFloat(calculateEMA(Math.min(12, prices.length)).toFixed(4));
  const ema26 = parseFloat(calculateEMA(Math.min(26, prices.length)).toFixed(4));

  // 4. MACD
  const macdLine = parseFloat((ema12 - ema26).toFixed(4));
  const signalLine = parseFloat((macdLine * 0.8).toFixed(4)); // Approximation for signal line
  const histogram = parseFloat((macdLine - signalLine).toFixed(4));

  // 5. Volume Spike
  let volumeSpike = false;
  if (volumes && volumes.length >= 5) {
    const recentVol = volumes[volumes.length - 1];
    const avgVol = volumes.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, volumes.length);
    volumeSpike = recentVol > (avgVol * 1.8);
  }

  // 6. Volatility 24h
  const highest = Math.max(...prices);
  const lowest = Math.min(...prices);
  const volatility24h = parseFloat((((highest - lowest) / lowest) * 100).toFixed(2));

  return {
    rsi,
    rsiStatus,
    sma20,
    sma50,
    ema12,
    ema26,
    macd: { macdLine, signalLine, histogram },
    volumeSpike,
    volatility24h
  };
}

/**
 * Generates Confluence Signal ("3 of 5 Indicators Bullish")
 */
export function generateConfluenceSignal(
  symbol: string,
  category: AssetCategory,
  currentPrice: number,
  prices: number[],
  sentimentScore: number = 0
): ConfluenceSignal {
  const indicators = calculateIndicators(prices);

  let bullishCount = 0;
  let bearishCount = 0;
  const summaryBullets: string[] = [];

  // Indicator 1: RSI
  if (indicators.rsi < 35) {
    bullishCount++;
    summaryBullets.push(`RSI is oversold (${indicators.rsi}) - Potential rebound area`);
  } else if (indicators.rsi > 65) {
    bearishCount++;
    summaryBullets.push(`RSI is overbought (${indicators.rsi}) - Potential resistance area`);
  } else {
    summaryBullets.push(`RSI is in neutral range (${indicators.rsi})`);
  }

  // Indicator 2: Price vs SMA20
  if (currentPrice > indicators.sma20) {
    bullishCount++;
    summaryBullets.push(`Price ($${currentPrice.toLocaleString()}) is trading ABOVE SMA-20 ($${indicators.sma20.toLocaleString()})`);
  } else {
    bearishCount++;
    summaryBullets.push(`Price ($${currentPrice.toLocaleString()}) is trading BELOW SMA-20 ($${indicators.sma20.toLocaleString()})`);
  }

  // Indicator 3: EMA Crossover (EMA12 vs EMA26)
  if (indicators.ema12 > indicators.ema26) {
    bullishCount++;
    summaryBullets.push(`EMA-12 > EMA-26 (Bullish momentum alignment)`);
  } else {
    bearishCount++;
    summaryBullets.push(`EMA-12 < EMA-26 (Bearish momentum alignment)`);
  }

  // Indicator 4: MACD Histogram
  if (indicators.macd.histogram > 0) {
    bullishCount++;
    summaryBullets.push(`MACD histogram positive (+${indicators.macd.histogram})`);
  } else {
    bearishCount++;
    summaryBullets.push(`MACD histogram negative (${indicators.macd.histogram})`);
  }

  // Indicator 5: Headline Sentiment
  if (sentimentScore > 0.15) {
    bullishCount++;
    summaryBullets.push(`Headline sentiment is positive (+${sentimentScore})`);
  } else if (sentimentScore < -0.15) {
    bearishCount++;
    summaryBullets.push(`Headline sentiment is negative (${sentimentScore})`);
  } else {
    summaryBullets.push(`Headline sentiment is neutral`);
  }

  // Label Confluence
  let confluenceLabel = `${bullishCount} of 5 Indicators Bullish`;
  if (bullishCount === 2 || bullishCount === 3) {
    confluenceLabel = `Neutral / Consolidating (${bullishCount} Bullish, ${bearishCount} Bearish)`;
  } else if (bearishCount >= 4) {
    confluenceLabel = `${bearishCount} of 5 Indicators Bearish`;
  }

  const overallScore = bullishCount - bearishCount;

  return {
    symbol,
    category,
    overallScore,
    confluenceLabel,
    sentimentScore,
    indicators,
    summaryBullets,
    disclaimer: "Decision support indicator only. Not financial advice.",
    lastUpdated: Date.now()
  };
}
