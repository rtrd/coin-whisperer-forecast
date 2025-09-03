import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface WalletConnectorProps {
  onConnect: (address: string) => void;
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection process
    setTimeout(() => {
      const mockAddress = '0x742d35Cc6635C0532925a3b8D6Ac0Bca7c5c4';
      setWalletAddress(mockAddress);
      setIsConnected(true);
      setIsConnecting(false);
      onConnect(mockAddress);
      toast.success('Wallet connected successfully!');
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    toast.info('Wallet disconnected');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Address copied to clipboard');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <CardTitle className="text-lg text-white">Wallet Connected</CardTitle>
            </div>
            <Badge variant="outline" className="bg-green-600 text-white border-green-500">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">MetaMask</p>
                <p className="text-sm text-gray-300">{formatAddress(walletAddress)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="h-8 w-8 p-0 text-white hover:bg-gray-600"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Disconnect
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info('Switching networks...')}
              className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Switch Network
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-white">Connect Your Wallet</CardTitle>
        <CardDescription className="text-gray-300">
          Connect your wallet to view your portfolio and get personalized insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Connect with WalletConnect
              </div>
            )}
          </Button>
          
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" disabled className="bg-gray-700 border-gray-600 text-white">
              <div className="w-5 h-5 rounded bg-orange-500" />
              MetaMask
            </Button>
            <Button variant="outline" size="sm" disabled className="bg-gray-700 border-gray-600 text-white">
              <div className="w-5 h-5 rounded bg-blue-500" />
              Coinbase
            </Button>
            <Button variant="outline" size="sm" disabled className="bg-gray-700 border-gray-600 text-white">
              <div className="w-5 h-5 rounded bg-purple-500" />
              Rainbow
            </Button>
          </div>
        </div>
        
        <div className="flex items-start gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
          <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-300">
            <p className="font-medium text-white">Demo Mode</p>
            <p>Click "Connect with WalletConnect" to see demo portfolio data</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};