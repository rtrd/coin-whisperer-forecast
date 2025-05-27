
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { ArticleCard } from "./ArticleCard";

const WordPressIntegration = () => {
  const articles = [
    {
      id: 1,
      title: "Bitcoin Breaks $45K: What This Means for Your Portfolio",
      excerpt: "As Bitcoin surges past $45,000, analysts predict this could be the start of a new bull run. Here's what investors need to know.",
      author: "Sarah Chen",
      date: "2024-01-15",
      category: "Market Analysis",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=240&fit=crop",
      url: "#"
    },
    {
      id: 2,
      title: "Ethereum 2.0 Staking Rewards: Complete Guide for 2024",
      excerpt: "Everything you need to know about ETH staking, including risks, rewards, and the best platforms to maximize your returns.",
      author: "Mike Rodriguez",
      date: "2024-01-14",
      category: "DeFi Guide",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=240&fit=crop",
      url: "#"
    },
    {
      id: 3,
      title: "Top 5 Altcoins to Watch This Week",
      excerpt: "Our AI analysis reveals these altcoins have the highest potential for significant price movements in the coming days.",
      author: "Alex Thompson",
      date: "2024-01-13",
      category: "AI Predictions",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=400&h=240&fit=crop",
      url: "#"
    },
    {
      id: 4,
      title: "DeFi Yield Farming: Risks vs Rewards in 2024",
      excerpt: "A comprehensive analysis of yield farming strategies, including the latest protocols and risk management techniques.",
      author: "Emma Davis",
      date: "2024-01-12",
      category: "DeFi Strategy",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=240&fit=crop",
      url: "#"
    },
    {
      id: 5,
      title: "Crypto Tax Guide: What You Need to Know",
      excerpt: "Navigate the complex world of cryptocurrency taxation with our comprehensive guide for the 2024 tax season.",
      author: "David Park",
      date: "2024-01-11",
      category: "Tax & Legal",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=240&fit=crop",
      url: "#"
    },
    {
      id: 6,
      title: "NFT Market Recovery: Signs of a Comeback?",
      excerpt: "After months of decline, the NFT market shows signs of recovery. We analyze the trends and what they mean for investors.",
      author: "Lisa Wong",
      date: "2024-01-10",
      category: "NFT Analysis",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=240&fit=crop",
      url: "#"
    }
  ];

  return (
    <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-blue-400" />
          Latest Crypto News & Analysis
          <Badge className="bg-blue-600">Live Feed</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WordPressIntegration;
