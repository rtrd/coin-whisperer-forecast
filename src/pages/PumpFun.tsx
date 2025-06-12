
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { IndexHeader } from "@/components/IndexHeader";
import Footer from "@/components/Footer";
import { PumpFunIntegration } from "@/components/PumpFunIntegration";

const PumpFun = () => {
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Homepage Header */}
        <IndexHeader 
          selectedCrypto="bitcoin"
          cryptoOptions={cryptoOptions}
          currentPrice={50000}
          priceChange={2.5}
        />

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Rocket className="h-12 w-12 text-purple-400" />
            Solana Memecoin Insights
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover and track trending memecoins and new token launches on Pump.fun
          </p>
        </div>

        <PumpFunIntegration />
      </div>
      
      <Footer />
    </div>
  );
};

export default PumpFun;
