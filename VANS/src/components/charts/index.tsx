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

const LegendCompat: React.FC<any> = (props) =>
  React.createElement(LegendRaw as unknown as React.ComponentType<any>, props);

// Paleta global eCharts
const echartsColors = [
  "#d74242",
  "#5c7cff",
  "#26c6a2",
  "#b2bdcf",
  "#ff6b6b",
  "#f0ad4e",
  "#9a6bff",
];

export const E = ({ option, h = 320 }: { option: any; h?: number }) => (
  <div className="card">
    <ReactECharts
      option={{ color: echartsColors, ...option }}
      style={{ height: h }}
    />
  </div>
);

/* KPI */
export function Kpi({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="card card-pad kpi">
      <div className="label">{label}</div>
      <div className="value">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
    </div>
  );
}

/* --- Recharts con colores explícitos (evita negro) --- */
export const LineMentions = ({ data }: { data: any[] }) => (
  <div className="card card-pad h-320">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="y" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="mentions"
          stroke="var(--c2)"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
export const AreaVolume = ({ data }: { data: any[] }) => (
  <div className="card card-pad h-320">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <XAxis dataKey="y" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="mentions"
          stroke="var(--c1)"
          fill="var(--c1)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
export const BarGeneric = ({
  data,
  x,
  dataKey,
}: {
  data: any[];
  x: string;
  dataKey: string;
}) => (
  <div className="card card-pad h-320">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey={x} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={dataKey} fill="var(--c2)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
export const GroupedColumns = ({ data }: { data: any[] }) => (
  <div className="card card-pad h-320">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="group_key" />
        <YAxis />
        <Tooltip />
        <LegendCompat />
        <Bar dataKey="positive" fill="var(--c3)" />
        <Bar dataKey="neutral" fill="var(--c4)" />
        <Bar dataKey="negative" fill="var(--c5)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/* --- eCharts --- */
export const StackedByNetwork = ({ data }: { data: any[] }) => (
  <E
    option={{
      tooltip: {},
      legend: {},
      xAxis: { type: "category", data: data.map((d: any) => d.network) },
      yAxis: { type: "value" },
      series: [
        { type: "bar", stack: "t", data: data.map((d: any) => d.engagement) },
      ],
    }}
  />
);
export const PieSentiment = ({ data }: { data: any[] }) => (
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
export const DonutPosNeg = ({ data }: { data: any[] }) => {
  const pos = data.find((d: any) => d.sentiment === "positive")?.count || 0,
    neg = data.find((d: any) => d.sentiment === "negative")?.count || 0;
  return (
    <E
      option={{
        series: [
          {
            type: "pie",
            radius: ["50%", "78%"],
            data: [
              { name: "Positive", value: pos },
              { name: "Negative", value: neg },
            ],
          },
        ],
      }}
    />
  );
};
export const HeatmapInteractions = ({
  data,
}: {
  data: { dow: number; hr: number; v: number }[];
}) => {
  const dataset = data.map((d) => [d.hr, d.dow, d.v]);
  return (
    <E
      option={{
        tooltip: {},
        grid: { top: 10, right: 10, bottom: 40, left: 40 },
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
          bottom: 4,
        },
        series: [{ type: "heatmap", data: dataset }],
      }}
    />
  );
};
export const Cloud = ({
  data,
}: {
  data: { text: string; value: number }[];
}) => (
  <E
    option={{
      tooltip: {},
      series: [
        {
          type: "wordCloud",
          gridSize: 8,
          sizeRange: [12, 48],
          rotationRange: [0, 0],
          textStyle: {
            color: () =>
              echartsColors[Math.floor(Math.random() * echartsColors.length)],
          },
          data: data.map((d) => ({ name: d.text, value: d.value })),
        },
      ],
    }}
  />
);

export const RadarChannels = ({ data }: { data: any[] }) => {
  const max = Math.max(1, ...data.map((x: any) => x.value)),
    indicators = data.map((d: any) => ({ name: d.channel, max }));
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
};
export const GaugeSatisfaction = ({ score }: { score: number }) => (
  <E
    option={{
      series: [
        {
          type: "gauge",
          min: 0,
          max: 5,
          splitNumber: 5,
          axisLine: { lineStyle: { width: 10 } },
          progress: { show: true, width: 10 },
          axisLabel: { formatter: (v: any) => v },
          detail: {
            valueAnimation: true,
            formatter: "{value}/5",
            fontSize: 28,
          },
          data: [{ value: score }],
        },
      ],
    }}
  />
);
export const TreemapCategories = ({ data }: { data: any[] }) => (
  <E option={{ series: [{ type: "treemap", data }] }} />
);
export const SunburstCategories = ({
  data,
}: {
  data: { category_lvl1: string; category_lvl2: string; v: number }[];
}) => {
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
};
export const FunnelConv = ({
  data,
}: {
  data: { stage: string; v: number }[];
}) => (
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
export const Choropleth = ({
  data,
}: {
  data: { country: string; count: number }[];
}) => {
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
      <div className="card card-pad h-360 center muted">Cargando mapa…</div>
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
};
export const Bubble = ({
  data,
}: {
  data: { x: number | string; y: number | string; z: number | string }[];
}) => {
  const clean = data
    .map((d) => ({
      x: Number(d.x),
      y: Number(d.y),
      z: Math.max(0, Number(d.z)),
    }))
    .filter(
      (d) =>
        Number.isFinite(d.x) && Number.isFinite(d.y) && Number.isFinite(d.z)
    );

  // escala de tamaño estable (evita burbujas minúsculas/gigantes)
  const zmax = Math.max(1, ...clean.map((d) => d.z));
  const size = (z: number) => {
    const t = z / zmax;
    return 6 + Math.sqrt(t) * 28; // 6–34 px
  };

  return (
    <E
      option={{
        tooltip: {
          trigger: "item",
          formatter: (p: any) =>
            `x: ${p.value[0]}<br/>y: ${p.value[1]}<br/>reach: ${p.value[2]}`,
        },
        xAxis: {
          type: "value",
          name: "Seguidores",
          splitLine: { show: false },
        },
        yAxis: { type: "value", name: "Engagement", splitLine: { show: true } },
        series: [
          {
            type: "scatter",
            symbolSize: (v: any) => size(v[2]),
            data: clean.map((d) => [d.x, d.y, d.z]),
            emphasis: { focus: "series" },
          },
        ],
      }}
    />
  );
};
export const Scatter = ({ data }: { data: { x: number; y: number }[] }) => (
  <E
    option={{
      xAxis: {},
      yAxis: {},
      series: [{ type: "scatter", data: data.map((d) => [d.x, d.y]) }],
    }}
  />
);
export const EventsTimeline = ({
  data,
}: {
  data: { y: string; title: string; kind: string }[];
}) => (
  <E
    option={{
      xAxis: { type: "category", data: data.map((d) => d.y) },
      yAxis: { show: false },
      series: [{ type: "line", data: data.map((_) => 1), symbolSize: 10 }],
      tooltip: { formatter: (p: any) => data[p.dataIndex].title },
    }}
  />
);
export const Network = ({
  links,
}: {
  links: { source: string; target: string; weight: number }[];
}) => {
  const nodes: Record<string, { name: string }> = {};
  links.forEach((l) => {
    nodes[l.source] = { name: l.source };
    nodes[l.target] = { name: l.target };
  });
  if (!links.length)
    return (
      <div className="card card-pad h-360 center muted">
        Sin datos de red en este rango
      </div>
    );
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
};

/* Extra */
export const Waterfall = ({
  data,
}: {
  data: { month: string; delta: number }[];
}) => (
  <E
    option={{
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: data.map((d) => d.month) },
      yAxis: { type: "value" },
      series: [
        {
          type: "bar",
          data: data.map((d) => d.delta),
          itemStyle: {
            color: (p: any) => (p.value >= 0 ? "#26c6a2" : "#ff6b6b"),
          },
        },
      ],
    }}
  />
);
export const SankeyChannels = ({
  links,
}: {
  links: { from: string; to: string; value: number }[];
}) => {
  const nodes = Array.from(new Set(links.flatMap((l) => [l.from, l.to]))).map(
    (name) => ({ name })
  );
  return (
    <E
      h={360}
      option={{
        tooltip: {},
        series: [
          {
            type: "sankey",
            data: nodes,
            links: links.map((l) => ({
              source: l.from,
              target: l.to,
              value: l.value,
            })),
            lineStyle: { color: "gradient" },
          },
        ],
      }}
    />
  );
};

import { COUNTRY_CENTER } from "../../lib/geo";

export const GeoHeatmap = ({
  data,
}: {
  data: { country: string; count: number }[];
}) => {
  const pts = data
    .map((d) => {
      const c = COUNTRY_CENTER[d.country as keyof typeof COUNTRY_CENTER];
      if (!c) return null;
      const v = Number(d.count || 0);
      return [c.lon, c.lat, v] as [number, number, number];
    })
    .filter(Boolean) as [number, number, number][];

  return (
    <E
      h={360}
      option={{
        tooltip: {},
        geo: {
          map: "world",
          roam: true,
          itemStyle: { areaColor: "#1b1f2a", borderColor: "#111" },
        },
        visualMap: {
          min: 0,
          max: Math.max(1, ...pts.map((p) => p[2])),
          calculable: true,
          orient: "horizontal",
          bottom: 6,
          left: "center",
        },
        series: [
          {
            type: "heatmap",
            coordinateSystem: "geo",
            data: pts,
            pointSize: 18,
            blurSize: 20,
          },
        ],
      }}
    />
  );
};
