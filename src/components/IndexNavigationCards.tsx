
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Rocket, ExternalLink } from "lucide-react";

export const IndexNavigationCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* AI Prediction Analysis */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl hover:shadow-3xl transition-all hover:bg-gray-800/70">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            AI Prediction Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Get advanced AI-powered cryptocurrency predictions and market analysis
          </p>
          <Link to="/ai-prediction">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              View AI Predictions
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Solana Memecoin Insights */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl hover:shadow-3xl transition-all hover:bg-gray-800/70">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Rocket className="h-5 w-5 text-purple-400" />
            Solana Memecoin Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Discover and track trending memecoins and new token launches
          </p>
          <Link to="/pump-fun">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              Explore Memecoin Insights
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
