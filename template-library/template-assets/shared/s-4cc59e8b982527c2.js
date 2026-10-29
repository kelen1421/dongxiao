
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

/* ── PORCELAIN 角色 token（basics-porcelain.html 原值）── */
const BG='#F7F2EB',TXT='#081F5C',MUT='rgba(8,31,92,.60)',LAB='rgba(8,31,92,.72)',
      FAINT='rgba(8,31,92,.32)';
const FLOOR='rgba(8,31,92,.24)',QUIET='rgba(8,31,92,.15)',GRID='rgba(8,31,92,.16)';
const DATA='#334EAC',DATA2='#7096D1',HERO='#081F5C',FAINTDATA='#BAD6EB';
const CAT4=['#081F5C','#334EAC','#7096D1','#BAD6EB'];

/* ════ 刊头 · 弧线流程装饰 ════
   纯装饰件：四个流程节点沿基线排开，相邻节点之间发丝弧承接，
   「数据形状 → 报告」一条主弧跨全程。不标数值。 */
(()=>{
const NODE=[['数据形状',40],['图',236],['页',420],['报告',580]];
obsReveal('flow',s=>{
  const OY=178;
  el(s,'line',{x1:16,y1:OY,x2:604,y2:OY,stroke:GRID,'stroke-width':.8,class:'fade'});
  // 嵌套弧：全部从「数据形状」起点扇出（学重制稿），
  // 发丝弧落 图 / 报告，主弧粗线落 页。
  const O=NODE[0][1];
  const arc=(toX,stroke,sw,op,dl)=>{
    const r=(toX-O)/2,ry=Math.min(150,r);   // 椭圆压扁，弧顶不出画布
    el(s,'path',{d:`M${O} ${OY} A${r} ${ry} 0 0 1 ${toX} ${OY}`,fill:'none',
      stroke,'stroke-width':sw,opacity:op,pathLength:1,
      class:'draw',style:`animation-delay:${dl}s;animation-duration:1s`});
  };
  arc(NODE[1][1],FAINTDATA,1.3,.95,.2);
  arc(NODE[3][1],DATA2,1.1,.6,.35);
  arc(NODE[2][1],DATA,3,1,.55);
  NODE.forEach(([name,x],i)=>{
    el(s,'circle',{cx:x,cy:OY,r:i===0||i===3?4:2.6,fill:i===0||i===3?HERO:DATA,
      class:'pop',style:`animation-delay:${.3+i*.12}s`});
    txt(s,{x,y:OY+22,'font-size':9.5,'font-weight':700,fill:i===0||i===3?TXT:MUT,
      'text-anchor':'middle','letter-spacing':'.14em',
      class:'fade',style:`animation-delay:${.4+i*.12}s`},name);
  });
});
})();

/* ════ 图A · F1 rung bars ════
   basics-porcelain.html 正本结构：柱身 = 一格格横档，1 档 = $1k，
   档线 1.8（加墨），每五档一粒点，顶数 TXT。 */
