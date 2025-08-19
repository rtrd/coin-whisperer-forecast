import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Lock, ChevronUp, ChevronDown } from "lucide-react";
import { MarketDataRow } from "./MarketDataRow";
import { CryptoToken } from "@/types/crypto";

type SortField = 'rank' | 'name' | 'price' | 'change24h' | 'predictionPercentage' | 'aiScore' | 'volume24h' | 'marketCap' | 'category';
type SortDirection = 'asc' | 'desc';

interface MarketDataTableProps {
  marketData: any[];
  isUnlocked: boolean;
  activeFilter: string;
  AllCryptosData: CryptoToken[];
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: SortDirection;
}

export const MarketDataTable: React.FC<MarketDataTableProps> = ({
  marketData,
  isUnlocked,
  activeFilter,
  AllCryptosData = [],
  onSort,
  sortField,
  sortDirection,
}) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-3 w-3 ml-1" /> : 
      <ChevronDown className="h-3 w-3 ml-1" />;
  };

  const SortableHeader = ({ field, children, className = "" }: { 
    field: SortField; 
    children: React.ReactNode; 
    className?: string;
  }) => (
    <TableHead className={`text-gray-300 px-2 cursor-pointer hover:text-white transition-colors ${className}`} onClick={() => onSort(field)}>
      <div className="flex items-center">
        {children}
        {getSortIcon(field)}
      </div>
    </TableHead>
  );
  return (
    <div className="overflow-x-auto">
      <Table className="w-full min-w-[800px]">
        <TableHeader>
          <TableRow className="border-gray-700 h-14 hover:bg-transparent">
            <SortableHeader field="rank" className="w-12">#</SortableHeader>
            <SortableHeader field="name" className="min-w-[200px]">Token</SortableHeader>
            <SortableHeader field="price" className="min-w-[100px]">Price</SortableHeader>
            <SortableHeader field="change24h" className="min-w-[100px]">24h Change</SortableHeader>
            <SortableHeader field="predictionPercentage" className="min-w-[120px]">
              <div className="flex items-center gap-1">
                Prediction %
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      AI-generated price prediction percentage for the next
                      period
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </SortableHeader>
            <SortableHeader field="aiScore" className="min-w-[100px]">
              <div className="flex items-center gap-1">
                AI Score
                {!isUnlocked && <Lock className="h-3 w-3 text-yellow-400" />}
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      AI confidence score (0-100) based on market analysis and
                      technical indicators
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </SortableHeader>
            <SortableHeader field="volume24h" className="min-w-[120px]">
              <div className="flex items-center gap-1">
                Trading Volume
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total trading volume in the last 24 hours</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </SortableHeader>
            <SortableHeader field="marketCap" className="min-w-[120px]">
              <div className="flex items-center gap-1">
                Market Cap
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total market capitalization</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </SortableHeader>
            <SortableHeader field="category" className="min-w-[100px]">Category</SortableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {marketData.map((token, index) => (
            <MarketDataRow
              key={token.value}
              token={token}
              index={index}
              isUnlocked={isUnlocked}
              activeFilter={activeFilter}
              AllCryptosData={AllCryptosData}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
