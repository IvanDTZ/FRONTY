import { useEffect, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import ChartCard from "../components/ui/ChartCard";
import {
  StackedByNetwork,
  RadarChannels,
  GroupedColumns,
  BarGeneric,
  SankeyChannels,
} from "../components/charts";

export default function Audience() {
  const { f } = useFilters();
  const p = qs({ from: f.from, to: f.to, countries: f.countries });
  const [byNet, setByNet] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [sankey, setSankey] = useState<any[]>([]);

  useEffect(() => {
    get(`/api/engagement/by-network/${p}`).then((r) =>
      setByNet(Array.isArray(r.data) ? r.data : [])
    );
    get(`/api/columns/grouped/${p}`).then((r) =>
      setGrouped(Array.isArray(r.data) ? r.data : [])
    );
    get(`/api/sentiment/share/${p}`).then((r) =>
      setSent(Array.isArray(r.data) ? r.data : [])
    );
    get(`/api/sankey/${p}`).then((r) =>
      setSankey(Array.isArray(r.data) ? r.data : [])
    );
  }, [p]);

  const radarData = byNet.map((d: any) => ({
    channel: d.network,
    value: d.engagement,
  }));

  return (
    <div className="container stack-24">
      <FilterBar />

      <div className="grid-2">
        <ChartCard
          title="Engagement por red"
          subtitle="Interacciones totales por canal"
          hint="Likes + comentarios + compartidos."
        >
          {byNet.length ? (
            <StackedByNetwork data={byNet} />
          ) : (
            <div className="card h-320 center muted">Sin datos</div>
          )}
        </ChartCard>

        <ChartCard
          title="Comparativa por canal (Radar)"
          subtitle="Fuerza relativa entre canales"
          hint="Radial normalizado."
        >
          {radarData.length ? (
            <RadarChannels data={radarData} />
          ) : (
            <div className="card h-320 center muted">Sin datos</div>
          )}
        </ChartCard>
      </div>

      <div className="grid-2">
        <ChartCard
          title="Sentiment (Barras)"
          subtitle="Conteo por tipo de sentimiento"
          hint="Vista rápida del tono general."
        >
          {sent.length ? (
            <BarGeneric
              data={sent.map((s: any) => ({
                name: s.sentiment,
                value: s.count,
              }))}
              x="name"
              dataKey="value"
            />
          ) : (
            <div className="card h-320 center muted">Sin datos</div>
          )}
        </ChartCard>

        <ChartCard
          title="Sentiment por canal"
          subtitle="Positivo / Neutral / Negativo"
          hint="Comparativa por plataforma."
        >
          {grouped.length ? (
            <GroupedColumns data={grouped} />
          ) : (
            <div className="card h-320 center muted">Sin datos</div>
          )}
        </ChartCard>
      </div>

      <ChartCard
        title="Flujo Canal → Sentimiento"
        subtitle="Relación entre origen y emoción"
        hint="Visualiza cómo se distribuye el sentimiento por canal."
      >
        {sankey.length ? (
          <SankeyChannels links={sankey} />
        ) : (
          <div className="card h-320 center muted">Sin datos</div>
        )}
      </ChartCard>
    </div>
  );
}
