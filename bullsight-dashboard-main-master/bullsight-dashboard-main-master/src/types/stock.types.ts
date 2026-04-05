export interface Position {
  id: string;
  symbol: string;
  companyName: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  sector: string;
}

export interface Portfolio {
  userId: string;
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  positions: Position[];
}

export interface PriceAlert {
  id: string;
  userId: string;
  symbol: string;
  targetPrice: number;
  condition: "ABOVE" | "BELOW";
  active: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

export interface WebSocketMessage {
  type: "PRICE_UPDATE" | "ALERT_TRIGGERED";
  payload: PriceUpdate | PriceAlert;
}

export interface OrderRequest {
  userId: string;
  symbol: string;
  quantity: number;
  orderType: "BUY" | "SELL";
  price: number;
}
