import { marketOverview, screenerResults, watchlist, marketAlerts, portfolioHoldings } from './mockData';
import { MarketOverview, Stock, AlertItem, PortfolioHolding, PatternInsight, SignalDirection } from '../types';

const ALPHA_VANTAGE_KEY = process.env.EXPO_PUBLIC_ALPHA_VANTAGE_API_KEY ?? 'demo';
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

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

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
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
    );
    const json = await response.json();
    const payload = json['Global Quote'] as Record<string, string> | undefined;

    if (!payload) return null;
    return quoteToStock(symbol, name, payload);
  } catch (error) {
    console.warn(`Failed to fetch live quote for ${symbol}:`, error);
    return null;
  }
};

export const searchStocks = async (query: string): Promise<Stock[]> => {
  const keyword = query.trim();
  if (!keyword) return [];

  if (!LIVE_ENABLED) return [];

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keyword)}&apikey=${ALPHA_VANTAGE_KEY}`
    );
    const json = await response.json();
    const matches = Array.isArray(json?.bestMatches) ? json.bestMatches : [];

    return matches.slice(0, 5).map((match: any) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      price: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      marketCap: 'Live',
      sentiment: 'Neutral',
      sparkline: [0, 0, 0, 0, 0, 0, 0],
    }));
  } catch (error) {
    console.warn('Search request failed:', error);
    return [];
  }
};

const buildPatternInsight = (stock: Stock): PatternInsight => {
  const series = stock.sparkline.length ? stock.sparkline : [stock.price, stock.price * 0.99, stock.price, stock.price * 1.01, stock.price * 1.02, stock.price * 1.03, stock.price];

  const latest = series[series.length - 1];
  const first = series[0];
  const mid = series[Math.max(0, Math.floor(series.length / 2))];
  const directionDelta = latest - first;
  const recentTrend = latest - mid;
  const average = series.reduce((sum, item) => sum + item, 0) / series.length;
  const range = Math.max(...series) - Math.min(...series);
  const positiveCandles = series.slice(1).filter((value, index) => value > series[index]).length;
  const negativeCandles = series.slice(1).filter((value, index) => value < series[index]).length;

  let direction: SignalDirection = 'Neutral';
  let pattern = 'Range bound';

  if (directionDelta > 0 && recentTrend > 0) {
    direction = 'Upward';
    pattern = 'Bullish continuation';
  } else if (directionDelta < 0 && recentTrend < 0) {
    direction = 'Downward';
    pattern = 'Bearish breakdown';
  } else if (positiveCandles > negativeCandles) {
    direction = 'Upward';
    pattern = 'Momentum squeeze';
  } else if (negativeCandles > positiveCandles) {
    direction = 'Downward';
    pattern = 'Distribution phase';
  }

  const score = clamp(
    Math.round(
      (Math.abs(directionDelta) / Math.max(average * 0.05, 1)) * 18 +
        (positiveCandles - negativeCandles) * 8 +
        stock.changePercent * 6 +
        (direction === 'Upward' ? 18 : direction === 'Downward' ? -18 : 0)
    ),
    10,
    95
  );

  const confidence = clamp(Math.abs(score), 35, 92);
  const support = Number((Math.min(...series) * 0.995).toFixed(2));
  const resistance = Number((Math.max(...series) * 1.005).toFixed(2));
  const nextMove = direction === 'Upward'
    ? `Upward bias: +${Math.max(0.5, Math.abs(stock.changePercent)).toFixed(1)}% expected`
    : direction === 'Downward'
      ? `Downward bias: -${Math.max(0.5, Math.abs(stock.changePercent)).toFixed(1)}% expected`
      : 'Sideways bias: low conviction move';

  return {
    symbol: stock.symbol,
    name: stock.name,
    direction,
    confidence,
    pattern,
    expectedMove: nextMove,
    support,
    resistance,
    lastPrice: Number(latest.toFixed(2)),
    changePercent: stock.changePercent,
    volume: stock.volume,
    score,
    note: `${pattern} with ${range > 0 ? 'clear trend range' : 'compressed range'} and ${positiveCandles >= negativeCandles ? 'bullish participation' : 'weakening demand'} detected.`,
  };
};

export const getPatternInsights = async (filter?: string): Promise<PatternInsight[]> => {
  const base = await getScreenerResults(filter);
  return base.map(buildPatternInsight);
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

export const getScreenerResults = async (filter?: string): Promise<Stock[]> => {
  const base = screenerResults;
  if (!filter) return base;

  const filters: Record<string, (stock: Stock) => boolean> = {
    Momentum: (stock) => stock.changePercent >= 1.5,
    Breakout: (stock) => stock.volume > 30000000,
    Value: (stock) => stock.price < 250,
    'AI Bias': (stock) => stock.sentiment === 'Bullish' || stock.changePercent > 0,
  };

  const predicate = filters[filter];
  return predicate ? base.filter(predicate) : base;
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
