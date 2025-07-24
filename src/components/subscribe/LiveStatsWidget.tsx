import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';

export const LiveStatsWidget: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState(12847);
  const [profitToday, setProfitToday] = useState(2.67);
  const [successRate, setSuccessRate] = useState(94.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3 - 1));
      setProfitToday(prev => Math.max(0, prev + (Math.random() - 0.5) * 0.1));
      setSuccessRate(prev => Math.min(99.9, Math.max(90, prev + (Math.random() - 0.5) * 0.2)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: Users,
      label: 'Active Users',
      value: activeUsers.toLocaleString(),
      change: '+127 today',
      color: 'text-blue-400'
    },
    {
      icon: DollarSign,
      label: 'Avg Daily Profit',
      value: `${profitToday.toFixed(2)}%`,
      change: 'Per user',
      color: 'text-crypto-success'
    },
    {
      icon: Target,
      label: 'Success Rate',
      value: `${successRate.toFixed(1)}%`,
      change: 'Last 30 days',
      color: 'text-crypto-gold'
    },
    {
      icon: TrendingUp,
      label: 'Signals Today',
      value: '847',
      change: '+23% vs yesterday',
      color: 'text-premium'
    }
  ];

  return (
    <div className="bg-glass-bg backdrop-blur-sm border border-glass-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 bg-crypto-success rounded-full animate-pulse"></div>
        <h3 className="text-white font-semibold">Live Performance</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
            <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-400">{stat.label}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
          </div>
        ))}
      </div>
    </div>
  );
};