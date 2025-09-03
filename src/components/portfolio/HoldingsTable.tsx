import React from 'react';
import { PortfolioAsset } from '@/types/portfolio';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';

interface HoldingsTableProps {
  assets: PortfolioAsset[];
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({ assets }) => {
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const formatValue = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground text-xl font-bold flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          All Holdings
          <div className="ml-auto text-sm font-normal text-muted-foreground">
            {assets.length} Assets
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold pl-6">Token</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Amount</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Price</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Total Value</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">7d Change</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right pr-6">Allocation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} className="border-border hover:bg-muted/50 transition-colors">
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={asset.icon} 
                      alt={asset.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-foreground">
                        {asset.name} <span className="text-muted-foreground font-normal">({asset.symbol})</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium text-foreground">
                    {formatAmount(asset.amount)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium text-foreground">
                    {formatPrice(asset.currentPrice)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-semibold text-foreground">
                    {formatValue(asset.totalValue)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className={`font-medium ${
                    asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {formatPercentage(asset.change24h)}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="font-medium text-primary">
                    {asset.allocation.toFixed(1)}%
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};