import { useEffect, useState } from "react";
import { get, qs } from "../lib/api";
import { useFilters } from "../lib/filters";
import FilterBar from "../components/filters/FilterBar";
import {
  Cloud,
  TreemapCategories,
  SunburstCategories,
  FunnelConv,
} from "../components/charts";

export default function Terms() {
  const { f } = useFilters();
  const p = qs(f);
  const [hash, setHash] = useState<any[]>([]);
  const [ats, setAts] = useState<any[]>([]);
  const [emoji, setEmoji] = useState<any[]>([]);
  const [tree, setTree] = useState<any[]>([]);
  const [sun, setSun] = useState<any[]>([]);
  const [fun, setFun] = useState<any[]>([]);
  useEffect(() => {
    get(`/api/terms/hashtags/${p}&limit=200`).then((r) =>
      setHash(r.data.map((x: any) => ({ text: x.term, value: x.count })))
    );
    get(`/api/terms/mentions/${p}&limit=200`).then((r) =>
      setAts(r.data.map((x: any) => ({ text: x.term, value: x.count })))
    );
    get(`/api/emoji/top/${p}&limit=200`).then((r) =>
      setEmoji(
        r.data.map((x: any) => ({ text: x.emoji, value: x.occurrences }))
      )
    );
    get(`/api/treemap/categories/${p}`).then((r) => setTree(r.data));
    get(`/api/sunburst/categories/${p}`).then((r) => setSun(r.data));
    get(`/api/funnel/${p}`).then((r) => setFun(r.data));
  }, [p]);
  return (
    <div className="container-app">
      <FilterBar />
      <div className="grid md:grid-cols-2 gap-4">
        <Cloud data={hash} />
        <Cloud data={ats} />
      </div>
      <Cloud data={emoji} />
      <TreemapCategories data={tree} />
      <SunburstCategories data={sun} />
      <FunnelConv data={fun} />
    </div>
  );
}
