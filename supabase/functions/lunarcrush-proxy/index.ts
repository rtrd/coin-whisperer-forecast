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

    const symbol = String(tokenSymbol).toUpperCase();

    console.log(`Fetching LunarCrush metrics for: ${symbol}`);

    const response = await fetch(
      `https://lunarcrush.com/api4/public/coins/${symbol}/v1`,
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

    const raw = await response.json();
    const src: any = raw?.data ?? raw;
    console.log(`Successfully fetched metrics for ${symbol}`);
    
    return new Response(
      JSON.stringify({
        galaxy_score: src.galaxy_score ?? src.galaxyScore ?? src.metrics?.galaxy_score,
        alt_rank: src.alt_rank ?? src.altRank ?? src.metrics?.alt_rank,
        social_volume_24h: src.social_volume_24h ?? src.metrics?.social_volume_24h,
        social_engagement_24h: src.social_engagement_24h ?? src.metrics?.social_engagement_24h,
        social_contributors: src.social_contributors ?? src.metrics?.social_contributors,
        social_dominance: src.social_dominance ?? src.metrics?.social_dominance,
        sentiment: src.sentiment ?? src.metrics?.sentiment,
        price_score: src.price_score ?? src.metrics?.price_score,
        bullish_sentiment: src.bullish_sentiment ?? src.metrics?.bullish_sentiment,
        bearish_sentiment: src.bearish_sentiment ?? src.metrics?.bearish_sentiment,
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
