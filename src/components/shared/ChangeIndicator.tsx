import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ChangeIndicatorProps {
  change: number;
  className?: string;
  showIcon?: boolean;
  showSign?: boolean;
}

export const ChangeIndicator: React.FC<ChangeIndicatorProps> = ({
  change,
  className = "",
  showIcon = true,
  showSign = true,
}) => {
  const isPositive = change >= 0;
  const icon = isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  const colorClass = isPositive ? "text-green-400" : "text-red-400";
  
  return (
    <span className={`flex items-center gap-1 ${colorClass} ${className}`}>
      {showIcon && icon}
      {showSign && (isPositive ? "+" : "")}{change.toFixed(2)}%
    </span>
  );
};