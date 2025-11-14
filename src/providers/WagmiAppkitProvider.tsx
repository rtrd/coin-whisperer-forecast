import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  arbitrum,
  base,
  scroll,
  polygon,
  solana,
  solanaDevnet,
  solanaTestnet,
  defineChain 
} from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { BitcoinAdapter } from "@reown/appkit-adapter-bitcoin";
import type { AppKitNetwork } from "@reown/appkit/networks";

// 1. Get projectId from https://dashboard.reown.com
// Using a temporary project ID - replace with your own from https://cloud.reown.com
const projectId =
  import.meta.env.VITE_PROJECT_ID || "temp-project-id-replace-me";
const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || "https://pumpparade.com";

// 2. Create a metadata object - optional
const metadata = {
  name: "Pumpparada",
  description: "Pumpparada AppKit Example",
  url: FRONTEND_URL,
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Define Cosmos chain
const cosmos = defineChain({
  id: 'cosmoshub-3',
  name: 'Cosmos',
  nativeCurrency: { name: 'Cosmos', symbol: 'ATOM', decimals: 6 },
  rpcUrls: {
    default: { http: ['https://cosmos-rpc.publicnode.com:443'] }
  },
  blockExplorers: { default: { name: 'Mint Scan', url: 'https://www.mintscan.io/cosmos' } },
  testnet: false,
  chainNamespace: 'cosmos',
  caipNetworkId: 'cosmos:cosmoshub-4'
})

const linea = defineChain({
  id: 59144,
  name: "Linea",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.linea.build"] },
    public: { http: ["https://rpc.linea.build"] },
  },
  blockExplorers: {
    default: { name: "LineaScan", url: "https://lineascan.build" },
  },
  testnet: false,
  chainNamespace: "eip155",
  caipNetworkId: "eip155:59144"
});

const optimism = defineChain({
  id: 10,
  name: "Optimism",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.optimism.io"] },
    public: { http: ["https://mainnet.optimism.io"] },
  },
  blockExplorers: {
    default: { name: "Optimism Explorer", url: "https://optimistic.etherscan.io" },
  },
  testnet: false,
  chainNamespace: "eip155",
  caipNetworkId: "eip155:10"
});


const avalanche = defineChain({
  id: 43114,
  name: "Avalanche",
  nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://api.avax.network/ext/bc/C/rpc"] },
    public: { http: ["https://api.avax.network/ext/bc/C/rpc"] },
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
  testnet: false,
  chainNamespace: "eip155",
  caipNetworkId: "eip155:43114"
});

// 3. Set the networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  mainnet,
  arbitrum,
  polygon,
  base,
  scroll,
  solana,
  solanaDevnet,
  solanaTestnet,
  cosmos,
  linea,
  optimism,
  avalanche
];

// 4. Create Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter();

// 5. Create Bitcoin Adapter
const bitcoinWeb3JsAdapter = new BitcoinAdapter({ projectId });

// 6. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  cacheTime: 30 * 1000,
});

// 7. Create modal
createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter, bitcoinWeb3JsAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
  enableNetworkSwitch: true, // allow choosing network in modal
  enableReconnect: false, // disable auto-reconnect on reload
  themeMode: "dark"
});

export function WagmiAppkitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      {children}
    </WagmiProvider>
  );
}
