import React from 'react';
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import { IndexHeader } from "@/components/IndexHeader";
import Footer from "@/components/Footer";
import { PumpFunIntegration } from "@/components/PumpFunIntegration";
import { generatePumpFunSEO } from "@/utils/pageSeo";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";

const PumpFun = () => {
  const seoData = generatePumpFunSEO();
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' }
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

      <script async src="https://appsha-prm.ctengine.io/js/script.js?wkey=Fkrv2lWxUV"></script>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-8">
          {/* Top Ad */}
          <GAMAdUnit
            adUnitId="div-gpt-ad-1752654531765-0"
            className="mb-8 flex justify-center"
            size={[728, 90]}
          />

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
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Rocket className="h-12 w-12 text-purple-400" />
              Solana Memecoin Insights
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover and track trending memecoins and new token launches on Pump.fun
            </p>
          </div>

          {/* Risk Warning */}
          <Card className="bg-yellow-900/20 border-yellow-700 shadow-2xl mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-200 font-medium mb-1">Investment Disclaimer</p>
                  <p className="text-xs text-yellow-300">
                    AI predictions and memecoin data are for educational purposes only. Cryptocurrency investments carry extremely high risk, especially memecoins. 
                    Always do your own research before making investment decisions. Past performance does not guarantee future results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <PumpFunIntegration />
          
          {/* Bottom Ad */}
          <GAMAdUnit
            adUnitId="div-gpt-ad-1752654531765-1"
            className="mt-8 mb-8 flex justify-center"
            size={[728, 90]}
          />
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default PumpFun;
