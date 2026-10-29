
/* ── mono-tokens 内联（几何/工具函数与正本一致）── */
const NS='http://www.w3.org/2000/svg';
const el=(p,t,a)=>{const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);p.appendChild(n);return n};
const txt=(p,a,s)=>{const n=el(p,'text',a);n.textContent=s;return n};
const tip=(n,s)=>{const t=document.createElementNS(NS,'title');t.textContent=s;n.appendChild(t)};
const rnd=(i,k)=>Math.abs(((i*73856093)^(k*19349663))%1000)/1000;
const D2R=Math.PI/180;
const pol=(cx,cy,r,deg)=>[cx+r*Math.cos(deg*D2R),cy+r*Math.sin(deg*D2R)];
const obsReveal=(id,fn)=>{
  const n=document.getElementById(id); if(!n)return;
  const go=()=>{n.innerHTML='';fn(n)};
  const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){go();io.disconnect()}},{threshold:.3});
  io.observe(n); n.style.cursor='pointer'; n.addEventListener('click',go);
};

/* ── PALM preset（color-presets.js 原值）── */
const P={BG:'#F0EFEB',TXT:'#58402E',DATA:'#43593B',DATA2:'#58402E',HERO:'#D4A017',
  FAINTDATA:'#ACAD79',BEAD:'#77835A',MUT:'rgba(88,64,46,.60)',
  FAINT:'rgba(88,64,46,.32)',GRID:'rgba(88,64,46,.16)',
  QUIET:'rgba(88,64,46,.15)',LAB:'rgba(88,64,46,.72)',
  RAMP:['#F2D17E','#ACAD79','#929960','#77835A','#43593B'],
  CAT4:['#43593B','#77835A','#ACAD79','#F2D17E'],CAT3:['#43593B','#929960','#F2D17E']};

/* ════ 图A · F5 tick rows ════
   结构照搬 basics-gallery "tick rows"：一行 = 一个开支类目，
   1 tick = $20k。tick 线宽 .9→1.6，透明度地板 .85。
   HERO 琥珀只给一个主角行（工资）。 */
