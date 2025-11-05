import { useEffect, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import ChartCard from "../components/ui/ChartCard";
import {
  Cloud,
  TreemapCategories,
  SunburstCategories,
  FunnelConv,
} from "../components/charts";

export default function Terms() {
  const { f } = useFilters();
  const p = qs({ from: f.from, to: f.to, countries: f.countries });
  const [hash, setHash] = useState<any[]>([]);
  const [ats, setAts] = useState<any[]>([]);
  const [emoji, setEmoji] = useState<any[]>([]);
  const [tree, setTree] = useState<any[]>([]);
  const [sun, setSun] = useState<any[]>([]);
  const [fun, setFun] = useState<any[]>([]);

  useEffect(() => {
    get(`/api/terms/hashtags/${p}&limit=200`).then((r) => setHash(r.data));
    get(`/api/terms/mentions/${p}&limit=200`).then((r) => setAts(r.data));
    get(`/api/emoji/top/${p}&limit=200`).then((r) => setEmoji(r.data));
    get(`/api/treemap/categories/${p}`).then((r) => setTree(r.data));
    get(`/api/sunburst/categories/${p}`).then((r) => setSun(r.data));
    get(`/api/funnel/${p}`).then((r) => setFun(r.data));
  }, [p]);

  return (
    <div className="container stack-24">
      <FilterBar />

      <div className="grid-2">
        <ChartCard
          title="Nube de hashtags"
          subtitle="Tópicos principales (#)"
          hint="Frecuencia ponderada de hashtags."
        >
          <Cloud data={hash} />
        </ChartCard>

        <ChartCard
          title="Nube de menciones (@)"
          subtitle="Cuentas más mencionadas"
          hint="Usuarios más aludidos en el periodo."
        >
          <Cloud data={ats} />
        </ChartCard>
      </div>

      <ChartCard
        title="Nube de emojis"
        subtitle="Emociones predominantes"
        hint="Tono emocional general."
      >
        <Cloud data={emoji} />
      </ChartCard>

      <ChartCard
        title="Treemap de categorías"
        subtitle="Tamaño = volumen de conversación"
        hint="Distribución de temas principales."
      >
        <TreemapCategories data={tree} />
      </ChartCard>

      <ChartCard
        title="Sunburst de subcategorías"
        subtitle="Jerarquía por nivel"
        hint="Desglose de categorías de conversación."
      >
        <SunburstCategories data={sun} />
      </ChartCard>

      <ChartCard
        title="Funnel de conversión"
        subtitle="Etapas de interacción"
        hint="Vistas → Engagement → Clics."
      >
        <FunnelConv data={fun} />
      </ChartCard>
    </div>
  );
}
