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
  if (timeframe === "7d") {
    timeframe = "1w";
  }
  if (timeframe === "30d") {
    timeframe = "1m";
  } else if (timeframe === "90d") {
    timeframe = "3m";
  }
  try {
    // Use Supabase Edge Function instead of direct API call
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
  AllCryptosData: any[]
): PriceData[] => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // normalize to midnight

  // Normalize timeframe
  const normalizedTimeframe =
    timeframe === "7d"
      ? "1w"
      : timeframe === "30d"
      ? "1m"
      : timeframe === "90d"
      ? "3m"
      : timeframe;

  const days =
    normalizedTimeframe === "1d"
      ? 1
      : normalizedTimeframe === "1w"
      ? 7
      : normalizedTimeframe === "1m"
      ? 30
      : 90;

  const pointsPerDay = days === 1 ? 24 : 1;
  const totalPoints = days * pointsPerDay;

  const intervalSec = (24 * 60 * 60) / pointsPerDay; // seconds between points
  const nowSec = Math.floor(now.getTime() / 1000); // now in seconds

  // Get base price
  const basePrices: { [key: string]: number } = {};
  AllCryptosData.forEach((token) => {
    const { id, current_price } = token;
    if (typeof current_price === "number" && !isNaN(current_price)) {
      basePrices[id] = current_price;
    }
  });

  const basePrice = basePrices[crypto] || 1.0;
  let currentPrice = basePrice;
  const data: PriceData[] = [];

  for (let i = 0; i < totalPoints; i++) {
    const timestamp = nowSec - (totalPoints - 1 - i) * intervalSec;

    // Volatility logic
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
    currentPrice *= 1 + change;

    // Trend logic
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

    currentPrice *= 1 + trend;

    data.push({
      timestamp,
      price: Math.max(currentPrice, 0.0000001),
      volume:
        Math.random() *
        (basePrice > 100
          ? 100_000_000
          : basePrice > 1
          ? 1_000_000_000
          : 10_000_000_000),
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
