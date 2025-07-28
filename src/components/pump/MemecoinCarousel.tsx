import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { TrendingUp, TrendingDown, ExternalLink, Sparkles } from "lucide-react";
import { openAffiliateLink } from "@/utils/affiliateLinks";

interface MemeCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export const MemecoinCarousel = () => {
  const [memecoins, setMemecoins] = useState<MemeCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemecoins = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch memecoins from CoinGecko - focusing on popular meme coins
        const memeCategories = 'meme-token';
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?` +
          `vs_currency=usd&category=${memeCategories}&order=volume_desc&` +
          `per_page=20&page=1&sparkline=false&price_change_percentage=24h`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMemecoins(data);
      } catch (err) {
        console.error('Error fetching memecoins:', err);
        setError('Failed to load memecoin data');
        // Fallback to mock data
        setMemecoins([
          {
            id: 'dogecoin',
            symbol: 'DOGE',
            name: 'Dogecoin',
            image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
            current_price: 0.072,
            price_change_percentage_24h: 5.2,
            market_cap: 10500000000,
            total_volume: 450000000
          },
          {
            id: 'shiba-inu',
            symbol: 'SHIB',
            name: 'Shiba Inu',
            image: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
            current_price: 0.000008,
            price_change_percentage_24h: -2.1,
            market_cap: 4700000000,
            total_volume: 180000000
          },
          {
            id: 'pepe',
            symbol: 'PEPE',
            name: 'Pepe',
            image: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
            current_price: 0.0000071,
            price_change_percentage_24h: 12.8,
            market_cap: 2900000000,
            total_volume: 850000000
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMemecoins();
  }, []);

  const formatPrice = (price: number) => {
    if (price < 0.000001) {
      return price.toFixed(10);
    } else if (price < 0.001) {
      return price.toFixed(8);
    } else if (price < 1) {
      return price.toFixed(6);
    }
    return price.toFixed(4);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  if (loading) {
    return (
      <div className="bg-gray-700/50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          <h3 className="text-white font-medium">Trending Memecoins</h3>
        </div>
        <div className="flex gap-4 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex-shrink-0 w-72">
              <div className="bg-gray-600/50 rounded-xl p-4 h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          Trending Memecoins
        </h3>
        {error && (
          <Badge className="bg-yellow-600 text-white">Using cached data</Badge>
        )}
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {memecoins.map((coin) => (
            <CarouselItem key={coin.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <Card className="bg-gray-800/60 border border-gray-600/50 hover:bg-gray-800/80 transition-all duration-200 hover:border-gray-500/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="%23666"/><text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-size="16">?</text></svg>';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="text-white font-bold text-sm truncate">{coin.symbol.toUpperCase()}</div>
                        <div className="text-gray-400 text-xs truncate">{coin.name}</div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 ${
                      coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="text-xs font-semibold">
                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                        {coin.price_change_percentage_24h?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div>
                      <div className="text-gray-400 text-xs">Price</div>
                      <div className="text-white font-mono text-sm">${formatPrice(coin.current_price)}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-gray-400">Volume</div>
                        <div className="text-gray-300 font-mono">${formatNumber(coin.total_volume)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Market Cap</div>
                        <div className="text-gray-300 font-mono">${formatNumber(coin.market_cap)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 text-xs"
                      size="sm"
                      onClick={() => openAffiliateLink(coin.symbol)}
                    >
                      <ExternalLink className="h-3 w-3 mr-2" />
                      Trade on eToro
                    </Button>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-xs"
                      size="sm"
                      onClick={() => window.open('https://app.andmilo.com/auth/signin/b103d893-d5b8-4cb3-8b67-1f356abb314f', '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-2" />
                      Trade With AI Agent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600" />
        <CarouselNext className="right-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600" />
      </Carousel>
    </div>
  );
};