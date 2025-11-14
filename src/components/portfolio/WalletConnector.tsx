import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Copy, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import { removeAddressFromStorage } from "@/lib/storage";
import { ChainNamespace } from "@reown/appkit/networks";

// Network icons (you can replace with your own SVGs or images)

const SUPPORTED_CHAINS = [
  {
    id: 1,
    name: "Ethereum",
    namespace: "eip155",
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  {
    name: "Polygon",
    id: 137,
    namespace: "eip155",
    icon: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
  },
  {
    name: "Arbitrum",
    id: 42161,
    namespace: "eip155",
    icon: "public/images/Arbitrum.png",
  },
  {
    name: "Optimism",
    id: 10,
    namespace: "eip155",
    icon: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
  },
  {
    name: "Binance Smart Chain",
    id: 56,
    icon: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  },
  {
    name: "Avalanche",
    id: 43114,
    icon: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png",
  },
  {
    name: "Solana",
    id: "solana-mainnet",
    namespace: "solana",
    icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  },
  {
    name: "Linea",
    id: 59144,
    namespace: "eip155",
    icon: "https://assets.coingecko.com/coins/images/68507/standard/linea-logo.jpeg",
  },
];

export const WalletConnector: React.FC<{
  onConnect: (addr: string, chainId: string | number) => void;
}> = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState<string | number | null>(null);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [selectNamespace, setNamespace] = useState<ChainNamespace>("eip155");

  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { address, isConnected: isAccountConnected } = useAppKitAccount({
    namespace: selectNamespace,
  });

  const handleAppkitConnect = () => {
    setIsConnecting(true);
    open(); // open wallet QR modal
    setTimeout(() => setIsConnecting(false), 1000);
  };

  useEffect(() => {
    if (isAccountConnected && address) {
      setWalletAddress(address);
      setIsConnected(true);
      onConnect(address, chainId);
      setTimeout(() => setShowNetworkModal(true), 300);
    }
  }, [isAccountConnected, address, chainId]);

  useEffect(() => {
    if (!isAccountConnected) {
      setIsConnected(false);
      setWalletAddress("");
      setChainId(null);
      setShowNetworkModal(false);
      removeAddressFromStorage();
    }
  }, [isAccountConnected]);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      removeAddressFromStorage();
      toast.success("Disconnected");
    } catch (err) {
      console.error(err);
      toast.error("Failed to disconnect");
    }
  };

  const handleNetworkSelect = (
    selectedChainId: string | number,
    namespace: ChainNamespace = "eip155"
  ) => {
    // debugger;
    handleAppkitConnect();
    setChainId(selectedChainId);
    setNamespace(namespace);
    setShowNetworkModal(false);
    toast.success(
      `Connected to ${
        SUPPORTED_CHAINS.find((c) => c.id === selectedChainId)?.name
      }`
    );
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Address copied");
  };

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <>
      <Card className="bg-gray-900/70 border-gray-700 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-white">
            {isConnected ? "Wallet Connected" : "Connect Your Wallet"}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {isConnected
              ? `Connected to chain ${chainId || "..."}`
              : "Scan QR to connect wallet"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isConnected && (
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Wallet</p>
                  <p className="text-sm text-gray-300">
                    {formatAddress(walletAddress)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="h-8 w-8 p-0 text-white hover:bg-gray-700"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button
            onClick={
              isConnected ? handleDisconnect : () => setShowNetworkModal(true)
            }
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
                {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
              </div>
            )}
          </Button>

          {!isConnected && (
            <div className="flex items-start gap-2 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-white">Info</p>
                <p>
                  Scan QR first. Network selection will appear in popup after
                  connection.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Network Selection Modal */}
      {showNetworkModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl p-6 w-80 max-h-[80vh] shadow-2xl relative animate-fade-in-up overflow-hidden">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowNetworkModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h3 className="text-white text-xl font-semibold mb-4 text-center">
              Select Network
            </h3>

            {/* Scrollable Network Sections */}
            <div className="overflow-y-auto max-h-[250px] pr-2 space-y-4">
              {SUPPORTED_CHAINS.reduce<JSX.Element[][]>((acc, chain, idx) => {
                const sectionIndex = Math.floor(idx / 5);
                if (!acc[sectionIndex]) acc[sectionIndex] = [];
                acc[sectionIndex].push(
                  <button
                    key={chain.id}
                    onClick={() =>
                      handleNetworkSelect(
                        chain.id,
                        chain?.namespace as ChainNamespace
                      )
                    }
                    className="flex items-center gap-3 justify-start rounded-xl px-4 py-2 bg-gray-800 hover:bg-blue-600 transform transition duration-300 ease-out hover:shadow-[0_0_15px_rgba(59,130,246,0.7)] w-full"
                  >
                    <img
                      src={chain.icon}
                      alt={chain.name}
                      className="w-6 h-6 object-contain rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/public/images/fallback.png";
                      }}
                    />
                    <span className="font-medium text-white">{chain.name}</span>
                  </button>
                );
                return acc;
              }, [])}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
