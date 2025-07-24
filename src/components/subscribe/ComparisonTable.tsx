import React from 'react';
import { Check, X, Crown } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const features = [
    { name: 'AI Price Predictions', free: false, premium: true },
    { name: 'Real-time Alerts', free: false, premium: true },
    { name: 'Technical Analysis', free: 'Basic', premium: 'Advanced' },
    { name: 'Supported Coins', free: '10', premium: '65+' },
    { name: 'Historical Data', free: '7 days', premium: 'Unlimited' },
    { name: 'Portfolio Tracking', free: false, premium: true },
    { name: 'Pump.fun Integration', free: false, premium: true },
    { name: 'Priority Support', free: false, premium: true },
    { name: 'Ad-free Experience', free: false, premium: true },
    { name: 'API Access', free: false, premium: true }
  ];

  return (
    <div className="bg-glass-bg backdrop-blur-sm border border-glass-border rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-premium/20 to-premium-end/20 p-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Free vs Premium</h3>
        <p className="text-gray-300">Choose the plan that fits your trading style</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-glass-border">
              <th className="text-left p-4 text-white font-semibold">Features</th>
              <th className="text-center p-4 text-gray-400 font-semibold">Free</th>
              <th className="text-center p-4 text-premium font-semibold">
                <div className="flex items-center justify-center gap-2">
                  <Crown className="h-4 w-4" />
                  Premium
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={index} className="border-b border-glass-border/50 hover:bg-glass-bg/50 transition-colors">
                <td className="p-4 text-gray-300">{feature.name}</td>
                <td className="p-4 text-center">
                  {feature.free === true ? (
                    <Check className="h-5 w-5 text-crypto-success mx-auto" />
                  ) : feature.free === false ? (
                    <X className="h-5 w-5 text-gray-600 mx-auto" />
                  ) : (
                    <span className="text-gray-400 text-sm">{feature.free}</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {feature.premium === true ? (
                    <Check className="h-5 w-5 text-crypto-success mx-auto" />
                  ) : (
                    <span className="text-premium text-sm font-semibold">{feature.premium}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};