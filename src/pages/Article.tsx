
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Clock, Share2, BookmarkPlus } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { IndexSidebar } from "@/components/IndexSidebar";

const Article = () => {
  const { articleId } = useParams<{ articleId: string }>();

  const articles = [
    {
      id: 1,
      title: "Bitcoin Breaks $45K: What This Means for Your Portfolio",
      content: `
        <p>As Bitcoin surges past $45,000, analysts predict this could be the start of a new bull run. The cryptocurrency market has been showing signs of recovery after months of uncertainty, and this latest milestone could signal a shift in investor sentiment.</p>
        
        <h2>Market Analysis</h2>
        <p>The recent price action can be attributed to several factors:</p>
        <ul>
          <li>Increased institutional adoption</li>
          <li>Regulatory clarity in major markets</li>
          <li>Improved market sentiment</li>
          <li>Technical breakout patterns</li>
        </ul>
        
        <h2>What This Means for Investors</h2>
        <p>For retail investors, this price movement presents both opportunities and risks. It's crucial to maintain a balanced perspective and consider your risk tolerance before making investment decisions.</p>
        
        <p>Remember to always do your own research and never invest more than you can afford to lose. The cryptocurrency market remains highly volatile and unpredictable.</p>
      `,
      author: "Sarah Chen",
      date: "2024-01-15",
      category: "Market Analysis",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Ethereum 2.0 Staking Rewards: Complete Guide for 2024",
      content: `
        <p>Ethereum 2.0 staking has become one of the most popular ways to earn passive income in the cryptocurrency space. This comprehensive guide will walk you through everything you need to know about ETH staking in 2024.</p>
        
        <h2>Understanding ETH Staking</h2>
        <p>Staking is the process of participating in the proof-of-stake consensus mechanism by locking up your ETH to help secure the network. In return, you earn rewards in the form of additional ETH.</p>
        
        <h2>Staking Options</h2>
        <ul>
          <li>Solo staking (32 ETH minimum)</li>
          <li>Staking pools</li>
          <li>Centralized exchange staking</li>
          <li>Liquid staking protocols</li>
        </ul>
        
        <h2>Risks and Considerations</h2>
        <p>While staking can be profitable, it's important to understand the risks involved, including slashing penalties, smart contract risks, and liquidity considerations.</p>
      `,
      author: "Mike Rodriguez",
      date: "2024-01-14",
      category: "DeFi Guide",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop"
    },
  ];

  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  const article = articles.find(a => a.id === Number(articleId));

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
        <Card className="bg-gray-800/50 border-gray-700 w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4 text-shadow-lg">Article Not Found</h1>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <Link to="/">
            <Button variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8">
            {/* Article Header */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-blue-600">{article.category}</Badge>
                </div>
                <CardTitle className="text-2xl md:text-3xl text-white mb-4 text-shadow-lg">{article.title}</CardTitle>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-300 gap-4">
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm md:text-base">{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm md:text-base">{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm md:text-base">{article.readTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Ad Banner - Hidden on mobile */}
            <div className="hidden md:flex justify-center">
              <AdBanner width={728} height={90} position="horizontal" />
            </div>

            {/* Article Content */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 md:p-8">
                <div 
                  className="prose prose-invert max-w-none text-gray-200 prose-headings:text-shadow-lg prose-h2:text-shadow-lg prose-h3:text-shadow-lg"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </CardContent>
            </Card>

            {/* Related Articles */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-shadow-lg">Related Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.filter(a => a.id !== article.id).slice(0, 2).map((relatedArticle) => (
                    <Link key={relatedArticle.id} to={`/article/${relatedArticle.id}`} className="block">
                      <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors">
                        <Badge className="mb-2 bg-blue-600">{relatedArticle.category}</Badge>
                        <h3 className="text-white font-semibold mb-2 text-shadow-lg">{relatedArticle.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{relatedArticle.author}</span>
                          <span>{relatedArticle.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Hidden on mobile, shown on large screens */}
          <div className="hidden lg:block">
            <IndexSidebar
              selectedCrypto="bitcoin"
              currentPrice={45000}
              priceChange={2.5}
              cryptoData={null}
              dataLoading={false}
              cryptoOptions={cryptoOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
