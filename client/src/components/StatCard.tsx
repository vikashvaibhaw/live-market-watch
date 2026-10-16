
import { memo } from "react";

interface Props {
  label: string;
  value: string;
  detail?: string;
}

function StatCard({ label, value, detail }: Props) {
  return (
    <div className="stat-card">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
      {detail && <small className="muted">{detail}</small>}
    </div>
  );
}

export default memo(StatCard);
