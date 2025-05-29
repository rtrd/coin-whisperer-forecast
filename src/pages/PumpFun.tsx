
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { PumpFunIntegration } from "@/components/PumpFunIntegration";

const PumpFun = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
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
            Pump.fun Integration
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover and track trending meme coins and new token launches on Pump.fun
          </p>
        </div>

        <PumpFunIntegration />
      </div>
    </div>
  );
};

export default PumpFun;
