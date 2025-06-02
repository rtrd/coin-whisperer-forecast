
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
    const { crypto, currentPrice, rsi, volatility, priceChange, predictionDays } = await req.json()
    
    // Get API key from Supabase secrets
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')
    
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not configured')
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: `You are a cryptocurrency price prediction AI. Analyze the provided data and return a JSON response with price predictions. Current price: $${currentPrice}, RSI: ${rsi.toFixed(2)}, Volatility: ${(volatility * 100).toFixed(2)}%, Price change: ${priceChange.toFixed(2)}%`
          },
          {
            role: 'user',
            content: `Predict the price of ${crypto} for the next ${predictionDays} days. Return only a JSON object with: {"trend": "bullish|bearish|neutral", "prediction_percentage": number, "confidence": number}. Base your analysis on: Current price $${currentPrice}, RSI ${rsi.toFixed(2)}, recent ${priceChange > 0 ? 'gains' : 'losses'} of ${Math.abs(priceChange).toFixed(2)}%.`
          }
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const aiResponse = await response.json()
    const aiContent = aiResponse.choices[0]?.message?.content
    
    let aiPrediction
    try {
      aiPrediction = JSON.parse(aiContent)
    } catch {
      // Fallback if JSON parsing fails
      aiPrediction = {
        trend: priceChange > 5 ? 'bullish' : priceChange < -5 ? 'bearish' : 'neutral',
        prediction_percentage: priceChange * 0.5,
        confidence: 0.75
      }
    }

    return new Response(
      JSON.stringify(aiPrediction),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in openrouter-proxy:', error)
    // Return fallback prediction on error
    const fallbackPrediction = {
      trend: 'neutral',
      prediction_percentage: 0,
      confidence: 0.5
    }
    
    return new Response(
      JSON.stringify(fallbackPrediction),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
