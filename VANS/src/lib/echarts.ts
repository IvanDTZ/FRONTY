// src/lib/echarts.ts
import * as echarts from 'echarts/core'
import 'echarts-wordcloud'


let worldPromise: Promise<void> | null = null

export function ensureWorldMap(): Promise<void> {
  if (!worldPromise) {
    worldPromise = fetch('https://fastly.jsdelivr.net/npm/echarts@5/map/json/world.json')
      .then(r => r.json())
      .then(geo => { echarts.registerMap('world', geo) })
      .catch((err) => {
        console.error('No se pudo cargar el mapa world de ECharts:', err)
      })
  }
  return worldPromise
}

export { echarts }
