import axios from 'axios'
import { mock } from './mock'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 8000,
})

export const qs = (p: Record<string, any>) => {
  const u = new URLSearchParams()
  Object.entries(p).forEach(([k,v])=>{
    if(v!==undefined && v!==null && v!=='' && !(Array.isArray(v)&&v.length===0))
      u.set(k, Array.isArray(v)? v.join(',') : String(v))
  })
  const s = u.toString()
  return s ? `?${s}` : ''
}

type Getter = (url: string) => Promise<{data:any}>
const fromMock: Getter = async (url) => {
  const path = url.split('?')[0]
  if (path.includes('/api/kpis/')) return {data: mock.kpis}
  if (path.includes('/api/mentions/timeline/')) return {data: mock.timeline}
  if (path.includes('/api/sentiment/share/')) return {data: mock.sentiment}
  if (path.includes('/api/demographics/age/')) return {data: mock.age}
  if (path.includes('/api/demographics/gender/')) return {data: mock.gender}
  if (path.includes('/api/engagement/by-network/')) return {data: mock.byNetwork}
  if (path.includes('/api/columns/grouped/')) return {data: mock.grouped}
  if (path.includes('/api/heatmap/interactions/')) return {data: mock.heatmap}
  if (path.includes('/api/terms/hashtags/')) return {data: mock.hashtags}
  if (path.includes('/api/terms/mentions/')) return {data: mock.ats}
  if (path.includes('/api/emoji/top/')) return {data: mock.emojis}
  if (path.includes('/api/treemap/categories/')) return {data: mock.treemap}
  if (path.includes('/api/sunburst/categories/')) return {data: mock.sunburst}
  if (path.includes('/api/funnel/')) return {data: mock.funnel}
  if (path.includes('/api/locations/')) return {data: mock.locations}
  if (path.includes('/api/bubble/')) return {data: mock.bubble}
  if (path.includes('/api/scatter/')) return {data: mock.scatter}
  if (path.includes('/api/events/')) return {data: mock.events}
  if (path.includes('/api/network/influencers/')) return {data: mock.network}
  if (path.includes('/api/gauge/satisfaction/')) return {data: mock.gauge}
  return {data: []}
}
export const get: Getter = async (url) => {
  if (!api.defaults.baseURL) return fromMock(url)
  try { return await api.get(url) } catch { return fromMock(url) }
}
