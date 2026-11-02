import { marketOverview, screenerResults, watchlist, marketAlerts, portfolioHoldings } from './mockData';
import { MarketOverview, Stock, AlertItem, PortfolioHolding } from '../types';

export const getMarketOverview = async (): Promise<MarketOverview[]> => {
  return marketOverview;
};

export const getWatchlist = async (): Promise<Stock[]> => {
  return watchlist;
};

export const getScreenerResults = async (): Promise<Stock[]> => {
  return screenerResults;
};

export const getAlerts = async (): Promise<AlertItem[]> => {
  return marketAlerts;
};

export const getPortfolio = async (): Promise<PortfolioHolding[]> => {
  return portfolioHoldings;
};

export const getCandlesForSymbol = async (symbol: string) => {
  const seedMap: Record<string, number[]> = {
    AAPL: [182, 186, 184, 190, 188, 196, 201, 205, 212, 218],
    MSFT: [420, 425, 430, 438, 440, 448, 451, 454, 459, 455],
    TSLA: [210, 214, 217, 220, 228, 234, 240, 247, 244, 247],
    RELIANCE: [2920, 2965, 3010, 3040, 3072, 3104, 3120, 3145, 3138, 3145],
    INFY: [1450, 1488, 1495, 1520, 1545, 1560, 1582, 1598, 1606, 1598],
    default: [100, 102, 101, 105, 104, 108, 110, 109, 112, 115],
  };

  return seedMap[symbol] ?? seedMap.default;
};
