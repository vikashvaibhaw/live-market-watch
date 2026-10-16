
import type { ConnectionState } from "../types/market";

interface Props {
  status: ConnectionState;
  lastMessageAt: number | null;
  onReconnect: () => void;
}

const labels: Record<ConnectionState, string> = {
  connecting: "Connecting",
  connected: "Live",
  reconnecting: "Reconnecting",
  disconnected: "Disconnected",
  error: "Connection error"
};

export default function ConnectionStatus({
  status,
  lastMessageAt,
  onReconnect
}: Props) {
  const stale =
    status === "connected" &&
    lastMessageAt !== null &&
    Date.now() - lastMessageAt > 10000;

  return (
    <div className="connection">
      <span
        className={`status-dot ${
          stale ? "stale" : status
        }`}
      />
      <span>
        {stale ? "Waiting for data" : labels[status]}
      </span>
      {status !== "connected" && (
        <button className="text-button" onClick={onReconnect}>
          Retry
        </button>
      )}
    </div>
  );
}
