import { useState, useEffect, useCallback } from "react";

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  sector: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
  positions: PositionData[];
}

export interface PositionData {
  symbol: string;
  name: string;
  qty: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  sector: string;
  allocation: number;
}

export interface ChartPoint {
  time: string;
  value: number;
  volume?: number;
}

const INITIAL_STOCKS: StockData[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 189.84, change: 2.31, changePercent: 1.23, volume: 52_300_000, high: 191.20, low: 187.50, sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet", price: 141.16, change: -0.84, changePercent: -0.59, volume: 21_100_000, high: 142.80, low: 140.20, sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft", price: 378.91, change: 4.12, changePercent: 1.10, volume: 18_700_000, high: 380.50, low: 375.30, sector: "Technology" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.42, change: -3.58, changePercent: -1.42, volume: 98_200_000, high: 253.10, low: 246.80, sector: "Automotive" },
  { symbol: "AMZN", name: "Amazon", price: 178.25, change: 1.67, changePercent: 0.95, volume: 42_500_000, high: 179.80, low: 176.90, sector: "E-Commerce" },
  { symbol: "NVDA", name: "NVIDIA", price: 495.22, change: 12.45, changePercent: 2.58, volume: 61_800_000, high: 498.30, low: 482.70, sector: "Technology" },
  { symbol: "META", name: "Meta", price: 367.12, change: -2.14, changePercent: -0.58, volume: 15_600_000, high: 370.40, low: 365.20, sector: "Technology" },
  { symbol: "JPM", name: "JPMorgan", price: 172.88, change: 0.92, changePercent: 0.53, volume: 8_900_000, high: 174.10, low: 171.50, sector: "Finance" },
];

const POSITIONS: PositionData[] = [
  { symbol: "AAPL", name: "Apple Inc.", qty: 150, avgPrice: 172.50, currentPrice: 189.84, pnl: 2601, pnlPercent: 10.04, sector: "Technology", allocation: 28 },
  { symbol: "NVDA", name: "NVIDIA", qty: 45, avgPrice: 442.10, currentPrice: 495.22, pnl: 2390.4, pnlPercent: 12.01, sector: "Technology", allocation: 22 },
  { symbol: "AMZN", name: "Amazon", qty: 100, avgPrice: 168.50, currentPrice: 178.25, pnl: 975, pnlPercent: 5.79, sector: "E-Commerce", allocation: 18 },
  { symbol: "GOOGL", name: "Alphabet", qty: 80, avgPrice: 138.20, currentPrice: 141.16, pnl: 236.8, pnlPercent: 2.14, sector: "Technology", allocation: 11 },
  { symbol: "JPM", name: "JPMorgan", qty: 70, avgPrice: 165.30, currentPrice: 172.88, pnl: 530.6, pnlPercent: 4.59, sector: "Finance", allocation: 12 },
  { symbol: "TSLA", name: "Tesla Inc.", qty: 60, avgPrice: 261.00, currentPrice: 248.42, pnl: -754.8, pnlPercent: -4.82, sector: "Automotive", allocation: 9 },
];

function generateChartData(points: number): ChartPoint[] {
  let value = 245000;
  const data: ChartPoint[] = [];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.45) * 3000;
    data.push({
      time: months[i % 12] || `${i + 1}`,
      value: Math.round(value),
      volume: Math.round(Math.random() * 80000 + 20000),
    });
  }
  return data;
}

export function useSimulatedData() {
  const [stocks, setStocks] = useState<StockData[]>(INITIAL_STOCKS);
  const [portfolio, setPortfolio] = useState<PortfolioSummary>({
    totalValue: 248_592,
    totalPnl: 12_340,
    totalPnlPercent: 5.22,
    dayChange: 3_245,
    dayChangePercent: 1.32,
    positions: POSITIONS,
  });
  const [chartData, setChartData] = useState<ChartPoint[]>(generateChartData(12));
  const [isLive, setIsLive] = useState(true);

  const tick = useCallback(() => {
    setStocks((prev) =>
      prev.map((s) => {
        const delta = (Math.random() - 0.48) * 2;
        const newPrice = Math.round((s.price + delta) * 100) / 100;
        const newChange = Math.round((s.change + delta * 0.3) * 100) / 100;
        return {
          ...s,
          price: newPrice,
          change: newChange,
          changePercent: Math.round((newChange / s.price) * 10000) / 100,
          volume: s.volume + Math.round(Math.random() * 100000),
        };
      })
    );

    setPortfolio((prev) => {
      const valueDelta = (Math.random() - 0.45) * 500;
      const newValue = Math.round(prev.totalValue + valueDelta);
      const newDayChange = Math.round(prev.dayChange + valueDelta * 0.2);
      return {
        ...prev,
        totalValue: newValue,
        dayChange: newDayChange,
        dayChangePercent: Math.round((newDayChange / newValue) * 10000) / 100,
        totalPnl: Math.round(prev.totalPnl + valueDelta * 0.1),
        positions: prev.positions.map((p) => {
          const d = (Math.random() - 0.48) * 1.5;
          const newCurrent = Math.round((p.currentPrice + d) * 100) / 100;
          const newPnl = Math.round((newCurrent - p.avgPrice) * p.qty * 100) / 100;
          return {
            ...p,
            currentPrice: newCurrent,
            pnl: newPnl,
            pnlPercent: Math.round((newPnl / (p.avgPrice * p.qty)) * 10000) / 100,
          };
        }),
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, [tick]);

  return { stocks, portfolio, chartData, setChartData, isLive, setIsLive };
}

export function generateMonthlyPerformance() {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return months.map((m) => ({
    month: m,
    value: Math.round(Math.random() * 40000 + 45000),
    gain: Math.round(Math.random() * 8000 - 2000),
  }));
}

export function generateSectorData() {
  return [
    { name: "Technology", value: 61, color: "#8b5cf6" },
    { name: "E-Commerce", value: 18, color: "#06b6d4" },
    { name: "Finance", value: 12, color: "#f472b6" },
    { name: "Automotive", value: 9, color: "#fbbf24" },
  ];
}

export function generateRiskData() {
  return [
    { name: "R1", value: 51 },
    { name: "R2", value: 44 },
    { name: "R3", value: 33 },
    { name: "R4", value: 43 },
    { name: "R5", value: 54 },
  ];
}
