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
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";

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

          {/* MOTI Meter Header - Enhanced with animations and gradients */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 blur-3xl -z-10"></div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Flame className="h-12 w-12 text-orange-400 animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                MOTI METER
              </h1>
              <Flame className="h-12 w-12 text-orange-400 animate-pulse" />
            </div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              The Ultimate Meme Coin Momentum Indicator - Ranking the hottest memecoins based on 
              viral energy, community conviction, and market momentum
            </p>
            <div className="mt-6 flex justify-center">
              <div className="px-6 py-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-full">
                <span className="text-orange-300 font-semibold">🔥 Live Rankings Updated Every Hour 🔥</span>
              </div>
            </div>
          </div>

          {/* Enhanced Scoring Criteria with better contrast */}
          <Card className="mb-12 bg-gray-800 border-gray-600 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-3 text-xl">
                <BarChart3 className="h-6 w-6 text-purple-400" />
                MOTI Scoring Criteria
                <div className="ml-auto">
                  <Badge className="bg-purple-600 text-white">AI Powered</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 bg-gray-900 rounded-lg border border-orange-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <strong className="text-orange-300 font-bold">Twitter Interaction</strong>
                  </div>
                  <p className="text-gray-200 text-sm">Viral energy & community hype</p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg border border-red-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <strong className="text-red-300 font-bold">Good Ticker</strong>
                  </div>
                  <p className="text-gray-200 text-sm">Short, memorable, meme-worthy</p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg border border-pink-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                    <strong className="text-pink-300 font-bold">Cultural References</strong>
                  </div>
                  <p className="text-gray-200 text-sm">Taps into current memes & trends</p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg border border-purple-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <strong className="text-purple-300 font-bold">Age & Maturity</strong>
                  </div>
                  <p className="text-gray-200 text-sm">Past first pump, seasoned meme</p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg border border-blue-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <strong className="text-blue-300 font-bold">Volume Consistency</strong>
                  </div>
                  <p className="text-gray-200 text-sm">High, stable trading volume</p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg border border-green-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <strong className="text-green-300 font-bold">Holder Growth</strong>
                  </div>
                  <p className="text-gray-200 text-sm">Growing conviction despite dips</p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg border border-yellow-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <strong className="text-yellow-300 font-bold">Higher Lows</strong>
                  </div>
                  <p className="text-gray-200 text-sm">Technical trend strength</p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg border border-orange-400/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                    <strong className="text-orange-300 font-bold">Final MOTI Score</strong>
                  </div>
                  <p className="text-gray-200 text-sm">Average of all criteria (1-5)</p>
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

          {/* Enhanced Time Period Tabs */}
          <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as '24h' | '5d' | '7d')} className="mb-10">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-3 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-xl p-2 shadow-2xl h-14">
                <TabsTrigger 
                  value="24h" 
                  className="h-10 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 font-medium"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  24 Hours
                </TabsTrigger>
                <TabsTrigger 
                  value="5d" 
                  className="h-10 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 font-medium"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  5 Days
                </TabsTrigger>
                <TabsTrigger 
                  value="7d" 
                  className="h-10 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 font-medium"
                >
                  <Users className="h-4 w-4 mr-2" />
                  7 Days
                </TabsTrigger>
              </TabsList>
            </div>

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
                     <div className="grid grid-cols-1 gap-6">
                      {motiTokens?.map((token, index) => (
                        <React.Fragment key={token.id}>
                          <Card className="bg-gray-800 border-gray-600 hover:bg-gray-750 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
                            <CardContent className="p-8">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-6">
                                   <div className="flex flex-col items-center">
                                     <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                                       <span className="text-2xl font-black text-white">#{index + 1}</span>
                                     </div>
                                   </div>
                                  
                                   <div className="flex items-center gap-4">
                                     <div className="relative">
                                       <img 
                                         src={token.image || '/placeholder.svg'} 
                                         alt={token.name}
                                         className="w-16 h-16 rounded-full shadow-lg ring-4 ring-purple-500/20"
                                         onError={(e) => {
                                           e.currentTarget.src = '/placeholder.svg';
                                         }}
                                       />
                                       <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                                         <Flame className="w-3 h-3 text-white" />
                                       </div>
                                     </div>
                                     <div>
                                       <div className="flex items-center gap-3">
                                         <h3 className="text-xl font-bold text-white">{token.name}</h3>
                                         <Badge className={`${getMotiColor(token.motiScore)} text-white px-3 py-1 text-sm font-bold shadow-lg`}>
                                           {getMotiLabel(token.motiScore)}
                                         </Badge>
                                       </div>
                                       <p className="text-gray-400 text-base font-semibold uppercase tracking-wider mt-1">${token.symbol}</p>
                                     </div>
                                   </div>
                                </div>

                                 <div className="flex items-center gap-6">
                                   <div className="flex gap-3">
                                     <div className="bg-gray-900/50 rounded-lg p-3 border border-orange-400/30 backdrop-blur-sm min-w-[120px]">
                                       <div className="text-xs text-orange-300 uppercase tracking-wide mb-1 font-semibold">MOTI Score</div>
                                       <div className="text-2xl font-black text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text">
                                         {token.motiScore.toFixed(1)}/5
                                       </div>
                                     </div>
                                     <div className="bg-gray-900/50 rounded-lg p-3 border border-blue-400/30 backdrop-blur-sm min-w-[140px]">
                                       <div className="text-xs text-blue-300 uppercase tracking-wide mb-1 font-semibold">Current Price</div>
                                       <div className="text-xl font-bold text-gray-100">
                                         ${token.current_price?.toFixed(6) || 'N/A'}
                                       </div>
                                     </div>
                                     <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600/30 backdrop-blur-sm min-w-[120px]">
                                       <div className="text-xs text-gray-300 uppercase tracking-wide mb-1 font-semibold">24h Change</div>
                                       <div className={`text-xl font-bold ${token.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                         {token.price_change_percentage_24h >= 0 ? '+' : ''}{token.price_change_percentage_24h?.toFixed(2) || '0'}%
                                       </div>
                                     </div>
                                   </div>
                                  
                                   {/* Enhanced Buy/Sell Buttons */}
                                   <div className="flex flex-col gap-3">
                                     <Button
                                       size="lg"
                                       className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                                       onClick={() => handleBuyToken(token)}
                                     >
                                       <ShoppingCart className="h-4 w-4 mr-2" />
                                       Buy Now
                                     </Button>
                                     <Button
                                       size="lg"
                                       className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 shadow-lg hover:shadow-red-500/25 transition-all duration-300 border-0"
                                       onClick={() => handleSellToken(token)}
                                     >
                                       <TrendingDown className="h-4 w-4 mr-2" />
                                       Sell
                                     </Button>
                                   </div>
                                </div>
                              </div>

                               {/* Enhanced Detailed Scoring with better contrast */}
                              <div className="mt-6 pt-6 border-t border-gray-600">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                                  <div className="text-center p-3 bg-gray-900 rounded-lg border border-orange-400/30">
                                    <div className="text-2xl font-bold text-orange-300 mb-1">{token.scores.twitterInteraction}</div>
                                    <div className="text-gray-300 text-sm font-medium">Twitter</div>
                                  </div>
                                  <div className="text-center p-3 bg-gray-900 rounded-lg border border-red-400/30">
                                    <div className="text-2xl font-bold text-red-300 mb-1">{token.scores.goodTicker}</div>
                                    <div className="text-gray-300 text-sm font-medium">Ticker</div>
                                  </div>
                                  <div className="text-center p-3 bg-gray-900 rounded-lg border border-pink-400/30">
                                    <div className="text-2xl font-bold text-pink-300 mb-1">{token.scores.culturalRefs}</div>
                                    <div className="text-gray-300 text-sm font-medium">Culture</div>
                                  </div>
                                  <div className="text-center p-3 bg-gray-900 rounded-lg border border-purple-400/30">
                                    <div className="text-2xl font-bold text-purple-300 mb-1">{token.scores.ageOfProject}</div>
                                    <div className="text-gray-300 text-sm font-medium">Age</div>
                                  </div>
                                  <div className="text-center p-3 bg-gray-900 rounded-lg border border-blue-400/30">
                                    <div className="text-2xl font-bold text-blue-300 mb-1">{token.scores.volumeConsistency}</div>
                                    <div className="text-gray-300 text-sm font-medium">Volume</div>
                                  </div>
                                  <div className="text-center p-3 bg-gray-900 rounded-lg border border-green-400/30">
                                    <div className="text-2xl font-bold text-green-300 mb-1">{token.scores.holderGrowth}</div>
                                    <div className="text-gray-300 text-sm font-medium">Holders</div>
                                  </div>
                                  <div className="text-center p-3 bg-gray-900 rounded-lg border border-yellow-400/30">
                                    <div className="text-2xl font-bold text-yellow-300 mb-1">{token.scores.higherLows}</div>
                                    <div className="text-gray-300 text-sm font-medium">Lows</div>
                                  </div>
                                </div>
                                
                                {/* Enhanced AI Summary with better contrast */}
                                <div className="bg-gray-900 rounded-xl p-6 border border-purple-400/30">
                                  <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                      <span className="text-white text-sm font-bold">AI</span>
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-purple-300 font-bold text-lg mb-3 flex items-center gap-2">
                                        MOTI Analysis
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                      </h4>
                                      <p className="text-gray-100 text-base leading-relaxed">
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
            <WordPressIntegration />
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