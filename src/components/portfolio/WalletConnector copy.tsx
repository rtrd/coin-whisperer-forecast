import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, CheckCircle, AlertCircle, Copy } from "lucide-react";
import { toast } from "sonner";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
//import { ethers } from "ethers";
import { getPortfolioData } from "@/services/portfolioData";
interface WalletConnectorProps {
  onConnect: (address: string, chainId: number) => void;
}
export const WalletConnector: React.FC<WalletConnectorProps> = ({
  onConnect,
}) => {
  const [provider, setProvider] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState<number | null>(null);
  // Initialize WalletConnect Provider
  useEffect(() => {
    const initProvider = async () => {
      const EVM_CHAINS = [137, 3, 4, 5, 42, 56, 250, 43114, 11155111];
      const rpcMap = {
        1: "https://mainnet.infura.io/v3/5c36bd9fb7234ce5b97196e52635579d",
        3: "https://ropsten.infura.io/v3/5c36bd9fb7234ce5b97196e52635579d",
        4: "https://rinkeby.infura.io/v3/5c36bd9fb7234ce5b97196e52635579d",
        5: "https://goerli.infura.io/v3/5c36bd9fb7234ce5b97196e52635579d",
        42: "https://kovan.infura.io/v3/5c36bd9fb7234ce5b97196e52635579d",
        56: "https://bsc-dataseed.binance.org/",
        137: "https://polygon-rpc.com",
        250: "https://rpcapi.fantom.network",
        43114: "https://api.avax.network/ext/bc/C/rpc",
        10: "https://mainnet.optimism.io",
        42161: "https://arb1.arbitrum.io/rpc",
        80001: "https://rpc-mumbai.matic.today",
        // add RPC for other chains
      };
      try {
        const wcProvider = await EthereumProvider.init({
          projectId: "751411e8f8ab373474bd177bb57cca0a",
          optionalChains: [1, 137, 56, 250, 43114, 42161, 10],
          showQrModal: true,
        });
        setProvider(wcProvider);
        // Event handlers
        // If there's an existing session, set state accordingly
        // If a session already exists, disconnect so you get a fresh state
        if (wcProvider.session && wcProvider.session.namespaces) {
          await wcProvider.disconnect();
        }
        // Event: on connect
        wcProvider.on("connect", async () => {
          try {
            debugger;
            const accs = (await wcProvider.request({
              method: "eth_accounts",
            })) as string[];
            const chainHex = await wcProvider.request({
              method: "eth_chainId",
            });
            const numericChain = parseInt(chainHex as string, 16);
            if (accs.length > 0) {
              setWalletAddress(accs[0]);
              setChainId(numericChain);
              setIsConnected(true);
            }
          } catch (err) {
            console.error("Error in connect listener:", err);
          }
        });
        // Event: chain changed
        // On chainChanged event
        wcProvider.on("chainChanged", async (newChainHex: string) => {
          try {
            debugger;
            const numeric = parseInt(newChainHex, 16);
            console.log("Event chainChanged:", numeric);
            setChainId(numeric);
          } catch (err) {
            console.error("Error parsing chainChanged:", err);
          }
        });
        // On accountsChanged
        wcProvider.on("accountsChanged", async (accounts: string[]) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            // also get chain
            try {
              const chainHex2 = await wcProvider.request({
                method: "eth_chainId",
              });
              const numeric2 = parseInt(chainHex2 as string, 16);
              setChainId(numeric2);
            } catch (err) {
              console.error("Error fetching chain after accountsChanged:", err);
            }
          } else {
            setIsConnected(false);
            setWalletAddress("");
          }
        });
        // … possibly also monitor session_event
        wcProvider.on("session_event", async (ev: any) => {
          debugger;
          console.log("session_event:", ev);
          // you could event inspect if chain was changed inside
          try {
            const accs = (await wcProvider.request({
              method: "eth_accounts",
            })) as string[];
            const chainHex3 = await wcProvider.request({
              method: "eth_chainId",
            });
            const numeric3 = parseInt(chainHex3 as string, 10);
            setChainId(numeric3);
            onConnect(accs[0], numeric3);
          } catch (err) {
            console.error("Error on session_event chain read:", err);
          }
        });
      } catch (initErr) {
        console.error("Error initializing WalletConnect provider:", initErr);
      }
    };
    initProvider();
    // optionally clean up listeners on unmount
    return () => {
      if (provider) {
        provider.off("connect");
        provider.off("chainChanged");
        provider.off("accountsChanged");
        provider.off("session_event");
        provider.off("disconnect");
      }
    };
  }, [onConnect]);
  
  const handleConnect = async () => {
    if (!provider) return toast.error("Provider not initialized");
    setIsConnecting(true);
    try {
      debugger
      await provider.connect();
      // Fetch live account and chain ID after connect
      const accounts = await provider.request({ method: "eth_accounts" });
      const chainIdHex = await provider.request({ method: "eth_chainId" });
      const chain = parseInt(chainIdHex, 16);
      if (accounts && accounts[0]) {
        setWalletAddress(accounts[0]);
        setChainId(chain);
        setIsConnected(true);
        onConnect(accounts[0], chain);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!provider) return;
    await provider.disconnect();
    setIsConnected(false);
    setWalletAddress("");
    setChainId(null);
  };
  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Address copied to clipboard");
  };
  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;
  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-white">
          {isConnected ? "Wallet Connected" : "Connect Your Wallet"}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {isConnected
            ? `Connected to ${chainId} network`
            : "Click the button below to connect your wallet using WalletConnect"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected && (
          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">WalletConnect</p>
                <p className="text-sm text-gray-300">
                  {formatAddress(walletAddress)}
                </p>
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
        )}
        <Button
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isConnecting}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isConnecting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isConnected ? "Disconnecting..." : "Connecting..."}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              {isConnected ? "Disconnect Wallet" : "Connect with WalletConnect"}
            </div>
          )}
        </Button>
        {!isConnected && (
          <div className="flex items-start gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-white">Info</p>
              <p>
                Scan the QR code that appears in the popup with your wallet app
                (e.g., MetaMask, Trust Wallet, SafePal)
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
