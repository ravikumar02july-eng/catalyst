import { AlertItem, MarketOverview, PortfolioHolding, Stock } from '../types';

export const marketOverview: MarketOverview[] = [
  { index: 'NIFTY 50', value: 24410.5, change: 218.8, changePercent: 0.9 },
  { index: 'SENSEX', value: 80310.4, change: 301.2, changePercent: 0.38 },
  { index: 'NASDAQ', value: 18466.8, change: -54.3, changePercent: -0.29 },
];

export const watchlist: Stock[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    price: 3145.7,
    change: 48.1,
    changePercent: 1.55,
    volume: 5430000,
    marketCap: '₹20.8T',
    sentiment: 'Bullish',
    sparkline: [3000, 3022, 3051, 3094, 3068, 3112, 3146],
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3786.4,
    change: -22.1,
    changePercent: -0.58,
    volume: 2800000,
    marketCap: '₹14.9T',
    sentiment: 'Neutral',
    sparkline: [3900, 3882, 3840, 3825, 3800, 3795, 3786],
  },
  {
    symbol: 'INFY',
    name: 'Infosys',
    price: 1598.2,
    change: 27.6,
    changePercent: 1.76,
    volume: 4500000,
    marketCap: '₹8.1T',
    sentiment: 'Bullish',
    sparkline: [1500, 1518, 1530, 1545, 1570, 1584, 1598],
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    price: 1715.9,
    change: 14.4,
    changePercent: 0.85,
    volume: 3300000,
    marketCap: '₹12.3T',
    sentiment: 'Bullish',
    sparkline: [1680, 1690, 1695, 1704, 1708, 1716, 1715],
  },
];

export const screenerResults: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 218.72,
    change: 6.94,
    changePercent: 3.28,
    volume: 66500000,
    marketCap: '$3.3T',
    sentiment: 'Bullish',
    sparkline: [198, 200, 204, 202, 209, 212, 218],
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    price: 455.18,
    change: 9.42,
    changePercent: 2.11,
    volume: 24000000,
    marketCap: '$3.4T',
    sentiment: 'Bullish',
    sparkline: [430, 435, 438, 444, 450, 454, 455],
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    price: 132.5,
    change: -2.1,
    changePercent: -1.56,
    volume: 42000000,
    marketCap: '$3.2T',
    sentiment: 'Neutral',
    sparkline: [138, 136, 134, 137, 135, 133, 132],
  },
  {
    symbol: 'TSLA',
    name: 'Tesla',
    price: 247.4,
    change: 11.2,
    changePercent: 4.75,
    volume: 112000000,
    marketCap: '$785B',
    sentiment: 'Bullish',
    sparkline: [220, 224, 228, 233, 236, 241, 247],
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 171.2,
    change: -3.4,
    changePercent: -1.95,
    volume: 33000000,
    marketCap: '$274B',
    sentiment: 'Bearish',
    sparkline: [180, 178, 176, 175, 174, 172, 171],
  },
];

export const portfolioHoldings: PortfolioHolding[] = [
  { symbol: 'AAPL', shares: 28, avgCost: 198.7, currentPrice: 218.72, allocation: 38 },
  { symbol: 'MSFT', shares: 18, avgCost: 402.3, currentPrice: 455.18, allocation: 31 },
  { symbol: 'RELIANCE', shares: 20, avgCost: 2980.0, currentPrice: 3145.7, allocation: 21 },
  { symbol: 'INFY', shares: 36, avgCost: 1480.8, currentPrice: 1598.2, allocation: 10 },
];

export const marketAlerts: AlertItem[] = [
  { id: '1', symbol: 'AAPL', condition: 'Breakout above $220', active: true, triggeredAt: '2 min ago' },
  { id: '2', symbol: 'TSLA', condition: 'Volume surge > 2x avg', active: true, triggeredAt: '8 min ago' },
  { id: '3', symbol: 'INFY', condition: 'VWAP support confirmed', active: false, triggeredAt: 'Yesterday' },
];
