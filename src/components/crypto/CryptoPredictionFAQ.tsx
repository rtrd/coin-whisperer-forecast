import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export const CryptoPredictionFAQ = () => {
  const faqs = [
    {
      question: "How accurate are AI crypto price predictions?",
      answer: "Our AI crypto price prediction models achieve up to 95% accuracy rates by combining advanced machine learning algorithms, real-time technical analysis, and comprehensive market sentiment data. The accuracy varies based on market conditions and prediction timeframe."
    },
    {
      question: "What cryptocurrencies can the AI predict?",
      answer: "Our AI crypto price prediction tool supports Bitcoin (BTC), Ethereum (ETH), and over 1000 popular altcoins including Solana, Cardano, Polygon, and many others. We continuously add support for new cryptocurrencies based on market demand."
    },
    {
      question: "Is the crypto price prediction tool free?",
      answer: "Yes, our basic AI crypto price prediction features are completely free to use. This includes 7-day predictions for major cryptocurrencies. Premium features offer extended prediction timeframes, advanced technical analysis, and additional prediction models."
    },
    {
      question: "How does machine learning improve crypto predictions?",
      answer: "Our machine learning algorithms analyze historical price data, trading patterns, market sentiment, social media trends, and technical indicators to identify complex patterns that traditional analysis might miss. This results in more accurate and reliable crypto price predictions."
    },
    {
      question: "Can I use AI predictions for crypto trading?",
      answer: "Our AI crypto price predictions are designed to inform your trading decisions, but should not be the sole basis for investment choices. Always combine AI predictions with your own research, risk management strategies, and consider market volatility."
    },
    {
      question: "How often are crypto price predictions updated?",
      answer: "Our AI crypto price prediction models run continuously, updating predictions every hour to incorporate the latest market data, news sentiment, and technical indicators. This ensures you always have access to the most current forecasts."
    }
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-blue-400" />
          AI Crypto Price Prediction FAQ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-gray-600">
              <AccordionTrigger className="text-white hover:text-blue-400 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};