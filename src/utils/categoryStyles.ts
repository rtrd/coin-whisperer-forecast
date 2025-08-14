
export const getCategoryBadgeStyle = (category: string): string => {
  const styles: { [key: string]: string } = {
    // Layer 1 & Infrastructure
    "Layer 1 (L1)": "border-blue-500 text-blue-400",
    "Layer 1": "border-blue-500 text-blue-400",
    "L2": "border-indigo-500 text-indigo-400",
    "Layer 2": "border-indigo-500 text-indigo-400",
    "Infrastructure": "border-slate-500 text-slate-400",
    
    // DeFi & Finance
    "DeFi": "border-green-500 text-green-400",
    "Liquid Staking": "border-emerald-500 text-emerald-400",
    "Exchange Token": "border-teal-500 text-teal-400",
    "Stablecoin": "border-zinc-500 text-zinc-400",
    "Payment Token": "border-lime-500 text-lime-400",
    "Wrapped Token": "border-amber-500 text-amber-400",
    
    // Meme & Social
    "Meme Coin": "border-purple-500 text-purple-400",
    "Meme": "border-purple-500 text-purple-400",
    "Social": "border-pink-500 text-pink-400",
    
    // Technology & Data
    "AI": "border-cyan-500 text-cyan-400",
    "Oracle": "border-violet-500 text-violet-400",
    "Storage": "border-fuchsia-500 text-fuchsia-400",
    "Identity": "border-rose-500 text-rose-400",
    "IoT": "border-sky-500 text-sky-400",
    "Indexing": "border-stone-500 text-stone-400",
    
    // Entertainment & Media
    "Gaming": "border-orange-500 text-orange-400",
    "NFT": "border-red-500 text-red-400",
    "Metaverse": "border-yellow-500 text-yellow-400",
    
    // Privacy & Security
    "Privacy": "border-gray-500 text-gray-400",
    
    // New & Trending
    "New": "border-green-300 text-green-300",
    "Trending": "border-yellow-300 text-yellow-300"
  };
  
  return styles[category] || "border-neutral-500 text-neutral-400";
};

export const getAIScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
};
