
/* ═══════════════════════════════════════════════════════════════
   MONO TOKENS — 风格的唯一正本
   所有 mono 图表（Chart.js / ECharts / 手写 SVG）共享这一份。
   任何文件里出现与本文件冲突的颜色、字体、动画参数，以本文件为准。
   用法：<script src="mono-tokens.js"><\/script>，全部挂在 window.MONO 上；
   也可以直接把本文件内容内联进单文件 HTML（开源分发时推荐内联）。
   ═══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  /* ── 1 · 色板 ──────────────────────────────────────────────
     纸灰底 + 炭黑墨。没有彩色。明度即数据：最重要 = 最黑。   */
  const INK   = '#1C1C1A';   // 墨：主数据、标题、强调
  const PAPER = '#F0EFEB';   // 纸：页面底色 = 浅卡底色（卡片无边框，靠留白分卡）
  const MUTED = '#8F8E88';   // 次级文字、副标题
  const FAINT = '#C6C5BF';   // 来源行、辅助刻度
  const GRID  = '#DEDDD6';   // 网格线、发丝线

  // 7 级灰阶 ladder：多系列时按重要性从黑到浅分配
  const L   = ['#1C1C1A', '#4A4944', '#6A6963', '#8F8E88', '#B0AFA9', '#C6C5BF', '#D8D7D1'];
  // 5 级简版（waffle 等少系列场景）
  const LAD = ['#1C1C1A', '#4A4944', '#8F8E88', '#B0AFA9', '#D8D7D1'];

  // 暗卡（dark card）专用：底 #1C1C1A，其上的"墨"反转为纸色
  const DARK = {
    bg: '#1C1C1A',
    ink: '#F0EFEB',          // 暗卡上的主数据色
    muted: '#8F8E88',
    faint: '#55554F',        // 暗卡来源行
    grid: '#2E2D29',         // 暗卡网格 / 发丝线
    gridSoft: '#2A2925',
    ladder: ['#F0EFEB', '#DCDAD2', '#C9C7BD', '#B3B0A4', '#8F8E88', '#6A6963', '#4A4944'],
  };

  /* ── 2 · 字体 ────────────────────────────────────────────── */
  const FONT = {
    family: 'Inter',
    // Google Fonts 引入行（放 <head>）：
    link: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Serif+SC:wght@400;500;600;700;900&display=swap',
    title:    { size: 16.5, weight: 700, spacing: '-.02em' },  // 卡内 h2
    titleBig: { size: 19,   weight: 700, spacing: '-.02em' },  // 独立大图 h2
    sub:      { size: 11.5, weight: 400 },                     // 副标题（图例说明写在这里）
    src:      { size: 9.5,  weight: 500, spacing: '.08em' },   // 来源行，全大写
    value:    { weight: 800 },                                 // 图内数值一律 800
    axis:     { size: 9.5,  weight: 600 },                     // 轴标签
    // SVG 内最小字号下限：半宽卡 6.5px，通栏/大图 5.5px。低于下限改 hover 出。
    minHalf: 6.5, minWide: 5.5,
  };

  /* ── 3 · 形状 ────────────────────────────────────────────── */
  const SHAPE = {
    cardRadius: 24,          // 卡片圆角
    cardPad: '28px 28px 20px',
    barRadius: 99,           // 柱端胶囊圆角（竖柱只圆上端，横柱只圆外端）
    tooltipRadius: 12,
  };

  /* ── 4 · 动画性格 ────────────────────────────────────────
     快进快停，quarticOut / cubicOut，不弹跳（elasticOut 只给波浪入场）。 */
  const MOTION = {
    enter: 900,              // 常规入场 ms
    enterSlow: 1200,         // 大元素 / 关系图
    easing: 'quarticOut',
    staggerDot: 12,          // 点阵逐个延迟 ms（8–15 区间）
    staggerBar: 100,         // 条形逐根延迟 ms（80–130 区间）
    // CSS 动画类（手写 SVG 用）：pop 缩放入场 / fade 淡入 / draw 描线
    css: `
  .pop{transform-box:fill-box;transform-origin:center;animation:pop .5s cubic-bezier(.2,.7,.3,1.3) both}
  @keyframes pop{from{transform:scale(0)}to{transform:none}}
  .fade{animation:fade .9s ease both}
  @keyframes fade{from{opacity:0}}
  .draw{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1s cubic-bezier(.4,0,.2,1) both}
  @keyframes draw{to{stroke-dashoffset:0}}
  @media (prefers-reduced-motion:reduce){
    .pop,.fade{animation:none}
    .draw{animation:none;stroke-dasharray:none;stroke-dashoffset:0}
  }`,
  };

  /* ── 5 · Tooltip ─────────────────────────────────────────
     浅卡用黑底纸字，暗卡用纸底黑字。ECharts 直接展开这两个对象。 */
  const tipLight = { backgroundColor: INK, borderWidth: 0, padding: [10, 14],
    textStyle: { color: PAPER, fontFamily: 'Inter', fontSize: 12 } };
  const tipDark  = { backgroundColor: PAPER, borderWidth: 0, padding: [10, 14],
    textStyle: { color: INK, fontFamily: 'Inter', fontSize: 12 } };

  /* ── 6 · 确定性伪随机 ────────────────────────────────────
     演示数据一律用它，不用 Math.random()——刷新必须长一样，
     否则截图 / 录屏 / 回归对比全部失效。                       */
  const rnd = (i, k) => Math.abs(((i * 73856093) ^ (k * 19349663)) % 1000) / 1000;

  /* ── 7 · 几何 ────────────────────────────────────────────── */
  const D2R = Math.PI / 180;
  const pol = (cx, cy, r, deg) => [cx + r * Math.cos(deg * D2R), cy + r * Math.sin(deg * D2R)];
  // 环形扇区 path（cornerRadius 自己在调用处用 ECharts sector 或手动倒角）
  const sect = (cx, cy, r0, r1, a0, a1) => {
    const big = a1 - a0 > 180 ? 1 : 0;
    const [xa, ya] = pol(cx, cy, r1, a0), [xb, yb] = pol(cx, cy, r1, a1);
    const [xc, yc] = pol(cx, cy, r0, a1), [xd, yd] = pol(cx, cy, r0, a0);
    return `M${xa} ${ya} A${r1} ${r1} 0 ${big} 1 ${xb} ${yb} L${xc} ${yc} A${r0} ${r0} 0 ${big} 0 ${xd} ${yd} Z`;
  };
  // 手绘感圆（editorial 系气泡用）：圆周叠两个慢波 + 噪声，seed 定形
  const blob = (x, y, r, seed) => {
    const n = Math.max(14, Math.round(r * 1.6)), pts = [];
    for (let t = 0; t < n; t++) {
      const a = t / n * Math.PI * 2;
      const w = 1 + .055 * Math.sin(a * 2 + seed * 7) + .04 * Math.sin(a * 3 + seed * 13)
              + (rnd(seed + t, 3) - .5) * .03;
      pts.push([x + Math.cos(a) * r * w, y + Math.sin(a) * r * w]);
    }
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let t = 0; t < n; t++) {
      const p = pts[t], q = pts[(t + 1) % n];
      d += ` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${((p[0]+q[0])/2).toFixed(1)} ${((p[1]+q[1])/2).toFixed(1)}`;
    }
    return d + ' Z';
  };

  /* ── 8 · SVG 快捷 ────────────────────────────────────────── */
  const NS = 'http://www.w3.org/2000/svg';
  const el  = (p, t, a) => { const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]); p.appendChild(n); return n; };
  const txt = (p, a, s) => { const n = el(p, 'text', a); n.textContent = s; return n; };
  const tip = (n, s) => { const t = document.createElementNS(NS, 'title');
    t.textContent = s; n.appendChild(t); };

  /* ── 9 · 统一 reveal：滚入视野才播，点击重播 ──────────────
     带 timer 登记（keep），重播前清干净，防动画叠加。          */
  const timers = {};
  const keep = (id, t) => { (timers[id] = timers[id] || []).push(t); };
  const obsReveal = (id, fn) => {
    const n = document.getElementById(id);
    const go = () => {
      (timers[id] || []).forEach(clearInterval); timers[id] = [];
      if (n.tagName === 'svg' || n.tagName === 'SVG') n.innerHTML = '';
      fn(n);
    };
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) { go(); io.disconnect(); }
    }, { threshold: .3 });
    io.observe(n);
    n.style.cursor = 'pointer';
    n.addEventListener('click', go);
  };
  // ECharts 版 reveal
  const eReveal = (id, opt) => obsReveal(id, elDom => {
    const g = echarts.getInstanceByDom(elDom) || echarts.init(elDom);
    g.clear(); g.setOption(opt);
  });

  /* ── 10 · 卡片骨架（生成新图时照抄这个结构） ──────────────
     <div class="card [dark] [wide]">
       <h2>结论式标题</h2>
       <div class="sub">副标题 · 图例说明 · 时间范围</div>
       <div class="ch" data-example-id="chart-placeholder"></div>  或  <svg data-example-id="chart-placeholder" viewBox="0 0 400 320">
       <div class="src">图型名 · 系列名 · 数据来源（全大写）</div>
     </div>                                                        */
  const CARD_CSS = `
  :root{--bg:${PAPER};--dark:${DARK.bg};--ink:${INK};--muted:${MUTED};--faint:${FAINT};--grid:${GRID}}
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:var(--bg);font-family:'Inter',sans-serif;color:var(--ink);padding:40px;-webkit-font-smoothing:antialiased}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:22px;max-width:1400px;margin:0 auto}
  .card{background:var(--bg);border-radius:${SHAPE.cardRadius}px;padding:${SHAPE.cardPad}}
  .card.dark{background:var(--dark);color:${PAPER}}
  .card.dark .sub{color:${MUTED}}
  .card.dark .src{color:${DARK.faint}}
  .card.wide{grid-column:1/-1}
  h2{font-weight:${FONT.title.weight};font-size:${FONT.title.size}px;letter-spacing:${FONT.title.spacing};margin-bottom:3px}
  .sub{font-size:${FONT.sub.size}px;color:var(--muted);margin-bottom:14px}
  .src{font-size:${FONT.src.size}px;color:var(--faint);margin-top:10px;letter-spacing:${FONT.src.spacing};font-weight:${FONT.src.weight}}
  .ch{height:320px}
  svg text{font-family:'Inter',sans-serif}` + MOTION.css;

  global.MONO = { INK, PAPER, MUTED, FAINT, GRID, L, LAD, DARK,
    FONT, SHAPE, MOTION, tipLight, tipDark,
    rnd, pol, sect, blob, el, txt, tip, obsReveal, eReveal, keep, CARD_CSS };
})(typeof window !== 'undefined' ? window : globalThis);


