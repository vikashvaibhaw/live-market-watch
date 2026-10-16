
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Search,
  TrendingUp
} from "lucide-react";

import { useMarketSocket } from "./hooks/useMarketSocket";
import ConnectionStatus from "./components/ConnectionStatus";
import Watchlist from "./components/Watchlist";
import MarketChart from "./components/MarketChart";
import StatCard from "./components/StatCard";

const currency = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  });

function App() {
  const { markets, status, lastMessageAt, reconnect } =
    useMarketSocket();

  const [selected, setSelected] = useState("BTCUSDT");
  const [search, setSearch] = useState("");

  const selectedMarket = useMemo(
    () => markets.find((market) => market.symbol === selected),
    [markets, selected]
  );

  const gainers = useMemo(
    () => markets.filter((market) => market.changePercent > 0).length,
    [markets]
  );

  const totalVolume = useMemo(
    () => markets.reduce((sum, market) => sum + market.volume, 0),
    [markets]
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">
            <TrendingUp size={22} />
          </span>
          <span>Market<span className="brand-accent">Watch</span></span>
        </a>

        <div className="topbar-right">
          <span className="market-label">
            <Activity size={15} />
            SPOT MARKETS
          </span>
          <ConnectionStatus
            status={status}
            lastMessageAt={lastMessageAt}
            onReconnect={reconnect}
          />
        </div>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">MARKET OVERVIEW</p>
          <h1>Market dashboard</h1>
          <p className="muted">
            Real-time cryptocurrency prices, all in one place.
          </p>
        </div>
        <div className="live-pill">
          <span className="live-pulse" />
          Live market feed
        </div>
      </section>

      {status === "error" && (
        <div className="notice error-notice">
          The market feed encountered an error. Your last prices
          may be stale. Try reconnecting.
          <button onClick={reconnect}>Reconnect</button>
        </div>
      )}

      {status === "reconnecting" && (
        <div className="notice">
          Reconnecting to the live market feed...
        </div>
      )}

      <section className="stats-grid">
        <StatCard
          label="Tracked assets"
          value={String(markets.length)}
          detail="Across your watchlist"
        />
        <StatCard
          label="Selected price"
          value={
            selectedMarket
              ? currency(selectedMarket.price)
              : "—"
          }
          detail={selectedMarket?.baseAsset ?? "Waiting for data"}
        />
        <StatCard
          label="Markets up"
          value={String(gainers)}
          detail={`Out of ${markets.length} tracked assets`}
        />
        <StatCard
          label="Combined 24h volume"
          value={
            markets.length
              ? `$${(totalVolume / 1_000_000).toFixed(2)}M`
              : "—"
          }
          detail="Across tracked pairs, in base units"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">PRICE CHART</p>
              <h2>
                {selectedMarket
                  ? `${selectedMarket.baseAsset}/USDT`
                  : `${selected.replace("USDT", "")}/USDT`}
              </h2>
            </div>

            {selectedMarket && (
              <div className="selected-price">
                <strong>{currency(selectedMarket.price)}</strong>
                <span
                  className={
                    selectedMarket.changePercent >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {selectedMarket.changePercent >= 0
                    ? <ArrowUpRight size={15} />
                    : <ArrowDownRight size={15} />}
                  {selectedMarket.changePercent.toFixed(2)}%
                </span>
              </div>
            )}
          </div>

          <MarketChart market={selectedMarket} />

          {selectedMarket && (
            <div className="chart-footer">
              <span>
                24h high: {currency(selectedMarket.highPrice)}
              </span>
              <span>
                24h low: {currency(selectedMarket.lowPrice)}
              </span>
            </div>
          )}
        </div>

        <div className="panel watchlist-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">YOUR MARKETS</p>
              <h2>Watchlist</h2>
            </div>
            <span className="count-badge">{markets.length}</span>
          </div>

          <label className="search-box">
            <Search size={17} />
            <input
              aria-label="Search markets"
              placeholder="Search assets..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          {markets.length === 0 && (
            <div className="loading-state" role="status">
              <span className="spinner" />
              <strong>Connecting to markets</strong>
              <span className="muted">
                Waiting for the first price updates...
              </span>
            </div>
          )}

          <Watchlist
            markets={markets}
            selected={selected}
            search={search}
            onSelect={setSelected}
          />

          <p className="panel-footnote">
            Prices are from a public market data feed.
          </p>
        </div>
      </section>

      <footer className="footer">
        <span>MarketWatch · Educational market dashboard</span>
        <span>
          Data provided by Binance · Not financial advice
        </span>
      </footer>
    </main>
  );
}

export default App;
