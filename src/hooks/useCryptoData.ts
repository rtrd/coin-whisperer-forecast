import { useQuery } from "@tanstack/react-query";

interface PriceData {
  timestamp: number;
  price: number;
  volume?: number;
}
const API_KEY = import.meta.env.VITE_LUNAR_API;

// Seeded random for deterministic mock data
function seededRandom(seed: string) {
  const m = 2**31 - 1;
  const a = 48271;
  let state = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % m;
  return () => {
    state = (a * state) % m;
    return state / m;
  };
}

const fetchCryptoData = async (
  crypto: string,
  timeframe: string,
  AllCryptosData: []
): Promise<PriceData[]> => {
  // Map timeframes to days parameter
  const daysMap: { [key: string]: number } = {
    "1d": 1,
    "7d": 7,
    "30d": 30,
    "3m": 90,
    "90d": 90,
  };
  const days = daysMap[timeframe] || 90;
  
  try {
    // Use CoinGecko proxy for technical analysis data
    const response = await fetch('/functions/v1/coingecko-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'market-chart',
        crypto: crypto,
        timeframe: timeframe,
        days: days,
      }),
    });

    if (!response.ok) {
      throw new Error(`CoinGecko proxy error: ${response.status}`);
    }

    const priceData = await response.json();
    // Data is already in the correct format from the proxy
    const data: PriceData[] = Array.isArray(priceData) ? priceData : [];
    const hasValidPrice = data.some(
      (d) => typeof d.price === "number" && !isNaN(d.price)
    );

    if (!hasValidPrice) {
      console.warn('No valid price data received from API');
      return generateMockData(crypto, timeframe, AllCryptosData);
    }
    return data;
  } catch (error) {
    console.error("Error fetching from CoinGecko proxy:", error);
    // Use deterministic mock data as fallback
    console.warn('Using deterministic fallback mock data due to API failure');
    return generateMockData(crypto, timeframe, AllCryptosData);
  }
};

const generateMockData = (
  crypto: string,
  timeframe: string,
  AllCryptosData: any[]
): PriceData[] => {
  // Create deterministic seed from crypto + timeframe + current date
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const seed = `${crypto}|${timeframe}|${today}`;
  const random = seededRandom(seed);
  
  const now = new Date();
  now.setHours(0, 0, 0, 0); // normalize to midnight

  // Map timeframe to days
  const daysMap: { [key: string]: number } = {
    "1d": 1,
    "7d": 7,
    "1w": 7,
    "30d": 30,
    "1m": 30,
    "90d": 90,
    "3m": 90,
  };
  const days = daysMap[timeframe] || 90;

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

    const change = (random() - 0.5) * volatility;
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
      trend = (random() - 0.5) * 0.0005;
    }

    currentPrice *= 1 + trend;

    data.push({
      timestamp,
      price: Math.max(currentPrice, 0.0000001),
      volume:
        random() *
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
    staleTime: 600000, // 10 minutes
    refetchInterval: false, // Don't auto-refetch
  });
};
