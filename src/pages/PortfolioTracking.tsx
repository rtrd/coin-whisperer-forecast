import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAdScript } from "@/hooks/useAdScript";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Briefcase,
  BarChart3,
  Target,
  Calculator,
  Wallet,
  Shield,
  Activity,
  Globe,
  Smartphone,
  Bell,
} from "lucide-react";
import { AdUnit } from "@/components/ads/AdService";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import Footer from "@/components/Footer";
import { getAllCryptos } from "../../utils/api";
import VdoFloatingAd from "@/components/ads/VdoFloatingAd";
import VdoBannerAd from "@/components/ads/VdoBannerAd";
const PortfolioTracking = () => {
  // Initialize ad script on page load
  useAdScript();

  const [marketData, setMarketData] = useState([]);
  const [portfolioDemo, setPortfolioDemo] = useState({
    totalValue: 125430.5,
    totalCost: 98750.0,
    totalGainLoss: 26680.5,
    totalGainLossPercent: 27.02,
    holdings: [],
  });

  const cryptoOptions = [
    {
      value: "bitcoin",
      label: "Bitcoin (BTC)",
      icon: "₿",
      category: "Major",
      score: 8.5,
      prediction: "+12.5%",
    },
    {
      value: "ethereum",
      label: "Ethereum (ETH)",
      icon: "Ξ",
      category: "Major",
      score: 8.2,
      prediction: "+8.3%",
    },
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
        console.error("Cache parsing error:", err);
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
      console.error("Error fetching market data:", error);
      // Fallback to mock data
      setMarketData([
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          price_change_percentage_24h: 5.2,
          image:
            "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
          current_price: 118184,
        },
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          price_change_percentage_24h: 3.1,
          image:
            "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
          current_price: 3007,
        },
        {
          id: "cardano",
          name: "Cardano",
          symbol: "ADA",
          price_change_percentage_24h: -2.5,
          image:
            "https://assets.coingecko.com/coins/images/975/large/cardano.png",
          current_price: 0.72,
        },
        {
          id: "solana",
          name: "Solana",
          symbol: "SOL",
          price_change_percentage_24h: -1.8,
          image:
            "https://assets.coingecko.com/coins/images/4128/large/solana.png",
          current_price: 164,
        },
      ]);
    }
  };

  useEffect(() => {
    fetchAndCacheMarketData();
    generateDemoPortfolio();
  }, []);

  const generateDemoPortfolio = () => {
    const demoHoldings = [
      {
        symbol: "BTC",
        name: "Bitcoin",
        amount: 2.5,
        avgPrice: 42000,
        currentPrice: 45000,
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        amount: 15,
        avgPrice: 2800,
        currentPrice: 3200,
        image:
          "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      },
      {
        symbol: "SOL",
        name: "Solana",
        amount: 50,
        avgPrice: 140,
        currentPrice: 180,
        image:
          "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      },
      {
        symbol: "ADA",
        name: "Cardano",
        amount: 5000,
        avgPrice: 0.45,
        currentPrice: 0.72,
        image:
          "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      },
      {
        symbol: "MATIC",
        name: "Polygon",
        amount: 2000,
        avgPrice: 0.85,
        currentPrice: 1.05,
        image:
          "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
      },
    ];

    const enrichedHoldings = demoHoldings.map((holding) => {
      const value = holding.amount * holding.currentPrice;
      const cost = holding.amount * holding.avgPrice;
      const gainLoss = value - cost;
      const gainLossPercent = (gainLoss / cost) * 100;

      return {
        ...holding,
        value,
        cost,
        gainLoss,
        gainLossPercent,
      };
    });

    setPortfolioDemo((prev) => ({
      ...prev,
      holdings: enrichedHoldings,
    }));
  };

  return (
    <>
      <Helmet>
        <title>
          Portfolio Tracking - Advanced Crypto Portfolio Analytics |
          CryptoInsights
        </title>
        <meta
          name="description"
          content="Track your cryptocurrency portfolio with real-time data, performance analytics, and professional-grade tools. Get early access to our portfolio tracking platform."
        />
      </Helmet>

      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-x-hidden">
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
              <Button
                variant="outline"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8">
              <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4">
                      <Briefcase className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                      Professional Portfolio Tracking
                    </h2>
                    <Badge
                      variant="outline"
                      className="text-yellow-400 border-yellow-400 px-4 py-2 text-sm mb-4"
                    >
                      COMING SOON
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30">
                      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full mb-3 sm:mb-4">
                        <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                        Multi-Wallet Support
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        Connect multiple wallets and exchanges
                      </p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl border border-green-500/30">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                        <Activity className="h-8 w-8 text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Real-Time Analytics
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Live performance metrics updated every second
                      </p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                        <Shield className="h-8 w-8 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Secure & Private
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Bank-level security with read-only connections
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Future Features Section */}
              <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl mb-4">
                    Advanced Features Coming Soon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <BarChart3 className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">
                            Advanced Analytics
                          </h4>
                          <p className="text-gray-300 text-sm">
                            Risk analysis, correlation matrices, Sharpe ratio
                            calculations
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Target className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">
                            Portfolio Rebalancing
                          </h4>
                          <p className="text-gray-300 text-sm">
                            Automated suggestions and manual rebalancing tools
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Bell className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">
                            Smart Alerts
                          </h4>
                          <p className="text-gray-300 text-sm">
                            Price, volume, and performance notifications
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                          <Calculator className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">
                            Tax Optimization
                          </h4>
                          <p className="text-gray-300 text-sm">
                            Tax-loss harvesting and FIFO/LIFO calculations
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <Globe className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">
                            DeFi Integration
                          </h4>
                          <p className="text-gray-300 text-sm">
                            Track staking, liquidity pools, and yield farming
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-pink-500/20 rounded-lg">
                          <Smartphone className="h-5 w-5 text-pink-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">
                            Mobile App
                          </h4>
                          <p className="text-gray-300 text-sm">
                            iOS and Android apps with push notifications
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ad Banner After Section 1 */}
              <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                {/* <GAMAdUnit
                  adUnitId="div-gpt-ad-1752654531765-3"
                  size={[728, 120]}
                  className="max-w-full h-full"
                /> */}
                <span id="ct_cVqQhaBjbGn"></span>
              </div>

              {/* Portfolio Tracking FAQ */}
              <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border-b border-gray-600/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="h-8 w-8 text-green-400" />
                    <div>
                      <CardTitle className="text-2xl text-white">
                        Portfolio Tracking FAQ
                      </CardTitle>
                      <p className="text-gray-300 mt-2">
                        Common questions about our upcoming portfolio tracking
                        platform
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="space-y-3">
                    <AccordionItem
                      value="real-time-tracking"
                      className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-green-500/50 transition-colors"
                    >
                      <AccordionTrigger className="text-white hover:text-green-400 font-medium">
                        How does real-time portfolio tracking work?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                        Our portfolio tracking automatically syncs with your
                        exchange accounts and wallets using secure read-only API
                        connections. Your portfolio value, gains/losses, and
                        asset allocation are updated in real-time as market
                        prices change, giving you instant visibility into your
                        investment performance.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="performance-analytics"
                      className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-blue-500/50 transition-colors"
                    >
                      <AccordionTrigger className="text-white hover:text-blue-400 font-medium">
                        What kind of performance analytics will I get?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                        You'll get comprehensive analytics including total
                        portfolio value, individual asset performance,
                        profit/loss calculations, percentage gains, risk
                        metrics, correlation analysis, and historical
                        performance charts. Track your investment strategy
                        effectiveness with detailed breakdowns by time periods.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="multi-platform-support"
                      className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-purple-500/50 transition-colors"
                    >
                      <AccordionTrigger className="text-white hover:text-purple-400 font-medium">
                        Can I track assets across multiple exchanges and
                        wallets?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                        Yes! Connect multiple exchanges, hardware wallets, and
                        DeFi protocols in one unified dashboard. Get a complete
                        view of your entire crypto portfolio regardless of where
                        your assets are stored, with automatic aggregation and
                        consolidated reporting.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="risk-management"
                      className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-orange-500/50 transition-colors"
                    >
                      <AccordionTrigger className="text-white hover:text-orange-400 font-medium">
                        How does portfolio tracking help with risk management?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                        Our tracking provides risk metrics like portfolio
                        volatility, asset correlation, and concentration risk
                        alerts. Set up custom alerts for significant price
                        movements, portfolio rebalancing suggestions, and
                        diversification recommendations to help optimize your
                        investment strategy.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="tax-reporting"
                      className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-cyan-500/50 transition-colors"
                    >
                      <AccordionTrigger className="text-white hover:text-cyan-400 font-medium">
                        How does it help with tax reporting and record keeping?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                        Automatically track cost basis, realized/unrealized
                        gains, and generate tax-ready reports. The system
                        maintains detailed transaction history, calculates
                        holding periods, and provides export functionality for
                        popular tax software, making crypto tax season much
                        simpler.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="privacy-security"
                      className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-pink-500/50 transition-colors"
                    >
                      <AccordionTrigger className="text-white hover:text-pink-400 font-medium">
                        How secure is my portfolio data and what about privacy?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                        We use bank-level encryption and never store your
                        private keys or trading credentials. All connections are
                        read-only, your data is encrypted both in transit and at
                        rest, and we follow strict privacy policies. You
                        maintain full control over your assets while getting
                        comprehensive tracking insights.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Ad Banner After Section 2 */}
              <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                {/* <GAMAdUnit
                  adUnitId="div-gpt-ad-1752654531765-4"
                  size={[728, 120]}
                  className="max-w-full h-full"
                /> */}
                <div className="max-w-full h-full">
                  <VdoBannerAd />
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-8 space-y-8">
                <MarketWinnersWidget topGainnersandLoosers={marketData} />
                <AdUnit type="skyscraper" />
              </div>
            </div>
          </div>
        </div>
        <VdoFloatingAd />
        <VdoBannerAd />
        <Footer />
      </div>
    </>
  );
};

export default PortfolioTracking;
