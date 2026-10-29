
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
const DATA='#43593B',DATA2='#77835A',HERO='#D4A017',FAINTDATA='#ACAD79',WHEAT='#F2D17E';
const CAT4=['#43593B','#77835A','#ACAD79','#F2D17E'];

/* ════ 模块A · F5 tick rows ════
   结构照搬 basics-gallery "tick rows"：1 tick = 4 人。
   琥珀只给榜首行。加墨：线宽 1.6，地板 .85。 */
(()=>{
const D=[['CLAUDE CODE',52],['CURSOR',44],['COPILOT',31],['CODEX',22],['WINDSURF',14],['其他',9]];
obsReveal('tools',s=>{
  const y0=i=>34+i*38,X0=104,PX=4.9;
  D.forEach(([name,v],i)=>{
    const y=y0(i),hero=i===0;
    txt(s,{x:94,y:y+3,'font-size':8,'font-weight':700,fill:MUT,'text-anchor':'end',
      'letter-spacing':'.04em',class:'fade',style:`animation-delay:${i*.08}s`},name);
    el(s,'line',{x1:X0,y1:y+8,x2:X0+55*PX,y2:y+8,stroke:GRID,'stroke-width':.8,
      class:'fade',style:`animation-delay:${i*.08}s`});
    for(let k=0;k<v;k++){
      const x=X0+k*PX+PX/2,h=8+rnd(k+1,i+2)*5;
      el(s,'line',{x1:x,y1:y+8,x2:x,y2:y+8-h,stroke:hero?HERO:DATA,'stroke-width':1.6,
        opacity:.85+rnd(k+3,i+5)*.15,class:'fade',style:`animation-delay:${i*.08+k*.01}s`});
      if(k%5===4)el(s,'circle',{cx:x,cy:y+12,r:.9,fill:FAINTDATA,
        class:'fade',style:`animation-delay:${i*.08+k*.01}s`});
    }
    const lab=txt(s,{x:X0+v*PX+9,y:y+3,'font-size':10.5,'font-weight':800,
      fill:hero?HERO:DATA,class:'fade',style:`animation-delay:${.4+i*.08}s`},v*4);
    tip(lab,`${name} —— ${v*4} 人常用`);
  });
  txt(s,{x:200,y:252,'font-size':7,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:.9s'},
    '一格 = 4 人 · 每五格一个圆点');
});
})();

/* ════ 模块B · 深绿卡竖 lollipop ════
   结构 = lupi-gallery "barcode lollipop" 的稀疏竖排版：一杆一件事，
   杆高 = 提及人数。深卡上纸色反白，榜首换麦黄（PALM.HERODK 规则：
   深底上琥珀读不出，强调走麦黄）。 */
(()=>{
const D=[['写测试',101],['读旧代码',76],['自动化脚本',66],['起项目',63],['查文档',62],
         ['重构',58],['调 CSS',56],['PR 描述',53],['SQL',49],['正则',46],['爬虫',44],['起名',28]];
obsReveal('todo',s=>{
  const X0=34,PX=37,base=196,map=v=>base-v*1.45;
  el(s,'line',{x1:X0-12,y1:base,x2:X0+11*PX+14,y2:base,stroke:'rgba(240,239,235,.25)',
    'stroke-width':.8,class:'fade'});
  D.forEach(([name,v],i)=>{
    const x=X0+i*PX,y=map(v),hero=i===0;
    const col=hero?WHEAT:'#F0EFE9';
    el(s,'line',{x1:x,y1:base,x2:x,y2:y,stroke:col,'stroke-width':hero?1.6:1,
      opacity:hero?1:.8,class:'fade',style:`animation-delay:${.1+i*.05}s`});
    const dot=el(s,'circle',{cx:x,cy:y,r:hero?5:3.4,fill:col,
      class:'pop',style:`animation-delay:${.2+i*.05}s`});
    tip(dot,`${name} —— ${v} 人提及`);
    txt(s,{x,y:y-9,'font-size':9,'font-weight':800,fill:col,'text-anchor':'middle',
      class:'fade',style:`animation-delay:${.4+i*.05}s`},v);
    txt(s,{x:x+3,y:base+8,'font-size':7,'font-weight':600,fill:'rgba(240,239,235,.75)',
      'text-anchor':'end',transform:`rotate(-52 ${x+3} ${base+8})`,
      class:'fade',style:`animation-delay:${.15+i*.05}s`},name);
  });
  txt(s,{x:240,y:242,'font-size':7,'font-weight':600,fill:'rgba(240,239,235,.5)',
    'text-anchor':'middle','letter-spacing':'.1em',class:'fade',style:'animation-delay:.9s'},
    '一杆 = 一件事 · 杆高 = 提及人数');
});
})();

/* ════ 模块D · L14 hundred field（轨道版）════
   结构照搬 lupi-gallery "hundred field"：golden-angle 撒布 1 点 = 1 人，
   四簇横排成轨道带（学图6 的轨道气泡阵），虚线连簇心。
   PALM 色相=类目：CAT4 一簇一色。spoke 加墨 ×1.8。 */
(()=>{
const SEG=[['同事安利',41,CAT4[0]],['社媒刷到',27,CAT4[1]],['播客/视频',19,CAT4[2]],['公司要求',13,CAT4[3]]];
const POS=[[96,150],[250,120],[386,170],[496,130]];
obsReveal('orbit',s=>{
  [[0,1],[1,2],[2,3]].forEach(([a,b],k)=>{
    el(s,'line',{x1:POS[a][0],y1:POS[a][1],x2:POS[b][0],y2:POS[b][1],
      stroke:GRID,'stroke-width':.8,'stroke-dasharray':'2 5',
      class:'fade',style:`animation-delay:${.9+k*.1}s`});
  });
  SEG.forEach(([name,v,shade],ci)=>{
    const [cx,cy]=POS[ci];
    let edge=0;
    for(let k=0;k<v;k++){
      const a=k*137.508+ci*55;
      const rr=4+Math.sqrt(k)*5.6+rnd(k+1,ci+2)*3;
      edge=Math.max(edge,rr);
      const [x,y]=pol(cx,cy,rr,a);
      if(k%5===0)el(s,'line',{x1:cx,y1:cy,x2:x,y2:y,stroke:FAINTDATA,'stroke-width':1.1,
        opacity:.85,class:'fade',style:`animation-delay:${ci*.14+k*.012}s`});
      const dot=el(s,'circle',{cx:x,cy:y,r:1.5+rnd(k+2,ci+3)*1.7,fill:shade,opacity:.9,
        class:'pop',style:`animation-delay:${ci*.14+k*.012}s`});
      tip(dot,`${name} —— 100 人中的 ${v} 人之一`);
    }
    el(s,'circle',{cx,cy,r:2.4,fill:TXT,class:'pop',style:`animation-delay:${ci*.14}s`});
    txt(s,{x:cx,y:cy+edge+14,'font-size':8.5,'font-weight':800,fill:TXT,'text-anchor':'middle',
      'letter-spacing':'.06em',style:`paint-order:stroke;stroke:${BG};stroke-width:3px;animation-delay:${.5+ci*.12}s`,
      class:'fade'},`${name} · ${v}`);
  });
  txt(s,{x:280,y:292,'font-size':7.5,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:1.3s'},
    '一点 = 一人 · 41 + 27 + 19 + 13 = 100');
});
})();

/* ════ 模块E · F1 rung bars ════
   结构照搬 basics-gallery "rung bars"：1 档 = 8 人，
   琥珀只给最大来源。 */
(()=>{
const D=[['视频教程',20],['X / 推特',20],['技术播客',17],['即刻/社群',17],['官方文档',16],
         ['朋友演示',13],['公众号',13],['线下活动',10],['其他',6]];
obsReveal('sources',s=>{
  const x0=i=>44+i*54,base=216,step=6.4,HW=15;
  D.forEach(([name,v],i)=>{
    const x=x0(i),hero=i===0;
    for(let k=0;k<v;k++){
      const y=base-k*step,w=HW-1.5+rnd(k+1,i+2)*3;
      el(s,'line',{x1:x-w,y1:y,x2:x+w,y2:y,stroke:hero?HERO:DATA,'stroke-width':1.8,
        opacity:.85+rnd(k+2,i+4)*.15,class:'fade',style:`animation-delay:${i*.07+k*.012}s`});
      if(k%5===4)el(s,'circle',{cx:x+HW+4.5,cy:y,r:.9,fill:FAINTDATA,
        class:'fade',style:`animation-delay:${i*.07+k*.012}s`});
    }
    const topY=base-(v-1)*step;
    const num=txt(s,{x,y:topY-9,'font-size':10.5,'font-weight':800,
      fill:hero?HERO:DATA,'text-anchor':'middle',
      class:'fade',style:`animation-delay:${.4+i*.07}s`},v*8);
    tip(num,`${name} —— ${v*8} 人`);
    txt(s,{x:x+3,y:base+12,'font-size':7,'font-weight':700,fill:MUT,'text-anchor':'end',
      transform:`rotate(-46 ${x+3} ${base+12})`,
      class:'fade',style:`animation-delay:${i*.07}s`},name);
  });
  el(s,'line',{x1:20,y1:base+4,x2:500,y2:base+4,stroke:GRID,'stroke-width':.8,class:'fade'});
  txt(s,{x:260,y:264,'font-size':7,'font-weight':600,fill:FAINT,'text-anchor':'middle',
    'letter-spacing':'.1em',class:'fade',style:'animation-delay:.9s'},
    '一档 = 8 人 · 每五档一个圆点');
});
})();

/* ════ 模块F · F5 tick rows 迷你 ════
   最看好的方向对比。琥珀只给榜首。 */
(()=>{
const D=[['AGENT 工作流',64],['代码审查',43],['UI 生成',36],['数据分析',28],['写作辅助',19]];
obsReveal('interest',s=>{
  const y0=i=>26+i*32,X0=104,PX=3.6;
  D.forEach(([name,v],i)=>{
    const y=y0(i),hero=i===0;
    txt(s,{x:96,y:y+3,'font-size':7.5,'font-weight':700,fill:MUT,'text-anchor':'end',
      'letter-spacing':'.04em',class:'fade',style:`animation-delay:${i*.08}s`},name);
    el(s,'line',{x1:X0,y1:y+7,x2:X0+70*PX,y2:y+7,stroke:GRID,'stroke-width':.7,
      class:'fade',style:`animation-delay:${i*.08}s`});
    for(let k=0;k<v;k++){
      const x=X0+k*PX+PX/2,h=7+rnd(k+1,i+2)*4;
      el(s,'line',{x1:x,y1:y+7,x2:x,y2:y+7-h,stroke:hero?HERO:DATA,'stroke-width':1.4,
        opacity:.85+rnd(k+3,i+5)*.15,class:'fade',style:`animation-delay:${i*.08+k*.008}s`});
      if(k%5===4)el(s,'circle',{cx:x,cy:y+10.5,r:.8,fill:FAINTDATA,
        class:'fade',style:`animation-delay:${i*.08+k*.008}s`});
    }
    const lab=txt(s,{x:X0+v*PX+8,y:y+3,'font-size':9.5,'font-weight':800,
      fill:hero?HERO:DATA,class:'fade',style:`animation-delay:${.4+i*.08}s`},v*4);
    tip(lab,`${name} —— ${v*4} 人看好`);
  });
});
})();

