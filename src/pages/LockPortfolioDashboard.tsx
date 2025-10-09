import React from "react";
import { LazyAITradingSignals } from "@/components/lazy/LazyAITradingSignals";
import { SignupLock } from "@/components/SignupLock";
import { AITradingSignalsSkeleton } from "@/components/SkeletonData";
import {PortfolioDashboard} from "@/pages/PortfolioDashboard";

export const LockPortfolioDashboard: React.FC = () => {
  return (
    <SignupLock
      title="AI Trading Signals"
      description="Live market data: Fear & Greed Index, DeFi TVL, volume alerts, and AI-powered trading recommendations"
    >
      <PortfolioDashboard />
    </SignupLock>
  );
};
