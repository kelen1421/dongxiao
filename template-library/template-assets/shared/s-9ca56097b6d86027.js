
/* ── mono-tokens 内联（几何/工具函数与正本一致）── */
const NS='http://www.w3.org/2000/svg';
const el=(p,t,a)=>{const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);p.appendChild(n);return n};
const txt=(p,a,s)=>{const n=el(p,'text',a);n.textContent=s;return n};
const tip=(n,s)=>{const t=document.createElementNS(NS,'title');t.textContent=s;n.appendChild(t)};
const rnd=(i,k)=>Math.abs(((i*73856093)^(k*19349663))%1000)/1000;
const D2R=Math.PI/180;
const pol=(cx,cy,r,deg)=>[cx+r*Math.cos(deg*D2R),cy+r*Math.sin(deg*D2R)];
const sect=(cx,cy,r0,r1,a0,a1)=>{
  const big=a1-a0>180?1:0;
  const [xa,ya]=pol(cx,cy,r1,a0),[xb,yb]=pol(cx,cy,r1,a1);
  const [xc,yc]=pol(cx,cy,r0,a1),[xd,yd]=pol(cx,cy,r0,a0);
  return `M${xa} ${ya} A${r1} ${r1} 0 ${big} 1 ${xb} ${yb} L${xc} ${yc} A${r0} ${r0} 0 ${big} 0 ${xd} ${yd} Z`;
};
const obsReveal=(id,fn)=>{
  const n=document.getElementById(id); if(!n)return;
  const go=()=>{n.innerHTML='';fn(n)};
  const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){go();io.disconnect()}},{threshold:.3});
  io.observe(n); n.style.cursor='pointer'; n.addEventListener('click',go);
};

/* ── WIRE preset（color-presets.js 原值）── */
const W={BG:'#F0F0EE',TXT:'#1F1E1C',DATA:'#22211F',DATA2:'#8F8E86',HERO:'#F5572F',
  FAINTDATA:'#C0BFB7',MUT:'rgba(31,30,28,.60)',FAINT:'rgba(31,30,28,.32)',
  GRID:'rgba(31,30,28,.16)'};

/* ════ 图A · F1 rung bars（三面板小倍数）════
   结构照搬 basics-gallery "rung bars"：柱身 = 一格格横档，可数。
   每面板 3 柱 = 2024/2025/2026。橙 = 2026（每面板唯一主角）。 */
