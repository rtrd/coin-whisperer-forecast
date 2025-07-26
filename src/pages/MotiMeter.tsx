import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { useAdScript } from "@/hooks/useAdScript";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, Flame, Clock, Users, BarChart3, ShoppingCart, TrendingDown, Home, Search, User, ArrowLeft, AlertTriangle } from "lucide-react";
import { useMotiMeterData } from "@/hooks/useMotiMeterData";
import { MotiToken } from "@/types/motiMeter";
import { IndexHeader } from "@/components/IndexHeader";
import { AdUnit } from "@/components/ads/AdService";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import WordPressIntegration from "@/components/WordPressIntegration";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* MOTI Meter Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Flame className="h-10 w-10 text-orange-400" />
                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                    MOTI METER
                  </h1>
                  <Flame className="h-10 w-10 text-orange-400" />
                </div>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  The Ultimate Meme Coin Momentum Indicator - Ranking the hottest memecoins based on 
                  viral energy, community conviction, and market momentum
                </p>
              </div>

              {/* Scoring Criteria */}
              <Card className="mb-8 bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    MOTI Scoring Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="text-gray-300">
                      <strong className="text-orange-400">Twitter Interaction</strong><br />
                      Viral energy & community hype
                    </div>
                    <div className="text-gray-300">
                      <strong className="text-orange-400">Good Ticker</strong><br />
                      Short, memorable, meme-worthy
                    </div>
                    <div className="text-gray-300">
                      <strong className="text-orange-400">Cultural References</strong><br />
                      Taps into current memes & trends
                    </div>
                    <div className="text-gray-300">
                      <strong className="text-orange-400">Age & Maturity</strong><br />
                      Past first pump, seasoned meme
                    </div>
                    <div className="text-gray-300">
                      <strong className="text-orange-400">Volume Consistency</strong><br />
                      High, stable trading volume
                    </div>
                    <div className="text-gray-300">
                      <strong className="text-orange-400">Holder Growth</strong><br />
                      Growing conviction despite dips
                    </div>
                    <div className="text-gray-300">
                      <strong className="text-orange-400">Higher Lows</strong><br />
                      Technical trend strength
                    </div>
                    <div className="text-gray-300">
                      <strong className="text-orange-400">Final Score</strong><br />
                      Average of all criteria (1-5)
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Period Tabs */}
              <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as '24h' | '5d' | '7d')} className="mb-8">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
                  <TabsTrigger value="24h" className="data-[state=active]:bg-purple-600">
                    <Clock className="h-4 w-4 mr-2" />
                    24 Hours
                  </TabsTrigger>
                  <TabsTrigger value="5d" className="data-[state=active]:bg-purple-600">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    5 Days
                  </TabsTrigger>
                  <TabsTrigger value="7d" className="data-[state=active]:bg-purple-600">
                    <Users className="h-4 w-4 mr-2" />
                    7 Days
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={selectedPeriod} className="mt-6">
                  {isLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                      {[...Array(10)].map((_, i) => (
                        <Card key={i} className="bg-gray-800/50 border-gray-700 animate-pulse">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                                <div>
                                  <div className="w-24 h-4 bg-gray-700 rounded mb-2"></div>
                                  <div className="w-16 h-3 bg-gray-700 rounded"></div>
                                </div>
                              </div>
                              <div className="w-20 h-8 bg-gray-700 rounded"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : error ? (
                    <Card className="bg-red-900/20 border-red-700">
                      <CardContent className="p-6 text-center">
                        <p className="text-red-400">Error loading MOTI data: {error.message || 'Unknown error'}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {motiTokens?.map((token, index) => (
                        <React.Fragment key={token.id}>
                          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex flex-col items-center">
                                    <div className="text-2xl font-bold text-white mb-1">#{index + 1}</div>
                                    <Badge className={`${getMotiColor(token.motiScore)} text-white px-2 py-1 text-xs`}>
                                      {getMotiLabel(token.motiScore)}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center gap-3">
                                    <img 
                                      src={token.image || '/placeholder.svg'} 
                                      alt={token.name}
                                      className="w-12 h-12 rounded-full"
                                      onError={(e) => {
                                        e.currentTarget.src = '/placeholder.svg';
                                      }}
                                    />
                                    <div>
                                      <h3 className="text-lg font-semibold text-white">{token.name}</h3>
                                      <p className="text-gray-400 text-sm uppercase">${token.symbol}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-orange-400 mb-1">
                                      {token.motiScore.toFixed(1)}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      ${token.current_price?.toFixed(6) || 'N/A'}
                                    </div>
                                    <div className={`text-sm ${token.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                      {token.price_change_percentage_24h >= 0 ? '+' : ''}{token.price_change_percentage_24h?.toFixed(2) || '0'}%
                                    </div>
                                  </div>
                                  
                                  {/* Buy/Sell Buttons */}
                                  <div className="flex flex-col gap-2">
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1"
                                      onClick={() => handleBuyToken(token)}
                                    >
                                      <ShoppingCart className="h-3 w-3 mr-1" />
                                      Buy
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1"
                                      onClick={() => handleSellToken(token)}
                                    >
                                      <TrendingDown className="h-3 w-3 mr-1" />
                                      Sell
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {/* Detailed Scoring */}
                              <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-xs mb-4">
                                  <div className="text-center">
                                    <div className="text-orange-400 font-semibold">{token.scores.twitterInteraction}</div>
                                    <div className="text-gray-500">Twitter</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-orange-400 font-semibold">{token.scores.goodTicker}</div>
                                    <div className="text-gray-500">Ticker</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-orange-400 font-semibold">{token.scores.culturalRefs}</div>
                                    <div className="text-gray-500">Culture</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-orange-400 font-semibold">{token.scores.ageOfProject}</div>
                                    <div className="text-gray-500">Age</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-orange-400 font-semibold">{token.scores.volumeConsistency}</div>
                                    <div className="text-gray-500">Volume</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-orange-400 font-semibold">{token.scores.holderGrowth}</div>
                                    <div className="text-gray-500">Holders</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-orange-400 font-semibold">{token.scores.higherLows}</div>
                                    <div className="text-gray-500">Lows</div>
                                  </div>
                                </div>
                                
                                {/* AI Summary */}
                                <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-purple-500">
                                  <div className="flex items-start gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-white text-xs font-bold">AI</span>
                                    </div>
                                    <div>
                                      <h4 className="text-purple-400 font-semibold text-sm mb-1">MOTI Analysis</h4>
                                      <p className="text-gray-300 text-sm leading-relaxed">
                                        {token.aiSummary}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

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

              {/* Trending Articles Widget - moved inside main content */}
              <div className="mt-8">
                <WordPressIntegration />
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                <AdUnit type="skyscraper" />
                
                <MarketWinnersWidget topGainnersandLoosers={topGainersAndLosers} />
              </div>
            </div>
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