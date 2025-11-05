import { useEffect, useMemo, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import ChartCard from "../components/ui/ChartCard";
import { Network, BarGeneric } from "../components/charts";

type Link = { source: string; target: string; weight: number };

export default function Influencers() {
  const { f } = useFilters();
  const p = qs({ from: f.from, to: f.to, countries: f.countries });
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    get(`/api/network/influencers/${p}`).then((r) =>
      setLinks(Array.isArray(r.data) ? r.data : [])
    );
  }, [p]);

  const { nodesCount, edgesCount, top } = useMemo(() => {
    const deg = new Map<string, number>();
    links.forEach((l) => {
      deg.set(l.source, (deg.get(l.source) || 0) + l.weight);
      deg.set(l.target, (deg.get(l.target) || 0) + l.weight);
    });
    const topArr = Array.from(deg.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
    const ids = new Set<string>();
    links.forEach((l) => {
      ids.add(l.source);
      ids.add(l.target);
    });
    return { nodesCount: ids.size, edgesCount: links.length, top: topArr };
  }, [links]);

  return (
    <div className="container stack-24">
      <FilterBar />

      <div className="grid-3">
        <div className="card card-pad kpi">
          <div className="label">Influencers</div>
          <div className="value">{nodesCount}</div>
        </div>
        <div className="card card-pad kpi">
          <div className="label">Conexiones</div>
          <div className="value">{edgesCount}</div>
        </div>
        <div className="card card-pad kpi">
          <div className="label">Intensidad media</div>
          <div className="value">
            {edgesCount
              ? (links.reduce((a, b) => a + b.weight, 0) / edgesCount).toFixed(
                  2
                )
              : "0.00"}
          </div>
        </div>
      </div>

      <ChartCard
        title="Red de influencers"
        subtitle="Colaboraciones y coapariciones"
        hint="Hubs: Vans, VansSkate, ThrasherMagazine, TonyHawk, LizzieArmanto, etc."
      >
        <Network links={links} />
      </ChartCard>

      <ChartCard
        title="Top 10 por centralidad"
        subtitle="Grado ponderado"
        hint="Suma de pesos de aristas por nodo."
      >
        {top.length ? (
          <BarGeneric data={top} x="name" dataKey="value" />
        ) : (
          <div className="card h-320 center muted">Sin datos</div>
        )}
      </ChartCard>
    </div>
  );
}
