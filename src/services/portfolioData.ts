import {
  PortfolioAsset,
  PortfolioMetrics,
  Transaction,
  DeFiPosition,
  RiskMetrics,
  AIRecommendation,
  SmartAlert,
  CorrelationData,
  PortfolioHistory,
} from "@/types/portfolio";

const API_BASE_URL = "https://server.pumpparade.com/api";

export const getPortfolioData = async (walletAddress: string, chainId:number) => {
  if (!walletAddress) throw new Error("Wallet address is required");

  try {
    const [
      portfolioRes,
      transactionsRes,
      defiRes,
      riskRes,
      alertsRes,
      correlationRes,
      historyRes,
    ] = await Promise.all([
      fetch(`${API_BASE_URL}/getPortfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, chainId }),
      }),
      fetch(`${API_BASE_URL}/getTransactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, chainId }),
      }),
      fetch(`${API_BASE_URL}/getDeFiPositions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress,chainId }),
      }),
      fetch(`${API_BASE_URL}/getRiskMetrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress,chainId }),
      }),
      fetch(`${API_BASE_URL}/getSmartAlerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress,chainId }),
      }),
      fetch(`${API_BASE_URL}/getCorrelationData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress,chainId }),
      }),
      fetch(`${API_BASE_URL}/getPortfolioHistory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress,chainId }),
      }),
    ]);

    if (
      [
        portfolioRes,
        transactionsRes,
        defiRes,
        riskRes,
        alertsRes,
        correlationRes,
        historyRes,
      ].some((r) => !r.ok)
    ) {
      throw new Error("Failed to fetch one or more portfolio components");
    }

    const portfolioData = await portfolioRes.json();
    const transactions: Transaction[] = await transactionsRes.json();
    const defiPositions: DeFiPosition[] = await defiRes.json();
    const riskMetrics: RiskMetrics = await riskRes.json();
    //const aiRecommendations: AIRecommendation[] = await aiRes.json();
    const smartAlerts: SmartAlert[] = await alertsRes.json();
    const correlationData: CorrelationData[] = await correlationRes.json();
    const portfolioHistory: PortfolioHistory[] = await historyRes.json();

    // --- Compute portfolio metrics ---
    const totalValue = portfolioData.portfolio.reduce(
      (sum: number, asset: PortfolioAsset) => sum + asset.totalValue,
      0
    );

    const portfolioAssets: PortfolioAsset[] = portfolioData.portfolio.map(
      (t: any) => ({
        id: t.symbol.toLowerCase(),
        symbol: t.symbol,
        name: t.name,
        icon: getIconForSymbol(t.symbol),
        chain: t.chain,
        address: t.address,
        amount: t.amount,
        currentPrice: t.currentPrice,
        averageBuyPrice: 0, // Add DB logic later
        totalValue: t.totalValue,
        pnl: 0,
        pnlPercentage: 0,
        allocation:
          totalValue > 0
            ? parseFloat(((t.totalValue / totalValue) * 100).toFixed(2))
            : 0,
        change24h: t.change24h,
        volume24h: 0,
        marketCap: 0,
      })
    );

    const portfolioMetrics: PortfolioMetrics = {
      totalValue: parseFloat(totalValue.toFixed(2)),
      totalPnL: 0,
      totalPnLPercentage: 0,
      dayChange: 0,
      dayChangePercentage: 0,
      weekChange: 0,
      weekChangePercentage: 0,
      monthChange: 0,
      monthChangePercentage: 0,
      bestPerformer: portfolioAssets[0] || null,
      worstPerformer: portfolioAssets[portfolioAssets.length - 1] || null,
    };

    // --- New Portfolio Summary ---
    // --- New Portfolio Summary ---
    const summaryTotalValue = totalValue;

    const summaryChangeAbs =
      portfolioAssets.reduce((sum, a) => {
        const absChange = (a.totalValue * (a.change24h || 0)) / 100; // assume % change
        return sum + absChange;
      }, 0) || 0;

    const summaryChangePct =
      summaryTotalValue > 0
        ? (summaryChangeAbs / (summaryTotalValue - summaryChangeAbs)) * 100
        : 0;

    const portfolioSummary = {
      totalValue: parseFloat(summaryTotalValue.toFixed(6)),
      change24h: {
        absolute: parseFloat(summaryChangeAbs.toFixed(6)),
        percent: parseFloat(summaryChangePct.toFixed(6)),
      },
      assets: portfolioAssets.length,
    };

    return {
      portfolioAssets,
      portfolioMetrics,
      portfolioSummary, // ✅ frontend can use this directly
      transactions,
      defiPositions,
      riskMetrics,
      //aiRecommendations,
      smartAlerts,
      correlationData,
      portfolioHistory,
    };
  } catch (error) {
    console.error("Error in getPortfolioData:", error);
    throw error;
  }
};

function getIconForSymbol(symbol: string): string {
  const iconsMap: Record<string, string> = {
    BTC: "₿",
    ETH: "Ξ",
    SOL: "◎",
    LINK: "⬢",
    MATIC: "⬡",
  };
  return iconsMap[symbol.toUpperCase()] || "❓";
}

const getAIPortfolioInsightsprompt = (
  portfolioData: any,
  strategy: string,
  walletAddress: string
) => {
  return `
You're an expert cryptocurrency technical analyst. 

Portfolio data:
${JSON.stringify(portfolioData)}

Strategy: ${strategy}
Wallet: ${walletAddress}

Return exactly 3 recommendations in **valid JSON array** matching this schema:

[
  {
    "id": "1",
    "type": "rebalance | risk_management | diversification",
    "title": "string",
    "description": "string",
    "priority": "low | medium | high",
    "potential_impact": number,
    "reasoning": "string",
    "actions": ["string", "string"]
  }
]
Do not return any extra text, only valid JSON.
`;
};


// In-memory cache with expiration
interface CacheEntry {
  value: string;
  timestamp: number;
}

const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
const aiInsightsCache = new Map<string, CacheEntry>();

export const getAIPortfolioInsights = async (
  portfolioData: any,
  strategy: string,
  walletAddress: string
) => {
  debugger;
  const cacheKey = `${walletAddress}-${strategy}`;
  const now = Date.now();

  // Check if cached value exists and is still valid
  const cached = aiInsightsCache.get(cacheKey);
 if (cached && now - cached.timestamp < CACHE_DURATION) {
  console.log("Returning cached AI insights");

  // 🕐 Apply 2-second delay before returning cached data
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return cached.value;
}

  // Fetch fresh data if no valid cache
  const prompt = getAIPortfolioInsightsprompt(portfolioData, strategy, walletAddress);

  const response = await fetch(`${API_BASE_URL}/getAIRecommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch AI recommendations: ${response.statusText}`);
  }

  const data = await response.json();

  // Store in cache with current timestamp
  aiInsightsCache.set(cacheKey, { value: data.text, timestamp: now });

  return data.text;
};


export const parseAIRecommendations = (apiText: string): AIRecommendation[] => {
  try {
    // 1. Clean markdown code fences if present
    const cleaned = apiText
      .replace(/```json\n?/gi, "")
      .replace(/```/g, "")
      .trim();

    // 2. Parse JSON
    const parsed: AIRecommendation[] = JSON.parse(cleaned);

    return parsed;
  } catch (e) {
    console.error("❌ Failed to parse AI recommendations:", e, apiText);
    return [];
  }
};

 const riskThresholds = {
    concentrationRisk: { high: 70, medium: 40 },
    beta: { high: 1.2, medium: 0.8 },
    maxDrawdown: { high: -20, medium: -10 },
  };

   function generateRiskSuggestions(riskMetrics) {
    const suggestions = [];

    if (riskMetrics.concentrationRisk > riskThresholds.concentrationRisk.high) {
      suggestions.push({
        id: "1",
        type: "high",
        title: "High Concentration Risk",
        description: `Your portfolio is heavily concentrated in crypto assets (${riskMetrics.concentrationRisk}%)`,
        action: "Consider diversifying into traditional assets or stablecoins",
        impact: "Could reduce volatility by 15-20%",
      });
    }

    if (riskMetrics.beta > riskThresholds.beta.high) {
      suggestions.push({
        id: "2",
        type: "medium",
        title: "Beta Exposure",
        description: `Portfolio beta of ${riskMetrics.beta} indicates higher market sensitivity`,
        action: "Add low-beta assets or defensive positions",
        impact: "Target beta reduction to 1.1-1.2",
      });
    }

    if (riskMetrics.maxDrawdown < riskThresholds.maxDrawdown.medium) {
      suggestions.push({
        id: "3",
        type: "low",
        title: "Drawdown Management",
        description: `Current max drawdown of ${riskMetrics.maxDrawdown.toFixed(3)}% is within acceptable range`,
        action: "Maintain stop-loss levels at current positions",
        impact: "Preserve capital during market downturns",
      });
    }

    return suggestions;
  }
const AIRiskManagementSuggestionsprompt = (riskMetrics: RiskMetrics) => {
   const prompt = `
You are a financial risk analysis assistant. 
Given the following riskMetrics:
${JSON.stringify(riskMetrics, null, 2)}

Generate risk suggestions in this exact JSON array format:
[
  {
    "id": "string",
    "type": "high | medium | low",
    "title": "string",
    "description": "string",
    "action": "string",
    "impact": "string"
  }
]

Guidelines:
- Match the style of suggestions in the example below:
${generateRiskSuggestions.toString()}
- Only output valid JSON (no text outside the JSON).
`;
return prompt
}
// In-memory cache

export const generateAIRiskManagementSuggestions = async (riskMetrics: RiskMetrics) => {
  const prompt = AIRiskManagementSuggestionsprompt(riskMetrics);


  // 2️⃣ Fetch from API
  const response = await fetch(`${API_BASE_URL}/getAIRecommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch AI RiskManagementSuggestion: ${response.statusText}`
    );
  }

  const data = await response.json();

  // 3️⃣ Parse AI response safely
  let parsedSuggestions;
  try {
    // Strip any ```json ... ``` fences if present
    const cleanedText = data.text.replace(/```json|```/g, "").trim();
    parsedSuggestions = JSON.parse(cleanedText);
  } catch (err) {
    console.error("❌ Failed to parse AI suggestions:", err, data.text);
    parsedSuggestions = [];
  }

  return parsedSuggestions;
};
