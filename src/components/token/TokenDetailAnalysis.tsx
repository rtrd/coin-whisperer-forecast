import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";
import { SentimentAnalysis } from "@/components/SentimentAnalysis";
import { fetchTechnicalIndicators } from "@/services/aiPredictionService";

interface TokenDetailAnalysisProps {
  cryptoId: string;
  cryptoData: any[] | undefined;
  dataLoading: boolean;
  prediction: any;
}

export const TokenDetailAnalysis: React.FC<TokenDetailAnalysisProps> = ({
  cryptoId,
  cryptoData,
  dataLoading,
  prediction,
}) => {
  const [technicalIndicator, setTechnicalIndicator] = React.useState<any>(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchTechnicalIndicators(cryptoId); // or any topic
        console.log("Fetched technical indicators:", response);
        setTechnicalIndicator(response);
      } catch (error) {
        console.error("Error fetching technical indicators:", error);
      }
    };

    getData();
  }, []);
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
              <SentimentAnalysis crypto={cryptoId} />
            </TabsContent>

            <TabsContent value="technical" className="mt-6">
              <TechnicalAnalysis
                data={cryptoData}
                isLoading={dataLoading}
                technicalIndicator={technicalIndicator}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
