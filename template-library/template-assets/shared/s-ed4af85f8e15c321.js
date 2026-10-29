
/* ── mono-tokens 内联（色板 / 几何 / 工具函数与正本一致）── */
const INK='#1C1C1A',PAPER='#F0EFEB',MUTED='#8F8E88',GRID='#DEDDD6';
const NS='http://www.w3.org/2000/svg';
const el=(p,t,a)=>{const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);p.appendChild(n);return n};
const txt=(p,a,s)=>{const n=el(p,'text',a);n.textContent=s;return n};
const tip=(n,s)=>{const t=document.createElementNS(NS,'title');t.textContent=s;n.appendChild(t)};
const rnd=(i,k)=>Math.abs(((i*73856093)^(k*19349663))%1000)/1000;
const obsReveal=(id,fn)=>{
  const n=document.getElementById(id); if(!n)return;
  const go=()=>{n.innerHTML='';fn(n)};
  const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){go();io.disconnect()}},{threshold:.3});
  io.observe(n); n.style.cursor='pointer'; n.addEventListener('click',go);
};

/* ════ 图A · 百 tick 分段条带 ════
   ballot tally 的单行队列 + tick donut 的 ladder 分段：
   100 根 tick，前 68 根上墨（公开解答）、中 21 根中灰（私下解答）、
   后 11 根淡灰（仍待解）。三段标签分别锚定首/中/尾。 */
(()=>{
const SEG=[['公开解答',68,INK],['私下',21,'#8F8E88'],['待解',11,'#C6C5BF']];
obsReveal('strip',s=>{
  const base=46,X0=14,PX=3.72;
  el(s,'line',{x1:X0,y1:base,x2:X0+100*PX,y2:base,stroke:GRID,'stroke-width':.8,class:'fade'});
  let k0=0;
  SEG.forEach(([name,v,shade],si)=>{
    for(let k=0;k<v;k++){
      const idx=k0+k,x=X0+idx*PX+PX/2;
      const h=12+rnd(idx+1,si+2)*7;
      el(s,'line',{x1:x,y1:base,x2:x,y2:base-h,stroke:shade,
        'stroke-width':si===2?.7:.9,opacity:si===2?.9:.6+rnd(idx+3,si+5)*.4,
        class:'fade',style:`animation-delay:${idx*.008}s`});
      if(idx%10===0)el(s,'circle',{cx:x,cy:base+4.5,r:.8,fill:'#C6C5BF',
        class:'fade',style:`animation-delay:${idx*.008}s`});
    }
    // 三段标签分别锚定：首段左对齐、中段居中、末段右对齐，避免相互挤压
    const anchors=[[X0,'start'],[X0+(k0+v/2)*PX,'middle'],[X0+100*PX,'end']];
    const [lx,anchor]=anchors[si];
    const lab=txt(s,{x:lx,y:base+18,'font-size':8,'font-weight':800,
      fill:shade==='#C6C5BF'?'#8F8E88':shade,'text-anchor':anchor,'letter-spacing':'.04em',
      class:'fade',style:`animation-delay:${.5+si*.12}s`},`${name} · ${v}`);
    tip(lab,`${name} —— 占全部问题的 ${v}%`);
    k0+=v;
  });
  txt(s,{x:200,y:78,'font-size':7,'font-weight':600,fill:'#B0AFA9','text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:.9s'},
    '68 + 21 + 11 = 100 · 每十格一个圆点');
});
})();

/* ════ 图B · L3 barcode lollipop ════
   结构照搬 lupi-gallery "barcode lollipop"：90 根发丝日历 +
   逐日 lollipop（周五空心头），top-3 标数保持 ≥6 天间距。
   发布周（三段各 6 天）在日历带上以密纹发丝标出——
   密度本身就是 Mono 的合法材质，没有新颜色。 */
(()=>{
const N=90;
const RELEASE=[[18,23],[47,52],[76,81]];               // 三个发布周
const inRel=d=>RELEASE.some(([a,b])=>d>=a&&d<=b);
const val=d=>{
  const base=28+10*Math.sin(d/8.5)+rnd(d+1,5)*14;
  return inRel(d)?base*(2.6+rnd(d+2,7)*1.1):base;
};
obsReveal('barcode',s=>{
  // 发布周：日历带背后加密发丝
  RELEASE.forEach(([a,b],ri)=>{
    for(let d=a;d<=b;d++){
      const x=18+d*4.05;
      for(let m=0;m<3;m++)
        el(s,'line',{x1:x-1.2+m*1.2,y1:12,x2:x-1.2+m*1.2,y2:252,stroke:'#DCDAD2',
          'stroke-width':.5,class:'fade',style:`animation-delay:${ri*.1}s`});
    }
  });
  // 日历条码：一根发丝 = 一个工作日
  for(let d=0;d<N;d++){
    const x=18+d*4.05;
    el(s,'line',{x1:x,y1:12,x2:x,y2:252,stroke:GRID,'stroke-width':.7,
      class:'fade',style:`animation-delay:${d*.004}s`});
  }
  const vs=Array.from({length:N},(_,d)=>val(d));
  const top3=[];
  for(const d of [...vs.keys()].sort((a,b)=>vs[b]-vs[a])){
    if(top3.every(t=>Math.abs(t-d)>=6))top3.push(d);
    if(top3.length===3)break;
  }
  for(let d=0;d<N;d++){
    const x=18+d*4.05,v=vs[d],y=246-v*1.12;
    const friday=d%5===4;
    const stemEnd=Math.min(250,y+14+rnd(d+1,9)*26);
    el(s,'line',{x1:x,y1:y,x2:x,y2:stemEnd,stroke:INK,'stroke-width':1.1,
      class:'fade',style:`animation-delay:${.3+d*.008}s`});
    const big=top3.includes(d);
    const dot=el(s,'circle',{cx:x,cy:y,r:big?4.4:2.4,
      fill:friday?PAPER:INK,stroke:INK,'stroke-width':friday?1.2:0,
      class:'pop',style:`animation-delay:${.3+d*.008}s`});
    tip(dot,`第 ${d+1} 个工作日 —— ${Math.round(v)} 个问题`);
    if(big)txt(s,{x,y:y-10,'font-size':9,'font-weight':800,fill:INK,'text-anchor':'middle',
      style:`paint-order:stroke;stroke:${PAPER};stroke-width:3px;animation-delay:${.9+d*.004}s`,
      class:'fade'},Math.round(v));
  }
  [[0,'8月'],[30,'10月'],[60,'1月'],[89,'3月']].forEach(([d,m])=>
    txt(s,{x:18+d*4.05,y:272,'font-size':8,'font-weight':600,fill:MUTED,
      'letter-spacing':'.08em',class:'fade'},m));
  txt(s,{x:200,y:292,'font-size':7.5,'font-weight':600,fill:'#B0AFA9','text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:1.1s'},
    '密纹带 = 发布周 · 一根 = 一个工作日');
});
})();

