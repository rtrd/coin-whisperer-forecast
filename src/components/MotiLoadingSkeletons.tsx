import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const MotiTokenSkeleton: React.FC = () => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 animate-pulse">
      <CardContent className="p-6">
        {/* Header with rank and token info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            {/* Rank badge */}
            <Skeleton className="w-12 h-12 rounded-full bg-gray-700" />
            
            {/* Token image */}
            <Skeleton className="w-16 h-16 rounded-full bg-gray-700" />
            
            {/* Token info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="w-32 h-6 bg-gray-700" />
                <Skeleton className="w-16 h-6 rounded-full bg-gray-700" />
              </div>
              <Skeleton className="w-20 h-4 bg-gray-700" />
            </div>
          </div>
          
          {/* MOTI Score Ring */}
          <Skeleton className="w-20 h-20 rounded-full bg-gray-700" />
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900/50 rounded-lg p-3 border border-gray-600/30">
              <Skeleton className="w-16 h-3 bg-gray-700 mb-2" />
              <Skeleton className="w-20 h-5 bg-gray-700" />
            </div>
          ))}
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3 mb-4">
          <Skeleton className="flex-1 h-12 rounded bg-gray-700" />
          <Skeleton className="flex-1 h-12 rounded bg-gray-700" />
        </div>
        
        {/* Expand button */}
        <Skeleton className="w-full h-8 rounded bg-gray-700" />
      </CardContent>
    </Card>
  );
};

export const MotiLoadingGrid: React.FC = () => {
  return (
    <div className="space-y-6">
      {[...Array(10)].map((_, i) => (
        <MotiTokenSkeleton key={i} />
      ))}
    </div>
  );
};