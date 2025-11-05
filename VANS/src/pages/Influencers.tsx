import { useEffect, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import { Network } from "../components/charts";

export default function Influencers() {
  const { f } = useFilters();
  const p = qs(f);
  const [links, setLinks] = useState<any[]>([]);
  useEffect(() => {
    get(`/api/network/influencers/${p}`).then((r) => setLinks(r.data));
  }, [p]);
  return (
    <div className="container-app">
      <FilterBar />
      <Network links={links} />
    </div>
  );
}
