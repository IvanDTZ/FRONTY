import { useEffect, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import ChartCard from "../components/ui/ChartCard";
import {
  EventsTimeline,
  GroupedColumns,
  Waterfall,
} from "../components/charts";

export default function Events() {
  const { f } = useFilters();
  const p = qs({ from: f.from, to: f.to, countries: f.countries });
  const [ev, setEv] = useState<any[]>([]);
  const [grp, setGrp] = useState<any[]>([]);
  const [wf, setWf] = useState<any[]>([]);

  useEffect(() => {
    get(`/api/events/${p}`).then((r) =>
      setEv(Array.isArray(r.data) ? r.data : [])
    );
    get(`/api/columns/grouped/${p}`).then((r) =>
      setGrp(Array.isArray(r.data) ? r.data : [])
    );
    get(`/api/waterfall/${p}`).then((r) =>
      setWf(Array.isArray(r.data) ? r.data : [])
    );
  }, [p]);

  return (
    <div className="container stack-24">
      <FilterBar />

      <ChartCard
        title="Timeline de eventos"
        subtitle="Principales hitos del periodo"
        hint="Lanzamientos, colaboraciones y anuncios que explican picos en la serie."
      >
        {ev.length ? (
          <EventsTimeline data={ev} />
        ) : (
          <div className="card h-320 center muted">
            Sin eventos en este rango
          </div>
        )}
      </ChartCard>

      <div className="grid-2">
        <ChartCard
          title="Sentimiento por canal"
          subtitle="Positivo / Neutral / Negativo por red"
          hint="Comparativa de tono durante el periodo activo."
        >
          {grp.length ? (
            <GroupedColumns data={grp} />
          ) : (
            <div className="card h-320 center muted">Sin datos</div>
          )}
        </ChartCard>

        <ChartCard
          title="Waterfall MoM"
          subtitle="Variación mensual de menciones"
          hint="Aporta contexto de qué meses suben o bajan."
        >
          {wf.length ? (
            <Waterfall data={wf} />
          ) : (
            <div className="card h-320 center muted">Sin datos</div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
