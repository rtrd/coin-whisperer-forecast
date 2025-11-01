import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDefiData } from '@/hooks/useDefiData';
import { DefiOverviewMetrics } from '@/components/defi/DefiOverviewMetrics';
import { TopProtocolsTable } from '@/components/defi/TopProtocolsTable';
import { ChainTVLBreakdown } from '@/components/defi/ChainTVLBreakdown';
import { DefiCategoriesGrid } from '@/components/defi/DefiCategoriesGrid';
import { DefiEducation } from '@/components/defi/DefiEducation';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const DefiPulse: React.FC = () => {
  const {
    protocols,
    chains,
    categories,
    totalTVL,
    totalChange24h,
    isLoading,
    error
  } = useDefiData();

  return (
    <>
      <Helmet>
        <title>DeFi Pulse - Real-Time DeFi Analytics & TVL Data | PumpParade</title>
        <meta 
          name="description" 
          content="Track Total Value Locked (TVL) across DeFi protocols, chains, and categories. Real-time analytics from DeFi Llama covering thousands of protocols and hundreds of blockchains." 
        />
        <meta 
          name="keywords" 
          content="DeFi, Total Value Locked, TVL, DeFi protocols, DeFi analytics, blockchain analytics, DeFi Llama, decentralized finance" 
        />
        <link rel="canonical" href="https://pumpparade.com/defi-pulse" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">DeFi Pulse</h1>
                <p className="text-gray-400 mt-1">
                  Real-time decentralized finance analytics and insights
                </p>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                Comprehensive DeFi ecosystem data powered by <span className="text-blue-400 font-semibold">DeFi Llama</span>, 
                tracking {protocols.length}+ protocols across {chains.length}+ blockchains with live TVL updates.
              </p>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Card className="bg-red-500/10 border-red-500/20 mb-8">
              <CardContent className="flex items-center gap-3 p-4">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-red-400 font-medium">Error Loading Data</p>
                  <p className="text-sm text-gray-300">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 bg-gray-700/50" />
                ))}
              </div>
              <Skeleton className="h-96 bg-gray-700/50" />
            </div>
          ) : (
            <>
              {/* Overview Metrics */}
              <DefiOverviewMetrics
                totalTVL={totalTVL}
                change24h={totalChange24h}
                protocolsCount={protocols.length}
                chainsCount={chains.length}
              />

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <ChainTVLBreakdown chains={chains} totalTVL={totalTVL} />
                </div>
                <div className="lg:col-span-1">
                  <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm h-full">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Market Insights</h3>
                      <div className="space-y-4">
                        <div className="bg-gray-700/40 rounded-lg p-4">
                          <p className="text-xs text-gray-400 mb-1">Dominant Chain</p>
                          <p className="text-lg font-bold text-white">{chains[0]?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-300 mt-1">
                            {chains[0] ? ((chains[0].tvl / totalTVL) * 100).toFixed(1) : '0'}% of total TVL
                          </p>
                        </div>
                        <div className="bg-gray-700/40 rounded-lg p-4">
                          <p className="text-xs text-gray-400 mb-1">Top Category</p>
                          <p className="text-lg font-bold text-white">{categories[0]?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-300 mt-1">
                            {categories[0]?.protocols || 0} protocols
                          </p>
                        </div>
                        <div className="bg-gray-700/40 rounded-lg p-4">
                          <p className="text-xs text-gray-400 mb-1">Largest Protocol</p>
                          <p className="text-lg font-bold text-white">{protocols[0]?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-300 mt-1">
                            ${protocols[0] ? (protocols[0].tvl / 1e9).toFixed(2) : '0'}B TVL
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="mb-6">
                <DefiCategoriesGrid categories={categories} />
              </div>

              {/* Top Protocols Table */}
              <div className="mb-6">
                <TopProtocolsTable protocols={protocols} />
              </div>

              {/* Educational Content */}
              <DefiEducation />
            </>
          )}

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleString()} • Data refreshes every 5 minutes
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DefiPulse;
