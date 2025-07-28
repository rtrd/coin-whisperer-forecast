import { useState } from "react";
import { HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const faqs = [
  {
    question: "What is real-time market data?",
    answer: "Real-time market data provides live price updates, trading volumes, and market metrics updated within seconds of market movements. This data is essential for making informed trading decisions and understanding market dynamics as they happen."
  },
  {
    question: "How often is the data updated?",
    answer: "Our platform updates cryptocurrency prices and market data every 30 seconds to 1 minute, depending on the data source. Social sentiment data from LunarCrush is updated multiple times per hour to capture the latest social media trends."
  },
  {
    question: "What sources do you use for market data?",
    answer: "We aggregate data from multiple premium sources including CoinGecko Pro API for price and market data, and LunarCrush API for social sentiment analysis. This multi-source approach ensures accuracy and comprehensive coverage."
  },
  {
    question: "What is social sentiment analysis?",
    answer: "Social sentiment analysis uses AI to analyze millions of social media posts, news articles, and online discussions about cryptocurrencies. It provides insights into market psychology and can often predict price movements before they occur."
  },
  {
    question: "How accurate are the market predictions?",
    answer: "Our AI models combine real-time price data, technical indicators, and social sentiment to generate predictions. While no prediction is guaranteed, our multi-factor approach historically shows higher accuracy than single-metric models."
  },
  {
    question: "Can I use this data for automated trading?",
    answer: "Yes, our real-time data feeds are designed to support both manual analysis and automated trading strategies. The low-latency updates and comprehensive metrics make it suitable for algorithmic trading applications."
  },
  {
    question: "What makes your data different?",
    answer: "We provide a unique combination of on-chain metrics, real-time price data, and social sentiment analysis all in one platform. This 360-degree view of the market gives traders and investors a significant advantage."
  },
  {
    question: "Is there an API available?",
    answer: "Currently, our real-time data is available through our web platform. We're developing API access for premium subscribers to integrate our data feeds directly into their own applications and trading systems."
  }
];

export function RealTimeDataSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
          <Menu className="h-4 w-4 mr-2" />
          FAQs
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-gray-900 border-gray-700">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Real-Time Data FAQs
          </SheetTitle>
          <SheetDescription className="text-gray-300">
            Learn about our real-time cryptocurrency data feeds and how they work
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-gray-800/50 rounded-lg px-4 border border-gray-600/50 hover:border-blue-500/50 transition-colors">
                <AccordionTrigger className="text-white hover:text-blue-400 font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}