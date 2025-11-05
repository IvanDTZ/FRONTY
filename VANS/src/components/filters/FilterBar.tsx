import { useFilters } from "../../lib/filters";
const BF = ["CL", "PE", "AR", "PA", "EC", "CO", "BR", "PY"];

export default function FilterBar() {
  const { f, setF } = useFilters();
  const toggle = (c: string) =>
    setF({
      ...f,
      countries: f.countries.includes(c)
        ? f.countries.filter((x) => x !== c)
        : [...f.countries, c],
    });

  const apply = () => setF({ ...f }); // dispara rerender en páginas por dependencia de qs(f)
  const clear = () => setF({ ...f, countries: [] });

  return (
    <div className="card card-pad">
      <div className="filterbar">
        <div className="field">
          <label>From</label>
          <input
            type="date"
            className="input"
            value={f.from}
            onChange={(e) => setF({ ...f, from: e.target.value })}
          />
        </div>
        <div className="field">
          <label>To</label>
          <input
            type="date"
            className="input"
            value={f.to}
            onChange={(e) => setF({ ...f, to: e.target.value })}
          />
        </div>
        <div className="field" style={{ gap: 6, minWidth: 220 }}>
          <label>Countries (BF)</label>
          <div className="chips">
            {BF.map((c) => (
              <button
                key={c}
                onClick={() => toggle(c)}
                className={`chip ${f.countries.includes(c) ? "active" : ""}`}
              >
                {c}
              </button>
            ))}
            <button className="chip" onClick={clear}>
              Clear
            </button>
          </div>
        </div>

        <div className="field">
          <label>Compare</label>
          <div className="chips">
            <button
              className={`chip ${f.compare ? "active" : ""}`}
              onClick={() => setF({ ...f, compare: !f.compare })}
            >
              {f.compare ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {f.compare && (
          <>
            <div className="field">
              <label>Compare From</label>
              <input
                type="date"
                className="input"
                value={f.cfrom || ""}
                onChange={(e) => setF({ ...f, cfrom: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Compare To</label>
              <input
                type="date"
                className="input"
                value={f.cto || ""}
                onChange={(e) => setF({ ...f, cto: e.target.value })}
              />
            </div>
          </>
        )}

        <div className="actions">
          <button className="btn primary" onClick={apply}>
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
