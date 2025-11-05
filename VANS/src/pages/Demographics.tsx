import { useEffect, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import {
  BarGeneric,
  HeatmapInteractions,
  GaugeSatisfaction,
} from "../components/charts";

export default function Demographics() {
  const { f } = useFilters();
  const p = qs(f);
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
    <div className="container-app">
      <FilterBar />
      <div className="grid md:grid-cols-2 gap-4">
        <BarGeneric data={age} x="bucket" dataKey="count" />
        <BarGeneric data={gender} x="gender" dataKey="count" />
      </div>
      <HeatmapInteractions data={heat} />
      <GaugeSatisfaction score={gauge} />
    </div>
  );
}
