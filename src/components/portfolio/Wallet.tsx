import React, { useState, useEffect } from 'react';
import { UniversalProvider } from '@walletconnect/universal-provider';
import { createAppKit } from '@reown/appkit/core';
import { mainnet, solana } from "@reown/appkit/networks";
const ConnectWalletButton = () => {
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    const initProvider = async () => {
      try {
        const wcProvider = await UniversalProvider.init({
          projectId: 'YOUR_PROJECT_ID',
          metadata: {
            name: 'Your dApp Name',
            description: 'Description of your dApp',
            url: 'https://your-dapp-url.com',
            icons: ['https://your-dapp-url.com/icon.png'],
          },
        });
        setProvider(wcProvider);
      } catch (error) {
        console.error('Error initializing WalletConnect provider:', error);
      }
    };

    initProvider();

    return () => {
      if (provider) {
        provider.off('connect');
        provider.off('chainChanged');
        provider.off('accountsChanged');
        provider.off('session_event');
        provider.off('disconnect');
      }
    };
  }, []);

  const handleConnect = async () => {
    if (!provider) return;

    setIsConnecting(true);
    try {
      const modal = createAppKit({
        projectId: 'YOUR_PROJECT_ID',
        networks:  [mainnet, solana],
        universalProvider: provider,
        manualWCControl: true,
      });

      modal.open();

      provider.on('connect', async () => {
        const accounts = await provider.request({ method: 'eth_accounts' });
        const chainHex = await provider.request({ method: 'eth_chainId' });
        const numericChain = parseInt(chainHex, 16);

        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setChainId(numericChain);
          setIsConnected(true);
        }
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!provider) return;

    await provider.disconnect();
    setIsConnected(false);
    setWalletAddress('');
    setChainId(null);
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div>
          <p>Connected Wallet: {walletAddress}</p>
          <p>Chain ID: {chainId}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton;
