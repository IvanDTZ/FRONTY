export const mock = {
  kpis: { mentions: 12835, engagement: 964000, reach: 4200000 },
  timeline: Array.from({length:12}, (_,i)=>({ y:`2025-${String(i+1).padStart(2,'0')}`, mentions: 600+Math.round(Math.random()*900) })),
  sentiment: [{sentiment:'positive',count:59},{sentiment:'neutral',count:24},{sentiment:'negative',count:16}],
  age: [{bucket:'13-17',count:120},{bucket:'18-24',count:300},{bucket:'25-34',count:420},{bucket:'35-44',count:180},{bucket:'45-54',count:90}],
  gender: [{gender:'male',count:600},{gender:'female',count:520},{gender:'unknown',count:110}],
  byNetwork: [
    {network:'Facebook',engagement:320000},
    {network:'Instagram',engagement:480000},
    {network:'Twitter',engagement:120000},
    {network:'Web',engagement:80000},
  ],
  grouped: [
    {group_key:'Facebook',positive:300,neutral:120,negative:60},
    {group_key:'Instagram',positive:420,neutral:140,negative:80},
    {group_key:'Twitter',positive:160,neutral:90,negative:70},
    {group_key:'Web',positive:90,neutral:70,negative:20},
  ],
  heatmap: Array.from({length:7*24},(_,k)=>({dow:k%7,hr:Math.floor(k/7),v:Math.round(Math.random()*22)})),
  hashtags: ['#vans','#offthewall','#skateboarding','#streetwear','#sneakers','#oldskool']
    .map((t,i)=>({text:t,value:90-i*10})),
  ats: ['@vans','@skate','@sneakers','@street','@retail'].map((t,i)=>({text:t,value:60-i*6})),
  emojis: ['🔥','💯','🤙','😍','😎','🛹'].map((e,i)=>({text:e,value:80-i*9})),
  treemap: [{name:'sneakers',value:40},{name:'streetwear',value:25},{name:'skate',value:18},{name:'lifestyle',value:12}],
  sunburst: [
    {category_lvl1:'Footwear',category_lvl2:'Sneakers',v:40},
    {category_lvl1:'Footwear',category_lvl2:'Skate',v:20},
    {category_lvl1:'Apparel',category_lvl2:'Streetwear',v:25},
    {category_lvl1:'Apparel',category_lvl2:'Lifestyle',v:12},
  ],
  funnel: [{stage:'Seen',v:5000},{stage:'Engaged',v:1800},{stage:'Clicked',v:700}],
  locations: [{country:'CL',count:320},{country:'PE',count:280},{country:'AR',count:260},{country:'CO',count:400},{country:'BR',count:520}],
  bubble: Array.from({length:40},()=>({x:Math.random()*100000,y:Math.random()*15000,z:Math.random()*300000})),
  scatter: Array.from({length:40},()=>({x:Math.random()*100000,y:Math.random()*5000})),
  events: [{y:'2025-01-12',title:'Lanzamiento campaña',kind:'launch'},{y:'2025-03-07',title:'Colaboración artista',kind:'collab'}],
  network: Array.from({length:60},(_,i)=>({source:`A${(i%10)+1}`,target:`B${(i%12)+1}`,weight:1+Math.round(Math.random()*5)})),
  gauge: {score: 4.2},

  // para gráficas extra
  sankey: [
    {from:'Facebook',to:'Positive',value:300},
    {from:'Facebook',to:'Neutral',value:120},
    {from:'Facebook',to:'Negative',value:60},
    {from:'Instagram',to:'Positive',value:420},
    {from:'Instagram',to:'Neutral',value:140},
    {from:'Instagram',to:'Negative',value:80},
  ],
  waterfall: Array.from({length:12},(_,i)=>({month:`2025-${String(i+1).padStart(2,'0')}`, delta: Math.round(-150 + Math.random()*300)})),
}
