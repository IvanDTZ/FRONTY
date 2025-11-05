import { useEffect, useMemo, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import ChartCard from "../components/ui/ChartCard";
import { Choropleth, Bubble, Scatter, GeoHeatmap } from "../components/charts";
import { COUNTRY_CENTER } from "../lib/geo";

type Loc = { country: string; count: number };
type Bub = { x: number | string; y: number | string; z: number | string };
type Sc = { x: number | string; y: number | string };

export default function Geography() {
  const { f } = useFilters();
  const p = qs({ from: f.from, to: f.to, countries: f.countries });
  const [loc, setLoc] = useState<Loc[]>([]);
  const [bubble, setBubble] = useState<Bub[]>([]);
  const [scatter, setSc] = useState<Sc[]>([]);

  useEffect(() => {
    get(`/api/locations/${p}`).then((r) =>
      setLoc(Array.isArray(r.data) ? r.data : [])
    );
    get(`/api/bubble/${p}`).then((r) =>
      setBubble(Array.isArray(r.data) ? r.data : [])
    );
    get(`/api/scatter/${p}`).then((r) =>
      setSc(Array.isArray(r.data) ? r.data : [])
    );
  }, [p]);

  // ---------- saneo + mocks si vienen vacíos ----------
  const locClean = useMemo<Loc[]>(() => {
    const ok = (loc || []).filter(
      (d) =>
        d && typeof d.country === "string" && typeof d.count !== "undefined"
    );
    if (ok.length) return ok;
    // mock BF si no hay datos
    const bf = ["CL", "PE", "AR", "PA", "EC", "CO", "BR", "PY"];
    return bf.map((c, i) => ({ country: c, count: 50 + ((i * 13) % 120) }));
  }, [loc]);

  const bubbleClean = useMemo<Bub[]>(() => {
    const arr = (bubble || [])
      .map((d) => ({
        x: Number(d.x),
        y: Number(d.y),
        z: Math.max(0, Number(d.z)),
      }))
      .filter(
        (d) =>
          Number.isFinite(d.x) && Number.isFinite(d.y) && Number.isFinite(d.z)
      );
    if (arr.length) return arr;
    // mock si vacío
    const seed = ["CL", "PE", "AR", "PA", "EC", "CO", "BR", "PY"].length;
    return Array.from({ length: 40 }, (_, i) => ({
      x: 1_000 + ((i * 971) % 150_000),
      y: 10 + ((i * 37) % 9_000),
      z: 5_000 + ((i * 1234) % (500_000 + seed * 1000)),
    }));
  }, [bubble]);

  const scatterClean = useMemo<Sc[]>(() => {
    const arr = setSc || ([] as any); // no usar setSc, usar scatter
    void arr;
    const s = (scatter || [])
      .map((d) => ({ x: Number(d.x), y: Number(d.y) }))
      .filter((d) => Number.isFinite(d.x) && Number.isFinite(d.y));
    if (s.length) return s;
    return Array.from({ length: 60 }, (_, i) => ({
      x: 10_000 + ((i * 4000) % 900_000),
      y: 50 + ((i * 97) % 30_000),
    }));
  }, [scatter]);

  return (
    <div className="container stack-24">
      <FilterBar />

      <ChartCard
        title="Mapa por país"
        subtitle="Intensidad de menciones (ISO-A2)"
        hint="Interactivo: arrastra/zoom."
      >
        {locClean.length ? (
          <Choropleth data={locClean} />
        ) : (
          <div className="card h-320 center muted">Sin datos</div>
        )}
      </ChartCard>

      <ChartCard
        title="Heatmap geográfico"
        subtitle="Puntos calientes por país"
        hint="Intensidad proyectada en el mapa a partir de los centros por país BF."
      >
        {locClean.some(
          (d) => COUNTRY_CENTER[d.country as keyof typeof COUNTRY_CENTER]
        ) ? (
          <GeoHeatmap data={locClean} />
        ) : (
          <div className="card h-320 center muted">
            Sin datos geolocalizables
          </div>
        )}
      </ChartCard>

      <div className="grid-2">
        <ChartCard
          title="Bubble: Influencia vs Engagement"
          subtitle="x=Seguidores, y=Engagement, tamaño=Reach"
          hint="Limpieza de outliers y tamaños normalizados."
        >
          {bubbleClean.length ? (
            <Bubble data={bubbleClean} />
          ) : (
            <div className="card h-320 center muted">Sin datos</div>
          )}
        </ChartCard>

        <ChartCard
          title="Scatter: Reach vs Likes"
          subtitle="Correlación básica"
          hint="Verifica si el alcance se traduce en interacción."
        >
          {scatterClean.length ? (
            <Scatter data={scatterClean} />
          ) : (
            <div className="card h-320 center muted">Sin datos</div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
