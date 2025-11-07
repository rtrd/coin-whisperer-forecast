import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LockedTechnicalAnalysis } from "@/components/LockedTechnicalAnalysis";
import { LockedSentimentAnalysis } from "@/components/LockedSentimentAnalysis";
import { fetchTechnicalIndicators } from "@/services/aiPredictionService";
import { processSentimentData } from "@/services/sentimentDataService";

interface TokenDetailAnalysisProps {
  cryptoId: string;
  cryptoData: any[] | undefined;
  dataLoading: boolean;
  prediction: any;
  technicalIndicator?: any[];
  sentimentData?: any;
}

interface ProcessedSentimentData {
  sentimentTimeline?: { date: string; value: number; change: number; sentiment: "bullish" | "bearish" | "neutral" }[];
  socialVolume?: { label: string; value: number }[];
  sourcesWithTrends?: { sentiment: number; mentions: number; trend?: number[] }[];
}

export const TokenDetailAnalysis: React.FC<TokenDetailAnalysisProps> = ({
  cryptoId,
  cryptoData,
  dataLoading,
  prediction,
  sentimentData,
}) => {
  const [processedSentiment, setProcessedSentiment] = useState<ProcessedSentimentData | null>(null);
  const [volumeData, setVolumeData] = useState<{ label: string; value: number }[]>([]);
  const [macdData, setMacdData] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    // Process sentiment data from API
    const loadSentimentData = async () => {
      const processed = await processSentimentData(cryptoId);
      if (processed) {
        setProcessedSentiment(processed);
      }
    };
    
    loadSentimentData();
  }, [cryptoId]);

  useEffect(() => {
    // Extract volume data from cryptoData with proper date labels
    if (cryptoData && cryptoData.length > 0) {
      const volumes = cryptoData.slice(-14).map((d) => {
        const date = new Date(d.timestamp);
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const day = date.getDate();
        return {
          label: `${month} ${day}`,
          value: d.volume || 0
        };
      });
      setVolumeData(volumes);
    }
  }, [cryptoData]);
  return (
    <div className="space-y-6">
      {/* Market Analysis - Combined Sentiment and Technical */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Market Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sentiment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700 border-gray-600">
              <TabsTrigger
                value="sentiment"
                className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-600"
              >
                Sentiment Analysis
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-600"
              >
                Technical Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sentiment" className="mt-6">
              <LockedSentimentAnalysis
                crypto={cryptoId}
                sentimentData={{
                  ...sentimentData,
                  ...processedSentiment
                }}
              />
            </TabsContent>

            <TabsContent value="technical" className="mt-6">
              <LockedTechnicalAnalysis
                data={cryptoData}
                isLoading={dataLoading}
                volumeData={volumeData}
                macdHistogram={macdData}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
