
import React from 'react';
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";
import { SignupLock } from "@/components/SignupLock";
import { TechnicalAnalysisSkeleton } from "@/components/SkeletonData";

interface LockedTechnicalAnalysisProps {
  data: any;
  isLoading: boolean;
}

export const LockedTechnicalAnalysis: React.FC<LockedTechnicalAnalysisProps> = ({
  data,
  isLoading
}) => {
  return (
    <SignupLock
      title="Advanced Technical Analysis"
      description="Get detailed technical indicators, RSI analysis, and trading signals powered by AI"
      skeletonData={<TechnicalAnalysisSkeleton />}
    >
      <TechnicalAnalysis data={data} isLoading={isLoading} technicalIndicator={data || []} />
    </SignupLock>
  );
};