const {INK,PAPER,MUTED,GRID,rnd,pol,sect,el,tip}=MONO;
const D2R=Math.PI/180;
// Footer legends are laid out as readable HTML, not squeezed into the chart.
const txt=(p,a,s)=> !['fan','converge','almanac','lineage','colonnade','patchwork'].includes(p.id)&&Number(a.y)>=296 ? null : MONO.txt(p,a,s);
const renderers=new Map();
const chartDefinitions=new Map();
const obsReveal=(id,fn)=>{
 chartDefinitions.set(id,fn);
 const node=document.getElementById(id);
 const go=()=>{
  node.replaceChildren();fn(node);
  // V3 wide ballot layout: double horizontal spacing, preserving counts, tick height,
  // stroke weight and circular markers. This is a layout change, not a data change.
  if(id==='gauge')node.querySelectorAll('text').forEach(mark=>{if(['73%','还剩 27 格'].includes(mark.firstChild?.nodeValue))mark.remove()});
  if(id==='ballottally')node.querySelectorAll('*').forEach(mark=>{
   ['x','x1','x2','cx'].forEach(key=>{if(mark.hasAttribute(key))mark.setAttribute(key,Number(mark.getAttribute(key))*2)});
  });
 };
 renderers.set(id,go);
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){go();observer.disconnect()}},{threshold:.2});
 observer.observe(node);node.addEventListener('click',go);
};
// ════ 3 · arc bubble matrix ════
(()=>{
const PROD=['编辑器','看板','文档','流程','聊天','Vault','页面','同步'];
const CITY=['SF','NYC','LON','BER','TOK','SYD','SIN','PAR','AMS','TOR','SEO','SAO'];
const W=[9,8,7,7,6,5,5,4,4,3,3,2];             // market weight
obsReveal('arcmatrix',s=>{
  const rowY=i=>74+i*29, colX=j=>92+j*27, dy=j=>-16*Math.sin(Math.PI*j/11);
  const v=(i,j)=>{
    if(rnd(i*13+1,j*7+3)<.09)return 0;                 // a few true absences
    const age=1-i*.085;                                // older rows reach further
    return Math.min(40,Math.round(W[j]*3.4*age*(.45+rnd(i+1,j+1)*.85)));
  };
  // find top-4 cells for labels
  const all=[];
  PROD.forEach((_,i)=>CITY.forEach((_,j)=>all.push([v(i,j),i,j])));
  const top=all.sort((a,b)=>b[0]-a[0]).slice(0,4).map(d=>d[1]*100+d[2]);
  PROD.forEach((p,i)=>{
    // the horizon arc
    const d='M'+CITY.map((_,j)=>`${colX(j)} ${rowY(i)+dy(j)}`).join(' L ');
    el(s,'path',{d,fill:'none',stroke:'#E3E2DB','stroke-width':1,pathLength:1,
      class:'draw',style:`animation-delay:${i*.08}s`});
    txt(s,{x:84,y:rowY(i)+3,'font-size':8,'font-weight':600,fill:'#6A6963','text-anchor':'end',
      class:'fade',style:`animation-delay:${i*.08}s`},p);
    CITY.forEach((c,j)=>{
      const x=colX(j),y=rowY(i)+dy(j),vv=v(i,j);
      if(!vv){el(s,'circle',{cx:x,cy:y,r:.9,fill:'#D8D6CE',
        class:'pop',style:`animation-delay:${.2+i*.08+j*.02}s`});return}
      const fill=vv>=25?INK:vv>=12?'#6A6963':'#B0AFA9';
      const dot=el(s,'circle',{cx:x,cy:y,r:Math.sqrt(vv)*1.3,fill,
        class:'pop',style:`animation-delay:${.2+i*.08+j*.02}s`});
      tip(dot,`${p} · ${c} · ${vv} 个账户`);
      if(top.includes(i*100+j))
        txt(s,{x,y:y-Math.sqrt(vv)*1.3-4,'font-size':7,'font-weight':800,fill:INK,
          'text-anchor':'middle',class:'fade',style:`animation-delay:${.6}s`},vv);
    });
  });
  CITY.forEach((c,j)=>{
    const x=colX(j),y=74+dy(j)-24;
    txt(s,{x,y,'font-size':7,'font-weight':700,fill:MUTED,'letter-spacing':'.08em',
      transform:`rotate(-55 ${x} ${y})`,class:'fade',style:`animation-delay:${j*.03}s`},c);
  });
});
})();

// ════ 4 · dot cascade on dark ════
(()=>{
const CAUSE=['DNS','CDN','配额','磁盘','证书','缓存','队列','锁','内存溢出','网络','第三方 API','配置','数据库','部署','代码','人工'];
const COUNT=[1,1,2,3,3,4,5,6,7,9,11,13,15,18,22,27];
document.getElementById('incident-total').textContent=COUNT.reduce((sum,n)=>sum+n,0);
obsReveal('cascade',s=>{
  const x=i=>34+i*22.2, base=i=>272-i*7.5;
  // dotted diagonal baseline
  el(s,'line',{x1:x(0)-8,y1:base(0)+4,x2:x(15)+8,y2:base(15)+4,
    stroke:'#4A4944','stroke-width':1,'stroke-dasharray':'2 4',class:'fade'});
  CAUSE.forEach((name,i)=>{
    const n=Math.ceil(COUNT[i]/2),bx=x(i),by=base(i);
    for(let k=0;k<n-1;k++)
      el(s,'circle',{cx:bx,cy:by-12-k*8.8,r:2.2,fill:'#B3B0A4',opacity:.9,
        class:'pop',style:`animation-delay:${i*.05+k*.03}s`});
    const topY=by-12-(n-1)*8.8;
    const top=el(s,'circle',{cx:bx,cy:topY,r:4.6,fill:PAPER,
      class:'pop',style:`animation-delay:${i*.05+n*.03}s`});
    tip(top,`${name} — ${COUNT[i]} incidents`);
    txt(s,{x:bx,y:topY-10,'font-size':9,'font-weight':700,fill:PAPER,'text-anchor':'middle',
      class:'fade',style:`animation-delay:${.2+i*.05}s`},COUNT[i]);
    txt(s,{x:bx,y:by+12,'font-size':6.5,'font-weight':600,fill:'#6A6963','text-anchor':'end',
      transform:`rotate(-90 ${bx} ${by+12})`,
      class:'fade',style:`animation-delay:${.1+i*.05}s`},name);
  });
});
})();

