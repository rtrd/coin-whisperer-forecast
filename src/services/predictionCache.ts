export type PredictionType = "technical" | "sentiment" | "hybrid";

export interface PredictionCacheEntry<T = any> {
  data: T;
  timestamp: number;
}

function getCacheKey(
  crypto: string,
  predictionDays: number,
  type: PredictionType
): string {
  return `prediction:${type}:${crypto.toLowerCase()}:${predictionDays}`;
}

export function setPredictionCache<T>(
  type: PredictionType,
  crypto: string,
  predictionDays: number,
  data: T
): void {
  const key = getCacheKey(crypto, predictionDays, type);
  const cacheEntry: PredictionCacheEntry<T> = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheEntry));
}

/**
 * Retrieves cached prediction data if it's not older than `maxAgeMinutes`.
 * Defaults to 120 minutes (3 hours).
 */
export function getPredictionCache<T>(
  type: PredictionType,
  crypto: string,
  predictionDays: number,
  maxAgeMinutes = 180 // ⏱ Default cache lifetime is now 2 hours
): T | null {
  const key = getCacheKey(crypto, predictionDays, type);
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const parsed: PredictionCacheEntry<T> = JSON.parse(cached);
    const ageMinutes = (Date.now() - parsed.timestamp) / (1000 * 60);
    if (ageMinutes > maxAgeMinutes) {
      localStorage.removeItem(key); // Cache expired
      return null;
    }
    return parsed.data;
  } catch (err) {
    console.log("❌ Failed to parse prediction cache:", err);
    return null;
  }
}

export function clearPredictionCache(type?: PredictionType): void {
  const prefix = type ? `prediction:${type}` : "prediction:";
  Object.keys(localStorage)
    .filter((key) => key.startsWith(prefix))
    .forEach((key) => localStorage.removeItem(key));
}
