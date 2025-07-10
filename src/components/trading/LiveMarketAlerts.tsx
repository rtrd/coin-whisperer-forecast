import React from 'react';
import { Zap, Clock } from "lucide-react";
import { getLiveSignalIcon, getLiveSignalColor } from '@/utils/tradingSignalsHelpers';
import { LiveSignal } from '@/types/tradingSignals';

interface LiveMarketAlertsProps {
  liveSignals: LiveSignal[];
}

export const LiveMarketAlerts: React.FC<LiveMarketAlertsProps> = ({ liveSignals }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <h3 className="text-white font-medium flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-blue-400" />
        Live Market Alerts
        <Clock className="h-3 w-3 text-gray-400" />
      </h3>
      <div className="space-y-2 max-h-32 overflow-y-auto px-2">
        {liveSignals.map((signal, index) => {
          const SignalIcon = getLiveSignalIcon(signal.type);
          return (
            <div key={index} className={`flex items-start gap-2 text-xs rounded p-2 border ${getLiveSignalColor(signal.strength)}`}>
              <div className="flex items-center gap-1 flex-shrink-0">
                <SignalIcon className="h-3 w-3 text-blue-300" />
                <span className="text-blue-300 font-medium">{signal.asset}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-200 truncate">{signal.message}</div>
                <div className="text-gray-400 text-xs">{signal.timestamp}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};