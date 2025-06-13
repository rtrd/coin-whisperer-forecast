
export const getCategoryBadgeStyle = (category: string): string => {
  const styles: { [key: string]: string } = {
    "Layer 1 (L1)": "border-blue-500 text-blue-400",
    "DeFi": "border-green-500 text-green-400",
    "Meme Coin": "border-purple-500 text-purple-400",
    "AI": "border-cyan-500 text-cyan-400",
    "Gaming": "border-orange-500 text-orange-400",
    "New": "border-yellow-500 text-yellow-400",
    "L2": "border-indigo-500 text-indigo-400",
    "Privacy": "border-gray-500 text-gray-400",
    "Stablecoin": "border-gray-500 text-gray-400",
    "Payment Token": "border-emerald-500 text-emerald-400"
  };
  
  return styles[category] || "border-red-500 text-red-400";
};

export const getAIScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
};
