
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PieChart, Mail, Clock, Check, Loader2 } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const PortfolioTracking = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Thank you! We'll notify you when Portfolio Tracking is ready!");
    setIsLoading(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header like homepage */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <IndexHeader
          selectedCrypto="bitcoin"
          cryptoOptions={cryptoOptions}
          currentPrice={45000}
          priceChange={2.5}
        />
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Page Header */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <PieChart className="h-8 w-8 text-green-400" />
                  <CardTitle 
                    className="text-4xl text-white"
                    style={{ textShadow: '0 0 15px rgba(0, 0, 0, 0.3)' }}
                  >
                    Portfolio Tracking
                  </CardTitle>
                </div>
                <p className="text-gray-300 text-lg">Advanced cryptocurrency portfolio tracking and performance analysis</p>
              </CardHeader>
            </Card>

            {/* Coming Soon Section */}
            <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700/50">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="h-8 w-8 text-blue-400" />
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg px-4 py-2">
                    COMING SOON
                  </Badge>
                </div>
                <CardTitle className="text-3xl text-white mb-4">
                  Advanced Portfolio Tracking is Almost Here!
                </CardTitle>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  We're putting the finishing touches on our comprehensive portfolio tracking system. 
                  Get notified when it's ready and be among the first to experience it!
                </p>
              </CardHeader>
              <CardContent className="max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email for early access"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white text-lg h-12"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg h-12"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Subscribing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Notify Me When Ready
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-700/50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-300 text-sm justify-center">
                    <Check className="h-4 w-4" />
                    <span>100% Free • No subscription required</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Preview */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">What's Coming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-400 mt-1" />
                      <div>
                        <h4 className="text-white font-medium">Real-time Portfolio Tracking</h4>
                        <p className="text-gray-400 text-sm">Monitor your crypto holdings across multiple wallets and exchanges</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-400 mt-1" />
                      <div>
                        <h4 className="text-white font-medium">Performance Analytics</h4>
                        <p className="text-gray-400 text-sm">Detailed insights into your portfolio's performance and ROI</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-400 mt-1" />
                      <div>
                        <h4 className="text-white font-medium">Risk Assessment</h4>
                        <p className="text-gray-400 text-sm">AI-powered risk analysis and portfolio optimization suggestions</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-400 mt-1" />
                      <div>
                        <h4 className="text-white font-medium">Smart Alerts</h4>
                        <p className="text-gray-400 text-sm">Custom notifications for price changes and portfolio events</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-400 mt-1" />
                      <div>
                        <h4 className="text-white font-medium">Tax Reporting</h4>
                        <p className="text-gray-400 text-sm">Automated tax calculation and reporting for your crypto gains</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-400 mt-1" />
                      <div>
                        <h4 className="text-white font-medium">DeFi Integration</h4>
                        <p className="text-gray-400 text-sm">Track your DeFi positions and yield farming rewards</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-8">
              <MarketWinnersWidget />
              <AdBanner width={300} height={600} position="vertical" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PortfolioTracking;
