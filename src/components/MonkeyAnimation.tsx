
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

export const MonkeyAnimation = () => {
  const [isWaving, setIsWaving] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const messages = [
    "Welcome to PumpParade! 🚀",
    "Let's find some crypto gems! 💎",
    "AI predictions loading... 🤖",
    "Ready to pump your portfolio? 📈",
    "Crypto market analysis in progress! 🔍"
  ];

  useEffect(() => {
    // Show animation after component mounts
    const showTimer = setTimeout(() => setIsVisible(true), 500);
    
    // Wave animation every 3 seconds
    const waveInterval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1000);
    }, 3000);

    // Change message every 4 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(waveInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className={`flex justify-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-700/50 border p-6 max-w-md">
        <div className="flex items-center gap-4">
          {/* Monkey Character */}
          <div className="relative">
            <div className="text-6xl animate-bounce">
              🐒
            </div>
            {/* Waving hand */}
            <div 
              className={`absolute -top-2 -right-2 text-2xl transition-transform duration-300 ${
                isWaving ? 'animate-pulse rotate-12' : ''
              }`}
            >
              👋
            </div>
          </div>
          
          {/* Speech Bubble */}
          <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-white font-medium text-sm">
              {messages[currentMessage]}
            </div>
            {/* Speech bubble tail */}
            <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
              <div className="w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white/10"></div>
            </div>
          </div>
        </div>
        
        {/* Progress dots for messages */}
        <div className="flex justify-center mt-4 gap-1">
          {messages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentMessage ? 'bg-yellow-400' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};
