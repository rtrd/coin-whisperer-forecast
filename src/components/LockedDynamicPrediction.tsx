
import React from 'react';
import { DynamicPredictionAdjuster } from "@/components/DynamicPredictionAdjuster";
import { SignupLock } from "@/components/SignupLock";
import { PredictionSkeleton } from "@/components/SkeletonData";

interface LockedDynamicPredictionProps {
  selectedCrypto: string;
  currentPrice: number;
  priceChange: number;
}

export const LockedDynamicPrediction: React.FC<LockedDynamicPredictionProps> = ({
  selectedCrypto,
  currentPrice,
  priceChange
}) => {
  return (
    <SignupLock
      title="Real-time AI Predictions"
      description="Live AI analysis that adapts to market movements and provides dynamic predictions"
      skeletonData={<PredictionSkeleton />}
    >
      <DynamicPredictionAdjuster
        selectedCrypto={selectedCrypto}
        currentPrice={currentPrice}
        priceChange={priceChange}
      />
    </SignupLock>
  );
};
