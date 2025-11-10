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
    console.log(
      `Successfully fetched ${priceData.length} data points for ${crypto}`
    );
    return Array.isArray(priceData) ? priceData : [];
  } catch (error) {
    console.error("Error fetching from CoinGecko proxy:", error);
    return [];
  }
};
