
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Lock } from "lucide-react";
import { MarketDataRow } from './MarketDataRow';

interface MarketDataTableProps {
  marketData: any[];
  isUnlocked: boolean;
  activeFilter: string;
}

export const MarketDataTable: React.FC<MarketDataTableProps> = ({
  marketData,
  isUnlocked,
  activeFilter
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-300">#</TableHead>
            <TableHead className="text-gray-300">Token</TableHead>
            <TableHead className="text-gray-300">Price</TableHead>
            <TableHead className="text-gray-300">24h Change</TableHead>
            <TableHead className="text-gray-300">
              <div className="flex items-center gap-1">
                Prediction %
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI-generated price prediction percentage for the next period</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TableHead>
            <TableHead className="text-gray-300">
              <div className="flex items-center gap-1">
                AI Score
                {!isUnlocked && <Lock className="h-3 w-3 text-yellow-400" />}
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI confidence score (0-100) based on market analysis and technical indicators</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TableHead>
            <TableHead className="text-gray-300">
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
            </TableHead>
            {activeFilter === 'market_cap' && (
              <TableHead className="text-gray-300">Market Cap</TableHead>
            )}
            <TableHead className="text-gray-300">Category</TableHead>
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
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
