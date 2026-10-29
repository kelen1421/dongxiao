
/* ── mono-tokens 内联（几何/工具函数与正本一致）── */
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

/* ── WIRE preset（color-presets.js 原值）── */
const BG='#F0F0EE',TXT='#1F1E1C',MUT='rgba(31,30,28,.60)',FAINT='rgba(31,30,28,.32)',
      GRID='rgba(31,30,28,.16)';
const DATA='#22211F',DATA2='#8F8E86',HERO='#F5572F',FAINTDATA='#C0BFB7';

/* ════ 图A · 单位点阵场 ════
   isotype 网格的 lieflat 翻译：20 列 × 5 行 = 100 点，1 点 = 60 团队。
   前 36 点橙（无发布流程）、接 28 点墨（会议过载）、其余 36 点淡灰。
   点径 rnd 微抖（Lupi 肌理），每 10 点列脚一粒定位点。 */
(()=>{
const SEG=[[36,'#F5572F','无发布流程'],[28,'#22211F','会议过载'],[36,'#C0BFB7','其余团队']];
obsReveal('field',s=>{
  const COLS=20,PX=44,PY=52,X0=32,Y0=40;
  let idx=0;
  SEG.forEach(([n,col,name],si)=>{
    for(let k=0;k<n;k++,idx++){
      const c=idx%COLS,r=Math.floor(idx/COLS);
      const x=X0+c*PX+(rnd(idx+1,si+3)-.5)*4,
            y=Y0+r*PY+(rnd(idx+2,si+7)-.5)*4;
      const dot=el(s,'circle',{cx:x,cy:y,r:7.5+rnd(idx+3,si+5)*2.5,fill:col,
        opacity:col==='#C0BFB7'?.85:.95,
        class:'pop',style:`animation-delay:${idx*.012}s`});
      tip(dot,`${name} —— 一点 = 60 个团队`);
    }
  });
  // 列脚定位点：每 5 列一粒
  for(let c=0;c<=COLS;c+=5)
    el(s,'circle',{cx:X0+c*PX-PX/2,cy:Y0+4.6*PY+26,r:1.2,fill:FAINTDATA,
      class:'fade',style:'animation-delay:1.2s'});
  txt(s,{x:X0+9.5*PX,y:Y0+4.6*PY+30,'font-size':8,'font-weight':600,fill:FAINT,
    'text-anchor':'middle','letter-spacing':'.1em',class:'fade',style:'animation-delay:1.3s'},
    '每行 20 点 · 从左上顺序读');
});
})();

/* ════ 图B/C · F6 paired rungs ════
   结构照搬 basics-gallery "paired rungs"：两把梯子并肩，
   2026 淡档、2030 实档（左橙右墨），一档一个诚实单位。 */
const pairs=(id,was,now,unit,colNow)=>{
  obsReveal(id,s=>{
    const base=196,step=5.2,HW=16,xa=110,xb=210;
    for(let k=0;k<was;k++){
      const y=base-k*step,w=HW-1.5+rnd(k+1,3)*3;
      el(s,'line',{x1:xa-w,y1:y,x2:xa+w,y2:y,stroke:FAINTDATA,'stroke-width':1.2,
        opacity:.75+rnd(k+2,4)*.25,class:'fade',style:`animation-delay:${k*.014}s`});
    }
    for(let k=0;k<now;k++){
      const y=base-k*step,w=HW-1.5+rnd(k+1,9)*3;
      el(s,'line',{x1:xb-w,y1:y,x2:xb+w,y2:y,stroke:colNow,'stroke-width':1.2,
        opacity:.8+rnd(k+2,11)*.2,class:'fade',style:`animation-delay:${.15+k*.014}s`});
      if(k%5===4)el(s,'circle',{cx:xb+HW+5,cy:y,r:.9,fill:FAINTDATA,
        class:'fade',style:`animation-delay:${.15+k*.014}s`});
    }
    const numA=txt(s,{x:xa,y:base-(was-1)*step-10,'font-size':10,'font-weight':700,
      fill:DATA2,'text-anchor':'middle',class:'fade',style:'animation-delay:.5s'},was*unit.k);
    const numB=txt(s,{x:xb,y:base-(now-1)*step-10,'font-size':12,'font-weight':800,
      fill:colNow,'text-anchor':'middle',class:'fade',style:'animation-delay:.65s'},now*unit.k);
    tip(numA,`2026 —— ${was*unit.k}${unit.t}`);
    tip(numB,`2030 —— ${now*unit.k}${unit.t}`);
    txt(s,{x:xa,y:base+16,'font-size':8,'font-weight':700,fill:MUT,'text-anchor':'middle',
      'letter-spacing':'.08em',class:'fade'},'2026');
    txt(s,{x:xb,y:base+16,'font-size':8,'font-weight':700,fill:MUT,'text-anchor':'middle',
      'letter-spacing':'.08em',class:'fade'},'2030');
    el(s,'line',{x1:60,y1:base+4,x2:260,y2:base+4,stroke:GRID,'stroke-width':.8,class:'fade'});
    txt(s,{x:160,y:230,'font-size':7,'font-weight':600,fill:FAINT,'text-anchor':'middle',
      'letter-spacing':'.1em',class:'fade',style:'animation-delay:.9s'},
      `一档 = ${unit.k}${unit.t}`);
  });
};
pairs('async',12,18,{k:200,t:' 团队'},HERO);   // 2400 → 3600 (+50%≈45% 示意)
pairs('meeting',15,12,{k:1,t:' 小时'},DATA);    // 15 → 12 (−20%)

