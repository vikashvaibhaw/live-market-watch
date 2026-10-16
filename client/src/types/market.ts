
export type PriceDirection = "up" | "down" | "unchanged";

export interface Market {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  changePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  direction: PriceDirection;
  history: { time: number; value: number }[];
}

export type ConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";

export interface BinanceTicker {
  e: string;
  E: number;
  s: string;
  c: string;
  P: string;
  h: string;
  l: string;
  v: string;
}
