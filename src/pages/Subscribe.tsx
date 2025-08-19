import React, { useState, useEffect } from 'react';
import { EnhancedSEOHead } from "@/components/seo/EnhancedSEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Crown, Check, Mail, ArrowLeft, Zap, TrendingUp, Users, Star, Rocket, Target, DollarSign, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { IndexHeader } from "@/components/IndexHeader";
import { MainNavigation } from "@/components/MainNavigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { trackFormSubmission, trackFormError, trackPageView } from "@/utils/analytics";
import { generateSubscribeSEO } from "@/utils/pageSeo";
import { PremiumFeatureCard } from "@/components/subscribe/PremiumFeatureCard";
import { TestimonialCard } from "@/components/subscribe/TestimonialCard";
import { LiveStatsWidget } from "@/components/subscribe/LiveStatsWidget";
import { ComparisonTable } from "@/components/subscribe/ComparisonTable";
import { useAdScript } from "@/hooks/useAdScript";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const seoData = generateSubscribeSEO();
  
  // Initialize ad script on page load
  useAdScript();

  // Track page view on component mount
  React.useEffect(() => {
    trackPageView('/subscribe');
    
  }, []);

  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      trackFormError("subscribe_page", "empty_email");
      return;
    }

    setIsLoading(true);
    
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Successfully subscribed! Premium features unlocked.");
    setIsLoading(false);
    setEmail('');
    
    // Track successful subscription
    trackFormSubmission("subscribe_page", true);
    
  };

  const premiumFeatures = [
    {
      icon: Brain,
      title: "Advanced AI Predictions",
      description: "Get 95% accurate price predictions powered by machine learning algorithms trained on billions of data points."
    },
    {
      icon: Zap,
      title: "Real-time Market Alerts",
      description: "Never miss a pump again with instant notifications for price movements, whale activities, and market shifts."
    },
    {
      icon: Rocket,
      title: "Pump.fun Integration",
      description: "Early access to trending memecoins with automated detection of viral tokens before they explode."
    },
    {
      icon: TrendingUp,
      title: "Advanced Technical Analysis",
      description: "50+ professional indicators including RSI, MACD, Bollinger Bands, and proprietary momentum signals."
    },
    {
      icon: MessageCircle,
      title: "Social Sentiment Analysis",
      description: "Real-time social media monitoring and sentiment tracking across Twitter, Reddit, and Discord communities."
    },
    {
      icon: Target,
      title: "Precision Trading Signals",
      description: "Automated buy/sell signals with exact entry and exit points for maximum profit potential."
    }
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Day Trader",
      testimonial: "Made $47k in my first month using the AI predictions. The accuracy is insane!",
      rating: 5,
      profit: "+340%"
    },
    {
      name: "Sarah Martinez",
      role: "Crypto Investor",
      testimonial: "The pump alerts have saved me countless hours of research. Pure gold!",
      rating: 5,
      profit: "+182%"
    },
    {
      name: "Mike Thompson",
      role: "Portfolio Manager",
      testimonial: "Finally, a tool that actually works. My clients are seeing 10x returns.",
      rating: 5,
      profit: "+890%"
    }
  ];

  return (
    <>
      <EnhancedSEOHead seoData={seoData} />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-12">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        
        {/* Navigation */}
        <MainNavigation />
        
        <div className="container mx-auto px-4 py-6 relative z-10 pt-20">
          {/* Homepage Header */}
          <IndexHeader 
            selectedCrypto="bitcoin"
            cryptoOptions={cryptoOptions}
            currentPrice={50000}
            priceChange={2.5}
          />
        </div>

        <div className="container mx-auto px-4 pb-6 relative z-10">
          {/* Ad Banner After Header */}
          <GAMAdUnit
            adUnitId="div-gpt-ad-1752654531765-0"
            size={[728, 90]}
            className="mb-6 md:mb-8"
          />

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Unlock
              </span>
              <br />
              <span className="flex items-center justify-center gap-4 mt-2">
                <Crown className="h-12 w-12 text-yellow-400 animate-glow" />
                Premium Trading
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
              Join thousands of traders using AI-powered predictions and advanced technical analysis.
              Get real-time market insights and never miss trading opportunities.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Market Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>AI Predictions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Technical Indicators</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {/* Subscription Form - Full Width */}
              <div className="lg:col-span-3">
                <Card className="bg-gray-800/50 border-gray-700 shadow-2xl max-w-3xl mx-auto">
                  <CardHeader className="text-center">
                    <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/50 rounded-full px-4 py-2 mb-4 mx-auto w-fit">
                      <Crown className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-semibold text-sm">FREE PREMIUM ACCESS</span>
                    </div>
                    <CardTitle className="text-3xl text-white flex items-center justify-center gap-3 mb-2">
                      <Rocket className="h-8 w-8 text-purple-400" />
                      Start Your Premium Journey
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-300 max-w-xl mx-auto">
                      Join our community by entering your email - No payment required. Premium features unlock instantly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                      <div>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-gray-700/50 border-gray-600 text-white text-lg h-14 focus:border-purple-400 transition-colors text-center"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-purple-600 hover:from-green-600 hover:to-purple-700 text-lg h-14 shadow-xl font-bold text-white"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Brain className="h-6 w-6 animate-spin" />
                            Activating Premium...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Crown className="h-6 w-6" />
                            Get Instant Free Access
                          </div>
                        )}
                      </Button>
                    </form>

                      <div className="grid grid-cols-3 gap-6 mt-8 max-w-xl mx-auto">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">24/7</div>
                          <div className="text-sm text-gray-400">Market Monitoring</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">Free</div>
                          <div className="text-sm text-gray-400">Access</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">Instant</div>
                          <div className="text-sm text-gray-400">Setup</div>
                        </div>
                      </div>

                    <div className="mt-6 p-4 bg-gray-700/50 border border-gray-600 rounded-lg text-center">
                      <p className="text-white font-semibold">
                        ✨ <strong>100% Free Premium:</strong> No credit card required, no hidden fees, unlock everything with just your email!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Premium Features Grid */}
            <div className="mb-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">
                  Everything You Need to <span className="text-purple-400">Dominate</span> Crypto
                </h2>
                <p className="text-gray-300">Professional trading tools for crypto analysis</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {premiumFeatures.map((feature, index) => (
                  <PremiumFeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    highlight={index === 0}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Ad Banner Before Footer */}
        <div className="container mx-auto px-4 py-6">
          <GAMAdUnit
            adUnitId="div-gpt-ad-1752654531765-1"
            size={[728, 90]}
            className="mb-6"
          />
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Footer />
      </div>
    </>
  );
};

export default Subscribe;
