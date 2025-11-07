
import React from 'react';
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";
import { SignupLock } from "@/components/SignupLock";
import { TechnicalAnalysisSkeleton } from "@/components/SkeletonData";

interface LockedTechnicalAnalysisProps {
  data: any;
  isLoading: boolean;
  volumeData?: { label: string; value: number }[];
  macdHistogram?: { label: string; value: number }[];
}

export const LockedTechnicalAnalysis: React.FC<LockedTechnicalAnalysisProps> = ({
  data,
  isLoading,
  volumeData,
  macdHistogram
}) => {
  return (
    <SignupLock
      title="Advanced Technical Analysis"
      description="Get detailed technical indicators, RSI analysis, and trading signals powered by AI"
      skeletonData={<TechnicalAnalysisSkeleton />}
    >
      <TechnicalAnalysis 
        data={data} 
        isLoading={isLoading}
        volumeData={volumeData}
        macdHistogram={macdHistogram}
      />
    </SignupLock>
  );
};
