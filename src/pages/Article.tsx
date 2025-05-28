
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
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&h=600&fit=crop"
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
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop"
    },
    {
      id: 3,
      title: "DeFi Yield Farming: Maximizing Returns in 2024",
      content: `<p>Yield farming strategies for the modern DeFi landscape...</p>`,
      author: "Alex Thompson",
      date: "2024-01-13",
      category: "DeFi",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop"
    }
  ];

  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Layer 1', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Layer 1', score: 8.2, prediction: '+8.3%' },
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

  const relatedArticles = articles.filter(a => a.id !== article.id).slice(0, 3);

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
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white text-shadow-lg">
              Article
            </h1>
            <p className="text-gray-300 mt-2">
              Latest cryptocurrency insights and analysis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8">
            {/* Article Hero with Background Image */}
            <Card className="overflow-hidden bg-gray-800/50 border-gray-700">
              <div 
                className="relative h-64 md:h-80 bg-cover bg-center"
                style={{ backgroundImage: `url(${article.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <Badge className="bg-blue-600 mb-4 w-fit">{article.category}</Badge>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg text-shadow-xl">
                    {article.title}
                  </h1>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-white gap-4">
                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm md:text-base drop-shadow">{article.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm md:text-base drop-shadow">{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm md:text-base drop-shadow">{article.readTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-black/30 border-white/30 text-white hover:bg-black/50 backdrop-blur-sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" className="bg-black/30 border-white/30 text-white hover:bg-black/50 backdrop-blur-sm">
                        <BookmarkPlus className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Ad Banner - Hidden on mobile */}
            <div className="hidden md:flex justify-center">
              <AdBanner width={728} height={90} position="horizontal" />
            </div>

            {/* Article Content */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 md:p-8">
                <div 
                  className="prose prose-invert prose-lg max-w-none text-gray-200 prose-headings:text-white prose-headings:text-shadow-lg prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-200 prose-p:leading-relaxed prose-li:text-gray-200"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link key={relatedArticle.id} to={`/article/${relatedArticle.id}`} className="block group">
                      <div className="bg-gray-700/50 rounded-lg overflow-hidden hover:bg-gray-700/70 transition-all duration-300 hover:shadow-lg">
                        <div 
                          className="h-32 bg-cover bg-center relative"
                          style={{ backgroundImage: `url(${relatedArticle.image})` }}
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all"></div>
                          <Badge className="absolute top-2 left-2 bg-blue-600">{relatedArticle.category}</Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="text-white font-semibold mb-2 text-sm group-hover:text-blue-400 transition-colors line-clamp-2">
                            {relatedArticle.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{relatedArticle.author}</span>
                            <span>{relatedArticle.readTime}</span>
                          </div>
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
