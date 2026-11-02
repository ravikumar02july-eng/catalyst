export type Sentiment = 'Bullish' | 'Neutral' | 'Bearish';

export type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  sentiment: Sentiment;
  sparkline: number[];
};

export type AlertItem = {
  id: string;
  symbol: string;
  condition: string;
  active: boolean;
  triggeredAt: string;
};

export type PortfolioHolding = {
  symbol: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  allocation: number;
};

export type MarketOverview = {
  index: string;
  value: number;
  change: number;
  changePercent: number;
};
