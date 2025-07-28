// Technical Analysis Indicators Utilities
export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: "buy" | "sell" | "neutral";
  strength: number;
}

// Scale normalized values to 0.2 to 0.8 (20% to 80%)
export const scaleStrength = (raw: number): number => {
  const clamped = Math.min(Math.max(raw, 0), 1); // 0 to 1
  return 0.2 + clamped * 0.6; // maps 0 to 0.2, 1 to 0.8
};

export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / avgLoss;

  return 100 - 100 / (1 + rs);
};

export const calculateRSIStrength = (rsi: number): number => {
  let raw = 0;

  if (rsi < 50) {
    // Closer to 30 or below → stronger buy signal
    raw = (30 - rsi) / 30;
  } else {
    // Closer to 70 or above → stronger sell signal
    raw = (rsi - 70) / 30;
  }

  // Only keep positive values, cap at 1
  raw = Math.max(0, Math.min(raw, 1));

  return scaleStrength(raw); // Scale to 20%–80%
};

export const calculateSMA = (prices: number[], period: number): number => {
  if (prices.length < period)
    return prices.reduce((a, b) => a + b, 0) / prices.length;
  const recent = prices.slice(-period);
  return recent.reduce((a, b) => a + b, 0) / period;
};

export const calculateSMAStrength = (prices: number[], period: number) => {
  const sma = calculateSMA(prices, period);
  const currentPrice = prices.at(-1) ?? 0;
  const deviation = Math.abs(currentPrice - sma) / Math.max(sma, 1);

  return { sma, strength: scaleStrength(deviation) };
};

export const calculateEMAList = (prices: number[], period: number): number[] => {
  const multiplier = 2 / (period + 1);
  const emaArray: number[] = [];
  let ema = prices[0];

  prices.forEach((price, i) => {
    if (i === 0) {
      emaArray.push(ema);
    } else {
      ema = price * multiplier + ema * (1 - multiplier);
      emaArray.push(ema);
    }
  });

  return emaArray;
};

export const calculateMACD = (prices: number[]) => {
  const ema12 = calculateEMAList(prices, 12);
  const ema26 = calculateEMAList(prices, 26);
  const macdLine = ema12.map((val, idx) => val - (ema26[idx] ?? 0));
  const signalLine = calculateEMAList(macdLine, 9);

  const latestMACD = macdLine.at(-1) ?? 0;
  const latestSignal = signalLine.at(-1) ?? 0;

  const diff = latestMACD - latestSignal;

  // Normalize using signal crossover momentum
  const rawStrength = Math.abs(diff) / Math.max(Math.abs(latestSignal), 1);
  const scaled = scaleStrength(rawStrength);

  return { macd: latestMACD, signal: latestSignal, strength: scaled };
};

export const calculateSupportResistance = (prices: number[]) => {
  const recentWindow = Math.min(20, prices.length);
  const recentPrices = prices.slice(-recentWindow);
  const supportLevel = Math.min(...recentPrices);
  const resistanceLevel = Math.max(...recentPrices);
  
  return { supportLevel, resistanceLevel };
};

export const generateTechnicalIndicators = (prices: number[]): TechnicalIndicator[] => {
  const currentPrice = prices[prices.length - 1];
  
  // Calculate indicators
  const rsi = calculateRSI(prices);
  const { sma: sma20, strength: sma20Strength } = calculateSMAStrength(prices, 20);
  const { sma: sma50, strength: sma50Strength } = calculateSMAStrength(prices, 50);
  const { macd, signal, strength: macdStrength } = calculateMACD(prices);

  return [
    {
      name: "RSI (14)",
      value: rsi,
      signal: rsi > 70 ? "sell" : rsi < 30 ? "buy" : "neutral",
      strength: calculateRSIStrength(rsi),
    },
    {
      name: "SMA 20",
      value: sma20,
      signal: currentPrice > sma20 ? "buy" : currentPrice < sma20 ? "sell" : "neutral",
      strength: sma20Strength,
    },
    {
      name: "SMA 50",
      value: sma50,
      signal: currentPrice > sma50 ? "buy" : currentPrice < sma50 ? "sell" : "neutral",
      strength: sma50Strength,
    },
    {
      name: "MACD",
      value: macd,
      signal: macd > signal ? "buy" : macd < signal ? "sell" : "neutral",
      strength: macdStrength,
    },
  ];
};

export const calculateOverallSignal = (indicators: TechnicalIndicator[]) => {
  const totalStrength = indicators.reduce((sum, ind) => sum + ind.strength, 0);

  const overallSignal = indicators.reduce((acc, ind) => {
    if (ind.signal === "buy") return acc + ind.strength;
    if (ind.signal === "sell") return acc - ind.strength;
    return acc;
  }, 0) / Math.max(totalStrength, 1);

  const overallTrend = overallSignal > 0.1 ? "buy" : overallSignal < -0.1 ? "sell" : "neutral";

  return { overallSignal, overallTrend };
};
