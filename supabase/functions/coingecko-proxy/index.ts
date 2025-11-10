
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
    const { crypto, timeframe, endpoint, network, contractAddress, days } = await req.json()
    
    // Get API key from Supabase secrets
    const COINGECKO_API_KEY = Deno.env.get('COINGECKO_API_KEY')
    
    if (!COINGECKO_API_KEY) {
      throw new Error('CoinGecko API key not configured')
    }

    let responseData;

    // Handle different endpoint types
    if (endpoint === 'market-chart') {
      // Price and volume data for technical analysis
      const daysParam = days || (timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90);
      const interval = daysParam === 1 ? 'hourly' : 'daily';
      
      const response = await fetch(
        `https://pro-api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=${daysParam}&interval=${interval}`,
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
      
      // Transform to our format with timestamp in seconds
      responseData = data.prices.map((price: [number, number], index: number) => ({
        timestamp: Math.floor(price[0] / 1000), // Convert ms to seconds
        price: price[1],
        volume: data.total_volumes?.[index]?.[1] || 0
      }));
    } else if (endpoint === 'holders' && network && contractAddress) {
      // Fetch token info which includes holder count and distribution
      const infoResponse = await fetch(
        `https://pro-api.coingecko.com/api/v3/onchain/networks/${network}/tokens/${contractAddress}/info`,
        {
          headers: {
            'x-cg-pro-api-key': COINGECKO_API_KEY,
          },
        }
      );

      if (!infoResponse.ok) {
        throw new Error(`CoinGecko API error: ${infoResponse.status}`);
      }

      const infoData = await infoResponse.json();
      const currentHolders = infoData.data?.attributes?.holders?.count || 0;

      // Fetch historical data for 24h growth calculation
      const chartResponse = await fetch(
        `https://pro-api.coingecko.com/api/v3/onchain/networks/${network}/tokens/${contractAddress}/token_holders_chart?before_timestamp=${Math.floor(Date.now()/1000)}&aggregate=1`,
        {
          headers: {
            'x-cg-pro-api-key': COINGECKO_API_KEY,
          },
        }
      );

      let holders24hAgo = currentHolders;
      if (chartResponse.ok) {
        const chartData = await chartResponse.json();
        const holdersList = chartData.data?.attributes?.token_holders_list || [];
        // Get holder count from ~24h ago (second to last entry if available)
        if (holdersList.length > 1) {
          holders24hAgo = holdersList[holdersList.length - 2][1];
        }
      }

      responseData = {
        total_holders: currentHolders,
        holders_24h_ago: holders24hAgo,
        distribution: infoData.data?.attributes?.holders?.distribution_percentage || {}
      };
    } else if (endpoint === 'top-holders' && network && contractAddress) {
      // Fetch top holders
      const response = await fetch(
        `https://pro-api.coingecko.com/api/v3/onchain/networks/${network}/tokens/${contractAddress}/top_holders`,
        {
          headers: {
            'x-cg-pro-api-key': COINGECKO_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();

      // Extract and normalize the holders array
      responseData = {
        items: data.data?.attributes?.holders || [],
        last_updated: data.data?.attributes?.last_updated_at
      };
    } else {
      // Default fallback: price chart data
      const daysParam = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const interval = daysParam === 1 ? 'hourly' : 'daily';
      
      const response = await fetch(
        `https://pro-api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=${daysParam}&interval=${interval}`,
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
      
      // Transform to our format with timestamp in seconds
      responseData = data.prices.map((price: [number, number], index: number) => ({
        timestamp: Math.floor(price[0] / 1000), // Convert ms to seconds
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
