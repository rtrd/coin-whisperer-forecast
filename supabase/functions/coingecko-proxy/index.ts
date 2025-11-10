
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
    
    console.log('[coingecko-proxy] Request:', { endpoint, network, contractAddress: contractAddress?.slice(0, 8), crypto });
    
    if (!COINGECKO_API_KEY) {
      console.error('[coingecko-proxy] Missing COINGECKO_API_KEY');
      return new Response(
        JSON.stringify({ error: 'API key not configured', code: 'MISSING_API_KEY' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let responseData;

    // Normalize incoming network names to CoinGecko Onchain identifiers
    const normalizeNetwork = (n?: string) => {
      const key = (n || '').toLowerCase();
      const map: Record<string, string> = {
        eth: 'ethereum',
        ethereum: 'ethereum',
        bsc: 'bsc',
        'binance-smart-chain': 'bsc',
        'polygon-pos': 'polygon_pos',
        polygon: 'polygon_pos',
        avalanche: 'avalanche',
        avax: 'avalanche',
        sol: 'solana',
        solana: 'solana'
      };
      return map[key] || key;
    };
    const net = normalizeNetwork(network);
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
    } else if (endpoint === 'holders' && net && contractAddress) {
      console.log('[coingecko-proxy] Fetching holders for:', network, contractAddress);
      
      // Fetch token info which includes holder count and distribution
      const infoResponse = await fetch(
        `https://pro-api.coingecko.com/api/v3/onchain/networks/${net}/tokens/${contractAddress}/info`,
        {
          headers: {
            'X-CG-Pro-API-Key': COINGECKO_API_KEY,
          },
        }
      );

      if (!infoResponse.ok) {
        const errorText = await infoResponse.text();
        console.error(`[holders] API error ${infoResponse.status}:`, errorText);
        return new Response(
          JSON.stringify({ 
            error: `API error: ${infoResponse.status}`, 
            details: errorText,
            code: 'API_ERROR',
            total_holders: 0, 
            holders_24h_ago: 0, 
            distribution: {} 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: infoResponse.status }
        );
      }

      const infoData = await infoResponse.json();
      const currentHolders = infoData.data?.attributes?.holders?.count || 0;

      // Fetch historical data for 24h growth calculation
      const chartResponse = await fetch(
        `https://pro-api.coingecko.com/api/v3/onchain/networks/${net}/tokens/${contractAddress}/token_holders_chart?before_timestamp=${Math.floor(Date.now()/1000)}&aggregate=1`,
        {
          headers: {
'X-CG-Pro-API-Key': COINGECKO_API_KEY,
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
    } else if (endpoint === 'top-holders' && net && contractAddress) {
      console.log('[coingecko-proxy] Fetching top-holders for:', network, contractAddress);
      
      // Fetch top holders
      const response = await fetch(
        `https://pro-api.coingecko.com/api/v3/onchain/networks/${net}/tokens/${contractAddress}/top_holders`,
        {
          headers: {
            'X-CG-Pro-API-Key': COINGECKO_API_KEY,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[top-holders] API error ${response.status}:`, errorText);
        return new Response(
          JSON.stringify({ 
            error: `API error: ${response.status}`, 
            details: errorText,
            code: 'API_ERROR',
            items: [], 
            last_updated: new Date().toISOString() 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
        );
      }

      const data = await response.json();

      // Extract and normalize the holders array, normalize percent keys
      const rawHolders = data.data?.attributes?.holders || [];
      const items = rawHolders.map((h: any) => {
        const p = (h.percentage ?? h.percent ?? h.pct ?? h.share);
        const num = typeof p === 'string' ? parseFloat(p) : (typeof p === 'number' ? p : 0);
        return { ...h, percentage: isFinite(num) ? Math.max(0, Math.min(100, num)) : 0 };
      });

      responseData = {
        items,
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
    console.error('[coingecko-proxy] Unhandled error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        code: 'INTERNAL_ERROR',
        stack: error instanceof Error ? error.stack : undefined
      }),
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
