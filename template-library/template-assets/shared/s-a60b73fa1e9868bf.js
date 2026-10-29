
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
const BG='#F0EFEB',TXT='#58402E',MUT='rgba(88,64,46,.60)',LAB='rgba(88,64,46,.72)',
      FAINT='rgba(88,64,46,.40)',QUIET='rgba(88,64,46,.15)',GRID='rgba(88,64,46,.16)';
const DATA='#43593B',DATA2='#77835A',HERO='#D4A017',FAINTDATA='#ACAD79';
const CAT4=['#43593B','#77835A','#ACAD79','#F2D17E'];

/* ════ 图A · F5 tick rows（开销）════
   一格 = ¥2,000。琥珀只给最大项。加墨 1.6 / 地板 .85。 */
(()=>{
const D=[['餐食',16],['住宿',13],['书和唱片',7],['交通',5],['杂物',3]];
obsReveal('spend',s=>{
  const y0=i=>26+i*30,X0=64,PX=8.4;
  D.forEach(([name,v],i)=>{
    const y=y0(i),hero=i===0;
    txt(s,{x:56,y:y+3,'font-size':8,'font-weight':700,fill:MUT,'text-anchor':'end',
      class:'fade',style:`animation-delay:${i*.08}s`},name);
    el(s,'line',{x1:X0,y1:y+7,x2:X0+17*PX,y2:y+7,stroke:GRID,'stroke-width':.7,
      class:'fade',style:`animation-delay:${i*.08}s`});
    for(let k=0;k<v;k++){
      const x=X0+k*PX+PX/2,h=8+rnd(k+1,i+2)*5;
      el(s,'line',{x1:x,y1:y+7,x2:x,y2:y+7-h,stroke:hero?HERO:DATA,'stroke-width':1.6,
        opacity:.85+rnd(k+3,i+5)*.15,class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
      if(k%5===4)el(s,'circle',{cx:x,cy:y+10.5,r:.9,fill:FAINTDATA,
        class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
    }
    const lab=txt(s,{x:X0+v*PX+8,y:y+3,'font-size':9.5,'font-weight':800,
      fill:hero?HERO:DATA,class:'fade',style:`animation-delay:${.4+i*.08}s`},
      '¥'+(v*2/10).toFixed(1)+'万');
    tip(lab,`${name} —— ¥${(v*2000).toLocaleString()}`);
  });
  txt(s,{x:130,y:172,'font-size':7,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:.9s'},
    '一格 = ¥2,000 · 每五格一个圆点');
});
})();

/* ════ 图B · F1 rung bars（咖啡馆访问）════
   一档 = 一次到访。琥珀给去得最多的那家。 */
(()=>{
const D=[['FUGLEN',5],['蓝瓶',2],['琥珀咖啡',2],['便利店',7]];
obsReveal('cafes',s=>{
  const x0=i=>44+i*60,base=142,step=9.5,HW=15;
  D.forEach(([name,v],i)=>{
    const x=x0(i),hero=i===3;
    for(let k=0;k<v;k++){
      const y=base-k*step,w=HW-1.5+rnd(k+1,i+2)*3;
      el(s,'line',{x1:x-w,y1:y,x2:x+w,y2:y,stroke:hero?HERO:DATA,'stroke-width':1.8,
        opacity:.85+rnd(k+2,i+4)*.15,class:'fade',style:`animation-delay:${i*.08+k*.03}s`});
    }
    const topY=base-(v-1)*step;
    const num=txt(s,{x,y:topY-8,'font-size':10.5,'font-weight':800,
      fill:hero?HERO:DATA,'text-anchor':'middle',
      class:'fade',style:`animation-delay:${.4+i*.08}s`},v);
    tip(num,`${name} —— ${v} 次`);
    txt(s,{x,y:base+14,'font-size':7,'font-weight':700,fill:MUT,'text-anchor':'middle',
      'letter-spacing':'.04em',class:'fade',style:`animation-delay:${i*.08}s`},name);
  });
  el(s,'line',{x1:16,y1:base+4,x2:244,y2:base+4,stroke:GRID,'stroke-width':.8,class:'fade'});
  txt(s,{x:130,y:180,'font-size':7,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:.9s'},
    '一档 = 一次到访 · 便利店赢了');
});
})();

/* ════ 图C · F4 tick donut（饮品构成）════
   一格 = 一杯，共 23 杯。PALM CAT 分段。加墨 1.8 / 引线 1.3。 */
(()=>{
const D=[['手冲',9,CAT4[0]],['拿铁',6,CAT4[1]],['罐装',5,CAT4[2]],['抹茶',3,'#D4A017']];
obsReveal('drinks',s=>{
  const cx=150,cy=100,R0=46,TOT=23;
  let k0=0;
  D.forEach(([name,v,shade],si)=>{
    for(let k=0;k<v;k++){
      const idx=k0+k,a=idx/TOT*360-90;
      const len=9+rnd(idx+1,si+2)*6;
      const [x1,y1]=pol(cx,cy,R0,a),[x2,y2]=pol(cx,cy,R0+len,a);
      el(s,'line',{x1,y1,x2,y2,stroke:shade,'stroke-width':1.8,opacity:.9,
        class:'fade',style:`animation-delay:${idx*.03}s`});
    }
    const mid=(k0+v/2)/TOT*360-90,[lx,ly]=pol(cx,cy,R0+34,mid),[gx,gy]=pol(cx,cy,R0+19,mid);
    el(s,'line',{x1:gx,y1:gy,x2:lx,y2:ly,stroke:FAINTDATA,'stroke-width':1.3,
      'stroke-dasharray':'1 3',class:'fade',style:`animation-delay:${.6+si*.1}s`});
    const anchor=Math.cos(mid*D2R)>0.3?'start':Math.cos(mid*D2R)<-0.3?'end':'middle';
    const lab=txt(s,{x:lx,y:ly+3,'font-size':8,'font-weight':800,fill:shade,'text-anchor':anchor,
      'letter-spacing':'.04em',style:`paint-order:stroke;stroke:${BG};stroke-width:3px;animation-delay:${.65+si*.1}s`,
      class:'fade'},`${name} · ${v}`);
    tip(lab,`${name} —— ${v} 杯`);
    k0+=v;
  });
  txt(s,{x:cx,y:cy-1,'font-size':19,'font-weight':800,fill:DATA,'text-anchor':'middle',
    class:'fade',style:'animation-delay:.9s'},'23');
  txt(s,{x:cx,y:cy+13,'font-size':7,'font-weight':600,fill:MUT,'text-anchor':'middle',
    'letter-spacing':'.08em',class:'fade',style:'animation-delay:.9s'},'杯 · 五天');
  txt(s,{x:150,y:202,'font-size':7,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:1.1s'},
    '一格 = 一杯 · 顺时针从十二点读');
});
})();

/* ════ 图D · F1 rung bars（餐馆类型）════
   一档 = 一顿。琥珀给次数最多的类型。 */
(()=>{
const D=[['拉面',4],['居酒屋',3],['早餐店',3],['咖喱',2],['寿司',2],['其他',3]];
obsReveal('food',s=>{
  const x0=i=>36+i*46,base=124,step=13,HW=12;
  D.forEach(([name,v],i)=>{
    const x=x0(i),hero=i===0;
    for(let k=0;k<v;k++){
      const y=base-k*step,w=HW-1.5+rnd(k+1,i+2)*3;
      el(s,'line',{x1:x-w,y1:y,x2:x+w,y2:y,stroke:hero?HERO:DATA,'stroke-width':1.8,
        opacity:.85+rnd(k+2,i+4)*.15,class:'fade',style:`animation-delay:${i*.08+k*.04}s`});
    }
    const topY=base-(v-1)*step;
    const num=txt(s,{x,y:topY-8,'font-size':10,'font-weight':800,
      fill:hero?HERO:DATA,'text-anchor':'middle',
      class:'fade',style:`animation-delay:${.4+i*.08}s`},v);
    tip(num,`${name} —— ${v} 顿`);
    txt(s,{x,y:base+14,'font-size':7.5,'font-weight':700,fill:MUT,'text-anchor':'middle',
      class:'fade',style:`animation-delay:${i*.08}s`},name);
  });
  el(s,'line',{x1:12,y1:base+4,x2:288,y2:base+4,stroke:GRID,'stroke-width':.8,class:'fade'});
  txt(s,{x:150,y:160,'font-size':7,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:.9s'},
    '一档 = 一顿 · 拉面 4 顿，没有遗憾');
});
})();

