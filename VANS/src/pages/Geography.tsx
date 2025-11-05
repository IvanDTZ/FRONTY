import { useEffect, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import { Choropleth, Bubble, Scatter } from "../components/charts";

export default function Geography() {
  const { f } = useFilters();
  const p = qs(f);
  const [loc, setLoc] = useState<any[]>([]);
  const [bubble, setBubble] = useState<any[]>([]);
  const [scatter, setSc] = useState<any[]>([]);
  useEffect(() => {
    get(`/api/locations/${p}`).then((r) => setLoc(r.data));
    get(`/api/bubble/${p}`).then((r) => setBubble(r.data));
    get(`/api/scatter/${p}`).then((r) => setSc(r.data));
  }, [p]);
  return (
    <div className="container-app">
      <FilterBar />
      <Choropleth data={loc} />
      <div className="grid md:grid-cols-2 gap-4">
        <Bubble data={bubble} />
        <Scatter data={scatter} />
      </div>
    </div>
  );
}
