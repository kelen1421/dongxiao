
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

/* ── PORCELAIN preset（color-presets.js 原值）── */
const P={BG:'#F7F2EB',TXT:'#081F5C',DATA:'#334EAC',DATA2:'#7096D1',HERO:'#081F5C',
  FAINTDATA:'#BAD6EB',MUT:'rgba(8,31,92,.60)',FAINT:'rgba(8,31,92,.32)',
  GRID:'rgba(8,31,92,.16)',CAT4:['#081F5C','#334EAC','#7096D1','#BAD6EB']};

/* ════ 图A · L15 ballot tally ════
   结构照搬 lupi-gallery "ballot tally"：每行 100 根发丝 tick，
   选中的上墨。彩色加墨：picked 线宽 .9→1.6，未选 .55→1.0。 */
(()=>{
const ASK=[['等代码 REVIEW',57],['需求中途膨胀',44],['会议吃掉整周',38],['CI 流水线抽风',21]];
obsReveal('tally',s=>{
  ASK.forEach(([name,v],i)=>{
    const base=64+i*58;
    txt(s,{x:24,y:base-26,'font-size':8,'font-weight':700,fill:P.MUT,
      'letter-spacing':'.06em',class:'fade',style:`animation-delay:${i*.1}s`},name);
    el(s,'line',{x1:24,y1:base,x2:376,y2:base,stroke:P.GRID,'stroke-width':.8,
      class:'fade',style:`animation-delay:${i*.1}s`});
    for(let k=0;k<100;k++){
      const x=24+k*3.5,picked=k<v;
      const h=picked?12+rnd(k+1,i+2)*5:4.5+rnd(k+1,i+5)*2;
      el(s,'line',{x1:x,y1:base,x2:x,y2:base-h,
        stroke:picked?(i===0?P.HERO:P.DATA):P.FAINTDATA,'stroke-width':picked?1.6:1,
        opacity:picked?1:.85,
        class:'fade',style:`animation-delay:${i*.1+k*.006}s`});
      if(k%10===0)el(s,'circle',{cx:x,cy:base+4.5,r:.9,fill:P.FAINTDATA,
        class:'fade',style:`animation-delay:${i*.1+k*.006}s`});
    }
    const lab=txt(s,{x:24+(v-1)*3.5+9,y:base-11,'font-size':11,'font-weight':800,
      fill:i===0?P.HERO:P.DATA,
      style:`paint-order:stroke;stroke:${P.BG};stroke-width:3px;animation-delay:${.5+i*.1}s`,
      class:'fade'},v);
    tip(lab,`100 人中有 ${v} 人选了这一项（可多选）`);
  });
  txt(s,{x:200,y:272,'font-size':7.5,'font-weight':600,fill:P.FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:1.1s'},
    '一格 = 一位受访者 · 每十格一个圆点');
});
})();

/* ════ 图B · L14 hundred field ════
   结构照搬 lupi-gallery "hundred field"：golden-angle 撒布，
   1 点 = 1 人，四簇 = 四种心态，虚线星座线连簇心。
   色阶用 PORCELAIN.CAT4 按份额从深到浅。spoke 线宽 .6→1.1（×1.8）。 */
(()=>{
const SEG=[['从容',38,P.CAT4[0]],['焦虑',34,P.CAT4[1]],['游离',16,P.CAT4[2]],['燃尽',12,P.CAT4[3]]];
const POS=[[128,142],[278,118],[182,254],[320,240]];
obsReveal('field',s=>{
  [[0,1],[0,2],[1,3],[2,3]].forEach(([a,b],k)=>{
    el(s,'line',{x1:POS[a][0],y1:POS[a][1],x2:POS[b][0],y2:POS[b][1],
      stroke:P.GRID,'stroke-width':.8,'stroke-dasharray':'2 5',
      class:'fade',style:`animation-delay:${.9+k*.1}s`});
  });
  SEG.forEach(([name,v,shade],ci)=>{
    const [cx,cy]=POS[ci];
    let edge=0;
    for(let k=0;k<v;k++){
      const a=k*137.508+ci*55;
      const rr=4+Math.sqrt(k)*5.9+rnd(k+1,ci+2)*3;
      edge=Math.max(edge,rr);
      const [x,y]=pol(cx,cy,rr,a);
      if(k%5===0)el(s,'line',{x1:cx,y1:cy,x2:x,y2:y,stroke:P.FAINTDATA,'stroke-width':1.1,
        opacity:.85,class:'fade',style:`animation-delay:${ci*.14+k*.012}s`});
      const dot=el(s,'circle',{cx:x,cy:y,r:1.5+rnd(k+2,ci+3)*1.7,fill:shade,opacity:.9,
        class:'pop',style:`animation-delay:${ci*.14+k*.012}s`});
      tip(dot,`${name} —— 100 人中的 ${v} 人之一`);
    }
    el(s,'circle',{cx,cy,r:2.4,fill:P.HERO,class:'pop',style:`animation-delay:${ci*.14}s`});
    txt(s,{x:cx,y:cy+edge+13,'font-size':8.5,'font-weight':800,fill:P.TXT,'text-anchor':'middle',
      'letter-spacing':'.08em',style:`paint-order:stroke;stroke:${P.BG};stroke-width:3px;animation-delay:${.5+ci*.12}s`,
      class:'fade'},`${name} · ${v}`);
  });
  txt(s,{x:200,y:322,'font-size':7.5,'font-weight':600,fill:P.FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:1.3s'},
    '一点 = 一个人 · 38 + 34 + 16 + 12 = 100');
});
})();

/* ════ 图C · F5 tick rows ════
   结构照搬 basics-gallery "tick rows"：一行 = 一种团队规模的发布队列，
   1 tick = 1 次发布。tick 线宽 .9→1.6，透明度地板 .85。
   HERO 只给一个主角行（人均最高的两人小队）。 */
(()=>{
const D=[['单人',26],['2–3 人',34],['4–6 人',28],['7–10 人',19],['11–20 人',12]];
obsReveal('rows',s=>{
  const y0=i=>44+i*44,X0=104,PX=6.9;
  D.forEach(([name,v],i)=>{
    const y=y0(i),hero=i===1;
    txt(s,{x:94,y:y+3,'font-size':8.5,'font-weight':700,fill:P.MUT,'text-anchor':'end',
      'letter-spacing':'.04em',class:'fade',style:`animation-delay:${i*.08}s`},name);
    el(s,'line',{x1:X0,y1:y+9,x2:X0+36*PX,y2:y+9,stroke:P.GRID,'stroke-width':.8,
      class:'fade',style:`animation-delay:${i*.08}s`});
    for(let k=0;k<v;k++){
      const x=X0+k*PX+PX/2,h=9+rnd(k+1,i+2)*6;
      el(s,'line',{x1:x,y1:y+9,x2:x,y2:y+9-h,stroke:hero?P.HERO:P.DATA,'stroke-width':1.6,
        opacity:.85+rnd(k+3,i+5)*.15,class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
      if(k%5===4)el(s,'circle',{cx:x,cy:y+13,r:.9,fill:P.FAINTDATA,
        class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
    }
    const lab=txt(s,{x:X0+v*PX+10,y:y+4,'font-size':11,'font-weight':800,
      fill:hero?P.HERO:P.DATA,
      class:'fade',style:`animation-delay:${.4+i*.08}s`},v);
    tip(lab,`${name}团队 —— ${v} 次发布`);
  });
  txt(s,{x:200,y:242,'font-size':7.5,'font-weight':600,fill:P.FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:.9s'},
    '一格 = 一次发布 · 每五格一个圆点');
});
})();

