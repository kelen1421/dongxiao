
/* ── PALM 角色 token（与 glance-palm.html 脚本内同名常量逐一对应，不新增色值） ── */
const BG='#F0EFEB',DARK='#58402E',TXT='#58402E';
const MUT='rgba(88,64,46,.60)',LAB='rgba(88,64,46,.72)',FAINT='rgba(88,64,46,.40)',QUIET='rgba(88,64,46,.15)',GRID='rgba(88,64,46,.16)';
const DATA='#43593B',DATA2='#58402E',HERO='#D4A017';
const HERODK='#F2D17E';
const FAINTDATA='#ACAD79';
const RAMP=['#F2D17E','#ACAD79','#929960','#77835A','#43593B'];
const INK=TXT,PAPER=BG,MUTED=MUT;
const rgb=h=>[0,2,4].map(i=>parseInt(h.slice(1).substr(i,2),16));
const alpha=(h,a)=>h[0]==='#'?'rgba('+rgb(h).join(',')+','+a+')':h;
const rankOf=a=>{const r=[...a].map((v,i)=>[v,i]).sort((x,y)=>y[0]-x[0]).map(d=>d[1]);
  return i=>r.indexOf(i)};
const rampAt=(i,n)=>i===0?RAMP[4]
  :RAMP[Math.max(0,Math.min(3,3-Math.round((i-1)/Math.max(1,n-2)*3)))];
const tipLight={backgroundColor:INK,borderWidth:0,textStyle:{color:PAPER,fontFamily:'Inter',fontSize:12},padding:[10,14]};

/* ── 统一 reveal 机制（滚入播 + 点击重播，与 glance-palm.html 一致） ── */
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
  const g=echarts.getInstanceByDom(el)||echarts.init(el);
  g.clear();g.setOption(opt);
});
const cjs={};
const cReveal=(id,mkCfg)=>obsReveal(id,el=>{
  cjs[id]?.destroy();
  cjs[id]=new Chart(el,mkCfg());
});

Chart.defaults.color=MUT;
Chart.defaults.font.family="'Inter','Noto Sans SC',sans-serif";
Chart.defaults.font.size=10.5;
Chart.defaults.borderColor=GRID;
Chart.defaults.plugins.legend.display=false;
Chart.defaults.plugins.tooltip.backgroundColor=TXT;
Chart.defaults.plugins.tooltip.titleColor=BG;
Chart.defaults.plugins.tooltip.bodyColor=alpha(BG,.72);
Chart.defaults.plugins.tooltip.padding=12;
Chart.defaults.plugins.tooltip.cornerRadius=12;
Chart.defaults.plugins.tooltip.displayColors=false;

/* ════ 图A · G5 Pictorial Bar ════
   结构照搬 glance-palm.html "Trees planted, year by year"：符号
   计数横条,原图 symbol 是树形,这里换成一个中性菱形——上线的是
   功能改动,不是树,符号形状不该借一个不相关的隐喻。 */
(()=>{
const SHIP='path://M14,0 L28,14 L14,28 L0,14 Z';
const DAYS5=['周一','周二','周三','周四','周五'];
const SHIPPED=[3,4,5,7,9];
eReveal('ship',{
  animationDuration:900,animationEasing:'quarticOut',animationDelay:i=>i*130,
  tooltip:{...tipLight,formatter:p=>p.name+' — '+SHIPPED[p.dataIndex]+' 个改动'},
  grid:{left:52,right:56,top:10,bottom:8},
  yAxis:{type:'category',data:DAYS5,inverse:true,
    axisLine:{show:false},axisTick:{show:false},
    axisLabel:{color:MUT,fontFamily:"'Inter','Noto Sans SC',sans-serif",fontSize:10.5,fontWeight:700}},
  xAxis:{show:false,max:10},
  series:[{
    type:'pictorialBar',symbol:SHIP,
    symbolRepeat:true,symbolSize:[15,15],symbolMargin:3,symbolClip:true,
    data:SHIPPED.map((v,i)=>({name:DAYS5[i],value:v,itemStyle:{color:RAMP[i]}})),
    label:{show:true,position:'right',offset:[8,0],
      color:TXT,fontFamily:"'Inter','Noto Sans SC',sans-serif",fontSize:12,fontWeight:700,
      formatter:p=>SHIPPED[p.dataIndex]+' 个'},
    z:10,
  },{
    type:'pictorialBar',symbol:SHIP,
    symbolRepeat:'fixed',symbolSize:[15,15],symbolMargin:3,symbolClip:true,
    itemStyle:{color:QUIET},data:DAYS5.map(()=>10),silent:true,z:5,
  }],
});
})();

/* ════ 图B · G3 Chunky Bars（补"排名比较"这个数据形状缺口） ════
   结构照搬 glance-palm.html "Revenue by plan"：粗胶囊柱 + 柱顶大字,
   颜色按 rampAt(排名,n) 走,排第一深绿,排最后最浅。 */
(()=>{
const CATS=['邮件','应用内','Slack 社群','工单表单'];
const V=[186,54,31,22];
const rk=rankOf(V);
cReveal('c3',()=>({
  type:'bar',
  data:{labels:CATS,
    datasets:[{data:V,
      backgroundColor:V.map((_,i)=>rampAt(rk(i),V.length)),
      borderRadius:{topLeft:99,topRight:99},borderSkipped:false,barPercentage:.52}]},
  options:{
    maintainAspectRatio:false,
    animation:{duration:900,easing:'easeOutQuart',delay:c=>c.type==='data'?c.dataIndex*110:0},
    plugins:{tooltip:{callbacks:{label:i=>i.raw+' 件工单'}}},
    scales:{
      x:{grid:{display:false},border:{display:false},ticks:{padding:8,font:{size:9.5,weight:600}}},
      y:{display:false,suggestedMax:220},
    },
  },
  plugins:[{
    id:'topValues',
    afterDatasetsDraw(chart){
      const {ctx}=chart;
      chart.getDatasetMeta(0).data.forEach((bar,i)=>{
        ctx.save();ctx.font="700 13px 'Inter','Noto Sans SC',sans-serif";ctx.fillStyle=INK;ctx.textAlign='center';
        ctx.fillText(chart.data.datasets[0].data[i]+'件',bar.x,bar.y-10);ctx.restore();
      });
    },
  }],
}));
})();

addEventListener('resize',()=>{
  ['ship'].forEach(id=>document.getElementById(id)&&echarts.getInstanceByDom(document.getElementById(id))?.resize());
});

