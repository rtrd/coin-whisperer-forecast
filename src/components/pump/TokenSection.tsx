
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TokenCard } from "./TokenCard";
import { TokenTable } from "./TokenTable";
import { PumpToken } from "../../hooks/usePumpPortalData";

interface TokenSectionProps {
  title: string;
  icon: React.ReactNode;
  tokens: PumpToken[];
  changeColorClass: string;
  viewMode: "list" | "grid";
  showPrice?: boolean;
  showChange?: boolean;
}

export const TokenSection: React.FC<TokenSectionProps> = ({
  title,
  icon,
  tokens,
  changeColorClass,
  viewMode,
  showPrice = true,
  showChange = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`bg-gray-700/50 rounded-lg transition-all duration-200 ${isExpanded ? 'p-6' : 'p-4'}`}>
      <div 
        className={`flex items-center justify-between cursor-pointer ${isExpanded ? 'mb-6' : 'mb-0'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-white font-medium flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <button className="text-gray-400 hover:text-white transition-colors">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tokens.map((token, index) => (
                <TokenCard
                  key={index}
                  token={token}
                  changeColorClass={changeColorClass}
                  showPrice={showPrice}
                  showChange={showChange}
                />
              ))}
            </div>
          ) : (
            <TokenTable 
              tokens={tokens} 
              changeColorClass={changeColorClass}
              showPrice={showPrice}
              showChange={showChange}
            />
          )}
        </>
      )}
    </div>
  );
};
