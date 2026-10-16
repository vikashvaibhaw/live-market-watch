
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Watchlist from "../components/Watchlist";
import type { Market } from "../types/market";
import "@testing-library/jest-dom/vitest";

const sampleMarkets: Market[] = [
  {
    symbol: "BTCUSDT",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    price: 65000,
    changePercent: 2.5,
    highPrice: 66000,
    lowPrice: 63000,
    volume: 1000,
    direction: "up",
    history: []
  },
  {
    symbol: "ETHUSDT",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    price: 3000,
    changePercent: -1.2,
    highPrice: 3100,
    lowPrice: 2900,
    volume: 5000,
    direction: "down",
    history: []
  }
];

describe("Watchlist", () => {
  it("renders market prices", () => {
    render(
      <Watchlist
        markets={sampleMarkets}
        selected="BTCUSDT"
        search=""
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText("BTC")).toBeInTheDocument();
    expect(screen.getByText("ETH")).toBeInTheDocument();
    expect(screen.getByText(/65,000\.00/)).toBeInTheDocument();
  });

  it("filters markets by search text", () => {
    render(
      <Watchlist
        markets={sampleMarkets}
        selected="BTCUSDT"
        search="eth"
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText("ETH")).toBeInTheDocument();
    expect(screen.queryByText("BTC")).not.toBeInTheDocument();
  });

  it("shows an empty state when there are no markets", () => {
    render(
      <Watchlist
        markets={[]}
        selected="BTCUSDT"
        search=""
        onSelect={vi.fn()}
      />
    );

    expect(
      screen.getByText("Waiting for market data...")
    ).toBeInTheDocument();
  });

  it("selects a market when its row is clicked", () => {
    const onSelect = vi.fn();

    render(
      <Watchlist
        markets={sampleMarkets}
        selected="BTCUSDT"
        search=""
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText("ETH"));
    expect(onSelect).toHaveBeenCalledWith("ETHUSDT");
  });
});
