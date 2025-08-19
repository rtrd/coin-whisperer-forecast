import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { useAdScript } from "@/hooks/useAdScript";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, Flame, Clock, Users, BarChart3, ShoppingCart, TrendingDown, Home, Search, User, ArrowLeft, AlertTriangle, Sparkles, Crown, Star } from "lucide-react";
import { useMotiMeterData } from "@/hooks/useMotiMeterData";
import { MotiToken } from "@/types/motiMeter";
import { IndexHeader } from "@/components/IndexHeader";
import { AdUnit } from "@/components/ads/AdService";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import { LazyWordPressIntegration } from "@/components/lazy/LazyWordPressIntegration";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
import { MotiTokenCard } from "@/components/MotiTokenCard";
import { MotiLoadingGrid } from "@/components/MotiLoadingSkeletons";

declare global {
  interface Window {
    googletag: any;
  }
}

const MotiMeter = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '5d' | '7d'>('24h');
  
  // Initialize ad script on page load
  useAdScript();
  const { data: motiTokens, isLoading, error } = useMotiMeterData(selectedPeriod);
  const [topGainersAndLosers, setTopGainersAndLosers] = useState<any[]>([]);

  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' }
  ];

  useEffect(() => {
    // Display header ad
    if (window.googletag && window.googletag.display) {
      window.googletag.display('div-gpt-ad-header-moti');
    }
  }, []);

  const handleBuyToken = (token: MotiToken) => {
    // Use eToro affiliate link instead of CoinGecko
    const symbol = token.symbol?.toLowerCase() || token.id;
    const affiliateUrl = `https://www.etoro.com/markets/${symbol}?utm_medium=Affiliate&utm_source=126447&utm_content=0&utm_serial=CHANGE&utm_campaign=CHANGE&utm_term=`;
    window.open(affiliateUrl, '_blank');
  };

  const handleSellToken = (token: MotiToken) => {
    // Use eToro affiliate link instead of CoinGecko
    const symbol = token.symbol?.toLowerCase() || token.id;
    const affiliateUrl = `https://www.etoro.com/markets/${symbol}?utm_medium=Affiliate&utm_source=126447&utm_content=0&utm_serial=CHANGE&utm_campaign=CHANGE&utm_term=`;
    window.open(affiliateUrl, '_blank');
  };

  const getMotiColor = (score: number) => {
    if (score >= 4.5) return 'bg-green-500';
    if (score >= 3.5) return 'bg-yellow-500';
    if (score >= 2.5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getMotiLabel = (score: number) => {
    if (score >= 4.5) return 'FIRE 🔥';
    if (score >= 3.5) return 'HOT 🌶️';
    if (score >= 2.5) return 'WARM 🌡️';
    return 'COLD ❄️';
  };

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* PumpParade Header */}
        <div className="container mx-auto px-4 py-2">
          <IndexHeader 
            selectedCrypto="bitcoin"
            cryptoOptions={cryptoOptions}
            currentPrice={50000}
            priceChange={2.5}
          />
        </div>

        <div className="container mx-auto px-4 pb-8">{/* Reduced gap */}
          {/* Header Ad */}
          <div className="flex justify-center mb-6">
            <div id='div-gpt-ad-header-moti' style={{minWidth: '728px', minHeight: '90px'}}></div>
          </div>

          {/* Back to Home Button */}
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button
                variant="outline"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Enhanced MOTI Meter Header with floating elements */}
          <div className="text-center mb-16 relative">
            {/* Animated background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
            
            {/* Floating decorative elements */}
            <div className="absolute top-0 left-10 animate-float">
              <Sparkles className="h-6 w-6 text-yellow-400/60" />
            </div>
            <div className="absolute top-20 right-20 animate-float" style={{ animationDelay: '0.5s' }}>
              <Star className="h-8 w-8 text-orange-400/60" />
            </div>
            <div className="absolute bottom-10 left-20 animate-float" style={{ animationDelay: '1s' }}>
              <Crown className="h-7 w-7 text-purple-400/60" />
            </div>
            
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="relative">
                <Flame className="h-16 w-16 text-orange-400 animate-pulse drop-shadow-[0_0_20px_rgba(251,146,60,0.6)]" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-20 blur-xl rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-orange-400 via-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl animate-fade-in text-shadow-xl">
                MOTI METER
              </h1>
              
              <div className="relative">
                <Flame className="h-16 w-16 text-orange-400 animate-pulse drop-shadow-[0_0_20px_rgba(251,146,60,0.6)]" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-20 blur-xl rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-5xl mx-auto leading-relaxed mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              The Ultimate Meme Coin Momentum Indicator - Ranking the hottest memecoins based on 
              <span className="text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text font-semibold"> viral energy</span>,
              <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text font-semibold"> community conviction</span>, and
              <span className="text-transparent bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text font-semibold"> market momentum</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="px-6 py-3 bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-full backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <span className="text-orange-300 font-semibold flex items-center gap-2">
                  🔥 Live Rankings Updated Every Hour 🔥
                </span>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <span className="text-purple-300 font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI-Powered Analysis
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Scoring Criteria with glassmorphism */}
          <Card className="mb-16 bg-gradient-to-br from-gray-800/80 via-gray-800/90 to-gray-900/80 border border-gray-600/50 shadow-2xl backdrop-blur-sm hover:shadow-purple-500/10 transition-all duration-500">
            <CardHeader className="pb-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-t-lg">
              <CardTitle className="text-white flex items-center gap-4 text-2xl">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                MOTI Scoring Criteria
                <div className="ml-auto flex gap-2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Powered
                  </Badge>
                </div>
              </CardTitle>
              <p className="text-gray-300 mt-2">
                Each token is evaluated across 7 key dimensions to calculate the ultimate MOTI score
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/60 rounded-xl border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse shadow-lg shadow-orange-500/50"></div>
                    <strong className="text-orange-300 font-bold text-lg">Twitter Interaction</strong>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">Viral energy, engagement metrics & community hype levels</p>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/60 rounded-xl border border-red-400/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                    <strong className="text-red-300 font-bold text-lg">Ticker Quality</strong>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">Short, memorable, and meme-worthy ticker symbols</p>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/60 rounded-xl border border-pink-400/30 hover:border-pink-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-pulse shadow-lg shadow-pink-500/50"></div>
                    <strong className="text-pink-300 font-bold text-lg">Cultural References</strong>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">Connection to current memes, trends & cultural moments</p>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/60 rounded-xl border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
                    <strong className="text-purple-300 font-bold text-lg">Project Maturity</strong>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">Beyond initial pump phase, proven staying power</p>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/60 rounded-xl border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-teal-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                    <strong className="text-blue-300 font-bold text-lg">Volume Consistency</strong>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">Sustained high trading volume and liquidity</p>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/60 rounded-xl border border-green-400/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    <strong className="text-green-300 font-bold text-lg">Holder Growth</strong>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">Expanding community conviction despite market dips</p>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/60 rounded-xl border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>
                    <strong className="text-yellow-300 font-bold text-lg">Technical Strength</strong>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">Higher lows pattern and overall trend resilience</p>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-xl border border-orange-400/60 hover:border-orange-400/80 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Flame className="w-5 h-5 text-orange-400 animate-pulse drop-shadow-lg" />
                    <strong className="text-orange-300 font-bold text-lg">Final MOTI Score</strong>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">Weighted average combining all criteria (1-5 scale)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ad Banner After Section 1 */}
          <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center mb-8">
            <GAMAdUnit
              adUnitId="div-gpt-ad-1752654531765-3"
              size={[728, 120]}
              className="max-w-full h-full"
            />
          </div>

          {/* Enhanced Time Period Tabs with glassmorphism */}
          <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as '24h' | '5d' | '7d')} className="mb-12">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-3 bg-gradient-to-r from-gray-800/80 via-gray-800/90 to-gray-900/80 border border-gray-600/50 rounded-2xl p-2 shadow-2xl h-16 backdrop-blur-sm">
                <TabsTrigger 
                  value="24h" 
                  className="h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:via-pink-600 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-purple-500/25 transition-all duration-300 font-semibold text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  <Clock className="h-5 w-5 mr-2" />
                  24 Hours
                </TabsTrigger>
                <TabsTrigger 
                  value="5d" 
                  className="h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:via-pink-600 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-purple-500/25 transition-all duration-300 font-semibold text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  5 Days
                </TabsTrigger>
                <TabsTrigger 
                  value="7d" 
                  className="h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:via-pink-600 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-purple-500/25 transition-all duration-300 font-semibold text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  <Users className="h-5 w-5 mr-2" />
                  7 Days
                </TabsTrigger>
              </TabsList>
            </div>

                <TabsContent value={selectedPeriod} className="mt-8">
                  {isLoading ? (
                    <MotiLoadingGrid />
                  ) : error ? (
                    <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-700/50 backdrop-blur-sm">
                      <CardContent className="p-8 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <AlertTriangle className="h-8 w-8 text-red-400" />
                          <h3 className="text-xl font-bold text-red-400">Error Loading MOTI Data</h3>
                        </div>
                        <p className="text-red-300 text-lg">{error.message || 'Unknown error occurred'}</p>
                        <Button 
                          className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => window.location.reload()}
                        >
                          Try Again
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                     <div className="space-y-8">
                      {motiTokens?.map((token, index) => (
                        <React.Fragment key={token.id}>
                          <MotiTokenCard
                            token={token}
                            rank={index + 1}
                            onBuy={handleBuyToken}
                            onSell={handleSellToken}
                          />

                          {/* Native Ad every 4 tokens - More natural looking */}
                          {(index + 1) % 4 === 0 && index < 9 && (
                            <TooltipProvider>
                              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all relative">
                                <div className="absolute top-2 right-2">
                                  <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Ad</span>
                                </div>
                                <CardContent className="p-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="flex flex-col items-center">
                                        <div className="text-2xl font-bold text-blue-400 mb-1">🚀</div>
                                        <Badge className="bg-blue-600 text-white px-2 py-1 text-xs">
                                          HOT 🔥
                                        </Badge>
                                      </div>
                                      
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                          <span className="text-white font-bold">$</span>
                                        </div>
                                        <div>
                                          <h3 className="text-lg font-semibold text-white">Trade {token.symbol?.toUpperCase() || 'MEME'}</h3>
                                          <div className="space-y-1">
                                            <p className="text-gray-400 text-sm">Zero fees • Best rates</p>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <div className="flex items-center gap-1 text-yellow-400 cursor-help">
                                                  <AlertTriangle className="h-3 w-3" />
                                                  <span className="text-xs">Risk Warning</span>
                                                </div>
                                              </TooltipTrigger>
                                              <TooltipContent className="max-w-xs">
                                                <p className="text-sm">
                                                  Crypto investments are risky and highly volatile. Tax may apply. Understand the risks here{' '}
                                                  <a href="https://etoro.tw/3PI44nZ" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                                                    https://etoro.tw/3PI44nZ
                                                  </a>
                                                </p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                      <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-400 mb-1">
                                          0%
                                        </div>
                                        <div className="text-sm text-gray-400">
                                          Trading Fees
                                        </div>
                                        <div className="text-sm text-green-400">
                                          100% Cashback for crypto fees
                                        </div>
                                      </div>
                                      
                                       <div className="flex flex-col gap-2">
                                        <Button
                                          size="sm"
                                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                                          onClick={() => {
                                            const symbol = token.symbol?.toLowerCase() || token.id;
                                            const affiliateUrl = `https://www.etoro.com/markets/${symbol}?utm_medium=Affiliate&utm_source=126447&utm_content=0&utm_serial=CHANGE&utm_campaign=CHANGE&utm_term=`;
                                            window.open(affiliateUrl, '_blank');
                                          }}
                                        >
                                          Trade Now
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </TooltipProvider>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

          {/* Ad Banner After Section 2 */}
          <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center mt-8 mb-8">
            <GAMAdUnit
              adUnitId="div-gpt-ad-1752654531765-4"
              size={[728, 120]}
              className="max-w-full h-full"
            />
          </div>

          {/* Trending Articles Widget - Full width */}
          <div className="mt-12">
            <LazyWordPressIntegration />
          </div>
        </div>

        <Footer />
      </div>

      {/* Bottom Navigation Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 px-4 py-2 lg:hidden">
        <nav className="flex justify-around items-center max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/tokens" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Search className="h-5 w-5" />
            <span className="text-xs">Tokens</span>
          </Link>
          <Link to="/moti-meter" className="flex flex-col items-center gap-1 text-orange-400">
            <Flame className="h-5 w-5" />
            <span className="text-xs">MOTI</span>
          </Link>
          <Link to="/ai-prediction" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">AI</span>
          </Link>
          <Link to="/subscribe" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <User className="h-5 w-5" />
            <span className="text-xs">Account</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default MotiMeter;