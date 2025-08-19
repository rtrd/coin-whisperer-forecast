interface PriceData {
  [x: string]: any;
  timestamp: number;
  price: number;
  volume?: number;
}
const API_KEY = import.meta.env.VITE_LUNAR_API;

export const fetchCryptoData = async (
  crypto: string,
  timeframe: string
): Promise<PriceData[]> => {
  console.log(`Fetching real ${crypto} data for ${timeframe}`);

  // Map timeframe to CoinGecko 'days' param
  const timeframeToDays: Record<string, number> = {
    "1w": 7,
    "30d": 30,
    "1m": 30,
    "3m": 90,
    "6m": 180,
    "1y": 365,
    "max": 1825, // ~5 years
  };
  const days =
    timeframeToDays[timeframe] ||
    (/^\d+d$/.test(timeframe) ? parseInt(timeframe) : 30);

  // Try LunarCrush if API key exists; otherwise fall back to CoinGecko
  if (API_KEY) {
    try {
      const response = await fetch(
        `https://lunarcrush.com/api4/public/coins/${crypto}/time-series/v2?bucket=day&interval=${timeframe}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`LunarCrush API error: ${response.status}`);
      }
      const lc = await response.json();
      const lcData = (lc?.data || []).map((d: any) => ({
        timestamp: d.timestamp || d.time || d[0] || Date.now(),
        price: d.price ?? d.close ?? d.value ?? d[1],
        volume: d.volume ?? d.vol,
      }));
      if (lcData.length > 0) {
        console.log(`Successfully fetched ${lcData.length} LC points for ${crypto}`);
        return lcData as PriceData[];
      }
    } catch (error) {
      console.warn("LunarCrush failed or unauthorized, using CoinGecko fallback:", error);
    }
  } else {
    console.warn("VITE_LUNAR_API missing; using CoinGecko fallback in preview/development.");
  }

  // CoinGecko fallback
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
      crypto
    )}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) {
      throw new Error(`CoinGecko market_chart error: ${res.status}`);
    }
    const data = await res.json();
    const prices: [number, number][] = data?.prices || [];
    const volumes: [number, number][] = data?.total_volumes || [];
    const volumeMap = new Map<number, number>(volumes.map(([t, v]) => [t, v]));

    const mapped: PriceData[] = prices.map(([timestamp, price]) => ({
      timestamp,
      price,
      volume: volumeMap.get(timestamp),
    }));
    console.log(`Fetched ${mapped.length} CG points for ${crypto}`);
    return mapped;
  } catch (error) {
    console.error("Error fetching fallback market chart:", error);
    return [];
  }
};
