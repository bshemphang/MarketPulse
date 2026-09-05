/**
 * Client-Side VADER-Style NLP Sentiment Analyzer
 * Evaluates financial news headlines without external paid APIs.
 */

const BULLISH_KEYWORDS: Record<string, number> = {
  surge: 2.5, surges: 2.5, surging: 2.5,
  soar: 2.5, soars: 2.5, soaring: 2.5,
  rally: 2.2, rallies: 2.2, rallying: 2.2,
  gain: 1.8, gains: 1.8, gained: 1.8, gaining: 1.8,
  bullish: 2.5, bull: 1.5, bulls: 1.5,
  breakout: 2.2, breaking: 1.2,
  record: 2.0, high: 1.5, highs: 1.8,
  growth: 1.8, growing: 1.8, grows: 1.8,
  profit: 2.0, profits: 2.0, profitable: 2.0,
  beat: 1.8, beats: 1.8, beating: 1.8,
  positive: 1.5, optimistic: 1.8, optimism: 1.8,
  inflow: 2.0, inflows: 2.0, buy: 1.2, buying: 1.5,
  adoption: 1.8, partnership: 1.5, approved: 2.2, approval: 2.2,
  stimulus: 1.8, cut: 1.2, easing: 1.8
};

const BEARISH_KEYWORDS: Record<string, number> = {
  plunge: -2.5, plunges: -2.5, plunging: -2.5,
  crash: -3.0, crashes: -3.0, crashing: -3.0,
  drop: -1.8, drops: -1.8, dropped: -1.8, dropping: -1.8,
  fall: -1.8, falls: -1.8, falling: -1.8, fell: -1.8,
  bearish: -2.5, bear: -1.5, bears: -1.5,
  dump: -2.5, dumps: -2.5, dumping: -2.5,
  decline: -1.8, declines: -1.8, declining: -1.8,
  loss: -2.0, losses: -2.0, losing: -1.8,
  fear: -2.0, panic: -2.5, selloff: -2.5, sell: -1.2, selling: -1.5,
  liquidation: -2.5, liquidations: -2.5,
  outflow: -2.0, outflows: -2.0,
  inflation: -1.5, hike: -1.5, hawkish: -1.8, recession: -2.5,
  ban: -2.2, lawsuit: -2.0, hack: -3.0, hacked: -3.0, exploit: -2.5,
  investigation: -1.8, SEC: -1.2, fine: -1.5, penalty: -1.8
};

export interface SentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number; // -1.0 to +1.0
}

export function analyzeSentiment(text: string): SentimentResult {
  if (!text) return { sentiment: 'neutral', score: 0 };

  const words = text.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
  let totalScore = 0;
  let matches = 0;

  for (const word of words) {
    if (BULLISH_KEYWORDS[word]) {
      totalScore += BULLISH_KEYWORDS[word];
      matches++;
    } else if (BEARISH_KEYWORDS[word]) {
      totalScore += BEARISH_KEYWORDS[word];
      matches++;
    }
  }

  if (matches === 0) {
    return { sentiment: 'neutral', score: 0 };
  }

  // Normalize score between -1.0 and +1.0
  const normalizedScore = Math.max(-1.0, Math.min(1.0, totalScore / (matches * 2.5)));

  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (normalizedScore > 0.15) sentiment = 'positive';
  else if (normalizedScore < -0.15) sentiment = 'negative';

  return {
    sentiment,
    score: parseFloat(normalizedScore.toFixed(2))
  };
}
