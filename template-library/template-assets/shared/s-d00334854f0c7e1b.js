
/* ── PALETTE：直接照抄 templates/glance-gallery.html 顶部同名常量，不新增色值 ── */
const INK='#1C1C1A',PAPER='#F0EFEB',MUTED='#8F8E88',GRID='#DEDDD6',FAINT='#C6C5BF';
const DPR=window.devicePixelRatio||1;
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 统一 reveal 机制（滚入播 + 点击重播，逐字照抄 gallery 的 obsReveal/cReveal/eReveal） ── */
const timers={};
const obsReveal=(id,fn)=>{
  const el=document.getElementById(id); if(!el)return;
  const go=()=>{(timers[id]||[]).forEach(clearInterval);timers[id]=[];fn(el)};
  const io=new IntersectionObserver(es=>{
    if(es[0].isIntersecting){go();io.disconnect()}
  },{threshold:.35});
  io.observe(el);
  el.style.cursor='pointer';
  el.addEventListener('click',go);
};
const keep=(id,t)=>{(timers[id]=timers[id]||[]).push(t)};
const eReveal=(id,opt)=>obsReveal(id,el=>{
  const g=echarts.getInstanceByDom(el)||echarts.init(el,null,{devicePixelRatio:DPR});
  g.clear();g.setOption(opt);
});
const cjs={};
const cReveal=(id,mkCfg)=>obsReveal(id,el=>{
  cjs[id]?.destroy();
  cjs[id]=new Chart(el,mkCfg());
});

Chart.defaults.color=MUTED;
Chart.defaults.font.family='Inter,"PingFang SC","Noto Sans SC",Arial,sans-serif';
Chart.defaults.font.size=10.5;
Chart.defaults.borderColor=GRID;
Chart.defaults.devicePixelRatio=DPR;
Chart.defaults.plugins.legend.display=false;
Chart.defaults.plugins.tooltip.backgroundColor=INK;
Chart.defaults.plugins.tooltip.titleColor='#F0EFEB';
Chart.defaults.plugins.tooltip.bodyColor='#A5A49E';
Chart.defaults.plugins.tooltip.padding=12;
Chart.defaults.plugins.tooltip.cornerRadius=12;
Chart.defaults.plugins.tooltip.displayColors=false;

/* ════ 图A · G3 Chunky Bars（移植自 glance-gallery.html "Revenue by plan"） ════
   柱端胶囊圆角 + 分段延迟入场 + 柱顶大字插件全部照搬，只把
   $K 的取值方式换成天数，颜色按名次二值分配（前两高=INK，后两低=FAINT）。 */
(()=>{
const LABELS=['中国','美国','法国','日本'];
const VALUES=[7,11,8,5];
const rankOf=a=>{const r=[...a].map((v,i)=>[v,i]).sort((x,y)=>y[0]-x[0]).map(d=>d[1]);return i=>r.indexOf(i)};
const rk=rankOf(VALUES);
cReveal('leaveChart',()=>({
  type:'bar',
  data:{labels:LABELS,
    datasets:[{data:VALUES,
      backgroundColor:VALUES.map((_,i)=>rk(i)<2?INK:FAINT),
      borderRadius:{topLeft:99,topRight:99},borderSkipped:false,barPercentage:.52}]},
  options:{
    maintainAspectRatio:false,
    animation:REDUCED?{duration:0}:{duration:900,easing:'easeOutQuart',delay:c=>c.type==='data'?c.dataIndex*110:0},
    plugins:{tooltip:{callbacks:{label:i=>i.raw+' 天未休'}}},
    scales:{
      x:{grid:{display:false},border:{display:false},ticks:{padding:8,font:{size:9,weight:600}}},
      y:{display:false,suggestedMax:16},
    },
  },
  plugins:[{
    id:'topValues',
    afterDatasetsDraw(chart){
      const {ctx}=chart;
      chart.getDatasetMeta(0).data.forEach((bar,i)=>{
        ctx.save();ctx.font='700 13px Inter,"PingFang SC",sans-serif';ctx.fillStyle=INK;ctx.textAlign='center';
        ctx.fillText(chart.data.datasets[0].data[i],bar.x,bar.y-10);ctx.restore();
      });
    },
  }],
}));
})();

/* ════ 图B · G18 Draw-in + Counter（移植自 glance-gallery.html "H1 revenue, drawn in one stroke"） ════
   一笔画折线 + 渐变面积 + performance.now() 计数器全部照搬，只把
   累计营收换成疲惫指数，累计终值就是计数器要数到的那个数。 */
(()=>{
const DAYS=Array.from({length:91},(_,i)=>String(i));
const FATIGUE=DAYS.map(d=>Math.round(6+90*Math.pow(Number(d)/90,1.35)));
const TOTAL=FATIGUE[FATIGUE.length-1];
const DUR=2000;
let gen=0;
const countEl=document.getElementById('fatigueCount');
obsReveal('stroke',el=>{
  const g=echarts.getInstanceByDom(el)||echarts.init(el,null,{devicePixelRatio:DPR});
  g.clear();
  gen++;const my=gen;
  g.setOption({
    animationDuration:REDUCED?0:DUR,animationEasing:'cubicOut',
    tooltip:{show:false},
    grid:{left:4,right:14,top:6,bottom:20},
    xAxis:{type:'category',data:DAYS,boundaryGap:false,
      axisLine:{show:false},axisTick:{show:false},splitLine:{show:false},
      axisLabel:{color:MUTED,fontFamily:'Inter',fontSize:8,fontWeight:600,
        interval:(i,v)=>[0,30,60,90].includes(Number(v)),
        formatter:v=>{const n=Number(v);return n===0?'0':n===30?'30':n===60?'60':n===90?'90天':''}}},
    yAxis:{show:false,max:TOTAL*1.08},
    series:[{
      type:'line',data:FATIGUE,smooth:.2,symbol:'none',
      lineStyle:{color:INK,width:2.2},
      areaStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,
        colorStops:[{offset:0,color:'rgba(28,28,26,.22)'},{offset:1,color:'rgba(28,28,26,0)'}]}},
    }],
  });
  if(REDUCED){if(countEl)countEl.textContent=TOTAL;return}
  const t0=performance.now();
  const tick=()=>{
    if(my!==gen)return;
    const p=Math.min(1,(performance.now()-t0)/DUR);
    const eased=1-Math.pow(1-p,3);
    if(countEl)countEl.textContent=Math.round(TOTAL*eased);
    if(p<1)requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
})();

addEventListener('resize',()=>{
  echarts.getInstanceByDom(document.getElementById('stroke'))?.resize();
});
