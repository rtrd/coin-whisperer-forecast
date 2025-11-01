import { useState, useEffect } from 'react';
import { MarketSignal, LiveSignal, TradingRecommendation, MarketNarrative } from '@/types/tradingSignals';
import { apiService } from '@/services/apiService';
import { CryptoToken } from '@/types/crypto';

interface UseRealTradingSignalsDataOptions {
  enabled?: boolean;
}

export const useRealTradingSignalsData = (options: UseRealTradingSignalsDataOptions = {}) => {
  const { enabled = true } = options;
  const [marketSentiment, setMarketSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  const [sentimentScore, setSentimentScore] = useState(50);
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [liveSignals, setLiveSignals] = useState<LiveSignal[]>([]);
  const [recommendations, setRecommendations] = useState<TradingRecommendation[]>([]);
  const [marketNarratives, setMarketNarratives] = useState<MarketNarrative[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [volumeChange24h, setVolumeChange24h] = useState(0);
  const [totalVolume24h, setTotalVolume24h] = useState(0);
  const [totalTVL, setTotalTVL] = useState(0);
  const [defiTVLChange, setDefiTVLChange] = useState(0);
  const [totalMarketCap, setTotalMarketCap] = useState(0);
  const [btcDominance, setBtcDominance] = useState(0);

  const generateSignalsFromRealData = async () => {
    setIsAnalyzing(true);
    
    try {
      // Fetch real market data
      const [fearGreedData, marketVolatility, defiTVL, cryptoData] = await Promise.all([
        apiService.getFearGreedIndex(),
        apiService.getMarketVolatility(),
        apiService.getDefiTVL(),
        apiService.getAllCryptos()
      ]);

      // Calculate market sentiment based on Fear & Greed Index
      const fearGreedValue = fearGreedData.value;
      let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      
      if (fearGreedValue >= 60) sentiment = 'bullish';
      else if (fearGreedValue <= 40) sentiment = 'bearish';
      
      setMarketSentiment(sentiment);
      setSentimentScore(fearGreedValue);

      // Generate market signals from real data
      const newSignals: MarketSignal[] = [
        {
          type: sentiment,
          strength: fearGreedValue,
          timeframe: 'SENTIMENT',
          description: `Fear & Greed Index shows ${fearGreedData.classification.toLowerCase()} market conditions`,
          asset: 'MARKET SENTIMENT'
        },
        {
          type: marketVolatility.trend === 'high' ? 'bearish' : marketVolatility.trend === 'low' ? 'bullish' : 'neutral',
          strength: 100 - marketVolatility.volatility,
          timeframe: 'VOLATILITY',
          description: `Market volatility is ${marketVolatility.trend} at ${marketVolatility.volatility}%`,
          asset: 'VOLATILITY INDEX'
        },
        {
          type: defiTVL.change24h > 0 ? 'bullish' : 'bearish',
          strength: Math.min(100, Math.abs(defiTVL.change24h * 10) + 50),
          timeframe: 'DEFI',
          description: `DeFi TVL ${defiTVL.change24h > 0 ? 'increased' : 'decreased'} by ${Math.abs(defiTVL.change24h).toFixed(1)}% in 24h`,
          asset: 'DEFI SECTOR'
        }
      ];

      // Get BTC data first (needed for market cap calculation)
      const btc = cryptoData.find(token => token.symbol.toLowerCase() === 'btc');
      
      // Generate live signals from top movers
      // Calculate market volume data
      const currentTotalVolume = cryptoData.reduce((sum, token) => sum + (token.total_volume || 0), 0);
      // Simulate previous 24h volume (in real app, this would come from historical data)
      const previous24hVolume = currentTotalVolume * (0.95 + Math.random() * 0.1); // ±5% variation
      const volume24hChange = ((currentTotalVolume - previous24hVolume) / previous24hVolume) * 100;

      // Calculate market cap and BTC dominance
      const currentTotalMarketCap = cryptoData.reduce((sum, token) => sum + (token.market_cap || 0), 0);
      const btcMarketCap = btc?.market_cap || 0;
      const btcDominancePercent = (btcMarketCap / currentTotalMarketCap) * 100;

      // Update volume and market metrics state
      setTotalVolume24h(currentTotalVolume);
      setVolumeChange24h(volume24hChange);
      setTotalTVL(defiTVL.tvl);
      setDefiTVLChange(defiTVL.change24h);
      setTotalMarketCap(currentTotalMarketCap);
      setBtcDominance(btcDominancePercent);

      const topGainers = cryptoData.slice(0, 50).filter(token => token.price_change_percentage_24h > 10);
      const topLosers = cryptoData.slice(0, 50).filter(token => token.price_change_percentage_24h < -10);
      const highVolumeTokens = cryptoData.slice(0, 20).filter(token => token.total_volume > 1000000000);

      const newLiveSignals: LiveSignal[] = [];

      // Volume spike alerts
      highVolumeTokens.slice(0, 3).forEach(token => {
        newLiveSignals.push({
          type: 'volume_spike',
          asset: token.symbol.toUpperCase(),
          message: `High volume: $${(token.total_volume / 1e9).toFixed(1)}B traded`,
          timestamp: new Date().toLocaleTimeString(),
          strength: 'high'
        });
      });

      // Price alerts for top gainers
      topGainers.slice(0, 2).forEach(token => {
        newLiveSignals.push({
          type: 'price_alert',
          asset: token.symbol.toUpperCase(),
          message: `+${token.price_change_percentage_24h.toFixed(1)}% price surge in 24h`,
          timestamp: new Date(Date.now() - Math.random() * 300000).toLocaleTimeString(),
          strength: token.price_change_percentage_24h > 20 ? 'high' : 'medium'
        });
      });

      // Support test alerts for top losers
      topLosers.slice(0, 2).forEach(token => {
        newLiveSignals.push({
          type: 'support_test',
          asset: token.symbol.toUpperCase(),
          message: `Testing support after ${Math.abs(token.price_change_percentage_24h).toFixed(1)}% decline`,
          timestamp: new Date(Date.now() - Math.random() * 600000).toLocaleTimeString(),
          strength: 'medium'
        });
      });

      // Generate trading recommendations
      const newRecommendations: TradingRecommendation[] = [];
      
      // BTC recommendation based on market sentiment (btc already defined above)
      if (btc) {
        let action: 'buy' | 'sell' | 'hold' = 'hold';
        let confidence = 60;
        let reason = 'Neutral market conditions';

        if (sentiment === 'bullish' && btc.price_change_percentage_24h > 2) {
          action = 'buy';
          confidence = Math.min(90, fearGreedValue + 15);
          reason = 'Strong market sentiment + positive price action';
        } else if (sentiment === 'bearish' && btc.price_change_percentage_24h < -2) {
          action = 'sell';
          confidence = Math.min(90, 100 - fearGreedValue + 15);
          reason = 'Weak market sentiment + negative price action';
        }

        newRecommendations.push({
          action,
          asset: 'BTC',
          confidence,
          reason,
          targetPrice: btc.current_price * (action === 'buy' ? 1.1 : action === 'sell' ? 0.9 : 1.05)
        });
      }

      // ETH recommendation
      const eth = cryptoData.find(token => token.symbol.toLowerCase() === 'eth');
      if (eth) {
        newRecommendations.push({
          action: defiTVL.change24h > 2 ? 'buy' : defiTVL.change24h < -2 ? 'sell' : 'hold',
          asset: 'ETH',
          confidence: Math.min(85, 50 + Math.abs(defiTVL.change24h * 10)),
          reason: `DeFi TVL ${defiTVL.change24h > 0 ? 'growth' : 'decline'} affects ETH ecosystem`,
          targetPrice: eth.current_price * (defiTVL.change24h > 2 ? 1.08 : defiTVL.change24h < -2 ? 0.92 : 1.03)
        });
      }

      // Altcoins market analysis (excluding BTC and ETH)
      const altcoins = cryptoData
        .filter(token => !['bitcoin', 'ethereum'].includes(token.id.toLowerCase()))
        .slice(0, 50); // Take top 50 altcoins by market cap
            
      if (altcoins.length > 0) {
        const altcoinGainers = altcoins.filter(token => token.price_change_percentage_24h > 0);
        const avgAltcoinChange = altcoins.reduce((sum, token) => sum + token.price_change_percentage_24h, 0) / altcoins.length;
        const altcoinDominance = altcoins.reduce((sum, token) => sum + (token.market_cap || 0), 0);
        
        // Calculate Altcoin Season Index (how altcoins perform vs Bitcoin)
        const btcChange = btc?.price_change_percentage_24h || 0;
        const altcoinsOutperformingBtc = altcoins.filter(token => token.price_change_percentage_24h > btcChange).length;
        const altcoinSeasonIndex = Math.round((altcoinsOutperformingBtc / altcoins.length) * 100);
        
        let action: 'buy' | 'sell' | 'hold' = 'hold';
        let confidence = 60;
        let reason = 'Mixed altcoin performance';
        
        if (avgAltcoinChange > 3 && altcoinGainers.length > altcoins.length * 0.6) {
          action = 'buy';
          confidence = Math.min(85, 60 + avgAltcoinChange * 3);
          reason = `Strong altcoin rally: ${altcoinGainers.length}/${altcoins.length} coins positive, avg +${avgAltcoinChange.toFixed(1)}%`;
        } else if (avgAltcoinChange < -3 && altcoinGainers.length < altcoins.length * 0.4) {
          action = 'sell';
          confidence = Math.min(85, 60 + Math.abs(avgAltcoinChange) * 3);
          reason = `Altcoin weakness: broad selling pressure, avg ${avgAltcoinChange.toFixed(1)}%`;
        } else if (avgAltcoinChange > 0 && sentiment === 'bullish') {
          action = 'buy';
          confidence = 70;
          reason = 'Bullish market supporting altcoin rotation';
        }
        
        newRecommendations.push({
          action,
          asset: 'ALTCOINS',
          confidence,
          reason,
          // Remove targetPrice, add altcoinSeasonIndex instead
          altcoinSeasonIndex
        });
      }

      // Generate market narratives
      const newMarketNarratives: MarketNarrative[] = [
        {
          type: 'trend',
          title: 'Real-Time Market Analysis',
          content: `Current Fear & Greed Index at ${fearGreedValue} indicates ${fearGreedData.classification.toLowerCase()} market sentiment. ${marketVolatility.trend === 'high' ? 'High volatility suggests caution.' : 'Stable volatility supports current trends.'}`,
          score: fearGreedValue,
          source: 'Alternative.me',
          timestamp: new Date().toLocaleTimeString(),
          impact: fearGreedValue > 70 || fearGreedValue < 30 ? 'high' : 'medium',
          category: 'Market Sentiment'
        },
        {
          type: 'risk',
          title: 'Volatility Assessment',
          content: `Market volatility is currently ${marketVolatility.trend} at ${marketVolatility.volatility}%. ${marketVolatility.trend === 'high' ? 'Risk management is crucial in current conditions.' : 'Stable conditions favor trend-following strategies.'}`,
          score: 100 - marketVolatility.volatility,
          source: 'CoinGecko',
          timestamp: new Date().toLocaleTimeString(),
          impact: marketVolatility.trend === 'high' ? 'high' : 'medium',
          category: 'Risk Analysis'
        },
        {
          type: 'cycle',
          title: 'DeFi Ecosystem Health',
          content: `Total Value Locked in DeFi protocols ${defiTVL.change24h > 0 ? 'increased' : 'decreased'} by ${Math.abs(defiTVL.change24h).toFixed(1)}% to $${(defiTVL.tvl / 1e9).toFixed(1)}B, indicating ${defiTVL.change24h > 0 ? 'growing' : 'declining'} ecosystem activity.`,
          score: Math.min(100, 50 + defiTVL.change24h * 5),
          source: 'DeFi Llama',
          timestamp: new Date().toLocaleTimeString(),
          impact: Math.abs(defiTVL.change24h) > 5 ? 'high' : 'medium',
          category: 'DeFi Analysis'
        }
      ];

      // Add top mover narratives
      if (topGainers.length > 0) {
        newMarketNarratives.push({
          type: 'news',
          title: 'Market Leaders',
          content: `${topGainers[0].name} leads gains with +${topGainers[0].price_change_percentage_24h.toFixed(1)}% surge. ${topGainers.length} tokens showing 10%+ gains indicate selective strength.`,
          score: Math.min(100, topGainers[0].price_change_percentage_24h * 2),
          source: 'Market Data',
          timestamp: new Date().toLocaleTimeString(),
          impact: topGainers[0].price_change_percentage_24h > 20 ? 'high' : 'medium',
          category: 'Price Action'
        });
      }

      if (topLosers.length > 0) {
        newMarketNarratives.push({
          type: 'narrative',
          title: 'Risk Areas',
          content: `${topLosers.length} tokens declining 10%+ led by ${topLosers[0].name} (-${Math.abs(topLosers[0].price_change_percentage_24h).toFixed(1)}%). Monitor for broader market weakness.`,
          score: Math.max(0, 50 - Math.abs(topLosers[0].price_change_percentage_24h) * 2),
          source: 'Market Data',
          timestamp: new Date().toLocaleTimeString(),
          impact: Math.abs(topLosers[0].price_change_percentage_24h) > 20 ? 'high' : 'medium',
          category: 'Risk Monitor'
        });
      }

      // Update state with real data
      setSignals(newSignals);
      setLiveSignals(newLiveSignals);
      setRecommendations(newRecommendations);
      setMarketNarratives(newMarketNarratives);

    } catch (error) {
      console.error('Failed to fetch real trading signals data:', error);
      
      // Fallback to basic data if APIs fail
      setSentimentScore(50);
      setMarketSentiment('neutral');
      setSignals([{
        type: 'neutral',
        strength: 50,
        timeframe: 'FALLBACK',
        description: 'Unable to fetch real-time data. Please check connection.',
        asset: 'SYSTEM'
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    
    generateSignalsFromRealData();
    
    // Refresh data every 60 seconds (reduced from 30s to avoid API rate limits)
    const interval = setInterval(generateSignalsFromRealData, 60000);
    
    return () => clearInterval(interval);
  }, [enabled]);

  return {
    marketSentiment,
    sentimentScore,
    signals,
    liveSignals,
    recommendations,
    marketNarratives,
    isAnalyzing,
    volumeChange24h,
    totalVolume24h,
    totalTVL,
    defiTVLChange,
    totalMarketCap,
    btcDominance
  };
};