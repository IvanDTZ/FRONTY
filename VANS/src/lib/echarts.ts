// src/lib/echarts.ts
import * as echarts from 'echarts/core'
import {
  MapChart, GraphChart, PieChart, BarChart, LineChart, RadarChart, SunburstChart,
  TreemapChart, FunnelChart, GaugeChart, ScatterChart
} from 'echarts/charts'
import {
  TooltipComponent, VisualMapComponent, LegendComponent, GridComponent,
  TitleComponent, DatasetComponent, GeoComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// Conjunto base (lo que usa tu dashboard)
echarts.use([
  MapChart, GraphChart, PieChart, BarChart, LineChart, RadarChart, SunburstChart,
  TreemapChart, FunnelChart, GaugeChart, ScatterChart,
  TooltipComponent, VisualMapComponent, LegendComponent, GridComponent,
  TitleComponent, DatasetComponent, GeoComponent, CanvasRenderer
])

let worldLoaded = false
let wcLoaded = false

export async function ensureWorldMap() {
  // Carga mapa mundial desde world-atlas (TopJSON) y lo convierte a GeoJSON
  if (!worldLoaded) {
    try {
      // Vite soporta importar JSON desde node_modules sin configuración extra
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const topo = await import('world-atlas/countries-110m.json')
      const { feature } = await import('topojson-client')

      const geojson = feature(topo as any, (topo as any).objects.countries)
      echarts.registerMap('world', geojson as any)
      worldLoaded = true
    } catch (e) {
      console.error('Error registrando mapa world desde world-atlas:', e)
    }
  }

  // WordCloud plugin
  if (!wcLoaded) {
    try {
      await import('echarts-wordcloud')
      wcLoaded = true
    } catch (e) {
      console.error('Error cargando echarts-wordcloud:', e)
    }
  }

  return true
}

export default echarts
