import { useEffect, useRef, useState, useCallback } from "react";
import type { PriceUpdate, PriceAlert, WebSocketMessage } from "@/types/stock.types";

interface UseWebSocketReturn {
  prices: Record<string, PriceUpdate>;
  alerts: PriceAlert[];
  isConnected: boolean;
}

export function useWebSocket(url = "ws://localhost:8080/ws/stocks"): UseWebSocketReturn {
  const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => setIsConnected(true);

      ws.onmessage = (event) => {
        try {
          const msg: WebSocketMessage = JSON.parse(event.data);
          if (msg.type === "PRICE_UPDATE") {
            const update = msg.payload as PriceUpdate;
            setPrices((prev) => ({ ...prev, [update.symbol]: update }));
          } else if (msg.type === "ALERT_TRIGGERED") {
            setAlerts((prev) => [...prev, msg.payload as PriceAlert]);
          }
        } catch { /* ignore malformed */ }
      };

      ws.onclose = () => {
        setIsConnected(false);
        reconnectTimer.current = setTimeout(connect, 5000);
      };

      ws.onerror = () => ws.close();
    } catch {
      setIsConnected(false);
      reconnectTimer.current = setTimeout(connect, 5000);
    }
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { prices, alerts, isConnected };
}
