import axios from 'axios'
import { mock } from './mock'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 8000,
})

export const todayISO = () => new Date().toISOString().slice(0,10)

export const qs = (p: Record<string, any>) => {
  const u = new URLSearchParams()
  Object.entries(p).forEach(([k,v])=>{
    if(v!==undefined && v!==null && v!=='' && !(Array.isArray(v)&&v.length===0))
      u.set(k, Array.isArray(v)? v.join(',') : String(v))
  })
  const s = u.toString()
  return s ? `?${s}` : ''
}

/* ---------- Helpers de mock con filtros ---------- */
function parse(url:string){
  const q = new URLSearchParams(url.split('?')[1]||'')
  const from = q.get('from') || '2025-01-01'
  const to   = q.get('to')   || todayISO()
  const countries = (q.get('countries')||'').split(',').filter(Boolean)
  return {from,to,countries}
}
function monthsBetween(from:string,to:string){
  const s = new Date(from+'T00:00:00'), e = new Date(to+'T00:00:00')
  const out:string[] = []
  const d = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), 1))
  const end = new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), 1))
  while(d <= end){ out.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`); d.setUTCMonth(d.getUTCMonth()+1) }
  return out
}
function seededRand(seed:number){ let x=Math.sin(seed)*10000; return x-Math.floor(x) }
function scaleByCountries(v:number, countries:string[]){ return Math.round(v*(1 + (countries.length? (countries.length*0.06):0))) }

/* Generadores por endpoint */
function genTimeline(url:string){
  const {from,to,countries}=parse(url)
  const months = monthsBetween(from,to)
  return months.map((m,i)=>({ y:`${m}`, mentions: scaleByCountries(500+Math.round(seededRand(i)*900), countries)}))
}
function genSentiment(url:string){
  const {countries}=parse(url)
  const base = [{sentiment:'positive',count:60},{sentiment:'neutral',count:25},{sentiment:'negative',count:15}]
  return base.map(b=>({sentiment:b.sentiment, count: scaleByCountries(b.count*10, countries)}))
}
function genByNetwork(url:string){
  const {countries}=parse(url)
  const base = [
    {network:'Facebook',engagement:320000},
    {network:'Instagram',engagement:480000},
    {network:'Twitter',engagement:120000},
    {network:'Web',engagement:80000},
  ]
  return base.map(b=>({network:b.network, engagement: scaleByCountries(b.engagement, countries)}))
}
function genGrouped(url:string){
  const {countries}=parse(url)
  const base = [
    {group_key:'Facebook',positive:300,neutral:120,negative:60},
    {group_key:'Instagram',positive:420,neutral:140,negative:80},
    {group_key:'Twitter',positive:160,neutral:90,negative:70},
    {group_key:'Web',positive:90,neutral:70,negative:20},
  ]
  return base.map(r=>({
    group_key:r.group_key,
    positive: scaleByCountries(r.positive, countries),
    neutral:  scaleByCountries(r.neutral, countries),
    negative: scaleByCountries(r.negative, countries),
  }))
}
function genKpis(url:string){
  const tl = genTimeline(url)
  const mentions = tl.reduce((a,b)=>a+b.mentions,0)
  const engagement = Math.round(mentions*75)
  const reach = Math.round(mentions*320)
  return {mentions, engagement, reach}
}
function genHeat(url:string){
  const {countries}=parse(url)
  return Array.from({length:7*24},(_,k)=>({dow:k%7,hr:Math.floor(k/7),v: scaleByCountries(Math.round(seededRand(k)*25), countries)}))
}
function genTerms(list:string[], mul:number, url:string){
  const {countries}=parse(url)
  return list.map((t,i)=>({text:t,value: scaleByCountries(Math.max(10, mul-i*mul*0.1), countries)}))
}
function genLocations(url:string){
  const {countries}=parse(url)
  const base = [{country:'CL',count:320},{country:'PE',count:280},{country:'AR',count:260},{country:'CO',count:400},{country:'BR',count:520}]
  return base
    .filter(b=>countries.length? countries.includes(b.country): true)
    .map(b=>({country:b.country, count: scaleByCountries(b.count, countries)}))
}
function genWaterfall(url:string){
  const {from,to}=parse(url)
  return monthsBetween(from,to).map((m,i)=>({month:m, delta: Math.round(-150 + seededRand(i)*300)}))
}
function genNetwork(url:string){
  const {countries}=parse(url)

  // Hubs & influencers reales vinculados a Vans / skate
  const hubs = [
    'Vans','VansSkate','ThrasherMagazine','TonyHawk','LizzieArmanto','SteveCaballero',
    'ChimaFerguson','RowanZorilla','BeatriceDomond','BrightonZeuner','TheBerrics',
    'StreetLeague','XGames','Supreme','Palace','Spitfire','IndependentTrucks','SkateLikeAGirl'
  ]
  // Cuentas de tiendas/medios latam + team
  const latam = ['VansMX','VansCL','VansAR','VansBR','VansCO','SkateLatam','StreetwearLATAM','ThrasherMX']
  const others = ['JeffRowley','PedroBarros','GregLutzka','ChristianHosoi','RayBarbee','DaneBurman','CurrenCaples']
  const all = [...hubs, ...latam, ...others]

  const links:any[]=[]
  for (let i=0;i<all.length;i++){
    const from = all[i]
    const to = hubs[Math.floor(seededRand(i)*hubs.length)]
    const w = 1 + Math.round(seededRand(i*7)*5)
    if (from!==to) links.push({source:from,target:to,weight:w})
    // co-colaboraciones entre hubs relevantes cada cierto paso
    if (i%6===0){
      const h2 = hubs[Math.floor(seededRand(i*11)*hubs.length)]
      if(h2!==to) links.push({source:to,target:h2,weight:1+Math.round(seededRand(i*13)*3)})
    }
  }
  // Si se filtran países BF, reducimos/filtramos para que cambie el tamaño de la red
  return countries.length ? links.slice(0, 60 + countries.length*8) : links
}


function genBubble(url:string){
  const {countries}=parse(url)
  const n = 40 + countries.length*5
  return Array.from({length:n},(_,i)=>({x:Math.random()*100000,y:Math.random()*15000,z:Math.random()*300000}))
}
function genSankey(url:string){
  const grouped = genGrouped(url)
  const m = new Map<string, {pos:number;neu:number;neg:number}>()
  grouped.forEach(g=>m.set(g.group_key,{pos:g.positive,neu:g.neutral,neg:g.negative}))
  const links:any[]=[]
  m.forEach((v,k)=>{
    links.push({from:k,to:'Positive',value:v.pos})
    links.push({from:k,to:'Neutral', value:v.neu})
    links.push({from:k,to:'Negative',value:v.neg})
  })
  return links
}

/* ---------- Fallback con filtros ---------- */
type Getter = (url: string) => Promise<{data:any}>
const fromMock: Getter = async (url) => {
  const path = url.split('?')[0]
  if (path.includes('/api/kpis/')) return {data: genKpis(url)}
  if (path.includes('/api/mentions/timeline/')) return {data: genTimeline(url)}
  if (path.includes('/api/sentiment/share/')) return {data: genSentiment(url)}
  if (path.includes('/api/demographics/age/')) return {data: mock.age}
  if (path.includes('/api/demographics/gender/')) return {data: mock.gender}
  if (path.includes('/api/engagement/by-network/')) return {data: genByNetwork(url)}
  if (path.includes('/api/columns/grouped/')) return {data: genGrouped(url)}
  if (path.includes('/api/heatmap/interactions/')) return {data: genHeat(url)}
  if (path.includes('/api/terms/hashtags/')) return {data: genTerms(['#vans','#offthewall','#skateboarding','#streetwear','#sneakers','#oldskool'],90,url)}
  if (path.includes('/api/terms/mentions/')) return {data: genTerms(['@vans','@skate','@sneakers','@street','@retail'],60,url)}
  if (path.includes('/api/emoji/top/')) return {data: genTerms(['🔥','💯','🤙','😍','😎','🛹'],80,url)}
  if (path.includes('/api/treemap/categories/')) return {data: mock.treemap}
  if (path.includes('/api/sunburst/categories/')) return {data: mock.sunburst}
  if (path.includes('/api/funnel/')) return {data: mock.funnel}
  if (path.includes('/api/locations/')) return {data: genLocations(url)}
  if (path.includes('/api/bubble/')) return {data: genBubble(url)}
  if (path.includes('/api/scatter/')) return {data: mock.scatter}
  if (path.includes('/api/events/')) return {data: mock.events}
  if (path.includes('/api/network/influencers/')) return {data: genNetwork(url)}
  if (path.includes('/api/gauge/satisfaction/')) return {data: mock.gauge}
  if (path.includes('/api/sankey/')) return {data: genSankey(url)}
  if (path.includes('/api/waterfall/')) return {data: genWaterfall(url)}
  return {data: []}
}
export const get: Getter = async (url) => {
  if (!api.defaults.baseURL) return fromMock(url)
  try { return await api.get(url) } catch { return fromMock(url) }
}
