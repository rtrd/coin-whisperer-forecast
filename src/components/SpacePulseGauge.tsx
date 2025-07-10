import React from 'react';

interface SpacePulseGaugeProps {
  value: number;
  label: string;
  maxValue: number;
  color: 'purple' | 'blue' | 'red' | 'green' | 'yellow';
  size?: 'small' | 'large';
}

export const SpacePulseGauge: React.FC<SpacePulseGaugeProps> = ({
  value,
  label,
  maxValue,
  color,
  size = 'large'
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const isSmall = size === 'small';
  const gaugeSize = isSmall ? 'w-24 h-24' : 'w-32 h-32';
  const textSize = isSmall ? 'text-lg' : 'text-2xl';
  const labelSize = isSmall ? 'text-xs' : 'text-sm';

  const colorClasses = {
    purple: {
      stroke: 'stroke-purple-400',
      glow: 'drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]',
      text: 'text-purple-400'
    },
    blue: {
      stroke: 'stroke-blue-400',
      glow: 'drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]',
      text: 'text-blue-400'
    },
    red: {
      stroke: 'stroke-red-400',
      glow: 'drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]',
      text: 'text-red-400'
    },
    green: {
      stroke: 'stroke-green-400',
      glow: 'drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]',
      text: 'text-green-400'
    },
    yellow: {
      stroke: 'stroke-yellow-400',
      glow: 'drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]',
      text: 'text-yellow-400'
    }
  };

  const currentColor = colorClasses[color];

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative">
        {/* Background Circle */}
        <svg className={`${gaugeSize} transform -rotate-90`} viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-700"
          />
          
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${currentColor.stroke} ${currentColor.glow} transition-all duration-1000 ease-out`}
            style={{
              filter: `drop-shadow(0 0 10px ${color === 'purple' ? 'rgba(168,85,247,0.5)' : 
                                                color === 'blue' ? 'rgba(59,130,246,0.5)' :
                                                color === 'red' ? 'rgba(248,113,113,0.5)' :
                                                color === 'green' ? 'rgba(74,222,128,0.5)' : 
                                                'rgba(250,204,21,0.5)'})`
            }}
          />
          
          {/* Pulse Effect */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className={`${currentColor.stroke} opacity-30 animate-ping`}
            style={{ animationDuration: '2s' }}
          />
        </svg>
        
        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${textSize} font-bold ${currentColor.text}`}>
            {Math.round(value)}
          </span>
          {!isSmall && (
            <span className="text-xs text-gray-400">
              /{maxValue}
            </span>
          )}
        </div>
        
        {/* Orbital Ring Animation */}
        <div className="absolute inset-0 rounded-full border border-gray-600/30 animate-spin" 
             style={{ animationDuration: '10s' }}>
          <div className={`w-2 h-2 ${currentColor.stroke.replace('stroke-', 'bg-')} rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2`} />
        </div>
      </div>
      
      {/* Label */}
      <div className="text-center">
        <p className={`${labelSize} font-medium text-gray-300`}>{label}</p>
        {!isSmall && (
          <div className="flex items-center justify-center mt-1">
            <div className={`w-2 h-2 ${currentColor.stroke.replace('stroke-', 'bg-')} rounded-full mr-2 animate-pulse`} />
            <span className="text-xs text-gray-500">
              {percentage.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};