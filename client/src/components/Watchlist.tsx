
import { memo } from "react";
import type { Market } from "../types/market";

interface Props {
  markets: Market[];
  selected: string;
  search: string;
  onSelect: (symbol: string) => void;
}

const money = (price: number) =>
  price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  });

const MarketRow = memo(function MarketRow({
  market,
  active,
  onSelect
}: {
  market: Market;
  active: boolean;
  onSelect: (symbol: string) => void;
}) {
  return (
    <button
      className={`market-row ${active ? "selected" : ""}`}
      onClick={() => onSelect(market.symbol)}
    >
      <span className="coin-icon">
        {market.baseAsset.slice(0, 1)}
      </span>

      <span className="coin-name">
        <strong>{market.baseAsset}</strong>
        <small>{market.quoteAsset}</small>
      </span>

      <span className="coin-price">
        <strong
          className={
            market.direction === "up"
              ? "price-up"
              : market.direction === "down"
                ? "price-down"
                : ""
          }
        >
          ${money(market.price)}
        </strong>
      </span>

      <span
        className={`change ${
          market.changePercent >= 0 ? "positive" : "negative"
        }`}
      >
        {market.changePercent >= 0 ? "+" : ""}
        {market.changePercent.toFixed(2)}%
      </span>
    </button>
  );
});

export default function Watchlist({
  markets,
  selected,
  search,
  onSelect
}: Props) {
  const filtered = markets.filter((market) =>
    `${market.baseAsset} ${market.symbol}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="watchlist">
      <div className="table-header">
        <span>Asset</span>
        <span>Price</span>
        <span>24h</span>
      </div>

      {filtered.map((market) => (
        <MarketRow
          key={market.symbol}
          market={market}
          active={selected === market.symbol}
          onSelect={onSelect}
        />
      ))}

      {filtered.length === 0 && (
        <div className="empty-state">
          {markets.length === 0
            ? "Waiting for market data..."
            : "No markets match your search."}
        </div>
      )}
    </div>
  );
}
