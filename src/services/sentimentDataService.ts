import { fetchSentimentData } from './aiPredictionService';

export interface SentimentTimelineData {
  date: string;
  value: number;
  change: number;
  sentiment: "bullish" | "bearish" | "neutral";
}

export interface SocialVolumeData {
  label: string;
  value: number;
}

export const processSentimentData = async (crypto: string) => {
  try {
    const apiData = await fetchSentimentData(crypto);
    
    if (!apiData || !apiData.data) {
      return null;
    }

    const data = apiData.data;
    
    // Process sentiment timeline from API if available
    let sentimentTimeline: SentimentTimelineData[] | undefined;
    if (data.timeseries && Array.isArray(data.timeseries)) {
      sentimentTimeline = data.timeseries.slice(-7).map((item: any, idx: number, arr: any[]) => {
        const sentiment = item.sentiment || 50;
        const prevSentiment = idx > 0 ? (arr[idx - 1].sentiment || 50) : sentiment;
        const change = sentiment - prevSentiment;
        
        return {
          date: new Date(item.time * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          value: sentiment,
          change,
          sentiment: sentiment >= 60 ? "bullish" as const : sentiment <= 40 ? "bearish" as const : "neutral" as const
        };
      });
    }

    // Process social volume from API if available
    let socialVolume: SocialVolumeData[] | undefined;
    if (data.timeseries && Array.isArray(data.timeseries)) {
      socialVolume = data.timeseries.slice(-7).map((item: any) => ({
        label: new Date(item.time * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        value: item.social_volume_24h || item.social_volume || 0
      }));
    }

    // Process source trends
    const sourcesWithTrends = Object.keys(data.types_sentiment || {}).map((key: string) => {
      const sentiment = data.types_sentiment[key] || 0;
      const mentions = data.types_interactions?.[key] || 0;
      
      // Try to get historical trend if available
      let trend: number[] | undefined;
      if (data.types_timeseries && data.types_timeseries[key]) {
        trend = data.types_timeseries[key].slice(-7).map((t: any) => t.sentiment || sentiment);
      }
      
      return { sentiment, mentions, trend };
    });

    return {
      sentimentTimeline,
      socialVolume,
      sourcesWithTrends
    };
  } catch (error) {
    console.error('Error processing sentiment data:', error);
    return null;
  }
};