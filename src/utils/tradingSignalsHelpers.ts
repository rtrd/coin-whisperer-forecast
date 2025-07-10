import { TrendingUp, TrendingDown, Activity, Target, BarChart3, AlertTriangle, Zap, TrendingUp as TrendUp, Shield, RotateCcw, Newspaper, Globe, Radar, ArrowUpCircle, ArrowDownCircle, Minus } from "lucide-react";

export const getSentimentIcon = (marketSentiment: 'bullish' | 'bearish' | 'neutral') => {
  switch (marketSentiment) {
    case 'bullish': return TrendingUp;
    case 'bearish': return TrendingDown;
    default: return Activity;
  }
};

export const getActionIcon = (action: string) => {
  switch (action) {
    case 'buy': return TrendingUp;
    case 'sell': return TrendingDown;
    default: return Target;
  }
};

export const getActionColor = (action: string) => {
  switch (action) {
    case 'buy': return 'text-green-300 border-green-300';
    case 'sell': return 'text-red-300 border-red-300';
    default: return 'text-yellow-300 border-yellow-300';
  }
};

export const getSignalTypeIcon = (type: string) => {
  switch (type) {
    case 'bullish': return TrendingUp;
    case 'bearish': return TrendingDown;
    default: return Activity;
  }
};

export const getSignalTypeColor = (type: string) => {
  switch (type) {
    case 'bullish': return 'text-green-300 border-green-300';
    case 'bearish': return 'text-red-300 border-red-300';
    default: return 'text-yellow-300 border-yellow-300';
  }
};

export const getLiveSignalIcon = (type: string) => {
  switch (type) {
    case 'volume_spike': return BarChart3;
    case 'breakout': return TrendingUp;
    case 'price_alert': return AlertTriangle;
    case 'support_test': return Target;
    case 'momentum_shift': return Activity;
    default: return Zap;
  }
};

export const getLiveSignalColor = (strength: string) => {
  switch (strength) {
    case 'high': return 'border-red-300 bg-red-900/20';
    case 'medium': return 'border-yellow-300 bg-yellow-900/20';
    case 'low': return 'border-gray-300 bg-gray-900/20';
    default: return 'border-gray-300 bg-gray-900/20';
  }
};

export const getNarrativeIcon = (type: string) => {
  switch (type) {
    case 'trend': return TrendUp;
    case 'risk': return Shield;
    case 'cycle': return RotateCcw;
    case 'news': return Newspaper;
    case 'narrative': return Globe;
    default: return Radar;
  }
};

export const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'high': return ArrowUpCircle;
    case 'medium': return Minus;
    case 'low': return ArrowDownCircle;
    default: return Minus;
  }
};

export const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'border-red-400/50 bg-red-900/20';
    case 'medium': return 'border-yellow-400/50 bg-yellow-900/20';
    case 'low': return 'border-green-400/50 bg-green-900/20';
    default: return 'border-gray-400/50 bg-gray-900/20';
  }
};