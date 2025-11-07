import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Users, TrendingUp } from "lucide-react";
import { SignupDialog } from "@/components/SignupDialog";

interface TokenPriceAlertsProps {
  tokenName: string;
  tokenSymbol: string;
  currentPrice: number;
}

export const TokenPriceAlerts: React.FC<TokenPriceAlertsProps> = ({
  tokenName,
  tokenSymbol,
  currentPrice,
}) => {
  const [showSignup, setShowSignup] = useState(false);
  const watchersCount = Math.floor(Math.random() * 5000) + 1000;

  return (
    <>
      <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="h-5 w-5 text-primary animate-pulse" />
            Price Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-300">
            Get notified when {tokenSymbol} hits your target price
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-gray-400">
              <span className="font-semibold text-white">{watchersCount.toLocaleString()}</span> users watching {tokenSymbol}
            </span>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
            onClick={() => setShowSignup(true)}
          >
            <Bell className="h-4 w-4 mr-2" />
            Set Price Alert
          </Button>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/20">
            <div className="text-center p-2 bg-green-500/10 rounded border border-green-500/30">
              <div className="text-xs text-gray-400 mb-1">Target Above</div>
              <div className="text-sm font-bold text-green-400">
                +10%
              </div>
            </div>
            <div className="text-center p-2 bg-red-500/10 rounded border border-red-500/30">
              <div className="text-xs text-gray-400 mb-1">Stop Loss</div>
              <div className="text-sm font-bold text-red-400">
                -10%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SignupDialog 
        open={showSignup} 
        onOpenChange={setShowSignup}
        title="Set Price Alert"
        description={`Get notified when ${tokenName} reaches your target price. Sign up for free to set custom price alerts.`}
      />
    </>
  );
};
