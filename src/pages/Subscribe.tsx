
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Crown, Check, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { IndexHeader } from "@/components/IndexHeader";
import { toast } from "sonner";

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Successfully subscribed! Premium features unlocked.");
    setIsLoading(false);
    setEmail('');
  };

  const premiumFeatures = [
    "Advanced AI Predictions with 95% accuracy",
    "Real-time alerts for all 65+ cryptocurrencies",
    "Exclusive pump.fun integration",
    "Technical analysis with 50+ indicators",
    "Portfolio tracking and recommendations",
    "Priority customer support",
    "Ad-free experience",
    "Early access to new features"
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
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Crown className="h-12 w-12 text-yellow-400" />
              Unlock Premium Features
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">PRO</Badge>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get access to advanced AI predictions, real-time alerts, and exclusive trading insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Subscription Form */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-400" />
                  Subscribe to Unlock
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Enter your email to get instant access to all premium features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white text-lg h-12"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg h-12 shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 animate-spin" />
                        Activating Premium...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5" />
                        Unlock Premium Access
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-700/50 rounded-lg">
                  <p className="text-green-300 text-sm text-center">
                    ✨ <strong>Limited Time:</strong> Free premium access for early subscribers!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features List */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-700/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  Premium Features
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Everything you need for successful crypto trading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                      <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
                <div className="text-gray-300">Prediction Accuracy</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-400 mb-2">65+</div>
                <div className="text-gray-300">Supported Tokens</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">10k+</div>
                <div className="text-gray-300">Active Users</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
