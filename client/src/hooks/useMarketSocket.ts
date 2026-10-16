
import { useCallback, useEffect, useState } from "react";
import type {
  BinanceTicker,
  ConnectionState,
  Market
} from "../types/market";

const SYMBOLS = [
  { symbol: "BTCUSDT", baseAsset: "BTC", quoteAsset: "USDT" },
  { symbol: "ETHUSDT", baseAsset: "ETH", quoteAsset: "USDT" },
  { symbol: "SOLUSDT", baseAsset: "SOL", quoteAsset: "USDT" },
  { symbol: "BNBUSDT", baseAsset: "BNB", quoteAsset: "USDT" },
  { symbol: "XRPUSDT", baseAsset: "XRP", quoteAsset: "USDT" },
  { symbol: "ADAUSDT", baseAsset: "ADA", quoteAsset: "USDT" },
  { symbol: "DOGEUSDT", baseAsset: "DOGE", quoteAsset: "USDT" },
  { symbol: "LINKUSDT", baseAsset: "LINK", quoteAsset: "USDT" }
];

const STREAM_URL =
  "wss://stream.binance.com:443/stream?streams=" +
  SYMBOLS.map(({ symbol }) =>
    `${symbol.toLowerCase()}@ticker`
  ).join("/");

const MAX_HISTORY = 300;

export function useMarketSocket() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [status, setStatus] =
    useState<ConnectionState>("connecting");
  const [lastMessageAt, setLastMessageAt] =
    useState<number | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const reconnect = useCallback(() => {
    setStatus("connecting");
    setRetryKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;
    let attempts = 0;

    const connect = () => {
      if (stopped) return;

      setStatus(attempts === 0 ? "connecting" : "reconnecting");

      try {
        socket = new WebSocket(STREAM_URL);
      } catch {
        setStatus("error");
        scheduleReconnect();
        return;
      }

      socket.onopen = () => {
        attempts = 0;
        setStatus("connected");
      };

      socket.onmessage = (event: MessageEvent<string>) => {
        try {
          const message = JSON.parse(event.data) as {
            stream?: string;
            data?: BinanceTicker;
          };

          const ticker = message.data;
          if (!ticker?.s || !ticker.c) return;

          const metadata = SYMBOLS.find(
            (item) => item.symbol === ticker.s
          );

          if (!metadata) return;

          const price = Number(ticker.c);
          if (!Number.isFinite(price) || price <= 0) return;

          const now = Math.floor(Date.now() / 1000);

          setLastMessageAt(Date.now());

          setMarkets((previous) => {
            const old = previous.find(
              (market) => market.symbol === ticker.s
            );

            const direction =
              !old || old.price === price
                ? old?.direction ?? "unchanged"
                : price > old.price
                  ? "up"
                  : "down";

            const history = old
              ? [...old.history]
              : [];

            const lastPoint = history[history.length - 1];

            if (lastPoint?.time === now) {
              history[history.length - 1] = {
                time: now,
                value: price
              };
            } else {
              history.push({ time: now, value: price });
            }

            const market: Market = {
              ...metadata,
              price,
              changePercent: Number(ticker.P),
              highPrice: Number(ticker.h),
              lowPrice: Number(ticker.l),
              volume: Number(ticker.v),
              direction,
              history: history.slice(-MAX_HISTORY)
            };

            const found = previous.some(
              (item) => item.symbol === ticker.s
            );

            if (!found) return [...previous, market];

            return previous.map((item) =>
              item.symbol === ticker.s ? market : item
            );
          });
        } catch {
          // Ignore malformed messages without crashing the UI.
        }
      };

      socket.onerror = () => {
        setStatus("error");
      };

      socket.onclose = () => {
        if (!stopped) scheduleReconnect();
      };
    };

    const scheduleReconnect = () => {
      if (stopped) return;

      attempts += 1;
      setStatus("reconnecting");

      const delay = Math.min(
        1000 * 2 ** Math.min(attempts - 1, 5),
        30000
      );

      retryTimer = setTimeout(connect, delay);
    };

    connect();

    return () => {
      stopped = true;
      if (retryTimer) clearTimeout(retryTimer);

      if (socket) {
        socket.onclose = null;
        socket.close();
      }
    };
  }, [retryKey]);

  return { markets, status, lastMessageAt, reconnect };
}