(()=>{
const D=[['工资',41],['基础设施与工具',9],['市场投放',7],['办公与运营',4],['法务',2]];
obsReveal('spendrows',s=>{
  const y0=i=>40+i*42,X0=112,PX=5.7;
  D.forEach(([name,v],i)=>{
    const y=y0(i),hero=i===0;
    txt(s,{x:102,y:y+3,'font-size':8.5,'font-weight':700,fill:P.MUT,'text-anchor':'end',
      'letter-spacing':'.04em',class:'fade',style:`animation-delay:${i*.08}s`},name);
    el(s,'line',{x1:X0,y1:y+9,x2:X0+43*PX,y2:y+9,stroke:P.GRID,'stroke-width':.8,
      class:'fade',style:`animation-delay:${i*.08}s`});
    for(let k=0;k<v;k++){
      const x=X0+k*PX+PX/2,h=9+rnd(k+1,i+2)*6;
      el(s,'line',{x1:x,y1:y+9,x2:x,y2:y+9-h,stroke:hero?P.HERO:P.DATA,'stroke-width':1.6,
        opacity:.85+rnd(k+3,i+5)*.15,class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
      if(k%5===4)el(s,'circle',{cx:x,cy:y+13,r:.9,fill:P.FAINTDATA,
        class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
    }
    const amount = v*20>=1000 ? '$'+(v*20/1000).toFixed(2).replace(/0+$/,'').replace(/\.$/,'')+'M' : '$'+(v*20)+'k';
    const lab=txt(s,{x:X0+v*PX+10,y:y+4,'font-size':11,'font-weight':800,
      fill:hero?P.HERO:P.DATA,class:'fade',style:`animation-delay:${.4+i*.08}s`},amount);
    tip(lab,`${name} —— ${v} 格 × $20k`);
  });
  txt(s,{x:200,y:246,'font-size':7.5,'font-weight':600,fill:P.FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:.9s'},
    '一格 = $20K · 每五格一个圆点 · 琥珀 = 最大开支项');
});
})();

/* ════ 图B · L11 trend lineage ════
   结构照搬 lupi-gallery "trend lineage"：一列 = 一个功能，
   实心 = 上线，空心 = 改版；两次动作相隔 > 2 年记一段虚线（沉寂期）；
   存活的功能续画到 2026；HERO 琥珀只给"沉寂最久之后杀回来"的那一条。
   年份轴从年报的 2022 起、到 2026 止，和顶部里程碑时间轴同一跨度。 */
(()=>{
const TR=[
  ['暗色模式',[[2022,'f'],[2024,'o']],true],
  ['看板',[[2022,'f']],true],
  ['命令面板',[[2023,'f']],false],
  ['协作光标',[[2023,'f'],[2025,'o']],true],
  ['模板库',[[2022,'f'],[2025,'o']],true],
  ['收件箱',[[2023,'f']],false],
  ['AI 摘要',[[2024,'f'],[2025,'o']],true],
  ['语音批注',[[2022,'f'],[2026,'o']],true],
];
const Y0=2022,yY=yr=>34+(yr-Y0)*60,colX=c=>84+c*36;
// 主角：最近一次有动作的功能线 —— 标题里的"回马枪"
const HC=TR.map((r,i)=>[r[1][r[1].length-1][0],i]).sort((a,b)=>b[0]-a[0])[0][1];
obsReveal('lineage',s=>{
  for(let yr=Y0;yr<=2026;yr++){
    el(s,'line',{x1:60,y1:yY(yr),x2:372,y2:yY(yr),stroke:P.QUIET,'stroke-width':.8,
      class:'fade',style:`animation-delay:${(yr-Y0)*.03}s`});
    txt(s,{x:52,y:yY(yr)+3,'font-size':8,'font-weight':600,fill:P.MUT,'text-anchor':'end',
      class:'fade',style:`animation-delay:${(yr-Y0)*.03}s`},yr);
  }
  TR.forEach(([name,ev,alive],c)=>{
    const x=colX(c),hero=c===HC;
    const lastYr=ev[ev.length-1][0];
    // 越近期动过 = 越重；已沉寂的走最浅一档（虚线本身已经在说沉寂）
    const col=hero?P.HERO:P.RAMP[alive?Math.min(4,Math.max(2,lastYr-Y0)):1];
    for(let k=0;k<ev.length-1;k++){
      const gap=ev[k+1][0]-ev[k][0];
      el(s,'line',{x1:x,y1:yY(ev[k][0])+7,x2:x,y2:yY(ev[k+1][0])-7,
        stroke:col,'stroke-width':hero?1.8:1.4,
        'stroke-dasharray':gap>2?'2 4':'none',pathLength:1,
        class:'draw',style:`animation-delay:${.3+c*.07}s;animation-duration:.6s`});
    }
    const last=ev[ev.length-1][0];
    if(alive)
      el(s,'line',{x1:x,y1:yY(last)+7,x2:x,y2:yY(2026)+16,stroke:col,'stroke-width':hero?1.8:1.4,
        pathLength:1,class:'draw',style:`animation-delay:${.45+c*.07}s;animation-duration:.6s`});
    ev.forEach(([yr,t])=>{
      const node=el(s,'circle',t==='f'
        ?{cx:x,cy:yY(yr),r:5.5,fill:col}
        :{cx:x,cy:yY(yr),r:5.5,fill:P.BG,stroke:col,'stroke-width':1.6});
      node.setAttribute('class','pop');
      node.style.animationDelay=(.35+c*.07)+'s';
      tip(node,`${name} —— ${t==='f'?'上线':'改版'} ${yr}`);
    });
    // 终点：存活的落在今天的基线上，沉寂的停在它停下的地方
    el(s,'circle',{cx:x,cy:alive?yY(2026)+16:yY(last)+12,r:alive?3:1.6,
      fill:col,class:'pop',style:`animation-delay:${.6+c*.07}s`});
    const ly=yY(2026)+26;
    txt(s,{x,y:ly,'font-size':8.5,'font-weight':hero?800:600,fill:hero?P.HERO:(alive?P.LAB:P.FAINT),
      transform:`rotate(-52 ${x} ${ly})`,'text-anchor':'end',
      class:'fade',style:`${hero?`paint-order:stroke;stroke:${P.BG};stroke-width:3px;`:''}animation-delay:${.7+c*.05}s`},name);
  });
});
})();

/* ════ 图C · F11 tick gauge ════
   结构照搬 basics-gallery "tick gauge"：210° 表盘，1 tick = 1% 目标。
   已达部分上深绿墨，尖端琥珀珠收笔。tick 线宽 1→1.8 / .6→1.1。 */
(()=>{
const GOAL=66;
obsReveal('gauge',s=>{
  const cx=200,cy=186,R0=100,A0=-195,SW=210;
  for(let k=0;k<100;k++){
    const a=A0+k/100*SW,inked=k<GOAL;
    const len=inked?13+rnd(k+1,3)*6:5+rnd(k+1,7)*2.5;
    const [x1,y1]=pol(cx,cy,R0,a),[x2,y2]=pol(cx,cy,R0+len,a);
    el(s,'line',{x1,y1,x2,y2,stroke:inked?P.DATA:P.FAINTDATA,'stroke-width':inked?1.8:1.1,
      opacity:inked?1:.85,class:'fade',style:`animation-delay:${k*.012}s`});
  }
  [25,50,75,100].forEach(m=>{
    const a=A0+m/100*SW,[dx,dy]=pol(cx,cy,R0-7,a),[tx2,ty2]=pol(cx,cy,R0-19,a);
    el(s,'circle',{cx:dx,cy:dy,r:1,fill:P.BEAD,class:'fade',style:'animation-delay:.8s'});
    txt(s,{x:tx2,y:ty2+3,'font-size':7,'font-weight':600,fill:P.FAINT,'text-anchor':'middle',
      class:'fade',style:'animation-delay:.85s'},m);
  });
  const aT=A0+GOAL/100*SW,[ex,ey]=pol(cx,cy,R0+20,aT);
  el(s,'circle',{cx:ex,cy:ey,r:2.8,fill:P.HERO,class:'pop',style:'animation-delay:1.1s'});
  const num=txt(s,{x:cx,y:cy-4,'font-size':34,'font-weight':800,fill:P.DATA,'text-anchor':'middle',
    class:'fade',style:'animation-delay:1s'},GOAL+'%');
  tip(num,'$7M ARR 目标已完成 $4.6M');
  txt(s,{x:cx,y:cy+16,'font-size':8.5,'font-weight':600,fill:P.MUT,'text-anchor':'middle',
    'letter-spacing':'.08em',class:'fade',style:'animation-delay:1.05s'},'还差 34 格');
  txt(s,{x:200,y:292,'font-size':7.5,'font-weight':600,fill:P.FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:1.2s'},
    '一格 = 目标的 1% · 上墨 = 已完成 · 琥珀珠 = 今天');
});
})();

