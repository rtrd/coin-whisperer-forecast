
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  publishedDate: string;
  category: string;
  imageUrl: string;
  readTime: string;
  url: string;
}

const WordPressIntegration = () => {
  // Mock WordPress articles data
  const articles: Article[] = [
    {
      id: 1,
      title: "Bitcoin Reaches New All-Time High: What This Means for Investors",
      excerpt: "Analyzing the factors behind Bitcoin's latest surge and its implications for the broader cryptocurrency market...",
      publishedDate: "2024-01-15",
      category: "Market Analysis",
      imageUrl: "/placeholder.svg",
      readTime: "5 min read",
      url: "#"
    },
    {
      id: 2,
      title: "The Rise of DeFi: Decentralized Finance Explained",
      excerpt: "Understanding the fundamentals of DeFi protocols and how they're reshaping traditional financial services...",
      publishedDate: "2024-01-14",
      category: "DeFi",
      imageUrl: "/placeholder.svg",
      readTime: "8 min read",
      url: "#"
    },
    {
      id: 3,
      title: "Meme Coins: From Joke to Serious Investment?",
      excerpt: "Exploring the phenomenon of meme cryptocurrencies and their impact on the digital asset landscape...",
      publishedDate: "2024-01-13",
      category: "Trends",
      imageUrl: "/placeholder.svg",
      readTime: "6 min read",
      url: "#"
    },
    {
      id: 4,
      title: "AI and Blockchain: The Future of Cryptocurrency Trading",
      excerpt: "How artificial intelligence is revolutionizing crypto trading strategies and market predictions...",
      publishedDate: "2024-01-12",
      category: "Technology",
      imageUrl: "/placeholder.svg",
      readTime: "7 min read",
      url: "#"
    },
    {
      id: 5,
      title: "Regulatory Updates: Global Crypto Legislation Overview",
      excerpt: "A comprehensive look at recent regulatory developments affecting cryptocurrency markets worldwide...",
      publishedDate: "2024-01-11",
      category: "Regulation",
      imageUrl: "/placeholder.svg",
      readTime: "10 min read",
      url: "#"
    },
    {
      id: 6,
      title: "Layer 2 Solutions: Scaling Ethereum for the Future",
      excerpt: "Examining the latest Layer 2 technologies and their role in addressing blockchain scalability challenges...",
      publishedDate: "2024-01-10",
      category: "Technology",
      imageUrl: "/placeholder.svg",
      readTime: "9 min read",
      url: "#"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <span className="text-blue-400">📰</span>
          Latest Crypto News & Insights
        </h2>
        <p className="text-gray-300">Stay updated with the latest cryptocurrency trends and market analysis</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {articles.map((article) => (
          <Card key={article.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer group">
            <div className="relative overflow-hidden rounded-t-lg">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-2 left-2 bg-blue-600 hover:bg-blue-700 text-xs">
                {article.category}
              </Badge>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
                {article.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-300 text-xs line-clamp-2 mb-3">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{article.readTime}</span>
                </div>
                <span>{formatDate(article.publishedDate)}</span>
              </div>
              
              <a 
                href={article.url} 
                className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors"
              >
                Read More
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WordPressIntegration;
