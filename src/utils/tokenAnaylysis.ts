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
    return priceData.data;
  } catch (error) {
    console.error("Error fetching from secure proxy:", error);
  }
};
