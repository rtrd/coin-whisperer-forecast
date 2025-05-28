import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { IndependentPredictionWidget } from "@/components/IndependentPredictionWidget";
import Footer from "@/components/Footer";

const AIPrediction = () => {
  const cryptoOptions = [
    // Layer 1 Cryptocurrencies
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Layer 1', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Layer 1', score: 8.2, prediction: '+8.3%' },
    { value: 'binancecoin', label: 'BNB (BNB)', icon: '🔶', category: 'Layer 1', score: 7.8, prediction: '+6.1%' },
    { value: 'ripple', label: 'XRP (XRP)', icon: '💧', category: 'Layer 1', score: 7.2, prediction: '+4.7%' },
    { value: 'cardano', label: 'Cardano (ADA)', icon: '₳', category: 'Layer 1', score: 6.9, prediction: '+3.2%' },
    { value: 'solana', label: 'Solana (SOL)', icon: '◎', category: 'Layer 1', score: 8.1, prediction: '+15.8%' },
    { value: 'avalanche-2', label: 'Avalanche (AVAX)', icon: '🔺', category: 'Layer 1', score: 7.5, prediction: '+7.9%' },
    { value: 'polygon', label: 'Polygon (MATIC)', icon: '⬟', category: 'Layer 1', score: 7.3, prediction: '+5.4%' },
    { value: 'polkadot', label: 'Polkadot (DOT)', icon: '⚫', category: 'Layer 1', score: 6.8, prediction: '+2.1%' },
    { value: 'chainlink', label: 'Chainlink (LINK)', icon: '🔗', category: 'Layer 1', score: 7.7, prediction: '+9.3%' },
    { value: 'litecoin', label: 'Litecoin (LTC)', icon: 'Ł', category: 'Layer 1', score: 6.5, prediction: '+3.8%' },
    { value: 'bitcoin-cash', label: 'Bitcoin Cash (BCH)', icon: '₿', category: 'Layer 1', score: 6.2, prediction: '+2.9%' },
    { value: 'stellar', label: 'Stellar (XLM)', icon: '🌟', category: 'Layer 1', score: 6.4, prediction: '+4.1%' },
    { value: 'cosmos', label: 'Cosmos (ATOM)', icon: '⚛️', category: 'Layer 1', score: 7.1, prediction: '+6.8%' },
    { value: 'algorand', label: 'Algorand (ALGO)', icon: '🔺', category: 'Layer 1', score: 6.7, prediction: '+4.5%' },
    
    // DeFi Tokens
    { value: 'uniswap', label: 'Uniswap (UNI)', icon: '🦄', category: 'DeFi', score: 7.1, prediction: '+11.2%' },
    { value: 'aave', label: 'Aave (AAVE)', icon: '👻', category: 'DeFi', score: 7.4, prediction: '+8.7%' },
    { value: 'compound-governance-token', label: 'Compound (COMP)', icon: '🏦', category: 'DeFi', score: 6.5, prediction: '+4.3%' },
    { value: 'maker', label: 'Maker (MKR)', icon: '🏭', category: 'DeFi', score: 6.9, prediction: '+6.8%' },
    { value: 'sushiswap', label: 'SushiSwap (SUSHI)', icon: '🍣', category: 'DeFi', score: 6.2, prediction: '+3.1%' },
    { value: 'pancakeswap-token', label: 'PancakeSwap (CAKE)', icon: '🥞', category: 'DeFi', score: 5.8, prediction: '-2.4%' },
    { value: 'curve-dao-token', label: 'Curve (CRV)', icon: '📈', category: 'DeFi', score: 6.4, prediction: '+1.9%' },
    { value: 'yearn-finance', label: 'Yearn Finance (YFI)', icon: '🔥', category: 'DeFi', score: 6.8, prediction: '+7.2%' },
    { value: 'synthetix', label: 'Synthetix (SNX)', icon: '⚡', category: 'DeFi', score: 6.1, prediction: '+3.4%' },
    { value: 'balancer', label: 'Balancer (BAL)', icon: '⚖️', category: 'DeFi', score: 5.9, prediction: '+2.1%' },
    
    // Meme Coins
    { value: 'dogecoin', label: 'Dogecoin (DOGE)', icon: '🐕', category: 'Meme', score: 6.1, prediction: '+18.5%' },
    { value: 'shiba-inu', label: 'Shiba Inu (SHIB)', icon: '🐕‍🦺', category: 'Meme', score: 5.9, prediction: '+25.3%' },
    { value: 'pepe', label: 'Pepe (PEPE)', icon: '🐸', category: 'Meme', score: 8.8, prediction: '+65.3%' },
    { value: 'floki', label: 'Floki (FLOKI)', icon: '🐺', category: 'Meme', score: 7.2, prediction: '+32.1%' },
    { value: 'bonk', label: 'Bonk (BONK)', icon: '🔨', category: 'Meme', score: 9.2, prediction: '+78.5%' },
    { value: 'dogelon-mars', label: 'Dogelon Mars (ELON)', icon: '🚀', category: 'Meme', score: 6.8, prediction: '+22.7%' },
    { value: 'baby-doge-coin', label: 'Baby Doge (BABYDOGE)', icon: '🐶', category: 'Meme', score: 5.5, prediction: '+14.2%' },
    { value: 'safemoon-2', label: 'SafeMoon (SFM)', icon: '🌙', category: 'Meme', score: 4.1, prediction: '-8.9%' },
    { value: 'wojak', label: 'Wojak (WOJAK)', icon: '😭', category: 'Meme', score: 7.5, prediction: '+45.2%' },
    { value: 'pepecoin-network', label: 'PepeCoin (PEPECOIN)', icon: '🐸', category: 'Meme', score: 6.9, prediction: '+28.3%' },
    
    // Layer 2 & Scaling
    { value: 'arbitrum', label: 'Arbitrum (ARB)', icon: '🔵', category: 'L2', score: 7.8, prediction: '+13.4%' },
    { value: 'optimism', label: 'Optimism (OP)', icon: '🔴', category: 'L2', score: 7.6, prediction: '+10.2%' },
    { value: 'immutable-x', label: 'Immutable X (IMX)', icon: '⚡', category: 'L2', score: 7.1, prediction: '+8.5%' },
    { value: 'loopring', label: 'Loopring (LRC)', icon: '🔄', category: 'L2', score: 6.3, prediction: '+4.7%' },
    { value: 'polygon-ecosystem-token', label: 'POL Token (POL)', icon: '🟣', category: 'L2', score: 7.2, prediction: '+9.1%' },
    { value: 'metis-token', label: 'Metis (METIS)', icon: '🔷', category: 'L2', score: 6.8, prediction: '+6.3%' },
    
    // Gaming & NFT
    { value: 'axie-infinity', label: 'Axie Infinity (AXS)', icon: '🎮', category: 'Gaming', score: 6.7, prediction: '+12.1%' },
    { value: 'the-sandbox', label: 'The Sandbox (SAND)', icon: '🏖️', category: 'Gaming', score: 6.9, prediction: '+15.3%' },
    { value: 'decentraland', label: 'Decentraland (MANA)', icon: '🌐', category: 'Gaming', score: 6.4, prediction: '+9.8%' },
    { value: 'enjincoin', label: 'Enjin Coin (ENJ)', icon: '💎', category: 'Gaming', score: 6.2, prediction: '+7.1%' },
    { value: 'gala', label: 'Gala (GALA)', icon: '🎲', category: 'Gaming', score: 5.8, prediction: '+5.4%' },
    { value: 'flow', label: 'Flow (FLOW)', icon: '🌊', category: 'Gaming', score: 6.5, prediction: '+8.2%' },
    { value: 'theta-token', label: 'Theta (THETA)', icon: '📺', category: 'Gaming', score: 6.3, prediction: '+6.9%' },
    
    // AI & Data
    { value: 'fetch-ai', label: 'Fetch.ai (FET)', icon: '🤖', category: 'AI', score: 8.5, prediction: '+52.1%' },
    { value: 'singularitynet', label: 'SingularityNET (AGIX)', icon: '🧠', category: 'AI', score: 8.1, prediction: '+41.8%' },
    { value: 'ocean-protocol', label: 'Ocean Protocol (OCEAN)', icon: '🌊', category: 'AI', score: 7.9, prediction: '+38.2%' },
    { value: 'render-token', label: 'Render (RNDR)', icon: '🎨', category: 'AI', score: 8.1, prediction: '+41.7%' },
    { value: 'the-graph', label: 'The Graph (GRT)', icon: '📊', category: 'AI', score: 7.3, prediction: '+24.1%' },
    { value: 'artificial-superintelligence-alliance', label: 'ASI Alliance (ASI)', icon: '🤖', category: 'AI', score: 8.3, prediction: '+48.9%' },
    
    // New & Trending
    { value: 'worldcoin-wld', label: 'Worldcoin (WLD)', icon: '🌍', category: 'New', score: 7.3, prediction: '+28.4%' },
    { value: 'sei-network', label: 'Sei (SEI)', icon: '⚡', category: 'New', score: 7.8, prediction: '+34.2%' },
    { value: 'starknet', label: 'Starknet (STRK)', icon: '🌟', category: 'New', score: 8.0, prediction: '+45.1%' },
    { value: 'jupiter-exchange-solana', label: 'Jupiter (JUP)', icon: '🪐', category: 'New', score: 7.5, prediction: '+19.8%' },
    { value: 'sui', label: 'Sui (SUI)', icon: '🌊', category: 'New', score: 7.9, prediction: '+31.5%' },
    { value: 'aptos', label: 'Aptos (APT)', icon: '🏛️', category: 'New', score: 7.7, prediction: '+26.8%' },
    { value: 'blur', label: 'Blur (BLUR)', icon: '🌀', category: 'New', score: 6.8, prediction: '+12.4%' },
    { value: 'injective-protocol', label: 'Injective (INJ)', icon: '💉', category: 'New', score: 7.9, prediction: '+35.2%' },
    { value: 'celestia', label: 'Celestia (TIA)', icon: '⭐', category: 'New', score: 8.2, prediction: '+42.1%' },
    { value: 'kaspa', label: 'Kaspa (KAS)', icon: '👻', category: 'New', score: 8.1, prediction: '+39.7%' },
    
    // Privacy Coins
    { value: 'monero', label: 'Monero (XMR)', icon: '🔒', category: 'Privacy', score: 4.5, prediction: '-8.9%' },
    { value: 'zcash', label: 'Zcash (ZEC)', icon: '🛡️', category: 'Privacy', score: 4.8, prediction: '-7.2%' },
    { value: 'dash', label: 'Dash (DASH)', icon: '💨', category: 'Privacy', score: 4.1, prediction: '-12.3%' },
    { value: 'beam', label: 'Beam (BEAM)', icon: '💡', category: 'Privacy', score: 5.2, prediction: '-3.1%' },
    { value: 'secret', label: 'Secret (SCRT)', icon: '🤫', category: 'Privacy', score: 5.5, prediction: '-1.8%' },
    
    // Stablecoins
    { value: 'tether', label: 'Tether (USDT)', icon: '💵', category: 'Stable', score: 3.2, prediction: '-0.05%' },
    { value: 'usd-coin', label: 'USD Coin (USDC)', icon: '🪙', category: 'Stable', score: 3.5, prediction: '+0.02%' },
    { value: 'dai', label: 'Dai (DAI)', icon: '⚖️', category: 'Stable', score: 3.8, prediction: '+0.08%' },
    { value: 'first-digital-usd', label: 'FDUSD (FDUSD)', icon: '💰', category: 'Stable', score: 3.1, prediction: '+0.01%' },
    { value: 'trueusd', label: 'TrueUSD (TUSD)', icon: '💎', category: 'Stable', score: 3.3, prediction: '-0.02%' },
    
    // Enterprise & Institutional
    { value: 'vechain', label: 'VeChain (VET)', icon: '⚡', category: 'Enterprise', score: 6.9, prediction: '+8.4%' },
    { value: 'quant-network', label: 'Quant (QNT)', icon: '🔢', category: 'Enterprise', score: 7.4, prediction: '+15.2%' },
    { value: 'hedera-hashgraph', label: 'Hedera (HBAR)', icon: '♦️', category: 'Enterprise', score: 7.1, prediction: '+11.8%' },
    { value: 'iota', label: 'IOTA (MIOTA)', icon: '🔗', category: 'Enterprise', score: 6.2, prediction: '+5.3%' },
    { value: 'neo', label: 'NEO (NEO)', icon: '🟢', category: 'Enterprise', score: 6.5, prediction: '+7.1%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <Link to="/">
            <Button variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white text-shadow-lg">
              AI Prediction Analysis
            </h1>
            <p className="text-gray-300 mt-2">
              Advanced cryptocurrency price predictions using machine learning
            </p>
          </div>
        </div>

        {/* Independent AI Prediction Widget */}
        <IndependentPredictionWidget cryptoOptions={cryptoOptions} />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AIPrediction;
