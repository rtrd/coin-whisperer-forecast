import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LUNARCRUSH_API_KEY = Deno.env.get('LUNARCRUSH_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tokenSymbol } = await req.json();

    if (!tokenSymbol) {
      throw new Error('tokenSymbol is required');
    }

    console.log(`Fetching LunarCrush metrics for: ${tokenSymbol}`);

    const response = await fetch(
      `https://lunarcrush.com/api4/public/coins/${tokenSymbol}/v1`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${LUNARCRUSH_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LunarCrush API error (${response.status}):`, errorText);
      throw new Error(`LunarCrush API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched metrics for ${tokenSymbol}`);
    
    return new Response(
      JSON.stringify({
        galaxy_score: data.galaxy_score,
        alt_rank: data.alt_rank,
        social_volume_24h: data.social_volume_24h,
        social_engagement_24h: data.social_engagement_24h,
        social_contributors: data.social_contributors,
        social_dominance: data.social_dominance,
        sentiment: data.sentiment,
        price_score: data.price_score,
        bullish_sentiment: data.bullish_sentiment,
        bearish_sentiment: data.bearish_sentiment,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in lunarcrush-proxy:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
