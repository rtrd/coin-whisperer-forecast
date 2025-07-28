import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronRight, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { state } = useSidebar();

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <Sidebar className="w-80" collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-white mb-4">
            <HelpCircle className="h-5 w-5 mr-2 inline" />
            {state !== "collapsed" && "Real-Time Data FAQs"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-0">
                      <Button
                        variant="ghost"
                        className="w-full p-4 text-left justify-between hover:bg-gray-700/50"
                        onClick={() => toggleFaq(index)}
                      >
                        <span className="text-white text-sm font-medium pr-2">
                          {faq.question}
                        </span>
                        {expandedFaq === index ? (
                          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                      </Button>
                      
                      {expandedFaq === index && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}