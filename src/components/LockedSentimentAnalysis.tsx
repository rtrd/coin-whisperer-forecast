
import React from 'react';
import { SentimentAnalysis } from "@/components/SentimentAnalysis";
import { SignupLock } from "@/components/SignupLock";
import { SentimentSkeleton } from "@/components/SkeletonData";

interface LockedSentimentAnalysisProps {
  crypto: string;
}

export const LockedSentimentAnalysis: React.FC<LockedSentimentAnalysisProps> = ({
  crypto
}) => {
  return (
    <SignupLock
      title="AI Market Sentiment"
      description="Real-time sentiment analysis from social media, news, and trading patterns"
      skeletonData={<SentimentSkeleton />}
    >
      <SentimentAnalysis crypto={crypto} />
    </SignupLock>
  );
};
