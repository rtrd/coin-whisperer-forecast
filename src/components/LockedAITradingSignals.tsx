import React from "react";
import { AITradingSignals } from "@/components/AITradingSignals";
import { SignupLock } from "@/components/SignupLock";
import { AITradingSignalsSkeleton } from "@/components/SkeletonData";

export const LockedAITradingSignals: React.FC = () => {
  return (
    <SignupLock
      title="AI Trading Signals"
      description="Real-time AI-powered market signals, sentiment analysis, and trading recommendations"
      skeletonData={<AITradingSignalsSkeleton />}
    >
      <AITradingSignals />
    </SignupLock>
  );
};
