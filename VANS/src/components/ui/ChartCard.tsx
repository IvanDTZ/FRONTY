import { useState } from "react";

export default function ChartCard({
  title,
  subtitle,
  hint,
  details,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  hint?: string;
  details?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`card card-pad ${className || ""}`}>
      <div className="card-head" style={{ alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div className="card-title">{title}</div>
          {subtitle ? (
            <div className="muted" style={{ fontSize: 12 }}>
              {subtitle}
            </div>
          ) : null}
          {hint ? (
            <div className="help-inline">
              <span className="i">i</span>
              <span className="txt">{hint}</span>
              {details ? (
                <button
                  className="btn"
                  style={{ padding: "2px 6px", fontSize: 12 }}
                  onClick={() => setOpen((o) => !o)}
                >
                  {open ? "Ocultar" : "Más"}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {open && details ? (
        <div
          className="muted"
          style={{ fontSize: 12, marginTop: 8, lineHeight: 1.45 }}
        >
          {details}
        </div>
      ) : null}
      {children}
    </div>
  );
}