// ════ B1 · rung bars ════
// 柱状图的 Lupi 化：柱身 = 一格格横档，1 档 = 1 个诚实单位。
// 远看是柱状图剪影，近看每一档都数得出来。档长、透明度 rnd 抖动。
(()=>{
const D=[['FREE',38],['STARTER',27],['PRO',22],['TEAM',16],['SCALE',11],['ENT',7]];
obsReveal('rungs',s=>{
  const x0=i=>56+i*56,base=266,step=5.6,HW=14;
  D.forEach(([name,v],i)=>{
    const x=x0(i);
    for(let k=0;k<v;k++){
      const y=base-k*step,w=HW-1.5+rnd(k+1,i+2)*3;
      el(s,'line',{x1:x-w,y1:y,x2:x+w,y2:y,stroke:INK,'stroke-width':1,
        opacity:.5+rnd(k+2,i+4)*.5,class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
      if(k%5===4)el(s,'circle',{cx:x+HW+4.5,cy:y,r:.8,fill:'#C6C5BF',
        class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
    }
    const topY=base-(v-1)*step;
    const num=txt(s,{x,y:topY-10,'font-size':11,'font-weight':800,fill:INK,'text-anchor':'middle',
      class:'fade',style:`animation-delay:${.4+i*.08}s`},v);
    tip(num,`${name} — $${v}k MRR`);
    txt(s,{x,y:base+18,'font-size':7.5,'font-weight':700,fill:MUTED,'text-anchor':'middle',
      'letter-spacing':'.08em',class:'fade',style:`animation-delay:${i*.08}s`},name);
  });
  el(s,'line',{x1:28,y1:base+4,x2:372,y2:base+4,stroke:GRID,'stroke-width':.8,class:'fade'});
  txt(s,{x:200,y:306,'font-size':7,'font-weight':600,fill:'#B0AFA9','text-anchor':'middle',
    'letter-spacing':'.12em',class:'fade',style:'animation-delay:.9s'},
    '一格 = 1 千美元 · 每五格标一个点');
});
})();


// ════ B2 · hairline line ════
// 折线图的 Lupi 化：barcode 的日历地板（每天一根发丝，无论有没有事）+
// 发丝折线 + 逐日圆点（周末空心）。峰值两个点放大标数。
(()=>{
const N=30;
const val=d=>46+22*Math.sin(d/4.6)+14*Math.sin(d/2.1)+rnd(d+1,5)*12;
obsReveal('dayline',s=>{
  const x=d=>30+d*11.7,base=262,map=v=>base-v*2.15;
  // calendar floor
  for(let d=0;d<N;d++)
    el(s,'line',{x1:x(d),y1:base,x2:x(d),y2:base-7,stroke:'#C6C5BF','stroke-width':.6,
      class:'fade',style:`animation-delay:${d*.008}s`});
  el(s,'line',{x1:24,y1:base,x2:376,y2:base,stroke:GRID,'stroke-width':.8,class:'fade'});
  const vs=Array.from({length:N},(_,d)=>val(d));
  // top-2 peaks, apart
  const top=[];
  for(const d of [...vs.keys()].sort((a,b)=>vs[b]-vs[a])){
    if(top.every(t=>Math.abs(t-d)>=5))top.push(d);
    if(top.length===2)break;
  }
  // hairline path
  const pts=vs.map((v,d)=>`${x(d)} ${map(v)}`).join(' L ');
  el(s,'path',{d:'M'+pts,fill:'none',stroke:INK,'stroke-width':1,pathLength:1,
    class:'draw',style:'animation-duration:1.2s'});
  vs.forEach((v,d)=>{
    const weekend=d%7===5||d%7===6,big=top.includes(d);
    const dot=el(s,'circle',{cx:x(d),cy:map(v),r:big?4.2:2.1,
      fill:weekend?PAPER:INK,stroke:INK,'stroke-width':weekend?1:0,
      class:'pop',style:`animation-delay:${.2+d*.03}s`});
    tip(dot,`第 ${d+1} 天 · ${Math.round(v)} 次注册`);
    if(big)txt(s,{x:x(d),y:map(v)-11,'font-size':9.5,'font-weight':800,fill:INK,'text-anchor':'middle',
      style:`paint-order:stroke;stroke:${PAPER};stroke-width:3px;animation-delay:${1+d*.01}s`,
      class:'fade'},Math.round(v));
  });
  [[0,'JUN 1'],[14,'JUN 15'],[29,'JUN 30']].forEach(([d,m])=>
    txt(s,{x:x(d),y:base+18,'font-size':7.5,'font-weight':600,fill:MUTED,'text-anchor':'middle',
      'letter-spacing':'.1em',class:'fade'},m));
  txt(s,{x:200,y:306,'font-size':7,'font-weight':600,fill:'#B0AFA9','text-anchor':'middle',
    'letter-spacing':'.12em',class:'fade',style:'animation-delay:1.1s'},
    '一个点 = 一天 · 空心 = 周末');
});
})();


// ════ L10 · radial patchwork (original gallery implementation) ════
(()=>{
const CX=200,CY=168,N=46;
obsReveal('patchwork',s=>{
  // 24h rim ticks
  for(let h=0;h<96;h++){
    const a=-90+h*3.75,[x1,y1]=pol(CX,CY,140,a),[x2,y2]=pol(CX,CY,h%4===0?146:143,a);
    el(s,'line',{x1,y1,x2,y2,stroke:'#C6C5BF','stroke-width':h%4===0?1:.5,
      class:'fade',style:`animation-delay:${h*.006}s`});
  }
  [0,6,12,18].forEach(h=>{
    const [x,y]=pol(CX,CY,157,-90+h*15);
    txt(s,{x,y:y+3,'font-size':8,'font-weight':700,fill:MUTED,'text-anchor':'middle',
      class:'fade'},String(h).padStart(2,'0'));
  });
  // the patchwork: translucent wedges pile into ink
  const wedges=[];
  for(let i=0;i<N;i++){
    // deploys cluster around 11h and 16h, thin overnight
    const peak=rnd(i+1,2)>.5?11:16;
    const hour=(peak+(rnd(i+1,3)-.5)*7+24)%24;
    const a0=-90+hour*15,sw=10+rnd(i+1,4)*34;
    const r1=34+rnd(i+1,5)*100;
    wedges.push([a0,sw,r1,hour,i]);
  }
  wedges.forEach(([a0,sw,r1,hour,i])=>{
    const w=el(s,'path',{d:sect(CX,CY,16,r1,a0,a0+sw),fill:INK,
      'fill-opacity':.07+rnd(i+1,6)*.09,class:'fade',
      style:`animation-delay:${.2+i*.022}s`});
    tip(w,`部署 #${i+1} · ${String(Math.floor(hour)).padStart(2,'0')}:${String(Math.floor(hour%1*60)).padStart(2,'0')} · ${Math.round(r1*6)} files`);
  });
  // three outlined wedges: the ones that paged somebody
  [4,17,31].forEach((i,k)=>{
    const [a0,sw,r1]=wedges[i];
    const w=el(s,'path',{d:sect(CX,CY,16,r1,a0,a0+sw),fill:'none',
      stroke:INK,'stroke-width':1.1,class:'fade',style:`animation-delay:${1.2+k*.15}s`});
    tip(w,`部署 #${i+1} · 触发事故`);
  });
  el(s,'circle',{cx:CX,cy:CY,r:3,fill:INK,class:'pop',style:'animation-delay:1.3s'});

});
})();


// ════ C7 · tick gauge ════
// 进度：ballot tick 弯成 210° 表盘，1 tick = 1% 目标。走到 73 上墨收笔。
// 里程碑 25/50/75/100 点标 + 小字。中心大数 + 剩余量小字。
(()=>{
const GOAL=73;
obsReveal('gauge',s=>{
  const cx=200,cy=190,R0=104,A0=-195,SW=210; // -195° → +15°
  for(let k=0;k<100;k++){
    const a=A0+k/100*SW,inked=k<GOAL;
    const len=inked?13+rnd(k+1,3)*6:5+rnd(k+1,7)*2.5;
    const [x1,y1]=pol(cx,cy,R0,a),[x2,y2]=pol(cx,cy,R0+len,a);
    el(s,'line',{x1,y1,x2,y2,stroke:inked?INK:'#C6C5BF','stroke-width':inked?1:.6,
      class:'fade',style:`animation-delay:${k*.012}s`});
  }
  [25,50,75,100].forEach(m=>{
    const a=A0+m/100*SW,[dx,dy]=pol(cx,cy,R0-7,a),[tx2,ty2]=pol(cx,cy,R0-19,a);
    el(s,'circle',{cx:dx,cy:dy,r:1,fill:'#B0AFA9',class:'fade',style:'animation-delay:.8s'});
    txt(s,{x:tx2,y:ty2+3,'font-size':7,'font-weight':600,fill:'#C6C5BF','text-anchor':'middle',
      class:'fade',style:'animation-delay:.85s'},m);
  });
  // inked tip bead
  const aT=A0+GOAL/100*SW,[ex,ey]=pol(cx,cy,R0+20,aT);
  el(s,'circle',{cx:ex,cy:ey,r:2.4,fill:INK,class:'pop',style:'animation-delay:1.1s'});
  const num=txt(s,{x:cx,y:cy-4,'font-size':34,'font-weight':800,fill:INK,'text-anchor':'middle',
    class:'fade',style:'animation-delay:1s'},GOAL+'%');
  tip(num,`$730k of the $1M quarter target`);
  txt(s,{x:cx,y:cy+16,'font-size':8,'font-weight':600,fill:MUTED,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:1.05s'},'还剩 27 格');
  txt(s,{x:200,y:300,'font-size':7,'font-weight':600,fill:'#B0AFA9','text-anchor':'middle',
    'letter-spacing':'.12em',class:'fade',style:'animation-delay:1.2s'},
    'ONE TICK = 1% OF TARGET · INKED = EARNED');
});
})();


// ════ C2 · paired rungs ════
// 分组柱：每类两把梯子并肩，今年实档、去年淡档。差值一眼可数。
(()=>{
const D=[['FREE',31,38],['STARTER',22,27],['PRO',16,22],['TEAM',13,16],['ENT',6,9]];
obsReveal('pairrungs',s=>{
  const x0=i=>64+i*66,base=258,step=5.4,HW=10;
  D.forEach(([name,was,now],i)=>{
    const xa=x0(i)-13,xb=x0(i)+13;
    for(let k=0;k<was;k++){
      const y=base-k*step,w=HW-1.2+rnd(k+1,i+2)*2.4;
      el(s,'line',{x1:xa-w,y1:y,x2:xa+w,y2:y,stroke:'#B0AFA9','stroke-width':1,
        opacity:.5+rnd(k+2,i+3)*.4,class:'fade',style:`animation-delay:${i*.08+k*.01}s`});
    }
    for(let k=0;k<now;k++){
      const y=base-k*step,w=HW-1.2+rnd(k+1,i+7)*2.4;
      el(s,'line',{x1:xb-w,y1:y,x2:xb+w,y2:y,stroke:INK,'stroke-width':1,
        opacity:.6+rnd(k+2,i+8)*.4,class:'fade',style:`animation-delay:${.15+i*.08+k*.01}s`});
    }
    const topB=base-(now-1)*step;
    const num=txt(s,{x:xb,y:topB-9,'font-size':10.5,'font-weight':800,fill:INK,'text-anchor':'middle',
      class:'fade',style:`animation-delay:${.5+i*.08}s`},now);
    tip(num,`${name} — $${was}k → $${now}k`);
    txt(s,{x:xa,y:base-(was-1)*step-9,'font-size':8.5,'font-weight':700,fill:'#B0AFA9','text-anchor':'middle',
      class:'fade',style:`animation-delay:${.5+i*.08}s`},was);
    txt(s,{x:x0(i),y:base+18,'font-size':7.5,'font-weight':700,fill:MUTED,'text-anchor':'middle',
      'letter-spacing':'.08em',class:'fade',style:`animation-delay:${i*.08}s`},name);
  });
  el(s,'line',{x1:30,y1:base+4,x2:370,y2:base+4,stroke:GRID,'stroke-width':.8,class:'fade'});
  txt(s,{x:200,y:306,'font-size':7,'font-weight':600,fill:'#B0AFA9','text-anchor':'middle',
    'letter-spacing':'.12em',class:'fade',style:'animation-delay:1s'},
    'FAINT = 2025 · INK = 2026 · ONE RUNG = $1K');
});
})();


// ════ C1 · tick rows ════
// 横向条形：一行 = 一支队伍的发布队列，1 tick = 1 次发布。
// tick 高度/透明度抖动，每 5 根一个点标，行尾大数。
(()=>{
const D=[['PLATFORM',34],['GROWTH',28],['MOBILE',22],['INFRA',17],['ML',11],['DESIGN',8]];
obsReveal('tickrows',s=>{
  const y0=i=>52+i*44,X0=104,PX=6.9;
  D.forEach(([name,v],i)=>{
    const y=y0(i);
    txt(s,{x:94,y:y+3,'font-size':8,'font-weight':700,fill:'#6A6963','text-anchor':'end',
      'letter-spacing':'.08em',class:'fade',style:`animation-delay:${i*.08}s`},name);
    el(s,'line',{x1:X0,y1:y+9,x2:X0+34*PX,y2:y+9,stroke:GRID,'stroke-width':.6,
      class:'fade',style:`animation-delay:${i*.08}s`});
    for(let k=0;k<v;k++){
      const x=X0+k*PX+PX/2,h=9+rnd(k+1,i+2)*6;
      el(s,'line',{x1:x,y1:y+9,x2:x,y2:y+9-h,stroke:INK,'stroke-width':.9,
        opacity:.55+rnd(k+3,i+5)*.45,class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
      if(k%5===4)el(s,'circle',{cx:x,cy:y+13,r:.8,fill:'#C6C5BF',
        class:'fade',style:`animation-delay:${i*.08+k*.012}s`});
    }
    const lab=txt(s,{x:X0+v*PX+10,y:y+4,'font-size':11,'font-weight':800,fill:INK,
      class:'fade',style:`animation-delay:${.4+i*.08}s`},v);
    tip(lab,`${name} — ${v} releases`);
  });
  txt(s,{x:200,y:308,'font-size':7,'font-weight':600,fill:'#B0AFA9','text-anchor':'middle',
    'letter-spacing':'.12em',class:'fade',style:'animation-delay:.9s'},
    'ONE TICK = ONE RELEASE · DOT MARKS EVERY FIFTH');
});
})();


// ════ 14 · hundred field ════
// small data, unit-decomposed: four shares of 100% become 100 people.
// phyllotaxis discs (golden angle) so每簇自带肌理; share is countable, not just readable.
(()=>{
const SEG=[['DAILY',41,INK],['WEEKLY',35,'#4A4944'],['MONTHLY',12,'#8F8E88'],['RARELY',12,'#B0AFA9']];
const POS=[[132,140],[276,116],[186,252],[322,238]];
obsReveal('hundredfield',s=>{
  // dashed constellation hairlines tying the cluster cores
  [[0,1],[0,2],[1,3],[2,3]].forEach(([a,b],k)=>{
    el(s,'line',{x1:POS[a][0],y1:POS[a][1],x2:POS[b][0],y2:POS[b][1],
      stroke:GRID,'stroke-width':.7,'stroke-dasharray':'2 5',
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
      // hairline spoke for every 5th person, core to dot
      if(k%5===0)el(s,'line',{x1:cx,y1:cy,x2:x,y2:y,stroke:'#C6C5BF','stroke-width':.6,
        class:'fade',style:`animation-delay:${ci*.14+k*.012}s`});
      const dot=el(s,'circle',{cx:x,cy:y,r:1.5+rnd(k+2,ci+3)*1.7,fill:shade,opacity:.9,
        class:'pop',style:`animation-delay:${ci*.14+k*.012}s`});
      tip(dot,`${name} · 100 人中的 ${v} 人`);
    }

    txt(s,{x:cx,y:cy+edge+13,'font-size':8,'font-weight':800,fill:INK,'text-anchor':'middle',
      'letter-spacing':'.1em',style:`paint-order:stroke;stroke:${PAPER};stroke-width:3px;animation-delay:${.5+ci*.12}s`,
      class:'fade'},`${name} · ${v}`);
  });
  txt(s,{x:200,y:314,'font-size':7,'font-weight':600,fill:'#B0AFA9','text-anchor':'middle',
    'letter-spacing':'.12em',class:'fade',style:'animation-delay:1.3s'},'ONE DOT = ONE PERSON · 41 + 35 + 12 + 12 = 100');
});
})();


// ════ 15 · ballot tally ════
// multi-select survey (each option independent, 0–100): every option is a row of
// 100 hairline ticks — a hundred people standing in line, the ones who picked it inked.
(()=>{
const ASK=[['DO MORE WITH THE SAME PAY',51],['AN UNSUSTAINABLE PACE',46],['QUALITY OF WORK SLIPPING',41],['BEING REPLACED OUTRIGHT',22]];
obsReveal('ballottally',s=>{
  ASK.forEach(([name,v],i)=>{
    const base=78+i*62;
    txt(s,{x:28,y:base-26,'font-size':7.5,'font-weight':700,fill:'#6A6963',
      'letter-spacing':'.08em',class:'fade',style:`animation-delay:${i*.1}s`},name);
    el(s,'line',{x1:28,y1:base,x2:372,y2:base,stroke:GRID,'stroke-width':.6,
      class:'fade',style:`animation-delay:${i*.1}s`});
    for(let k=0;k<100;k++){
      const x=28+k*3.44,picked=k<v;
      const h=picked?12+rnd(k+1,i+2)*5:4.5+rnd(k+1,i+5)*2;
      el(s,'line',{x1:x,y1:base,x2:x,y2:base-h,
        stroke:picked?INK:'#C6C5BF','stroke-width':picked?.9:.55,
        class:'fade',style:`animation-delay:${i*.1+k*.006}s`});
      if(k%10===0)el(s,'circle',{cx:x,cy:base+4.5,r:.8,fill:'#C6C5BF',
        class:'fade',style:`animation-delay:${i*.1+k*.006}s`});
    }
    const lab=txt(s,{x:28+(v-1)*3.44+9,y:base-11,'font-size':11,'font-weight':800,fill:INK,
      style:`paint-order:stroke;stroke:${PAPER};stroke-width:3px;animation-delay:${.5+i*.1}s`,
      class:'fade'},v);
    tip(lab,`${v} of 100 picked this — they could pick several`);
  });
  txt(s,{x:200,y:314,'font-size':7,'font-weight':600,fill:'#B0AFA9','text-anchor':'middle',
    'letter-spacing':'.12em',class:'fade',style:'animation-delay:1.1s'},'ONE TICK = ONE RESPONDENT · DOT MARKS EVERY TENTH');
});
})();


// ════ 2 · barcode lollipop ════
(()=>{
const N=90;
const val=d=>95+55*Math.sin(d/9.5)+30*Math.sin(d/3.7)+rnd(d+1,5)*40;
obsReveal('barcode',s=>{
  // the barcode: one hairline per day, full height
  for(let d=0;d<N;d++){
    const x=18+d*8.53;
    el(s,'line',{x1:x,y1:8,x2:x,y2:258,stroke:GRID,'stroke-width':.7,
      class:'fade',style:`animation-delay:${d*.004}s`});
  }
  const vs=Array.from({length:N},(_,d)=>val(d));
  // top-3 peaks, kept at least 6 days apart so labels never collide
  const top3=[];
  for(const d of [...vs.keys()].sort((a,b)=>vs[b]-vs[a])){
    if(top3.every(t=>Math.abs(t-d)>=6))top3.push(d);
    if(top3.length===3)break;
  }
  for(let d=0;d<N;d++){
    const x=18+d*8.53,v=vs[d],y=252-v*.75;
    const weekend=d%7===5||d%7===6;
    const stemEnd=Math.min(256,y+14+rnd(d+1,9)*26);
    el(s,'line',{x1:x,y1:y,x2:x,y2:stemEnd,stroke:INK,'stroke-width':1.1,
      class:'fade',style:`animation-delay:${.3+d*.008}s`});
    const big=top3.includes(d);
    const dot=el(s,'circle',{cx:x,cy:y,r:big?4.6:2.7,
      fill:weekend?PAPER:INK,stroke:INK,'stroke-width':weekend?1.2:0,
      class:'pop',style:`animation-delay:${.3+d*.008}s`});
    tip(dot,`第 ${d+1} 天 · 峰值 ${Math.round(v)}k`);
    if(big)txt(s,{x,y:y-10,'font-size':9,'font-weight':800,fill:INK,'text-anchor':'middle',
      class:'fade',style:`animation-delay:${.9+d*.004}s`},Math.round(v)+'k');
  }
  [[0,'APR'],[30,'MAY'],[61,'JUN']].forEach(([d,m])=>
    txt(s,{x:18+d*8.53,y:276,'font-size':8,'font-weight':600,fill:MUTED,
      'letter-spacing':'.12em',class:'fade'},m));
});
})();


// ════ 1 · launch fan ════
// spokes sorted by launch week → the big dots cascade along a diagonal arc
(()=>{
const FEAT=['Editor','Boards','Docs','Chat','Flows','Vault','Pages','Sync','Grid','Views','Hub','Forms'];
const LAUNCH=[1,3,4,6,8,9,11,12,14,16,17,19];     // week of launch
const CX=40,CY=304,rOf=w=>56+w*9.7;
obsReveal('fan',s=>{
  const ang=i=>-84+i*(76/11);
  // dotted week guides
  [5,10,15,20].forEach((w,gi)=>{
    const r=rOf(w),[x1,y1]=pol(CX,CY,r,-84),[x2,y2]=pol(CX,CY,r,-8);
    el(s,'path',{d:`M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`,fill:'none',
      stroke:'#D8D7D1','stroke-width':1,'stroke-dasharray':'2 5',
      class:'fade',style:`animation-delay:${gi*.1}s`});
    const [lx,ly]=pol(CX,CY,r,-87.5);
    txt(s,{x:lx,y:ly,'font-size':6.5,fill:'#B0AFA9','text-anchor':'middle',
      class:'fade',style:`animation-delay:${gi*.1}s`},'W'+w);
  });
  FEAT.forEach((name,i)=>{
    const a=ang(i),L=LAUNCH[i];
    const mau=Math.round(48-i*3+rnd(i+1,3)*10);
    // hairline spoke from launch to rim
    const [sx,sy]=pol(CX,CY,rOf(L),a),[ex,ey]=pol(CX,CY,rOf(20),a);
    el(s,'line',{x1:sx,y1:sy,x2:ex,y2:ey,stroke:'#DEDDD6','stroke-width':.7,
      class:'fade',style:`animation-delay:${.15+i*.05}s`});
    // weekly texture dots
    for(let w=L+1;w<=20;w++){
      const [x,y]=pol(CX,CY,rOf(w),a);
      el(s,'circle',{cx:x,cy:y,r:1.1+rnd(i+1,w)*1.2,fill:'#B0AFA9',opacity:.8,
        class:'pop',style:`animation-delay:${.2+i*.06+(w-L)*.015}s`});
    }
    // launch dot, sized by MAU
    const [bx,by]=pol(CX,CY,rOf(L),a);
    const big=el(s,'circle',{cx:bx,cy:by,r:Math.sqrt(mau)*1.15,fill:INK,
      class:'pop',style:`animation-delay:${.15+i*.07}s`});
    tip(big,`${name} — launched W${L} · ${mau}k MAU`);
    // rim label along the spoke
    const [tx,ty]=pol(CX,CY,rOf(20)+9,a);
    txt(s,{x:tx,y:ty,'font-size':7,'font-weight':600,fill:'#6A6963',
      transform:`rotate(${a} ${tx} ${ty})`,'dominant-baseline':'middle',
      class:'fade',style:`animation-delay:${.3+i*.05}s`},name);
  });
});
})();


// ════ 5 · radial convergence ════
(()=>{
const N=48,CX=200,CY=162,R=116;
const THEME=[['PERF',15,-75],['INTEGRATIONS',10,-3],['PRICING',9,69],['MOBILE',8,141],['UX',6,213]];
obsReveal('converge',s=>{
  // hub assignment: contiguous blocks with a little organic leakage
  const blocks=THEME.flatMap(([,n],h)=>Array(n).fill(h));
  const hubOf=i=>blocks[i];
  const hubPt=h=>pol(CX,CY,34,THEME[h][2]);
  const counts=[0,0,0,0,0];
  for(let i=0;i<N;i++)counts[hubOf(i)]++;
  for(let i=0;i<N;i++){
    const deg=i/N*360-90,[px,py]=pol(CX,CY,R,deg);
    const h=hubOf(i),[hx,hy]=hubPt(h);
    const c1x=CX+(px-CX)*.42,c1y=CY+(py-CY)*.42;
    const c2x=CX+(hx-CX)*.3,c2y=CY+(hy-CY)*.3;
    el(s,'path',{d:`M${px} ${py} C${c1x} ${c1y} ${c2x} ${c2y} ${hx} ${hy}`,
      fill:'none',stroke:'#B0AFA9','stroke-width':.7,opacity:.55,pathLength:1,
      class:'draw',style:`animation-delay:${i*.018}s`});
    el(s,'circle',{cx:px,cy:py,r:1.6,fill:'#6A6963',
      class:'pop',style:`animation-delay:${i*.018}s`});
    // tiny rim code, flipped on the left half so it stays readable
    const flip=deg>90&&deg<270,[lx,ly]=pol(CX,CY,R+7,deg);
    txt(s,{x:lx,y:ly,'font-size':6.5,fill:MUTED,
      'text-anchor':flip?'end':'start','dominant-baseline':'middle',
      transform:`rotate(${flip?deg+180:deg} ${lx} ${ly})`,
      class:'fade',style:`animation-delay:${.2+i*.01}s`},'R-'+String(i+1).padStart(2,'0'));
  }
  THEME.forEach(([name,,deg],h)=>{
    const [hx,hy]=hubPt(h);
    const hub=el(s,'circle',{cx:hx,cy:hy,r:Math.sqrt(counts[h])*1.55,fill:INK,
      class:'pop',style:`animation-delay:${.5+h*.08}s`});
    tip(hub,`${name} — ${counts[h]} requests`);
    // theme label parked outside the rim, past the code ring
    const [tx,ty]=pol(CX,CY,R+34,deg);
    txt(s,{x:tx,y:ty,'font-size':8,'font-weight':800,fill:INK,'text-anchor':'middle',
      'dominant-baseline':'middle','letter-spacing':'.08em',
      style:`animation-delay:${.6+h*.08}s`,
      class:'fade'},`${name} · ${counts[h]}`);
    // hairline tying the label to its hub, skimming past the rim
    const [gx,gy]=pol(CX,CY,R+22,deg);
    el(s,'line',{x1:hx,y1:hy,x2:gx,y2:gy,stroke:'#C6C5BF','stroke-width':.7,
      'stroke-dasharray':'1 3',class:'fade',style:`animation-delay:${.7+h*.08}s`});
  });
});
})();


// ════ 3 · bubble almanac ════
// the vintage-almanac feel lives in three things: ledger-paper hairlines
// under everything, bubbles big enough to collide, and marginalia. do all three.
(()=>{
const AREAS=['EDITOR','BOARDS','DOCS','CHAT','FLOWS','VAULT','PAGES','SYNC','GRID','VIEWS','HUB','FORMS'];
const BETA={GRID:2023,VIEWS:2024,HUB:2025,FORMS:2025};   // beta until this year
const BORN={EDITOR:2019,BOARDS:2019,DOCS:2019,CHAT:2020,FLOWS:2020,VAULT:2021,PAGES:2021,SYNC:2022,GRID:2022,VIEWS:2023,HUB:2024,FORMS:2024};
obsReveal('almanac',s=>{
  const rowY=i=>62+i*34,colX=j=>132+j*57;
  // ledger paper: hairlines every 6.8px, edge to edge, under everything
  for(let y=40;y<=318;y+=6.8)
    el(s,'line',{x1:56,y1:y,x2:822,y2:y,stroke:'#DEDDD6','stroke-width':.5,
      class:'fade',style:`animation-delay:${(y-40)*.001}s`});
  const vals=[];
  for(let i=0;i<8;i++){
    const yr=2019+i;
    el(s,'line',{x1:56,y1:rowY(i),x2:822,y2:rowY(i),stroke:'#C6C5BF','stroke-width':.9,
      class:'fade',style:`animation-delay:${i*.04}s`});
    txt(s,{x:48,y:rowY(i)+3,'font-size':9,'font-weight':700,fill:'#8F8E88','text-anchor':'end',
      class:'fade',style:`animation-delay:${i*.04}s`},yr);
    AREAS.forEach((a,j)=>{
      if(yr<BORN[a])return;
      const age=yr-BORN[a];
      // steep spread: quiet areas stay pinpricks, busy ones balloon
      const v=Math.round((2+age*5)*(0.25+rnd(i*12+j+1,j+3)**2*2.2));
      vals.push([Math.max(1,v),i,j,a,yr]);
    });
  }
  // draw small over large so the giants sit underneath as washes
  vals.sort((a,b)=>b[0]-a[0]);
  const top3=vals.slice(0,3);
  // hand-drawn circle: radius wobbles around the rim on two slow sine waves,
  // so every bubble is its own slightly-off print — never a compass circle
  const blob=(x,y,r,seed)=>{
    const n=Math.max(14,Math.round(r*1.6)),pts=[];
    for(let t=0;t<n;t++){
      const a=t/n*Math.PI*2;
      const w=1+.055*Math.sin(a*2+seed*7)+.04*Math.sin(a*3+seed*13)+(rnd(seed+t,3)-.5)*.03;
      pts.push([x+Math.cos(a)*r*w,y+Math.sin(a)*r*w]);
    }
    let d=`M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for(let t=0;t<n;t++){
      const p=pts[t],q=pts[(t+1)%n];
      d+=` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${((p[0]+q[0])/2).toFixed(1)} ${((p[1]+q[1])/2).toFixed(1)}`;
    }
    return d+' Z';
  };
  vals.forEach(([v,i,j,a,yr],k)=>{
    const x=colX(j)+(rnd(i*7+j+2,j+9)-.5)*10,  // jitter off the gridline
          y=rowY(i),r=Math.sqrt(v)*3.8;        // big: rows are 34 apart, giants reach ~28 and collide
    const beta=BETA[a]&&yr<=BETA[a];
    const g=el(s,'g',{class:'pop',style:`animation-delay:${.15+k*.012}s`});
    const seed=i*12+j;
    const dot=el(g,'path',beta
      ?{d:blob(x,y,r,seed),fill:'none',stroke:'#8F8E88','stroke-width':1,'stroke-dasharray':'3 3'}
      :{d:blob(x,y,r,seed),fill:INK,'fill-opacity':.09+rnd(i+2,j+4)*.1,
        stroke:INK,'stroke-opacity':.3+rnd(i+5,j+7)*.35,'stroke-width':.6+rnd(i+3,j+11)*.9});
    tip(dot,`${a} · ${yr} — ${v*10} tickets${beta?' (beta)':''}`);
    // escalation core: small wobbly blot, nudged off-center like a press mark
    if(!beta){
      const ox=(rnd(seed+1,17)-.5)*r*.3,oy=(rnd(seed+3,19)-.5)*r*.3;
      el(g,'path',{d:blob(x+ox,y+oy,Math.max(1.4,r*.17),seed+29),fill:INK});
    }
    if(top3.includes(vals[k]))
      txt(s,{x,y:y-r-5,'font-size':8.5,'font-weight':800,fill:INK,'text-anchor':'middle',
        class:'fade',style:'animation-delay:1s'},v*10);
  });
  AREAS.forEach((a,j)=>{
    const x=colX(j);
    txt(s,{x,y:34,'font-size':7.5,'font-weight':700,fill:MUTED,'letter-spacing':'.1em',
      transform:`rotate(-32 ${x} 34)`,class:'fade',style:`animation-delay:${j*.03}s`},a);
  });
  // marginalia: two annotations with pointer hairlines, like the original's notes
  el(s,'path',{d:`M${colX(3)+30} ${rowY(5)-14} C${colX(3)+70} ${rowY(5)-34} ${colX(3)+96} ${rowY(5)-38} ${colX(3)+118} ${rowY(5)-38}`,
    fill:'none',stroke:'#B0AFA9','stroke-width':.7,class:'fade',style:'animation-delay:1.1s'});
  txt(s,{x:colX(3)+124,y:rowY(5)-35,'font-size':7,fill:'#6A6963','font-style':'italic',
    class:'fade',style:'animation-delay:1.1s'},'annual volumes vary across products');
  el(s,'path',{d:`M${colX(9)+16} ${rowY(2)+8} C${colX(9)+40} ${rowY(2)+26} ${colX(9)+60} ${rowY(2)+30} ${colX(9)+80} ${rowY(2)+30}`,
    fill:'none',stroke:'#B0AFA9','stroke-width':.7,class:'fade',style:'animation-delay:1.2s'});
  txt(s,{x:colX(9)+86,y:rowY(2)+33,'font-size':7,fill:'#6A6963','font-style':'italic',
    class:'fade',style:'animation-delay:1.2s'},'dashed outlines identify beta releases');
  // footer strip: important events, the almanac's timeline shelf
  const evY=356;
  el(s,'line',{x1:56,y1:evY-16,x2:822,y2:evY-16,stroke:'#C6C5BF','stroke-width':.8,
    class:'fade',style:'animation-delay:1.2s'});
  txt(s,{x:56,y:evY-24,'font-size':7,'font-weight':800,fill:'#8F8E88','letter-spacing':'.16em',
    class:'fade',style:'animation-delay:1.2s'},'IMPORTANT EVENTS');
  [['2020','SLA introduced'],['2022','self-serve help center'],['2023','general availability'],['2025','AI deflection live']]
  .forEach(([yr,note],k)=>{
    const x=90+k*196;
    el(s,'line',{x1:x,y1:evY-16,x2:x,y2:evY-6,stroke:'#8F8E88','stroke-width':1,
      class:'fade',style:`animation-delay:${1.3+k*.08}s`});
    txt(s,{x,y:evY+4,'font-size':8,'font-weight':800,fill:INK,
      class:'fade',style:`animation-delay:${1.3+k*.08}s`},yr);
    txt(s,{x,y:evY+15,'font-size':7,fill:'#8F8E88',
      class:'fade',style:`animation-delay:${1.3+k*.08}s`},note);
  });
});
})();


// ════ 6 · trend lineage ════
(()=>{
// [name, events [year, type f|o], aliveToday]
const TR=[
  ['Dark mode',[[2017,'f'],[2022,'o']],true],
  ['Kanban',[[2016,'f']],true],
  ['Wikis',[[2016,'f'],[2019,'o']],false],
  ['Slash cmds',[[2018,'f']],true],
  ['Templates',[[2019,'f'],[2024,'o']],true],
  ['Inbox',[[2020,'f']],false],
  ['Live cursors',[[2020,'f'],[2023,'o']],true],
  ['AI drafts',[[2023,'f'],[2025,'o']],true],
  ['Voice notes',[[2021,'f']],false],
  ['Offline',[[2018,'f'],[2026,'o']],true],
];
const Y0=2016,yY=yr=>34+(yr-Y0)*24,colX=c=>76+c*31;
obsReveal('lineage',s=>{
  for(let yr=Y0;yr<=2026;yr++){
    el(s,'line',{x1:60,y1:yY(yr),x2:372,y2:yY(yr),stroke:'#DEDDD6','stroke-width':.8,
      class:'fade',style:`animation-delay:${(yr-Y0)*.03}s`});
    if(yr%2===0)txt(s,{x:52,y:yY(yr)+3,'font-size':8,'font-weight':600,fill:MUTED,'text-anchor':'end',
      class:'fade',style:`animation-delay:${(yr-Y0)*.03}s`},yr);
  }
  TR.forEach(([name,ev,alive],c)=>{
    const x=colX(c);
    // segments between events: solid while fresh, dashed once dormant
    for(let k=0;k<ev.length-1;k++){
      const gap=ev[k+1][0]-ev[k][0];
      el(s,'line',{x1:x,y1:yY(ev[k][0])+7,x2:x,y2:yY(ev[k+1][0])-7,
        stroke:'#B0AFA9','stroke-width':1,
        'stroke-dasharray':gap>2?'2 4':'none',
        class:'fade',style:`animation-delay:${.3+c*.07}s;animation-duration:.6s`});
    }
    const last=ev[ev.length-1][0];
    if(alive)
      el(s,'line',{x1:x,y1:yY(last)+7,x2:x,y2:yY(2026)+16,stroke:'#B0AFA9','stroke-width':1,
        class:'fade',style:`animation-delay:${.45+c*.07}s;animation-duration:.6s`});
    ev.forEach(([yr,t])=>{
      const node=el(s,'circle',t==='f'
        ?{cx:x,cy:yY(yr),r:5.5,fill:INK}
        :{cx:x,cy:yY(yr),r:5.5,fill:PAPER,stroke:INK,'stroke-width':1.4});
      node.setAttribute('class','pop');
      node.style.animationDelay=(.35+c*.07)+'s';
      tip(node,`${name} — ${t==='f'?'shipped':'reworked'} ${yr}`);
    });
    // terminal dot: alive lands on today's baseline, dead stops where it stopped
    el(s,'circle',{cx:x,cy:alive?yY(2026)+16:yY(last)+12,r:alive?3:1.6,
      fill:alive?INK:'#C6C5BF',class:'pop',style:`animation-delay:${.6+c*.07}s`});
    const ly=yY(2026)+26;
    txt(s,{x,y:ly,'font-size':6.8,'font-weight':600,fill:alive?'#4A4944':'#B0AFA9',
      transform:`rotate(-38 ${x} ${ly})`,'text-anchor':'end',
      class:'fade',style:`animation-delay:${.7+c*.05}s`},name);
  });
});
})();


// ════ 8 · type colonnade ════
(()=>{
const PRE=['core','ui','api','data','auth','sync','mail','flag','edge','doc','bot'];
const SUF=['-kit','-svc','-web','-cli','-db','-gw','-sdk','-jobs'];
const TEAM=['平台','前端','后端','数据','基础设施','移动端','安全','增长','机器学习','设计'];
obsReveal('colonnade',s=>{
  const N=44;
  const teamY=j=>36+j*28,repoY=i=>16+i*6.7;
  const counts=Array(10).fill(0);
  const owner=i=>{const w=rnd(i+1,17);return Math.min(9,Math.floor(w*w*10))}; // skewed: low teams hoard
  for(let i=0;i<N;i++)counts[owner(i)]++;
  for(let i=0;i<N;i++){
    const name=PRE[i%11]+SUF[Math.floor(rnd(i+1,8)*8)%8]+(i>21?'-v2':'');
    const yi=repoY(i),j=owner(i),yj=teamY(j);
    txt(s,{x:112,y:yi+2,'font-size':6.5,fill:'#8F8E88','text-anchor':'end',
      class:'fade',style:`animation-delay:${i*.012}s`},name);
    el(s,'rect',{x:117,y:yi-1.2,width:4,height:2.4,fill:'#B0AFA9',
      class:'fade',style:`animation-delay:${i*.012}s`});
    el(s,'path',{d:`M123 ${yi} C 200 ${yi} 220 ${yj} 288 ${yj}`,fill:'none',
      stroke:'#B0AFA9','stroke-width':.6,opacity:.6,pathLength:1,
      class:'draw',style:`animation-delay:${.2+i*.015}s;animation-duration:.7s`});
  }
  TEAM.forEach((t,j)=>{
    const y=teamY(j);
    el(s,'circle',{cx:293,cy:y,r:Math.sqrt(counts[j])*2.7,fill:counts[j]>=7?INK:counts[j]>=4?'#6A6963':'#B0AFA9',
      class:'pop',style:`animation-delay:${.6+j*.05}s`});
    const lab=txt(s,{x:302+counts[j]*.55,y:y+2.5,'font-size':7,'font-weight':700,fill:'#4A4944',
      class:'fade',style:`animation-delay:${.65+j*.05}s`},`${t} · ${counts[j]}`);
    tip(lab,`${t} owns ${counts[j]} repos`);
  });
});
})();


document.getElementById("largest-owner").textContent=Array.from({length:44},(_,i)=>Math.min(9,Math.floor(rnd(i+1,17)**2*10))).filter(i=>i===0).length;

// ════ B4 · tick donut ════
// 环形图的 Lupi 化：ballot tally 的百人队列绕成整圈表盘，1 tick = 1%，
// 四段来源用灰阶 ladder 分段，段间留一格呼吸。中心只放总数和单位说明。
(()=>{
const D=[['ORGANIC',37,INK],['PAID',28,'#4A4944'],['REFERRAL',21,'#8F8E88'],['SOCIAL',14,'#B0AFA9']];
obsReveal('overview-tickdonut',s=>{
  const cx=200,cy=148,R0=64;
  let k0=0;
  D.forEach(([name,v,shade],si)=>{
    for(let k=0;k<v;k++){
      const idx=k0+k,a=idx*3.6-90;
      const len=10+rnd(idx+1,si+2)*6;
      const [x1,y1]=pol(cx,cy,R0,a),[x2,y2]=pol(cx,cy,R0+len,a);
      el(s,'line',{x1,y1,x2,y2,stroke:shade,'stroke-width':1,
        class:'fade',style:`animation-delay:${idx*.012}s`});
      if(idx%10===0){
        const [dx,dy]=pol(cx,cy,R0-5,a);
        el(s,'circle',{cx:dx,cy:dy,r:.8,fill:'#C6C5BF',
          class:'fade',style:`animation-delay:${idx*.012}s`});
      }
    }
    // segment label at mid-angle, outside, tied by a dotted hairline
    const mid=(k0+v/2)*3.6-90,[lx,ly]=pol(cx,cy,R0+38,mid),[gx,gy]=pol(cx,cy,R0+20,mid);
    el(s,'line',{x1:gx,y1:gy,x2:lx,y2:ly,stroke:'#C6C5BF','stroke-width':.7,
      'stroke-dasharray':'1 3',class:'fade',style:`animation-delay:${.6+si*.1}s`});
    const anchor=Math.cos(mid*D2R)>0.3?'start':Math.cos(mid*D2R)<-0.3?'end':'middle';
    const lab=txt(s,{x:lx,y:ly+3,'font-size':8,'font-weight':800,fill:shade,'text-anchor':anchor,
      'letter-spacing':'.06em',style:`paint-order:stroke;stroke:${PAPER};stroke-width:3px;animation-delay:${.65+si*.1}s`,
      class:'fade'},`${name} · ${v}`);
    tip(lab,`${name} · 流量占比 ${v}%`);
    k0+=v;
  });
  txt(s,{x:cx,y:cy-2,'font-size':22,'font-weight':800,fill:INK,'text-anchor':'middle',
    class:'fade',style:'animation-delay:.9s'},'100');
  txt(s,{x:cx,y:cy+14,'font-size':7,'font-weight':600,fill:MUTED,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:.9s'},'TICKS · ONE = 1%');
  txt(s,{x:200,y:296,'font-size':7,'font-weight':600,fill:'#B0AFA9','text-anchor':'middle',
    'letter-spacing':'.12em',class:'fade',style:'animation-delay:1.1s'},
    '十二点方向为零 · 每十格标一个点 · 顺时针阅读');
});
})();



['rungs','dayline','gauge'].forEach(id=>obsReveal('overview-'+id,chartDefinitions.get(id)));

const slides=[...document.querySelectorAll('.slide')];
const viewport=document.getElementById('viewport');
let current=0,noticeTimer;
function fit(){
 document.documentElement.style.setProperty('--scale',Math.min(viewport.clientWidth/1600,viewport.clientHeight/900));
}
function replay(){slides[current].querySelectorAll('svg').forEach(s=>renderers.get(s.id)?.())}
function show(index){
 current=Math.max(0,Math.min(slides.length-1,index));
 slides.forEach((s,i)=>{s.classList.toggle('active',i===current);s.setAttribute('aria-hidden',String(i!==current))});
 const theme=getComputedStyle(slides[current]);
 document.body.style.backgroundColor=theme.backgroundColor;
 document.body.style.color=theme.color;
 document.documentElement.style.backgroundColor=theme.backgroundColor;
 document.getElementById('previous').disabled=current===0;
 document.getElementById('next').disabled=current===slides.length-1;
 document.getElementById('status').textContent=`第 ${current+1} 页，共 ${slides.length} 页`;
 if(document.activeElement?.closest('.slide[aria-hidden="true"]'))viewport.focus({preventScroll:true});
 try{history.replaceState(null,'',`#${current+1}`)}catch{};replay();
}
document.getElementById('previous').onclick=()=>show(current-1);
document.getElementById('next').onclick=()=>show(current+1);
document.querySelectorAll('[data-go]').forEach(link=>link.addEventListener('click',e=>{
 e.preventDefault();e.stopPropagation();show(Number(link.dataset.go)-1);
}));
async function 全屏(){
 const notice=document.getElementById('fullscreen-notice');notice.hidden=true;clearTimeout(noticeTimer);
 try{
  if(document.fullscreenElement)await document.exitFullscreen();
  else await document.documentElement.requestFullscreen();
 }catch{
  notice.textContent='当前预览不允许浏览器全屏。请在独立浏览器窗口打开后，再双击或按 F。';
  notice.hidden=false;noticeTimer=setTimeout(()=>notice.hidden=true,6500);
 }
}
viewport.addEventListener('dblclick',e=>{
 if(e.target.closest('a,button,input,textarea,select'))return;
 e.preventDefault();全屏();
});
window.addEventListener('keydown',e=>{
 if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
 if(['ArrowRight','PageDown'].includes(e.key)||(e.code==='Space'&&!e.target.closest('button,a'))){e.preventDefault();show(current+1)}
 if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}
 if(e.key==='Home'){e.preventDefault();show(0)}
 if(e.key==='End'){e.preventDefault();show(slides.length-1)}
 if(e.key.toLowerCase()==='c'){e.preventDefault();show(1)}
 if(e.key.toLowerCase()==='r'){e.preventDefault();replay()}
 if(e.key.toLowerCase()==='f'){e.preventDefault();全屏()}
});
// Horizontal touch gestures work without introducing visible presentation controls.
let gesture=null,suppressClickUntil=0;
viewport.addEventListener('pointerdown',e=>{
 if(e.pointerType!=='touch'||!e.isPrimary||e.target.closest('a,button'))return;
 gesture={id:e.pointerId,x:e.clientX,y:e.clientY};
});
viewport.addEventListener('pointerup',e=>{
 if(!gesture||gesture.id!==e.pointerId)return;
 const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;gesture=null;
 if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4){suppressClickUntil=Date.now()+500;show(current+(dx<0?1:-1))}
});
viewport.addEventListener('pointercancel',()=>{gesture=null});
viewport.addEventListener('click',e=>{if(Date.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation()}},true);
window.addEventListener('resize',fit);document.addEventListener('fullscreenchange',fit);
new ResizeObserver(fit).observe(viewport);
window.addEventListener('afterprint',fit);
window.addEventListener('beforeprint',()=>renderers.forEach(fn=>fn()));
document.getElementById('signup-peak').textContent=Math.round(Math.max(...Array.from({length:30},(_,d)=>46+22*Math.sin(d/4.6)+14*Math.sin(d/2.1)+rnd(d+1,5)*12)));
document.getElementById('quarter-peak').textContent=Math.round(Math.max(...Array.from({length:90},(_,d)=>95+55*Math.sin(d/9.5)+30*Math.sin(d/3.7)+rnd(d+1,5)*40)));
document.getElementById('overview-signup-peak').textContent=document.getElementById('signup-peak').textContent;
fit();show(8);

