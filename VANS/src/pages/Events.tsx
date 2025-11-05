import { useEffect, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import { EventsTimeline, GroupedColumns } from "../components/charts";

export default function Events() {
  const { f } = useFilters();
  const p = qs(f);
  const [ev, setEv] = useState<any[]>([]);
  const [grp, setGrp] = useState<any[]>([]);
  useEffect(() => {
    get(`/api/events/${p}`).then((r) => setEv(r.data));
    get(`/api/columns/grouped/${p}`).then((r) => setGrp(r.data));
  }, [p]);
  return (
    <div className="container-app">
      <FilterBar />
      <EventsTimeline data={ev} />
      <GroupedColumns data={grp} />
    </div>
  );
}