(()=>{
const D=[['FREE',38],['STARTER',27],['PRO',22],['TEAM',16],['SCALE',11],['ENT',7]];
obsReveal('rungs',s=>{
  const x0=i=>56+i*56,base=266,step=5.6,HW=14;
  D.forEach(([name,v],i)=>{
    const x=x0(i);
    for(let k=0;k<v;k++){
      const y=base-k*step,w=HW-1.5+rnd(k+1,i+2)*3;
      el(s,'line',{x1:x-w,y1:y,x2:x+w,y2:y,stroke:DATA,'stroke-width':1.8,
        opacity:.85+rnd(k+2,i+4)*.15,class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
      if(k%5===4)el(s,'circle',{cx:x+HW+4.5,cy:y,r:.8,fill:FAINT,
        class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
    }
    const topY=base-(v-1)*step;
    const num=txt(s,{x,y:topY-10,'font-size':11,'font-weight':800,fill:TXT,'text-anchor':'middle',
      class:'fade',style:`animation-delay:${.4+i*.08}s`},v);
    tip(num,`${name} — $${v}k MRR`);
    txt(s,{x,y:base+18,'font-size':7.5,'font-weight':700,fill:MUT,'text-anchor':'middle',
      'letter-spacing':'.08em',class:'fade',style:`animation-delay:${i*.08}s`},name);
  });
  el(s,'line',{x1:28,y1:base+4,x2:372,y2:base+4,stroke:GRID,'stroke-width':.8,class:'fade'});
  txt(s,{x:200,y:306,'font-size':7,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.12em',class:'fade',style:'animation-delay:.9s'},
    'ONE RUNG = $1K · DOT MARKS EVERY FIFTH');
});
})();

/* ════ 图B · F2 hairline line ════
   basics-porcelain.html 正本结构：barcode 日历地板 + 折线 2.2 +
   逐日圆点（周末空心 1.4 边），峰值 HERO 放大标数。 */
(()=>{
const N=30;
const val=d=>46+22*Math.sin(d/4.6)+14*Math.sin(d/2.1)+rnd(d+1,5)*12;
obsReveal('dayline',s=>{
  const x=d=>30+d*11.7,base=262,map=v=>base-v*2.15;
  for(let d=0;d<N;d++)
    el(s,'line',{x1:x(d),y1:base,x2:x(d),y2:base-7,stroke:FLOOR,'stroke-width':.6,
      class:'fade',style:`animation-delay:${d*.008}s`});
  el(s,'line',{x1:24,y1:base,x2:376,y2:base,stroke:GRID,'stroke-width':.8,class:'fade'});
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
    const weekend=d%7===5||d%7===6,big=top.includes(d);
    const dot=el(s,'circle',{cx:x(d),cy:map(v),r:big?4.2:2.1,
      fill:weekend?BG:(big?HERO:DATA),stroke:big?HERO:DATA,'stroke-width':weekend?1.4:0,
      class:'pop',style:`animation-delay:${.2+d*.03}s`});
    tip(dot,`Day ${d+1} — ${Math.round(v)} sign-ups`);
    if(big)txt(s,{x:x(d),y:map(v)-11,'font-size':9.5,'font-weight':800,fill:TXT,'text-anchor':'middle',
      style:`paint-order:stroke;stroke:${BG};stroke-width:3px;animation-delay:${1+d*.01}s`,
      class:'fade'},Math.round(v));
  });
  [[0,'JUN 1'],[14,'JUN 15'],[29,'JUN 30']].forEach(([d,m])=>
    txt(s,{x:x(d),y:base+18,'font-size':7.5,'font-weight':600,fill:MUT,'text-anchor':'middle',
      'letter-spacing':'.1em',class:'fade'},m));
  txt(s,{x:200,y:306,'font-size':7,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.12em',class:'fade',style:'animation-delay:1.1s'},
    'ONE DOT = ONE DAY · HOLLOW = WEEKEND');
});
})();

/* ════ 图C · F4 tick donut ════
   basics-porcelain.html 正本结构：百 tick 表盘，1 tick = 1%，
   CAT4 四段，tick 1.9（加墨），段标签虚线引出。 */
(()=>{
const D=[['ORGANIC',37,CAT4[0]],['PAID',28,CAT4[1]],['REFERRAL',21,CAT4[2]],['SOCIAL',14,CAT4[3]]];
obsReveal('tickdonut',s=>{
  const cx=200,cy=148,R0=64;
  let k0=0;
  D.forEach(([name,v,shade],si)=>{
    for(let k=0;k<v;k++){
      const idx=k0+k,a=idx*3.6-90;
      const len=12+rnd(idx+1,si+2)*6;
      const [x1,y1]=pol(cx,cy,R0,a),[x2,y2]=pol(cx,cy,R0+len,a);
      el(s,'line',{x1,y1,x2,y2,stroke:shade,'stroke-width':1.9,
        class:'fade',style:`animation-delay:${idx*.012}s`});
      if(idx%10===0){
        const [dx,dy]=pol(cx,cy,R0-5,a);
        el(s,'circle',{cx:dx,cy:dy,r:.8,fill:FAINT,
          class:'fade',style:`animation-delay:${idx*.012}s`});
      }
    }
    const mid=(k0+v/2)*3.6-90,[lx,ly]=pol(cx,cy,R0+38,mid),[gx,gy]=pol(cx,cy,R0+20,mid);
    el(s,'line',{x1:gx,y1:gy,x2:lx,y2:ly,stroke:FAINT,'stroke-width':.7,
      'stroke-dasharray':'1 3',class:'fade',style:`animation-delay:${.6+si*.1}s`});
    const anchor=Math.cos(mid*D2R)>0.3?'start':Math.cos(mid*D2R)<-0.3?'end':'middle';
    const lab=txt(s,{x:lx,y:ly+3,'font-size':8,'font-weight':800,fill:shade,'text-anchor':anchor,
      'letter-spacing':'.06em',style:`paint-order:stroke;stroke:${BG};stroke-width:3px;animation-delay:${.65+si*.1}s`,
      class:'fade'},`${name} · ${v}`);
    tip(lab,`${name} — ${v}% of traffic`);
    k0+=v;
  });
  txt(s,{x:cx,y:cy-2,'font-size':22,'font-weight':800,fill:TXT,'text-anchor':'middle',
    class:'fade',style:'animation-delay:.9s'},'100');
  txt(s,{x:cx,y:cy+14,'font-size':7,'font-weight':600,fill:MUT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:.9s'},'TICKS · ONE = 1%');
  txt(s,{x:200,y:296,'font-size':7,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.12em',class:'fade',style:'animation-delay:1.1s'},
    'TWELVE O’CLOCK IS ZERO · DOT MARKS EVERY TENTH · READS CLOCKWISE');
});
})();

/* ════ 图D · L15 ballot tally ════
   lupi-gallery.html 正本结构：每行 100 根 tick，选中的上墨。
   彩色加墨：picked 1.6 / 未选 1.0，地板 .85。首行 HERO。 */
(()=>{
const ASK=[['DO MORE WITH THE SAME PAY',51],['AN UNSUSTAINABLE PACE',46],['QUALITY OF WORK SLIPPING',41],['BEING REPLACED OUTRIGHT',22]];
obsReveal('tally',s=>{
  ASK.forEach(([name,v],i)=>{
    const base=68+i*60;
    txt(s,{x:26,y:base-26,'font-size':7.5,'font-weight':700,fill:MUT,
      'letter-spacing':'.08em',class:'fade',style:`animation-delay:${i*.1}s`},name);
    el(s,'line',{x1:26,y1:base,x2:374,y2:base,stroke:GRID,'stroke-width':.8,
      class:'fade',style:`animation-delay:${i*.1}s`});
    for(let k=0;k<100;k++){
      const x=26+k*3.48,picked=k<v;
      const h=picked?12+rnd(k+1,i+2)*5:4.5+rnd(k+1,i+5)*2;
      el(s,'line',{x1:x,y1:base,x2:x,y2:base-h,
        stroke:picked?(i===0?HERO:DATA):FAINTDATA,'stroke-width':picked?1.6:1,
        opacity:picked?1:.85,
        class:'fade',style:`animation-delay:${i*.1+k*.006}s`});
      if(k%10===0)el(s,'circle',{cx:x,cy:base+4.5,r:.9,fill:FAINTDATA,
        class:'fade',style:`animation-delay:${i*.1+k*.006}s`});
    }
    const lab=txt(s,{x:26+(v-1)*3.48+9,y:base-11,'font-size':11,'font-weight':800,
      fill:i===0?HERO:DATA,
      style:`paint-order:stroke;stroke:${BG};stroke-width:3px;animation-delay:${.5+i*.1}s`,
      class:'fade'},v);
    tip(lab,`${v} of 100 picked this — they could pick several`);
  });
  txt(s,{x:200,y:292,'font-size':7,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.12em',class:'fade',style:'animation-delay:1.1s'},
    'ONE TICK = ONE RESPONDENT · DOT MARKS EVERY TENTH');
});
})();

/* ════ 右栏 KPI 卡 ════
   数据家具：虚线框 + 右上大数 + 底部双段条（主/辅示意），
   纯排字 + 单条，不占图额度。 */
(()=>{
const KPI=[
  ['图型覆盖','基础图到复杂关系','48',.72],
  ['配色预设','Mono / Porcelain / Palm / Wire','4',.55],
  ['阅读系统','Lupi / Basics / Glance','3',.62],
  ['页面单位','一页一个主判断','1',.8],
  ['可复用输出','HTML / PNG / PDF','3',.6],
  ['数据家具','标题 / 留白 / 来源','∞',.68],
];
const box=document.getElementById('kpis');
KPI.forEach(([h,d,v,fill])=>{
  const k=document.createElement('div');
  k.className='kpi';
  k.innerHTML=`<div class="h">${h}</div><div class="d">${d}</div>
    <div class="box"><div class="v">${v}</div>
    <div class="bar"><i style="width:${fill*100}%;background:${DATA}"></i><i style="width:${(1-fill)*72}%;background:${FAINTDATA}"></i></div></div>`;
  box.appendChild(k);
});
})();

