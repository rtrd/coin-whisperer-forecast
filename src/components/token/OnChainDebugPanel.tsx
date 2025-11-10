import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Bug } from 'lucide-react';

interface OnChainDebugPanelProps {
  rawData: {
    holders: any;
    topHolders: any;
  } | null;
  contractAddress?: string;
  network?: string;
  isLoading?: boolean;
}

export const OnChainDebugPanel: React.FC<OnChainDebugPanelProps> = ({
  rawData,
  contractAddress,
  network,
  isLoading
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-muted/50 bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Debug Panel</CardTitle>
            <Badge variant="outline" className="text-xs">Development</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 text-xs">
          {/* Request Info */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Request Parameters</h4>
            <div className="rounded-md bg-muted/30 p-3 font-mono space-y-1">
              <div className="flex gap-2">
                <span className="text-muted-foreground">Network:</span>
                <span className="text-foreground">{network || 'N/A'}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground">Contract:</span>
                <span className="text-foreground break-all">{contractAddress || 'N/A'}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={isLoading ? 'secondary' : 'default'} className="text-xs">
                  {isLoading ? 'Loading...' : 'Loaded'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Holders API Response */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Holders API Response</h4>
            <div className="rounded-md bg-muted/30 p-3 font-mono max-h-64 overflow-y-auto">
              <pre className="text-muted-foreground whitespace-pre-wrap break-words">
                {rawData?.holders 
                  ? JSON.stringify(rawData.holders, null, 2)
                  : 'No data available'}
              </pre>
            </div>
          </div>

          {/* Top Holders API Response */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Top Holders API Response</h4>
            <div className="rounded-md bg-muted/30 p-3 font-mono max-h-64 overflow-y-auto">
              <pre className="text-muted-foreground whitespace-pre-wrap break-words">
                {rawData?.topHolders 
                  ? JSON.stringify(rawData.topHolders, null, 2)
                  : 'No data available'}
              </pre>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">API Endpoints Used</h4>
            <div className="rounded-md bg-muted/30 p-3 space-y-2">
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="text-xs shrink-0">POST</Badge>
                <code className="text-muted-foreground break-all">
                  /functions/v1/coingecko-proxy
                  <br />
                  {`{ "endpoint": "holders", "network": "${network}", "contractAddress": "${contractAddress}" }`}
                </code>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="text-xs shrink-0">POST</Badge>
                <code className="text-muted-foreground break-all">
                  /functions/v1/coingecko-proxy
                  <br />
                  {`{ "endpoint": "top-holders", "network": "${network}", "contractAddress": "${contractAddress}" }`}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
