import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { useAdScript } from "@/hooks/useAdScript";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Mail, Briefcase, TrendingUp, BarChart3, Target, PieChart, DollarSign, Calculator, AlertTriangle, Wallet, Shield, Activity, Zap, Users, Globe, CreditCard, Smartphone, Bell, Settings } from "lucide-react";
import { formatPrice, formatVolume, formatMarketCap } from "@/utils/marketDataHelpers";
import { AdUnit } from "@/components/ads/AdService";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { getAllCryptos } from "../../utils/api";

const PortfolioTracking = () => {
  // Initialize ad script on page load
  useAdScript();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState([]);
  const [portfolioDemo, setPortfolioDemo] = useState({
    totalValue: 125430.50,
    totalCost: 98750.00,
    totalGainLoss: 26680.50,
    totalGainLossPercent: 27.02,
    holdings: []
  });
  
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  const CACHE_KEY = "topGainersAndLosers";
  const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

  // Fetch real market data using the same approach as Article.tsx
  const fetchAndCacheMarketData = async () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setMarketData(data);
          return;
        }
      } catch (err) {
        console.error('Cache parsing error:', err);
      }
    }
    
    try {
      const data = await getAllCryptos();
      setMarketData(data);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Fallback to mock data
      setMarketData([
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price_change_percentage_24h: 5.2, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 118184 },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price_change_percentage_24h: 3.1, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3007 },
        { id: 'cardano', name: 'Cardano', symbol: 'ADA', price_change_percentage_24h: -2.5, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', current_price: 0.72 },
        { id: 'solana', name: 'Solana', symbol: 'SOL', price_change_percentage_24h: -1.8, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 164 }
      ]);
    }
  };

  useEffect(() => {
    fetchAndCacheMarketData();
    generateDemoPortfolio();
  }, []);

  const generateDemoPortfolio = () => {
    const demoHoldings = [
      { symbol: 'BTC', name: 'Bitcoin', amount: 2.5, avgPrice: 42000, currentPrice: 45000, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
      { symbol: 'ETH', name: 'Ethereum', amount: 15, avgPrice: 2800, currentPrice: 3200, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
      { symbol: 'SOL', name: 'Solana', amount: 50, avgPrice: 140, currentPrice: 180, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
      { symbol: 'ADA', name: 'Cardano', amount: 5000, avgPrice: 0.45, currentPrice: 0.72, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
      { symbol: 'MATIC', name: 'Polygon', amount: 2000, avgPrice: 0.85, currentPrice: 1.05, image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png' }
    ];

    const enrichedHoldings = demoHoldings.map(holding => {
      const value = holding.amount * holding.currentPrice;
      const cost = holding.amount * holding.avgPrice;
      const gainLoss = value - cost;
      const gainLossPercent = (gainLoss / cost) * 100;
      
      return {
        ...holding,
        value,
        cost,
        gainLoss,
        gainLossPercent
      };
    });

    setPortfolioDemo(prev => ({
      ...prev,
      holdings: enrichedHoldings
    }));
  };

  const handleEmailSubmit = async () => {
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
    <>
      <Helmet>
        <title>Portfolio Tracking - Advanced Crypto Portfolio Management | CryptoInsights</title>
        <meta name="description" content="Track your cryptocurrency portfolio with real-time data, performance analytics, and professional-grade tools. Get early access to our portfolio management platform." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <IndexHeader
            selectedCrypto="bitcoin"
            cryptoOptions={cryptoOptions}
            currentPrice={45000}
            priceChange={2.5}
          />
        </div>

        <div className="container mx-auto px-4 pb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4">
                      <Briefcase className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Professional Portfolio Management</h2>
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400 px-4 py-2 text-sm mb-4">
                      LAUNCHING Q2 2025
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                        <Wallet className="h-8 w-8 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Multi-Wallet Support</h3>
                      <p className="text-gray-300 text-sm">Connect multiple wallets and exchanges</p>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl border border-green-500/30">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                        <Activity className="h-8 w-8 text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Real-Time Analytics</h3>
                      <p className="text-gray-300 text-sm">Live performance metrics updated every second</p>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                        <Shield className="h-8 w-8 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
                      <p className="text-gray-300 text-sm">Bank-level security with read-only connections</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30 shadow-xl backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                      <Mail className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Get Early Access</h3>
                    <div className="max-w-md mx-auto">
                      <div className="flex flex-col gap-4">
                        <Input
                          type="email"
                          placeholder="Enter your email for early access"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-gray-700/50 border-gray-600 text-white"
                        />
                        <Button 
                          onClick={handleEmailSubmit}
                          disabled={isLoading || !email}
                          className="bg-gradient-to-r from-green-500 to-blue-600"
                        >
                          {isLoading ? 'Submitting...' : 'Join Early Access List'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-8 space-y-8">
                <MarketWinnersWidget topGainnersandLoosers={marketData} />
                <AdUnit type="skyscraper" />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PortfolioTracking;
