
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { crypto, timeframe, endpoint, network, contractAddress } = await req.json()
    
    // Get API key from Supabase secrets
    const COINGECKO_API_KEY = Deno.env.get('COINGECKO_API_KEY')
    
    if (!COINGECKO_API_KEY) {
      throw new Error('CoinGecko API key not configured')
    }

    let responseData;

    // Handle different endpoint types
    if (endpoint === 'holders' && network && contractAddress) {
      // Fetch current holders
      const holdersResponse = await fetch(
        `https://pro-api.coingecko.com/api/v3/onchain/networks/${network}/tokens/${contractAddress}`,
        {
          headers: {
            'X-CG-Pro-API-Key': COINGECKO_API_KEY,
          },
        }
      );

      if (!holdersResponse.ok) {
        throw new Error(`CoinGecko API error: ${holdersResponse.status}`);
      }

      const holdersData = await holdersResponse.json();
      
      // Fetch 24h ago data for growth calculation
      const yesterday = Math.floor((Date.now() - 86400000) / 1000);
      const chartResponse = await fetch(
        `https://pro-api.coingecko.com/api/v3/onchain/networks/${network}/tokens/${contractAddress}/holders_chart?from=${yesterday}`,
        {
          headers: {
            'X-CG-Pro-API-Key': COINGECKO_API_KEY,
          },
        }
      );

      const chartData = chartResponse.ok ? await chartResponse.json() : null;
      const holders24hAgo = chartData?.data?.[0]?.value || holdersData.data?.attributes?.total_holders;

      responseData = {
        total_holders: holdersData.data?.attributes?.total_holders || 0,
        holders_24h_ago: holders24hAgo || 0
      };
    } else if (endpoint === 'top-holders' && network && contractAddress) {
      // Fetch top holders
      const response = await fetch(
        `https://pro-api.coingecko.com/api/v3/onchain/networks/${network}/tokens/${contractAddress}/top_holders`,
        {
          headers: {
            'X-CG-Pro-API-Key': COINGECKO_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      responseData = await response.json();
    } else {
      // Default: price chart data
      const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      
      const response = await fetch(
        `https://pro-api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=${days}&interval=${days === 1 ? 'hourly' : 'daily'}`,
        {
          headers: {
            'X-CG-Pro-API-Key': COINGECKO_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform CoinGecko data to our format
      responseData = data.prices.map((price: [number, number], index: number) => ({
        timestamp: price[0],
        price: price[1],
        volume: data.total_volumes?.[index]?.[1] || 0
      }));
    }

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in coingecko-proxy:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
