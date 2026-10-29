
/* ── mono-tokens 内联（色板 / 几何 / 工具函数与正本一致）── */
const BG='#F7F2EB',TXT='#081F5C',MUT='rgba(8,31,92,.60)',LAB='rgba(8,31,92,.72)',FAINT='rgba(8,31,92,.32)';
const FLOOR='rgba(8,31,92,.24)',QUIET='rgba(8,31,92,.15)',GRID='rgba(8,31,92,.16)';
const DATA='#334EAC',DATA2='#7096D1',HERO='#081F5C',FAINTDATA='#BAD6EB';
const CAT4=['#081F5C','#334EAC','#7096D1','#BAD6EB'],HEAT=['#334EAC','#7096D1','#BAD6EB'];
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

/* ════ 图A · F2 hairline line ════
   结构照搬 basics-gallery "hairline line"：barcode 日历地板 +
   发丝折线 + 逐日圆点（周末空心），峰值两点放大标数。 */
(()=>{
const N=31;
const val=d=>{
  const spike=(d===5||d===6)?38:(d===19?30:0);        // 两次发布日
  return 24+10*Math.sin(d/5.2)+rnd(d+1,5)*10+spike;
};
obsReveal('dayline',s=>{
  const x=d=>26+d*11.4,base=254,map=v=>base-v*2.1;
  for(let d=0;d<N;d++)
    el(s,'line',{x1:x(d),y1:base,x2:x(d),y2:base-7,stroke:FLOOR,'stroke-width':.6,
      class:'fade',style:`animation-delay:${d*.008}s`});
  el(s,'line',{x1:20,y1:base,x2:380,y2:base,stroke:GRID,'stroke-width':.8,class:'fade'});
  const vs=Array.from({length:N},(_,d)=>val(d));
  const top=[];
  for(const d of [...vs.keys()].sort((a,b)=>vs[b]-vs[a])){
    if(top.every(t=>Math.abs(t-d)>=5))top.push(d);
    if(top.length===2)break;
  }
  const pts=vs.map((v,d)=>`${x(d)} ${map(v)}`).join(' L ');
  el(s,'path',{d:'M'+pts,fill:'none',stroke:DATA,'stroke-width':2.2,pathLength:1,
    class:'draw',style:'animation-duration:1.2s'});
  vs.forEach((v,d)=>{
    const weekend=d%7===3||d%7===4,big=top.includes(d);
    const dot=el(s,'circle',{cx:x(d),cy:map(v),r:big?4.2:2.1,
      fill:weekend?BG:(big?HERO:DATA),stroke:big?HERO:DATA,'stroke-width':weekend?1.4:0,
      class:'pop',style:`animation-delay:${.2+d*.03}s`});
    tip(dot,`7 月 ${d+1} 日 —— ${Math.round(v)} 次注册`);
    if(big)txt(s,{x:x(d),y:map(v)-11,'font-size':9.5,'font-weight':800,fill:TXT,'text-anchor':'middle',
      style:`paint-order:stroke;stroke:${BG};stroke-width:3px;animation-delay:${1+d*.01}s`,
      class:'fade'},Math.round(v));
  });
  [[0,'7月1日'],[14,'7月15日'],[30,'7月31日']].forEach(([d,m])=>
    txt(s,{x:x(d),y:base+18,'font-size':7.5,'font-weight':600,fill:MUT,'text-anchor':'middle',
      'letter-spacing':'.06em',class:'fade'},m));
  txt(s,{x:200,y:294,'font-size':7.5,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:1.1s'},
    '一点 = 一天 · 空心 = 周末 · 标数 = 发布日');
});
})();

/* ════ 图B · F10 dot heat ════
   结构照搬 basics-gallery "dot heat"：7×12 网格，点面积 = 工单量，
   静默格留一粒极小点，最热格虚线圈标数。 */
(()=>{
const DAY=['周一','周二','周三','周四','周五','周六','周日'];
obsReveal('dotheat',s=>{
  const x0=j=>64+j*27,y0=i=>50+i*30;
  let max=0,mi=0,mj=0;
  const v=(i,j)=>{
    const day=i<5?(i===1?1.25:1):.32;
    const hour=Math.exp(-((j-3.4)**2)/6)+.6*Math.exp(-((j-8.6)**2)/5);
    return Math.round(day*hour*20*(0.6+rnd(i*12+j+1,j+3)*.8));
  };
  for(let i=0;i<7;i++)for(let j=0;j<12;j++){const t=v(i,j);if(t>max){max=t;mi=i;mj=j}}
  for(let i=0;i<7;i++){
    txt(s,{x:50,y:y0(i)+3,'font-size':8,'font-weight':700,fill:LAB,'text-anchor':'end',
      'letter-spacing':'.04em',class:'fade',style:`animation-delay:${i*.05}s`},DAY[i]);
    for(let j=0;j<12;j++){
      const t=v(i,j),x=x0(j),y=y0(i);
      if(!t){el(s,'circle',{cx:x,cy:y,r:.8,fill:QUIET,
        class:'pop',style:`animation-delay:${i*.05+j*.015}s`});continue}
      const hero=i===mi&&j===mj;
      const dot=el(s,'circle',{cx:x,cy:y,r:1.2+Math.sqrt(t)*2.1,
        fill:t>max*.66?HEAT[0]:t>max*.33?HEAT[1]:HEAT[2],
        class:'pop',style:`animation-delay:${i*.05+j*.015}s`});
      tip(dot,`${DAY[i]} ${8+j}:00 —— ${t} 张工单`);
      if(hero)el(s,'circle',{cx:x,cy:y,r:1.2+Math.sqrt(t)*2.1+3.4,fill:'none',
        stroke:TXT,'stroke-width':1,'stroke-dasharray':'2 3',
        class:'fade',style:'animation-delay:1s'});
    }
  }
  for(let j=0;j<12;j+=2)
    txt(s,{x:x0(j),y:y0(6)+26,'font-size':7,'font-weight':600,fill:FAINT,'text-anchor':'middle',
      class:'fade',style:`animation-delay:${j*.02}s`},(8+j)+':00');
  txt(s,{x:200,y:296,'font-size':7.5,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:1.1s'},
    `点面积 = 工单量 · 虚线圈 = 峰值 ${max} 张 · 极小点 = 安静时段`);
});
})();

/* ════ 图C · F4 tick donut ════
   结构照搬 basics-gallery "tick donut"：1 tick = 1%，
   四段来源用灰阶 ladder 分段。 */
(()=>{
const D=[['自然',37,CAT4[0]],['投放',28,CAT4[1]],['引荐',21,CAT4[2]],['社交',14,CAT4[3]]];
obsReveal('donut',s=>{
  const cx=170,cy=140,R0=58;
  let k0=0;
  D.forEach(([name,v,shade],si)=>{
    for(let k=0;k<v;k++){
      const idx=k0+k,a=idx*3.6-90;
      const len=9+rnd(idx+1,si+2)*5.5;
      const [x1,y1]=pol(cx,cy,R0,a),[x2,y2]=pol(cx,cy,R0+len,a);
      el(s,'line',{x1,y1,x2,y2,stroke:shade,'stroke-width':1.9,
        class:'fade',style:`animation-delay:${idx*.012}s`});
      if(idx%10===0){
        const [dx,dy]=pol(cx,cy,R0-5,a);
        el(s,'circle',{cx:dx,cy:dy,r:.8,fill:FAINT,
          class:'fade',style:`animation-delay:${idx*.012}s`});
      }
    }
    const mid=(k0+v/2)*3.6-90,[lx,ly]=pol(cx,cy,R0+34,mid),[gx,gy]=pol(cx,cy,R0+18,mid);
    el(s,'line',{x1:gx,y1:gy,x2:lx,y2:ly,stroke:FAINT,'stroke-width':.7,
      'stroke-dasharray':'1 3',class:'fade',style:`animation-delay:${.6+si*.1}s`});
    const anchor=Math.cos(mid*D2R)>0.3?'start':Math.cos(mid*D2R)<-0.3?'end':'middle';
    const lab=txt(s,{x:lx,y:ly+3,'font-size':8.5,'font-weight':800,fill:shade,'text-anchor':anchor,
      'letter-spacing':'.04em',style:`paint-order:stroke;stroke:${BG};stroke-width:3px;animation-delay:${.65+si*.1}s`,
      class:'fade'},`${name} · ${v}`);
    tip(lab,`${name}流量 —— 占 ${v}%`);
    k0+=v;
  });
  txt(s,{x:cx,y:cy-2,'font-size':20,'font-weight':800,fill:TXT,'text-anchor':'middle',
    class:'fade',style:'animation-delay:.9s'},'100');
  txt(s,{x:cx,y:cy+13,'font-size':7.5,'font-weight':600,fill:MUT,'text-anchor':'middle',
    'letter-spacing':'.08em',class:'fade',style:'animation-delay:.9s'},'格 · 一格 = 1%');
  txt(s,{x:170,y:288,'font-size':7.5,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:1.1s'},
    '每十格一个圆点 · 顺时针读');
});
})();

/* ════ 图D · F5 tick rows（迷你版）════
   结构照搬 basics-gallery "tick rows"：1 tick = 1 张工单。 */
(()=>{
const D=[['编辑器',31],['计费',24],['导入',17],['API',11],['其他',6]];
obsReveal('rows',s=>{
  const y0=i=>28+i*34,X0=72,PX=4.6;
  D.forEach(([name,v],i)=>{
    const y=y0(i);
    txt(s,{x:64,y:y+3,'font-size':7.5,'font-weight':700,fill:LAB,'text-anchor':'end',
      'letter-spacing':'.04em',class:'fade',style:`animation-delay:${i*.08}s`},name);
    el(s,'line',{x1:X0,y1:y+8,x2:X0+34*PX,y2:y+8,stroke:GRID,'stroke-width':.6,
      class:'fade',style:`animation-delay:${i*.08}s`});
    for(let k=0;k<v;k++){
      const x=X0+k*PX+PX/2,h=7+rnd(k+1,i+2)*5;
      el(s,'line',{x1:x,y1:y+8,x2:x,y2:y+8-h,stroke:DATA,'stroke-width':1.6,
        opacity:.85+rnd(k+3,i+5)*.15,class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
      if(k%5===4)el(s,'circle',{cx:x,cy:y+11.5,r:.7,fill:FAINT,
        class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
    }
    const lab=txt(s,{x:X0+v*PX+8,y:y+3,'font-size':9.5,'font-weight':800,fill:TXT,
      class:'fade',style:`animation-delay:${.4+i*.08}s`},v);
    tip(lab,`${name} —— ${v} 张工单`);
  });
  txt(s,{x:130,y:186,'font-size':7,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.08em',class:'fade',style:'animation-delay:.9s'},
    '一格 = 一张工单 · 每五格一个圆点');
});
})();

