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
import { Info, Lock } from "lucide-react";
import { MarketDataRow } from "./MarketDataRow";
import { CryptoToken } from "@/types/crypto";

interface MarketDataTableProps {
  marketData: any[];
  isUnlocked: boolean;
  activeFilter: string;
  AllCryptosData: CryptoToken[];
}

export const MarketDataTable: React.FC<MarketDataTableProps> = ({
  marketData,
  isUnlocked,
  activeFilter,
  AllCryptosData = [],
}) => {
  return (
    <div className="overflow-x-auto">
      <Table className="w-full min-w-[800px]">
        <TableHeader>
          <TableRow className="border-gray-700 h-14">
            <TableHead className="text-gray-300 w-12 px-2">#</TableHead>
            <TableHead className="text-gray-300 min-w-[200px] px-2">Token</TableHead>
            <TableHead className="text-gray-300 min-w-[100px] px-2">Price</TableHead>
            <TableHead className="text-gray-300 min-w-[100px] px-2">
              24h Change
            </TableHead>
            <TableHead className="text-gray-300 min-w-[120px] px-2">
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
            </TableHead>
            <TableHead className="text-gray-300 min-w-[100px] px-2">
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
            </TableHead>
            <TableHead className="text-gray-300 min-w-[120px] px-2">
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
            <TableHead className="text-gray-300 min-w-[120px] px-2">
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
            </TableHead>
            <TableHead className="text-gray-300 min-w-[100px] px-2">Category</TableHead>
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
