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
  return (
    <div className="card card-pad flex flex-wrap items-end gap-3">
      <div className="flex flex-col">
        <label className="text-xs opacity-70">From</label>
        <input
          type="date"
          className="bg-transparent border border-white/10 px-2 py-1 rounded"
          value={f.from}
          onChange={(e) => setF({ ...f, from: e.target.value })}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs opacity-70">To</label>
        <input
          type="date"
          className="bg-transparent border border-white/10 px-2 py-1 rounded"
          value={f.to}
          onChange={(e) => setF({ ...f, to: e.target.value })}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {BF.map((c) => (
          <button
            key={c}
            onClick={() => toggle(c)}
            className={`btn-chip ${
              f.countries.includes(c)
                ? "bg-[var(--color-vans-burgundy)] text-white"
                : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
