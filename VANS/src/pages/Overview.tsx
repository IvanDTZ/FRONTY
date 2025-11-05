import { useEffect, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import ChartCard from "../components/ui/ChartCard";
import {
  Kpi,
  LineMentions,
  AreaVolume,
  PieSentiment,
  DonutPosNeg,
  Waterfall,
} from "../components/charts";

export default function Overview() {
  const { f } = useFilters();
  const p = qs({ from: f.from, to: f.to, countries: f.countries });
  const [kpi, setKpi] = useState<any>({});
  const [tl, setTl] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [wf, setWf] = useState<any[]>([]);

  useEffect(() => {
    get(`/api/kpis/${p}`).then((r) => setKpi(r.data));
    get(`/api/mentions/timeline/${p}&group=month`).then((r) => setTl(r.data));
    get(`/api/sentiment/share/${p}`).then((r) => setSent(r.data));
    get(`/api/waterfall/${p}`).then((r) => setWf(r.data));
  }, [p]);

  return (
    <div className="container stack-24">
      <FilterBar />

      <div className="grid-3">
        <ChartCard
          title="Mentions"
          subtitle="Total de mensajes"
          hint="Todas las menciones del periodo analizado."
        >
          <Kpi label="Mentions" value={kpi.mentions || 0} />
        </ChartCard>
        <ChartCard
          title="Engagement"
          subtitle="Suma de likes, comments y reposts"
          hint="Mide la interacción total."
        >
          <Kpi label="Engagement" value={kpi.engagement || 0} />
        </ChartCard>
        <ChartCard
          title="Reach"
          subtitle="Alcance potencial"
          hint="Usuarios únicos potenciales."
        >
          <Kpi label="Reach" value={kpi.reach || 0} />
        </ChartCard>
      </div>

      <ChartCard
        title="Mentions Over Time"
        subtitle="Evolución temporal"
        hint="Permite detectar picos anómalos."
        details="Serie temporal agregada por mes, usando fecha de publicación."
      >
        <LineMentions data={tl} />
      </ChartCard>

      <div className="grid-2">
        <ChartCard
          title="Sentiment Share"
          subtitle="Distribución emocional"
          hint="Positivo / Neutral / Negativo."
        >
          <PieSentiment data={sent} />
        </ChartCard>

        <ChartCard
          title="Positive vs Negative"
          subtitle="Polaridades extremas"
          hint="Comparación directa entre positivo y negativo."
        >
          <DonutPosNeg data={sent} />
        </ChartCard>
      </div>

      <ChartCard
        title="Volumen acumulado (Área)"
        subtitle="Tendencia general"
        hint="Representa el volumen agregado en el tiempo."
      >
        <AreaVolume data={tl} />
      </ChartCard>

      <ChartCard
        title="Waterfall MoM"
        subtitle="Variación mes a mes"
        hint="Muestra aportes positivos o negativos por mes."
      >
        <Waterfall data={wf} />
      </ChartCard>
    </div>
  );
}
