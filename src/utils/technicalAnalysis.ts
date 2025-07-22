export const linearRegression = (data: { x: number; y: number }[]) => {
  const n = data.length;
  const sumX = data.reduce((sum, point) => sum + point.x, 0);
  const sumY = data.reduce((sum, point) => sum + point.y, 0);
  const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

export const calculateMovingAverage = (
  prices: number[],
  period: number
): number[] => {
  const ma: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    ma.push(sum / period);
  }
  return ma;
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

export const calculateVolatility = (prices: number[]): number => {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) /
    returns.length;

  return Math.sqrt(variance);
};
const calculateEMAList = (prices: number[], period: number): number[] => {
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
// Scale normalized values to 0.2 to 0.8 (20% to 80%)
const scaleStrength = (raw: number): number => {
  const clamped = Math.min(Math.max(raw, 0), 1); // 0 to 1
  return 0.2 + clamped * 0.6; // maps 0 to 0.2, 1 to 0.8
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
