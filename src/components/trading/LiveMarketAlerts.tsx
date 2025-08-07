import React from 'react';
import { Zap, Clock } from "lucide-react";
import { getLiveSignalIcon, getLiveSignalColor } from '@/utils/tradingSignalsHelpers';
import { LiveSignal } from '@/types/tradingSignals';

interface LiveMarketAlertsProps {
  liveSignals: LiveSignal[];
}

export const LiveMarketAlerts: React.FC<LiveMarketAlertsProps> = ({ liveSignals }) => {
  return (
    <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/40 backdrop-blur-sm">
      <h3 className="text-white font-medium flex items-center gap-2 mb-4">
        <Zap className="h-4 w-4 text-blue-400" />
        Live Market Alerts
        <Clock className="h-3 w-3 text-gray-400" />
      </h3>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {liveSignals.map((signal, index) => {
          const SignalIcon = getLiveSignalIcon(signal.type);
          return (
            <div key={index} className={`flex items-start gap-2 text-xs rounded-lg p-2.5 border ${getLiveSignalColor(signal.strength)}`}>
              <div className="flex items-center gap-1 flex-shrink-0">
                <SignalIcon className="h-3 w-3 text-blue-400" />
                <span className="text-blue-400 font-medium">{signal.asset}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-300 truncate">{signal.message}</div>
                <div className="text-gray-500 text-xs">{signal.timestamp}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};