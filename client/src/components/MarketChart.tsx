
import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  LineSeries,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type Time
} from "lightweight-charts";
import type { Market } from "../types/market";

interface Props {
  market: Market | undefined;
}

export default function MarketChart({ market }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 320,
      layout: {
        background: {
          type: ColorType.Solid,
          color: "#111827"
        },
        textColor: "#94a3b8"
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" }
      },
      rightPriceScale: {
        borderColor: "#374151"
      },
      timeScale: {
        borderColor: "#374151",
        timeVisible: true,
        secondsVisible: true
      }
    });

    const series = chart.addSeries(LineSeries, {
  color: "#38bdf8",
  lineWidth: 2,
  priceLineVisible: true,
  lastValueVisible: true
});

    chartRef.current = chart;
    seriesRef.current = series;

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: container.clientWidth
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series || !market) return;

    const points: LineData<Time>[] = market.history.map(
      (point) => ({
        time: point.time as Time,
        value: point.value
      })
    );

    if (points.length > 0) {
      series.setData(points);
      chartRef.current?.timeScale().fitContent();
    }
  }, [market]);

  return (
    <div className="chart-wrapper">
      {!market || market.history.length === 0 ? (
        <div className="chart-empty">
          Waiting for price ticks to build the chart...
        </div>
      ) : null}
      <div ref={containerRef} className="chart-container" />
    </div>
  );
}
