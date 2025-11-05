import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { ensureWorldMap } from "../../lib/echarts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Legend as LegendRaw,
} from "recharts";

/* ---------- wrappers ---------- */
const LegendCompat: React.FC<any> = (props) =>
  React.createElement(LegendRaw as unknown as React.ComponentType<any>, props);

export const E = ({ option }: { option: any }) => (
  <div className="card">
    <ReactECharts option={option} style={{ height: 320 }} />
  </div>
);

/* ---------- KPI ---------- */
export function KpiCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number | string;
  suffix?: string;
}) {
  return (
    <div className="kpi">
      <div className="text-xs opacity-70">{label}</div>
      <div className="v">
        {typeof value === "number" ? value.toLocaleString() : value}
        {suffix ? ` ${suffix}` : ""}
      </div>
    </div>
  );
}

/* ---------- Recharts charts ---------- */
export function LineMentions({ data }: { data: any[] }) {
  return (
    <div className="card card-pad h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="y" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="mentions" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export function AreaVolume({ data }: { data: any[] }) {
  return (
    <div className="card card-pad h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis dataKey="y" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="mentions" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export function BarGeneric({
  data,
  x,
  dataKey,
}: {
  data: any[];
  x: string;
  dataKey: string;
}) {
  return (
    <div className="card card-pad h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey={x} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export function GroupedColumns({ data }: { data: any[] }) {
  return (
    <div className="card card-pad h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="group_key" />
          <YAxis />
          <Tooltip />
          <LegendCompat />
          <Bar dataKey="positive" />
          <Bar dataKey="neutral" />
          <Bar dataKey="negative" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------- ECharts charts ---------- */
export function StackedByNetwork({ data }: { data: any[] }) {
  return (
    <E
      option={{
        tooltip: {},
        legend: {},
        xAxis: { type: "category", data: data.map((d: any) => d.network) },
        yAxis: { type: "value" },
        series: [
          {
            type: "bar",
            stack: "total",
            data: data.map((d: any) => d.engagement),
          },
        ],
      }}
    />
  );
}

export function PieSentiment({ data }: { data: any[] }) {
  return (
    <E
      option={{
        tooltip: {},
        series: [
          {
            type: "pie",
            radius: "70%",
            data: data.map((d: any) => ({ name: d.sentiment, value: d.count })),
          },
        ],
      }}
    />
  );
}

export function DonutPosNeg({ data }: { data: any[] }) {
  const pos = data.find((d: any) => d.sentiment === "positive")?.count || 0;
  const neg = data.find((d: any) => d.sentiment === "negative")?.count || 0;
  return (
    <E
      option={{
        series: [
          {
            type: "pie",
            radius: ["50%", "80%"],
            data: [
              { name: "Positive", value: pos },
              { name: "Negative", value: neg },
            ],
          },
        ],
      }}
    />
  );
}

export function HeatmapInteractions({
  data,
}: {
  data: { dow: number; hr: number; v: number }[];
}) {
  const dataset = data.map((d) => [d.hr, d.dow, d.v]);
  return (
    <E
      option={{
        tooltip: {},
        grid: { top: 10 },
        xAxis: { type: "category", data: [...Array(24)].map((_, i) => i) },
        yAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        visualMap: {
          min: 0,
          max: Math.max(1, ...data.map((d) => d.v)),
          orient: "horizontal",
          left: "center",
          bottom: 0,
        },
        series: [{ type: "heatmap", data: dataset }],
      }}
    />
  );
}

export function Cloud({ data }: { data: { text: string; value: number }[] }) {
  const seriesData = data.map((d) => ({ name: d.text, value: d.value }));
  return (
    <E
      option={{
        tooltip: {},
        series: [
          {
            type: "wordCloud",
            gridSize: 8,
            sizeRange: [12, 48],
            rotationRange: [0, 0],
            textStyle: { color: () => undefined },
            data: seriesData,
          },
        ],
      }}
    />
  );
}

export function RadarChannels({ data }: { data: any[] }) {
  const indicators = data.map((d: any) => ({
    name: d.channel,
    max: Math.max(...data.map((x: any) => x.value)),
  }));
  return (
    <E
      option={{
        legend: {},
        radar: { indicator: indicators },
        series: [
          {
            type: "radar",
            data: [{ value: data.map((d: any) => d.value), name: "Score" }],
          },
        ],
      }}
    />
  );
}

export function GaugeSatisfaction({ score }: { score: number }) {
  return (
    <E
      option={{
        series: [
          {
            type: "gauge",
            progress: { show: true },
            detail: { valueAnimation: true, formatter: "{value}/5" },
            data: [{ value: score }],
          },
        ],
      }}
    />
  );
}

export function TreemapCategories({ data }: { data: any[] }) {
  return <E option={{ series: [{ type: "treemap", data }] }} />;
}

export function SunburstCategories({
  data,
}: {
  data: { category_lvl1: string; category_lvl2: string; v: number }[];
}) {
  const byL1: Record<string, any[]> = {};
  data.forEach((d) => {
    byL1[d.category_lvl1] = byL1[d.category_lvl1] || [];
    byL1[d.category_lvl1].push({ name: d.category_lvl2, value: d.v });
  });
  const seriesData = Object.entries(byL1).map(([k, children]) => ({
    name: k,
    children,
  }));
  return (
    <E
      option={{
        series: [{ type: "sunburst", data: seriesData, radius: [0, "90%"] }],
      }}
    />
  );
}

export function FunnelConv({ data }: { data: { stage: string; v: number }[] }) {
  return (
    <E
      option={{
        series: [
          {
            type: "funnel",
            data: data.map((d) => ({ name: d.stage, value: d.v })),
          },
        ],
      }}
    />
  );
}

export function Choropleth({
  data,
}: {
  data: { country: string; count: number }[];
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let m = true;
    ensureWorldMap().then(() => m && setReady(true));
    return () => {
      m = false;
    };
  }, []);
  if (!ready)
    return (
      <div className="card card-pad h-80 flex items-center justify-center">
        Cargando mapa…
      </div>
    );
  return (
    <E
      option={{
        tooltip: {},
        visualMap: { min: 0, max: Math.max(1, ...data.map((d) => d.count)) },
        series: [
          {
            type: "map",
            map: "world",
            roam: true,
            data: data.map((d) => ({ name: d.country, value: d.count })),
          },
        ],
      }}
    />
  );
}

export function Bubble({
  data,
}: {
  data: { x: number; y: number; z: number }[];
}) {
  return (
    <E
      option={{
        xAxis: {},
        yAxis: {},
        series: [
          {
            type: "scatter",
            symbolSize: (d: any) => Math.sqrt(d[2]) || 6,
            data: data.map((d) => [d.x, d.y, d.z]),
          },
        ],
      }}
    />
  );
}
export function Scatter({ data }: { data: { x: number; y: number }[] }) {
  return (
    <E
      option={{
        xAxis: {},
        yAxis: {},
        series: [{ type: "scatter", data: data.map((d) => [d.x, d.y]) }],
      }}
    />
  );
}
export function EventsTimeline({
  data,
}: {
  data: { y: string; title: string; kind: string }[];
}) {
  return (
    <E
      option={{
        xAxis: { type: "category", data: data.map((d) => d.y) },
        yAxis: { show: false },
        series: [{ type: "line", data: data.map((_) => 1), symbolSize: 10 }],
        tooltip: { formatter: (p: any) => data[p.dataIndex].title },
      }}
    />
  );
}
export function Network({
  links,
}: {
  links: { source: string; target: string; weight: number }[];
}) {
  const nodes: Record<string, { name: string }> = {};
  links.forEach((l) => {
    nodes[l.source] = { name: l.source };
    nodes[l.target] = { name: l.target };
  });
  return (
    <E
      option={{
        series: [
          {
            type: "graph",
            layout: "force",
            roam: true,
            data: Object.values(nodes),
            links: links.map((l) => ({
              source: l.source,
              target: l.target,
              value: l.weight,
            })),
            force: { repulsion: 120 },
          },
        ],
      }}
    />
  );
}
