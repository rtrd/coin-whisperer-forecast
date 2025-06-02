
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
    const { crypto, timeframe } = await req.json()
    
    // Get API key from Supabase secrets
    const COINGECKO_API_KEY = Deno.env.get('COINGECKO_API_KEY')
    
    if (!COINGECKO_API_KEY) {
      throw new Error('CoinGecko API key not configured')
    }

    // Convert timeframe to days
    const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90
    
    const response = await fetch(
      `https://pro-api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=${days}&interval=${days === 1 ? 'hourly' : 'daily'}`,
      {
        headers: {
          'X-CG-Pro-API-Key': COINGECKO_API_KEY,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform CoinGecko data to our format
    const priceData = data.prices.map((price: [number, number], index: number) => ({
      timestamp: price[0],
      price: price[1],
      volume: data.total_volumes?.[index]?.[1] || 0
    }))

    return new Response(
      JSON.stringify(priceData),
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
      JSON.stringify({ error: error.message }),
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
