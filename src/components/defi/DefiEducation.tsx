import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Info, Shield, Zap, TrendingUp, Users } from "lucide-react";

export const DefiEducation: React.FC = () => {
  const concepts = [
    {
      icon: BookOpen,
      title: "What is DeFi?",
      content: "Decentralized Finance (DeFi) refers to financial services built on blockchain technology that operate without traditional intermediaries like banks. DeFi protocols use smart contracts to automate financial transactions, offering services like lending, borrowing, trading, and earning interest on cryptocurrencies."
    },
    {
      icon: Shield,
      title: "Total Value Locked (TVL)",
      content: "TVL represents the total amount of assets deposited in DeFi protocols. It's the primary metric for measuring the size and health of the DeFi ecosystem. A higher TVL indicates more trust and capital flowing into decentralized applications."
    },
    {
      icon: Zap,
      title: "Key DeFi Categories",
      content: "DeFi encompasses various categories: DEXs (Decentralized Exchanges) for trading, Lending protocols for borrowing/lending, Yield Farming for earning rewards, Liquid Staking for staking derivatives, and Bridge protocols for cross-chain transfers."
    },
    {
      icon: TrendingUp,
      title: "Why Use DeFi?",
      content: "DeFi offers permissionless access to financial services, potentially higher yields than traditional finance, 24/7 market access, transparency through public blockchains, and the ability to maintain custody of your own assets."
    },
    {
      icon: Users,
      title: "Multi-Chain Ecosystem",
      content: "Modern DeFi operates across multiple blockchains including Ethereum, Binance Smart Chain, Solana, Avalanche, and Polygon. Each chain offers different advantages in terms of speed, cost, and ecosystem maturity."
    },
    {
      icon: Info,
      title: "Understanding Risks",
      content: "While DeFi offers opportunities, it carries risks including smart contract vulnerabilities, impermanent loss in liquidity pools, market volatility, and regulatory uncertainty. Always research protocols thoroughly and never invest more than you can afford to lose."
    }
  ];

  return (
    <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-400" />
          Understanding DeFi
        </CardTitle>
        <p className="text-sm text-gray-400 mt-1">
          Essential knowledge about decentralized finance
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {concepts.map((concept, index) => {
          const Icon = concept.icon;
          return (
            <div key={index} className="bg-gray-700/30 rounded-lg p-5 border border-gray-600/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">{concept.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {concept.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-5 mt-6">
          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-400" />
            Data Sources
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            All data on this page is sourced from <span className="text-blue-400 font-medium">DeFi Llama</span>, 
            the leading DeFi analytics platform. DeFi Llama aggregates TVL data across thousands of protocols 
            and hundreds of blockchains, providing accurate and real-time insights into the DeFi ecosystem. 
            Data is updated every 5 minutes to ensure accuracy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
