import { useEffect, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import {
  KpiCard,
  LineMentions,
  AreaVolume,
  PieSentiment,
  DonutPosNeg,
} from "../components/charts";

export default function Overview() {
  const { f } = useFilters();
  const p = qs(f);
  const [kpi, setKpi] = useState<any>({});
  const [tl, setTl] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  useEffect(() => {
    get(`/api/kpis/${p}`).then((r) => setKpi(r.data));
    get(`/api/mentions/timeline/${p}&group=month`).then((r) => setTl(r.data));
    get(`/api/sentiment/share/${p}`).then((r) => setSent(r.data));
  }, [p]);
  return (
    <div className="container-app">
      <FilterBar />
      <div className="grid md:grid-cols-3 gap-4">
        <KpiCard label="Mentions" value={kpi.mentions || 0} />
        <KpiCard label="Engagement" value={kpi.engagement || 0} />
        <KpiCard label="Reach" value={kpi.reach || 0} />
      </div>
      <div className="grid gap-4">
        <LineMentions data={tl} />
        <div className="grid md:grid-cols-2 gap-4">
          <PieSentiment data={sent} />
          <DonutPosNeg data={sent} />
        </div>
        <AreaVolume data={tl} />
      </div>
    </div>
  );
}
