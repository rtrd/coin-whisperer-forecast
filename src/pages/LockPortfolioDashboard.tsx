import React from "react";
import { LazyAITradingSignals } from "@/components/lazy/LazyAITradingSignals";
import { SignupLock } from "@/components/SignupLock";
import { AITradingSignalsSkeleton } from "@/components/SkeletonData";
import {PortfolioDashboard} from "@/pages/PortfolioDashboard";

export const LockPortfolioDashboard: React.FC = () => {
  return (
    <SignupLock
      title="Portfolio Analysis & Monitoring"
      description="Scan your portfolio and get AI-powered insights and recommendations for maximum performance"
    >
      <PortfolioDashboard />
    </SignupLock>
  );
};
