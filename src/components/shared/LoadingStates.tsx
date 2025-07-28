import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = "" }) => (
  <Skeleton className={`bg-gray-700 ${className}`} />
);

export const TechnicalAnalysisLoading: React.FC = () => (
  <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm">
    <CardHeader className="bg-gray-700/30 border-b border-gray-600/30">
      <SkeletonLoader className="h-6 w-32" />
      <SkeletonLoader className="h-4 w-48" />
    </CardHeader>
    <CardContent className="space-y-4 p-6">
      {[...Array(5)].map((_, i) => (
        <SkeletonLoader key={i} className="h-16 w-full" />
      ))}
    </CardContent>
  </Card>
);

export const TableRowLoading: React.FC = () => (
  <tr className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <SkeletonLoader className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const CardLoading: React.FC = () => (
  <Card className="bg-gray-800/50 border-gray-700">
    <CardContent className="p-4 space-y-3">
      <SkeletonLoader className="h-6 w-24" />
      <SkeletonLoader className="h-4 w-32" />
      <SkeletonLoader className="h-8 w-full" />
    </CardContent>
  </Card>
);