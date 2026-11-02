import { marketOverview, screenerResults, watchlist, marketAlerts, portfolioHoldings } from './mockData';
import { MarketOverview, Stock, AlertItem, PortfolioHolding } from '../types';

const LIVE_API_KEY = process.env.EXPO_PUBLIC_ALPHA_VANTAGE_API_KEY ?? 'demo';
const LIVE_ENABLED = Boolean(process.env.EXPO_PUBLIC_ALPHA_VANTAGE_API_KEY);

const normalizePrice = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizePercent = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const cleaned = value.replace('%', '').trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const quoteToStock = (symbol: string, name: string, data: Record<string, string>): Stock => {
  const price = normalizePrice(data['05. price'], 0);
  const change = normalizePrice(data['09. change'], 0);
  const changePercent = normalizePercent(data['10. change percent'], 0);
  const volume = normalizePrice(data['06. volume'], 0);

  return {
    symbol,
    name,
    price,
    change,
    changePercent,
    volume: Math.round(volume),
    marketCap: 'Live',
    sentiment: changePercent >= 0 ? 'Bullish' : changePercent < 0 ? 'Bearish' : 'Neutral',
    sparkline: [price * 0.97, price * 0.98, price * 0.99, price, price * 1.01, price * 1.02, price],
  };
};

const fetchQuote = async (symbol: string, name: string): Promise<Stock | null> => {
  if (!LIVE_ENABLED) return null;

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${LIVE_API_KEY}`
    );
    const json = await response.json();
    const payload = json['Global Quote'] as Record<string, string> | undefined;

    if (!payload) {
      return null;
    }

    return quoteToStock(symbol, name, payload);
  } catch (error) {
    console.warn(`Failed to fetch live quote for ${symbol}:`, error);
    return null;
  }
};

const fetchMarketOverview = async (): Promise<MarketOverview[]> => {
  return marketOverview;
};

export const getMarketOverview = async (): Promise<MarketOverview[]> => {
  try {
    return await fetchMarketOverview();
  } catch {
    return marketOverview;
  }
};

export const getWatchlist = async (): Promise<Stock[]> => {
  const liveSymbols = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'NVDA', name: 'NVIDIA' },
    { symbol: 'TSLA', name: 'Tesla' },
  ];

  if (LIVE_ENABLED) {
    const results = await Promise.all(
      liveSymbols.map(async ({ symbol, name }) => {
        const stock = await fetchQuote(symbol, name);
        return stock ?? watchlist.find((item) => item.symbol.toLowerCase() === symbol.toLowerCase()) ?? null;
      })
    );

    const valid = results.filter(Boolean) as Stock[];
    if (valid.length > 0) return valid;
  }

  return watchlist;
};

export const getScreenerResults = async (): Promise<Stock[]> => {
  const symbols = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'NVDA', name: 'NVIDIA' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'AMD', name: 'Advanced Micro Devices' },
  ];

  if (LIVE_ENABLED) {
    const results = await Promise.all(
      symbols.map(async ({ symbol, name }) => {
        const stock = await fetchQuote(symbol, name);
        return stock ?? screenerResults.find((item) => item.symbol.toLowerCase() === symbol.toLowerCase()) ?? null;
      })
    );

    const valid = results.filter(Boolean) as Stock[];
    if (valid.length > 0) return valid;
  }

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
