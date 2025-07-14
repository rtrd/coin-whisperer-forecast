import React from "react";
import { AITradingSignals } from "@/components/AITradingSignals";
import { SignupLock } from "@/components/SignupLock";
import { AITradingSignalsSkeleton } from "@/components/SkeletonData";

export const LockedAITradingSignals: React.FC = () => {
  return (
    // <SignupLock
    //   title="AI Trading Signals"
    //   description="Real-time AI-powered market signals, sentiment analysis, and trading recommendations"
    //   skeletonData={<AITradingSignalsSkeleton />}
    // >
    //   <AITradingSignals />
    // </SignupLock>
    <div className="mb-8">
      <div className="rounded-lg border bg-card text-card-foreground bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-600/50 shadow-xl">
        <div className="flex flex-col space-y-1.5 p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-sparkles h-8 w-8 text-white"
              >
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                <path d="M20 3v4"></path>
                <path d="M22 5h-4"></path>
                <path d="M4 17v2"></path>
                <path d="M5 18H3"></path>
              </svg>
            </div>
          </div>
          <h3 className="font-semibold tracking-tight text-white text-xl">
            AI Trading Signals
          </h3>
          <p className="text-gray-200 text-sm mt-2">
            Real-time AI-powered market signals, sentiment analysis, and trading
            recommendations
          </p>
        </div>
        <div className="p-6 pt-0 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-clock h-5 w-5 text-purple-300"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-purple-200 font-semibold">COMING SOON</span>
          </div>
          <p className="text-gray-200 text-sm">
            We're working hard to bring you the most advanced AI-powered
            cryptocurrency analysis tools. Stay tuned for exciting updates!
          </p>
          <div className="mt-6 flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
