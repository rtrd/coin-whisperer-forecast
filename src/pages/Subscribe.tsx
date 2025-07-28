import React, { useState } from 'react';
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Crown, Check, Mail, ArrowLeft, Zap, TrendingUp, Users, Star, Rocket, Target, DollarSign, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { IndexHeader } from "@/components/IndexHeader";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { trackFormSubmission, trackFormError, trackSubscriptionEvent, trackPageView } from "@/utils/analytics";
import { generateSubscribeSEO } from "@/utils/pageSeo";
import { PremiumFeatureCard } from "@/components/subscribe/PremiumFeatureCard";
import { TestimonialCard } from "@/components/subscribe/TestimonialCard";
import { LiveStatsWidget } from "@/components/subscribe/LiveStatsWidget";
import { ComparisonTable } from "@/components/subscribe/ComparisonTable";
import { useAdScript } from "@/hooks/useAdScript";

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const seoData = generateSubscribeSEO();
  
  // Initialize ad script on page load
  useAdScript();

  // Track page view on component mount
  React.useEffect(() => {
    trackPageView('/subscribe');
    trackSubscriptionEvent('view_plans', 'premium', 'subscribe_page');
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
    trackSubscriptionEvent("start_checkout", "premium", "subscribe_page");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Successfully subscribed! Premium features unlocked.");
    setIsLoading(false);
    setEmail('');
    
    // Track successful subscription
    trackFormSubmission("subscribe_page", true);
    trackSubscriptionEvent("complete", "premium", "subscribe_page");
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
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
        <meta property="og:url" content={seoData.openGraph.url} />
        <meta property="og:image" content={seoData.openGraph.image} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content={seoData.twitter.card} />
        <meta name="twitter:title" content={seoData.twitter.title} />
        <meta name="twitter:description" content={seoData.twitter.description} />
        <meta name="twitter:image" content={seoData.twitter.image} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto px-4 py-6 relative z-10">
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
              <Button variant="outline" size="sm" className="bg-glass-bg backdrop-blur-sm border-glass-border text-white hover:bg-glass-bg/80">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-crypto-gold/20 border border-crypto-gold/50 rounded-full px-4 py-2 mb-4">
              <Star className="h-4 w-4 text-crypto-gold" />
              <span className="text-crypto-gold font-semibold text-sm">LIMITED TIME OFFER</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Unlock
              </span>
              <br />
              <span className="flex items-center justify-center gap-4 mt-2">
                <Crown className="h-12 w-12 text-crypto-gold animate-glow" />
                Premium Trading
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
              Join 12,847+ traders making <span className="text-crypto-success font-bold">$2,340+ daily</span> with our AI-powered predictions.
              Get 95% accurate signals and never miss a pump again.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-crypto-success rounded-full animate-pulse"></div>
                <span>12,847 Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-crypto-gold rounded-full animate-pulse"></div>
                <span>847 Signals Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>94.8% Success Rate</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {/* Subscription Form - Full Width */}
              <div className="lg:col-span-3">
                <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 shadow-2xl max-w-3xl mx-auto">
                  <CardHeader className="text-center">
                    <div className="inline-flex items-center gap-2 bg-crypto-success/20 border border-crypto-success/50 rounded-full px-4 py-2 mb-4 mx-auto w-fit">
                      <Crown className="h-4 w-4 text-crypto-success" />
                      <span className="text-crypto-success font-semibold text-sm">FREE PREMIUM ACCESS</span>
                    </div>
                    <CardTitle className="text-3xl text-white flex items-center justify-center gap-3 mb-2">
                      <Rocket className="h-8 w-8 text-blue-400" />
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
                          className="bg-glass-bg border-glass-border text-white text-lg h-14 focus:border-blue-400 transition-colors text-center"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-crypto-success to-blue-500 hover:from-crypto-success/90 hover:to-blue-500/90 text-lg h-14 shadow-xl font-bold text-white"
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
                        <div className="text-2xl font-bold text-white">12,847</div>
                        <div className="text-sm text-gray-400">Active Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-crypto-success">Free</div>
                        <div className="text-sm text-gray-400">Forever</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">Instant</div>
                        <div className="text-sm text-gray-400">Access</div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-crypto-success/20 to-blue-500/20 border border-crypto-success/50 rounded-lg text-center">
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
                  Everything You Need to <span className="text-blue-400">Dominate</span> Crypto
                </h2>
                <p className="text-gray-300">Professional trading tools used by 12,847+ successful traders</p>
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

            {/* Testimonials */}
            <div className="mb-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">
                  Real Traders, Real <span className="text-crypto-success">Profits</span>
                </h2>
                <p className="text-gray-300">See what our community is saying about their success</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={index} {...testimonial} />
                ))}
              </div>
            </div>


            {/* Second Subscription CTA */}
            <div className="text-center">
              <Card className="bg-gradient-to-br from-crypto-success/20 to-blue-500/20 border-crypto-success/50 shadow-2xl max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Crown className="h-16 w-16 text-crypto-gold animate-float" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-crypto-success rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">!</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Don't Miss Out!</h3>
                  <p className="text-gray-300 mb-6 text-lg">
                    12,847+ traders are already using our free premium tools. Join the community that's revolutionizing crypto trading.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder="Enter your email for instant access"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-glass-bg border-glass-border text-white text-lg h-12 focus:border-crypto-success transition-colors text-center"
                      required
                    />
                    <Button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-crypto-success to-blue-500 hover:from-crypto-success/90 hover:to-blue-500/90 text-white font-bold text-lg h-12"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Brain className="h-5 w-5 animate-spin" />
                          Activating...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Rocket className="h-5 w-5" />
                          Start Trading Smarter - Free
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Footer />
      </div>
    </>
  );
};

export default Subscribe;
