import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LockedTechnicalAnalysis } from "@/components/LockedTechnicalAnalysis";
import { LockedSentimentAnalysis } from "@/components/LockedSentimentAnalysis";
import { fetchTechnicalIndicators } from "@/services/aiPredictionService";

interface TokenDetailAnalysisProps {
  cryptoId: string;
  cryptoData: any[] | undefined;
  dataLoading: boolean;
  prediction: any;
  technicalIndicator?: any[]; // Optional, can be undefined if not used
  sentimentData?: any; // Optional sentiment data prop
}

export const TokenDetailAnalysis: React.FC<TokenDetailAnalysisProps> = ({
  cryptoId,
  cryptoData,
  dataLoading,
  prediction,
  sentimentData, // Added this line
}) => {
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
              <LockedSentimentAnalysis crypto={cryptoId} />
            </TabsContent>

            <TabsContent value="technical" className="mt-6">
              <LockedTechnicalAnalysis data={cryptoData} isLoading={dataLoading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
