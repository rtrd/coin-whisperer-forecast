
import React from 'react';
import { IndependentPredictionWidget } from "@/components/IndependentPredictionWidget";
import { SignupLock } from "@/components/SignupLock";
import { PredictionSkeleton } from "@/components/SkeletonData";

interface LockedIndependentPredictionProps {
  cryptoOptions: any[];
}

export const LockedIndependentPrediction: React.FC<LockedIndependentPredictionProps> = ({
  cryptoOptions
}) => {
  return (
    <SignupLock
      title="Independent AI Prediction Analysis"
      description="Advanced cryptocurrency predictions using machine learning algorithms and market sentiment analysis"
      skeletonData={<PredictionSkeleton />}
    >
      <IndependentPredictionWidget cryptoOptions={cryptoOptions} />
    </SignupLock>
  );
};
