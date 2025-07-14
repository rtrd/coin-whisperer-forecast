import { useQuery } from "@tanstack/react-query";

interface PriceData {
  timestamp: number;
  price: number;
  volume?: number;
}
const API_KEY = import.meta.env.VITE_LUNAR_API;

const fetchCryptoData = async (
  crypto: string,
  timeframe: string,
  AllCryptosData: []
): Promise<PriceData[]> => {
  console.log(`Fetching real ${crypto} data for ${timeframe}`);
  debugger;
  try {
    // Use Supabase Edge Function instead of direct API call
    const response = await fetch(
      `https://lunarcrush.com/api4/public/coins/${crypto}/time-series/v2?bucket=day&interval=1m`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Proxy API error: ${response.status}`);
    }

    const priceData = await response.json();
    console.log(
      `Successfully fetched ${priceData.length} data points for ${crypto}`
    );
    const data: PriceData[] = [];
    data.push(
      ...priceData.data.map((item: any) => ({
        timestamp: item.time,
        price: item.close,
        volume: item.volume_24h,
      }))
    );
    debugger;
    const hasValidPrice = data.some(
      (d) => typeof d.price === "number" && !isNaN(d.price)
    );

    if (!hasValidPrice) {
      return generateMockData(crypto, timeframe, AllCryptosData);
    }
    return data;
  } catch (error) {
    console.error("Error fetching from secure proxy:", error);

    // Fallback to mock data if proxy fails
    return generateMockData(crypto, timeframe, AllCryptosData);
  }
};

const generateMockData = (
  crypto: string,
  timeframe: string,
  AllCryptosData: []
): PriceData[] => {
  debugger;
  const now = Date.now();
  const days =
    timeframe === "1d"
      ? 1
      : timeframe === "7d"
      ? 7
      : timeframe === "30d"
      ? 30
      : 90;
  const intervals = days === 1 ? 24 : days * 4;
  const basePrices: { [key: string]: number } = {};

  AllCryptosData.forEach((token) => {
    const { id, current_price } = token;
    if (typeof current_price === "number" && !isNaN(current_price)) {
      basePrices[id] = current_price;
    }
  });
  const basePrice = basePrices[crypto] || 1.0;
  const data: PriceData[] = [];
  let currentPrice = basePrice;

  for (let i = intervals; i >= 0; i--) {
    const timestamp = now - i * (days === 1 ? 3600000 : 21600000);

    let volatility = 0.02;

    if (
      crypto.includes("shiba") ||
      crypto.includes("pepe") ||
      crypto.includes("bonk") ||
      crypto.includes("floki")
    ) {
      volatility = 0.08;
    } else if (
      crypto.includes("tether") ||
      crypto.includes("usd-coin") ||
      crypto.includes("dai")
    ) {
      volatility = 0.001;
    } else if (crypto === "bitcoin" || crypto === "ethereum") {
      volatility = 0.015;
    }

    const change = (Math.random() - 0.5) * volatility;
    currentPrice = currentPrice * (1 + change);

    let trend = 0.0001;
    if (
      crypto.includes("ai") ||
      crypto.includes("fetch") ||
      crypto.includes("singularity") ||
      crypto.includes("render")
    ) {
      trend = 0.0003;
    } else if (
      crypto.includes("meme") ||
      crypto.includes("doge") ||
      crypto.includes("shib") ||
      crypto.includes("pepe")
    ) {
      trend = (Math.random() - 0.5) * 0.0005;
    }

    currentPrice = currentPrice * (1 + trend);

    data.push({
      timestamp,
      price: Math.max(currentPrice, 0.0000001),
      volume:
        Math.random() *
        (basePrice > 100
          ? 100000000
          : basePrice > 1
          ? 1000000000
          : 10000000000),
    });
  }

  return data;
};

export const useCryptoData = (
  crypto: string,
  timeframe: string,
  AllCryptosData: []
) => {
  return useQuery({
    queryKey: ["crypto-data", crypto, timeframe],
    queryFn: () => fetchCryptoData(crypto, timeframe, AllCryptosData),
    // staleTime: 60000,
    // refetchInterval: 30000,
  });
};
