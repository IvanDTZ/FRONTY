import { useEffect, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import ChartCard from "../components/ui/ChartCard";
import {
  BarGeneric,
  HeatmapInteractions,
  GaugeSatisfaction,
} from "../components/charts";

export default function Demographics() {
  const { f } = useFilters();
  const p = qs({ from: f.from, to: f.to, countries: f.countries });
  const [age, setAge] = useState<any[]>([]);
  const [gender, setGender] = useState<any[]>([]);
  const [heat, setHeat] = useState<any[]>([]);
  const [gauge, setGauge] = useState<number>(0);

  useEffect(() => {
    get(`/api/demographics/age/${p}`).then((r) => setAge(r.data));
    get(`/api/demographics/gender/${p}`).then((r) => setGender(r.data));
    get(`/api/heatmap/interactions/${p}`).then((r) => setHeat(r.data));
    get(`/api/gauge/satisfaction/${p}`).then((r) =>
      setGauge(r.data.score || 0)
    );
  }, [p]);

  return (
    <div className="container stack-24">
      <FilterBar />

      <div className="grid-2">
        <ChartCard
          title="Distribución por edad"
          subtitle="Audiencia agrupada por rangos"
          hint="Datos inferidos de perfiles públicos."
        >
          <BarGeneric data={age} x="bucket" dataKey="count" />
        </ChartCard>

        <ChartCard
          title="Distribución por género"
          subtitle="Composición declarada o inferida"
          hint="Incluye categoría 'unknown'."
        >
          <BarGeneric data={gender} x="gender" dataKey="count" />
        </ChartCard>
      </div>

      <ChartCard
        title="Mapa de calor de interacciones"
        subtitle="Día de la semana × hora local"
        hint="Permite descubrir horarios de mayor actividad."
      >
        <HeatmapInteractions data={heat} />
      </ChartCard>

      <ChartCard
        title="Satisfacción (Gauge)"
        subtitle="Promedio de rating 1–5"
        hint="5 es excelente, 1 muy malo."
      >
        <GaugeSatisfaction score={gauge} />
      </ChartCard>
    </div>
  );
}
