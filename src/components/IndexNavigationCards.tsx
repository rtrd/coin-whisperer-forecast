import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Rocket, ExternalLink, Wallet } from "lucide-react";
import { trackNavClick } from "@/utils/analytics";

export const IndexNavigationCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-6 mb-8">
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
            Get advanced AI-powered cryptocurrency predictions and market
            analysis
          </p>
          <Link
            to="/ai-prediction"
            onClick={() =>
              trackNavClick("/ai-prediction", "index_navigation_cards")
            }
          >
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
          <Link
            to="/pump-fun"
            onClick={() => trackNavClick("/pump-fun", "index_navigation_cards")}
          >
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              Explore Memecoin Insights
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* AI Portfolio Analysis */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl hover:shadow-3xl transition-all hover:bg-gray-800/70">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="h-5 w-5 text-cyan-400" />
            AI Portfolio Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Track your crypto portfolio with advanced analytics, performance metrics, and risk analysis
          </p>
          <Link
            to="/lock-portfolio-dashboard"
            onClick={() =>
              trackNavClick("/lock-portfolio-dashboard", "index_navigation_cards")
            }
          >
            <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              View AI Portfolio Analysis
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