(()=>{
const PANELS=[
  {id:'p0',unit:100,years:[['2024',6],['2025',18],['2026',35]]},   // 访客 ×100
  {id:'p1',unit:100,years:[['2024',3],['2025',13],['2026',29]]},   // 注册 ×100
  {id:'p2',unit:400,years:[['2024',4],['2025',14],['2026',31]]},   // 浏览量 ×400
];
PANELS.forEach(({id,unit,years})=>{
  obsReveal(id,s=>{
    const x0=i=>44+i*58,base=152,step=3.6,HW=13;
    years.forEach(([yr,v],i)=>{
      const x=x0(i),is26=yr==='2026';
      for(let k=0;k<v;k++){
        const y=base-k*step,w=HW-1.5+rnd(k+1,i+2)*3;
        el(s,'line',{x1:x-w,y1:y,x2:x+w,y2:y,stroke:is26?W.HERO:W.DATA,'stroke-width':1,
          opacity:(is26?.75:.5)+rnd(k+2,i+4)*.25,class:'fade',
          style:`animation-delay:${i*.08+k*.012}s`});
        if(k%5===4)el(s,'circle',{cx:x+HW+4,cy:y,r:.8,fill:W.FAINTDATA,
          class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
      }
      const topY=base-(v-1)*step;
      const num=txt(s,{x,y:topY-8,'font-size':10,'font-weight':800,
        fill:is26?W.HERO:W.DATA,'text-anchor':'middle',
        class:'fade',style:`animation-delay:${.4+i*.08}s`},(v*unit>=1000?(v*unit/1000)+'k':v*unit));
      tip(num,`${yr} 年 —— ${v*unit}`);
      txt(s,{x,y:base+16,'font-size':7.5,'font-weight':700,fill:W.MUT,'text-anchor':'middle',
        'letter-spacing':'.08em',class:'fade',style:`animation-delay:${i*.08}s`},yr);
    });
    el(s,'line',{x1:14,y1:base+4,x2:186,y2:base+4,stroke:W.GRID,'stroke-width':.8,class:'fade'});
    txt(s,{x:100,y:184,'font-size':7,'font-weight':600,fill:W.FAINT,'text-anchor':'middle',
      'letter-spacing':'.08em',class:'fade',style:'animation-delay:.9s'},
      '一档 = '+unit);
  });
});
})();

/* ════ 图B · L10 radial patchwork ════
   结构照搬 lupi-gallery "radial patchwork"：每瓦 = 一次上线/发帖，
   角度 = 当天时刻，半径 = 声量，透明度叠加出扎堆密度——
   这是「一律实心」铁律唯一的例外，透明度本身就是数据。
   主簇在上班前与下班后，午后只有零星几次（周末）——有正职的独立开发者作息。
   底注不画在图内：12 点刻度就在那个位置，正本 gallery 两者相撞。
   HERO 只框 3 次冲上 HN 首页的发布——本图橙色唯一的窄角色。 */
(()=>{
const CX=200,CY=168,N=40;
obsReveal('patchwork',s=>{
  // 24 小时刻度环
  for(let h=0;h<96;h++){
    const a=-90+h*3.75,[x1,y1]=pol(CX,CY,140,a),[x2,y2]=pol(CX,CY,h%4===0?146:143,a);
    el(s,'line',{x1,y1,x2,y2,stroke:W.GRID,'stroke-width':h%4===0?1:.5,
      class:'fade',style:`animation-delay:${h*.006}s`});
  }
  [0,6,12,18].forEach(h=>{
    const [x,y]=pol(CX,CY,157,-90+h*15);
    txt(s,{x,y:y+3,'font-size':8,'font-weight':700,fill:W.MUT,'text-anchor':'middle',
      class:'fade'},String(h).padStart(2,'0'));
  });
  // 每瓦一次「上线/发帖」：早班（上班前）与夜班（下班后）两簇
  const wedges=[];
  for(let i=0;i<N;i++){
    const peak=i%13===5?14:(rnd(i+1,2)>.5?7:22);
    const hour=(peak+(rnd(i+1,3)-.5)*6+24)%24;
    const a0=-90+hour*15,sw=10+rnd(i+1,4)*34;
    const r1=34+rnd(i+1,5)*100;
    wedges.push([a0,sw,r1,hour,i]);
  }
  wedges.forEach(([a0,sw,r1,hour,i])=>{
    const col=hour<8?W.FAINTDATA:hour<19?W.DATA2:W.DATA;
    const w=el(s,'path',{d:sect(CX,CY,16,r1,a0,a0+sw),fill:col,
      'fill-opacity':.17+rnd(i+1,6)*.15,class:'fade',
      style:`animation-delay:${.2+i*.022}s`});
    tip(w,`第 ${i+1} 次上线/发帖 — ${String(Math.floor(hour)).padStart(2,'0')}:${String(Math.floor(hour%1*60)).padStart(2,'0')}`);
  });
  // 三次冲上 Hacker News 首页的发布
  [0,8,26].forEach((i,k)=>{
    const [a0,sw,r1]=wedges[i];
    const w=el(s,'path',{d:sect(CX,CY,16,r1,a0,a0+sw),fill:'none',
      stroke:W.HERO,'stroke-width':1.5,class:'fade',style:`animation-delay:${1.2+k*.15}s`});
    tip(w,`第 ${i+1} 次上线/发帖 — 冲上了 Hacker News 首页`);
  });
  el(s,'circle',{cx:CX,cy:CY,r:3,fill:W.DATA,class:'pop',style:'animation-delay:1.3s'});
});
})();

/* ════ 图C · F5 tick rows ════
   结构照搬 basics-gallery "tick rows"。1 tick = 10 次访问。
   HERO 只给赢家渠道那一行。 */
(()=>{
const D=[['TWITTER / X',77],['GOOGLE',34],['邮件通讯',22],['GITHUB',13],['其他',9]];
obsReveal('rows',s=>{
  const y0=i=>34+i*36,X0=76,PX=1.9;
  D.forEach(([name,v],i)=>{
    const y=y0(i),hero=i===0;
    txt(s,{x:68,y:y+3,'font-size':7.5,'font-weight':700,fill:W.MUT,'text-anchor':'end',
      'letter-spacing':'.04em',class:'fade',style:`animation-delay:${i*.08}s`},name);
    el(s,'line',{x1:X0,y1:y+8,x2:X0+80*PX,y2:y+8,stroke:W.GRID,'stroke-width':.6,
      class:'fade',style:`animation-delay:${i*.08}s`});
    for(let k=0;k<v;k++){
      const x=X0+k*PX+PX/2,h=7+rnd(k+1,i+2)*5;
      el(s,'line',{x1:x,y1:y+8,x2:x,y2:y+8-h,stroke:hero?W.HERO:W.DATA,'stroke-width':.9,
        opacity:.55+rnd(k+3,i+5)*.45,class:'fade',style:`animation-delay:${i*.08+k*.008}s`});
      if(k%10===9)el(s,'circle',{cx:x,cy:y+11.5,r:.7,fill:W.FAINTDATA,
        class:'fade',style:`animation-delay:${i*.08+k*.008}s`});
    }
    const lab=txt(s,{x:X0+v*PX+8,y:y+3,'font-size':9.5,'font-weight':800,
      fill:hero?W.HERO:W.DATA,class:'fade',style:`animation-delay:${.4+i*.08}s`},
      (v*10>=1000?(v*10/1000).toFixed(1)+'k':v*10));
    tip(lab,`${name} —— ${v*10} 次访问`);
  });
  txt(s,{x:134,y:204,'font-size':7,'font-weight':600,fill:W.FAINT,'text-anchor':'middle',
    'letter-spacing':'.08em',class:'fade',style:'animation-delay:.9s'},
    '一格 = 10 次访问 · 每一百次一个圆点');
});
})();

/* ════ 图D · F11 tick gauge ════
   结构照搬 basics-gallery "tick gauge"：一格 = 每 100 次访问中的 1 次。
   9% 转化上墨，HERO 只给尖端珠 + 大数。 */
(()=>{
const GOAL=9;
obsReveal('gauge',s=>{
  const cx=100,cy=128,R0=62,A0=-195,SW=210;
  for(let k=0;k<100;k++){
    const a=A0+k/100*SW,inked=k<GOAL;
    const len=inked?11+rnd(k+1,3)*5:4+rnd(k+1,7)*2;
    const [x1,y1]=pol(cx,cy,R0,a),[x2,y2]=pol(cx,cy,R0+len,a);
    el(s,'line',{x1,y1,x2,y2,stroke:inked?W.DATA:W.FAINTDATA,'stroke-width':inked?1:.6,
      class:'fade',style:`animation-delay:${k*.012}s`});
  }
  [25,50,75,100].forEach(m=>{
    const a=A0+m/100*SW,[dx,dy]=pol(cx,cy,R0-6,a),[tx2,ty2]=pol(cx,cy,R0-16,a);
    el(s,'circle',{cx:dx,cy:dy,r:.9,fill:W.DATA2,class:'fade',style:'animation-delay:.8s'});
    txt(s,{x:tx2,y:ty2+2.5,'font-size':6,'font-weight':600,fill:W.FAINT,'text-anchor':'middle',
      class:'fade',style:'animation-delay:.85s'},m);
  });
  const aT=A0+GOAL/100*SW,[ex,ey]=pol(cx,cy,R0+17,aT);
  el(s,'circle',{cx:ex,cy:ey,r:2.4,fill:W.HERO,class:'pop',style:'animation-delay:1.1s'});
  const num=txt(s,{x:cx,y:cy-2,'font-size':26,'font-weight':800,fill:W.HERO,'text-anchor':'middle',
    class:'fade',style:'animation-delay:1s'},'9%');
  tip(num,'每 100 位访客中有 9 位完成注册');
  txt(s,{x:cx,y:cy+13,'font-size':7,'font-weight':600,fill:W.MUT,'text-anchor':'middle',
    'letter-spacing':'.08em',class:'fade',style:'animation-delay:1.05s'},'转化率');
  txt(s,{x:100,y:202,'font-size':7,'font-weight':600,fill:W.FAINT,'text-anchor':'middle',
    'letter-spacing':'.08em',class:'fade',style:'animation-delay:1.2s'},
    '一格 = 每 100 次访问中的 1 次 · 上墨 = 已转化');
});
})();

