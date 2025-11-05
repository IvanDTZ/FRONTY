import { useEffect, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import {
  StackedByNetwork,
  RadarChannels,
  GroupedColumns,
  BarGeneric,
} from "../components/charts";

export default function Audience() {
  const { f } = useFilters();
  const p = qs(f);
  const [byNet, setByNet] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  useEffect(() => {
    get(`/api/engagement/by-network/${p}`).then((r) => setByNet(r.data));
    get(`/api/columns/grouped/${p}`).then((r) => setGrouped(r.data));
    get(`/api/sentiment/share/${p}`).then((r) => setSent(r.data));
  }, [p]);
  const radarData = byNet.map((d: any) => ({
    channel: d.network,
    value: d.engagement,
  }));
  return (
    <div className="container-app">
      <FilterBar />
      <div className="grid md:grid-cols-2 gap-4">
        <StackedByNetwork data={byNet} />
        <RadarChannels data={radarData} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <BarGeneric
          data={sent.map((s: any) => ({ name: s.sentiment, value: s.count }))}
          x="name"
          dataKey="value"
        />
        <GroupedColumns data={grouped} />
      </div>
    </div>
  );
}
