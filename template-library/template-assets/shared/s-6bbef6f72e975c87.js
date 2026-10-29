
/* ── mono-tokens 内联（色板 / 几何 / 工具函数与正本一致）── */
const BG='#F0EFEB',TXT='#58402E',MUT='rgba(88,64,46,.60)',LAB='rgba(88,64,46,.72)',FAINT='rgba(88,64,46,.40)';
const QUIET='rgba(88,64,46,.15)',GRID='rgba(88,64,46,.16)';
const DATA='#43593B',DATA2='#58402E',HERO='#D4A017',FAINTDATA='#ACAD79';
const SER=['#43593B','#D4A017','#77835A','#F2D17E','#ACAD79','#58402E'];   // 分类色：一簇一色
const RAMP=['#F2D17E','#ACAD79','#929960','#77835A','#43593B'];            // 5 档序数梯（浅→重）
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

/* ════ 图A · L1 launch fan ════
   结构照搬 lupi-gallery "launch fan"：辐条按发布周排序，
   大点（月活）沿对角弧滚落，周环虚线作导轨。 */
(()=>{
const FEAT=['编辑器','看板','文档','聊天','流程','保险库','页面','同步','表格','视图','中枢','表单'];
const LAUNCH=[1,3,4,6,8,9,11,12,14,16,17,19];     // 发布周
const CX=40,CY=314,rOf=w=>56+w*9.7;
obsReveal('fan',s=>{
  const ang=i=>-84+i*(76/11);
  // 周环虚线导轨
  [5,10,15,20].forEach((w,gi)=>{
    const r=rOf(w),[x1,y1]=pol(CX,CY,r,-84),[x2,y2]=pol(CX,CY,r,-8);
    el(s,'path',{d:`M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`,fill:'none',
      stroke:QUIET,'stroke-width':1,'stroke-dasharray':'2 5',
      class:'fade',style:`animation-delay:${gi*.1}s`});
    const [lx,ly]=pol(CX,CY,r,-87.5);
    txt(s,{x:lx,y:ly,'font-size':6.5,fill:FAINT,'text-anchor':'middle',
      class:'fade',style:`animation-delay:${gi*.1}s`},'第'+w+'周');
  });
  FEAT.forEach((name,i)=>{
    const a=ang(i),L=LAUNCH[i];
    const col=RAMP[4-Math.min(4,Math.floor((L-1)/4))];   // 上线越早 = 越重
    const mau=Math.round(48-i*3+rnd(i+1,3)*10);
    // 发丝辐条：从发布点到轮辋
    const [sx,sy]=pol(CX,CY,rOf(L),a),[ex,ey]=pol(CX,CY,rOf(20),a);
    el(s,'line',{x1:sx,y1:sy,x2:ex,y2:ey,stroke:QUIET,'stroke-width':.7,
      class:'fade',style:`animation-delay:${.15+i*.05}s`});
    // 周纹理点
    for(let w=L+1;w<=20;w++){
      const [x,y]=pol(CX,CY,rOf(w),a);
      el(s,'circle',{cx:x,cy:y,r:1.1+rnd(i+1,w)*1.2,fill:col,opacity:.55,
        class:'pop',style:`animation-delay:${.2+i*.06+(w-L)*.015}s`});
    }
    // 发布点：面积 = 月活
    const [bx,by]=pol(CX,CY,rOf(L),a);
    const big=el(s,'circle',{cx:bx,cy:by,r:Math.sqrt(mau)*1.15,fill:col,
      class:'pop',style:`animation-delay:${.15+i*.07}s`});
    tip(big,`${name} —— 第 ${L} 周发布 · 月活 ${mau}k`);
    // 轮辋标签沿辐条走
    const [tx,ty]=pol(CX,CY,rOf(20)+9,a);
    txt(s,{x:tx,y:ty,'font-size':7.5,'font-weight':600,fill:LAB,
      transform:`rotate(${a} ${tx} ${ty})`,'dominant-baseline':'middle',
      class:'fade',style:`animation-delay:${.3+i*.05}s`},name);
  });
});
})();

/* ════ 图B · L5 radial convergence ════
   结构照搬 lupi-gallery "radial convergence"：48 条请求在轮辋
   带编号站好，贝塞尔曲线被五个主题枢纽拽进去，枢纽面积 = 请求数，
   少量请求"漏"到别的主题（organic leakage）。 */
(()=>{
const N=48,CX=200,CY=166,R=116;
const THEME=[['性能',15,-75],['集成',10,-3],['定价',9,69],['移动端',8,141],['体验',6,213]];
obsReveal('converge',s=>{
  const blocks=THEME.flatMap(([,n],h)=>Array(n).fill(h));
  const hubOf=i=>rnd(i+1,11)>.92?(blocks[i]+2)%5:blocks[i];
  const hubPt=h=>pol(CX,CY,34,THEME[h][2]);
  const counts=[0,0,0,0,0];
  for(let i=0;i<N;i++)counts[hubOf(i)]++;
  for(let i=0;i<N;i++){
    const deg=i/N*360-90,[px,py]=pol(CX,CY,R,deg);
    const h=hubOf(i),[hx,hy]=hubPt(h);
    const c1x=CX+(px-CX)*.42,c1y=CY+(py-CY)*.42;
    const c2x=CX+(hx-CX)*.3,c2y=CY+(hy-CY)*.3;
    el(s,'path',{d:`M${px} ${py} C${c1x} ${c1y} ${c2x} ${c2y} ${hx} ${hy}`,
      fill:'none',stroke:SER[h],'stroke-width':.9,opacity:.62,pathLength:1,
      class:'draw',style:`animation-delay:${i*.018}s`});
    el(s,'circle',{cx:px,cy:py,r:1.6,fill:SER[h],
      class:'pop',style:`animation-delay:${i*.018}s`});
    // 轮辋小编号，左半翻转保持可读
    const flip=deg>90&&deg<270,[lx,ly]=pol(CX,CY,R+7,deg);
    txt(s,{x:lx,y:ly,'font-size':5.5,fill:MUT,
      'text-anchor':flip?'end':'start','dominant-baseline':'middle',
      transform:`rotate(${flip?deg+180:deg} ${lx} ${ly})`,
      class:'fade',style:`animation-delay:${.2+i*.01}s`},'R-'+String(i+1).padStart(2,'0'));
  }
  THEME.forEach(([name,,deg],h)=>{
    const [hx,hy]=hubPt(h);
    const hub=el(s,'circle',{cx:hx,cy:hy,r:Math.sqrt(counts[h])*1.55,
      fill:counts[h]===Math.max(...counts)?HERO:SER[h],
      class:'pop',style:`animation-delay:${.5+h*.08}s`});
    tip(hub,`${name} —— ${counts[h]} 条请求`);
    const [tx,ty]=pol(CX,CY,R+34,deg);
    txt(s,{x:tx,y:ty,'font-size':8.5,'font-weight':800,fill:TXT,'text-anchor':'middle',
      'dominant-baseline':'middle','letter-spacing':'.06em',
      style:`paint-order:stroke;stroke:${BG};stroke-width:3px;animation-delay:${.6+h*.08}s`,
      class:'fade'},`${name} · ${counts[h]}`);
    const [gx,gy]=pol(CX,CY,R+22,deg);
    el(s,'line',{x1:hx,y1:hy,x2:gx,y2:gy,stroke:FAINT,'stroke-width':.7,
      'stroke-dasharray':'1 3',class:'fade',style:`animation-delay:${.7+h*.08}s`});
  });
});
})();

/* ════ 图C · bubble almanac ════
   结构照搬 lupi-gallery "bubble almanac"：账本发丝纸垫底、
   手绘抖动气泡（blob，两个慢波 + 噪声）、beta 虚线圈、
   升级件墨核、斜排列头、旁注 + 底部大事记。860 宽整行。 */
(()=>{
const AREAS=['编辑器','看板','文档','聊天','流程','保险库','页面','同步','表格','视图','中枢','表单'];
const BETA={'表格':2023,'视图':2024,'中枢':2025,'表单':2025};   // beta 到这一年
const BORN={'编辑器':2019,'看板':2019,'文档':2019,'聊天':2020,'流程':2020,'保险库':2021,'页面':2021,'同步':2022,'表格':2022,'视图':2023,'中枢':2024,'表单':2024};
obsReveal('almanac',s=>{
  const rowY=i=>62+i*34,colX=j=>132+j*57;
  // 账本纸：6.8px 一根发丝，边到边，垫在一切下面
  for(let y=40;y<=318;y+=6.8)
    el(s,'line',{x1:56,y1:y,x2:822,y2:y,stroke:QUIET,'stroke-width':.5,
      class:'fade',style:`animation-delay:${(y-40)*.001}s`});
  const vals=[];
  for(let i=0;i<8;i++){
    const yr=2019+i;
    el(s,'line',{x1:56,y1:rowY(i),x2:822,y2:rowY(i),stroke:GRID,'stroke-width':.9,
      class:'fade',style:`animation-delay:${i*.04}s`});
    txt(s,{x:48,y:rowY(i)+3,'font-size':9,'font-weight':700,fill:MUT,'text-anchor':'end',
      class:'fade',style:`animation-delay:${i*.04}s`},yr);
    AREAS.forEach((a,j)=>{
      if(yr<BORN[a])return;
      const age=yr-BORN[a];
      const v=Math.round((2+age*5)*(0.25+rnd(i*12+j+1,j+3)**2*2.2));
      vals.push([Math.max(1,v),i,j,a,yr]);
    });
  }
  vals.sort((a,b)=>b[0]-a[0]);
  const top3=vals.slice(0,3);
  // 手绘圆：圆周叠两个慢波 + 噪声，seed 定形——没有一只是圆规圆
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
    const x=colX(j)+(rnd(i*7+j+2,j+9)-.5)*10,
          y=rowY(i),r=Math.sqrt(v)*3.8;
    const beta=BETA[a]&&yr<=BETA[a],isTop=top3.includes(vals[k]);
    const col=RAMP[Math.min(4,Math.floor(v/12))];        // 票量 5 档
    const g=el(s,'g',{class:'pop',style:`animation-delay:${.15+k*.012}s`});
    const seed=i*12+j;
    const dot=el(g,'path',beta
      ?{d:blob(x,y,r,seed),fill:'none',stroke:DATA2,'stroke-width':1.2,'stroke-dasharray':'3 3'}
      :{d:blob(x,y,r,seed),fill:col,'fill-opacity':.16+rnd(i+2,j+4)*.14,
        stroke:isTop?HERO:col,'stroke-opacity':isTop?.95:.5+rnd(i+5,j+7)*.38,'stroke-width':.6+rnd(i+3,j+11)*.9});
    tip(dot,`${a} · ${yr} 年 —— ${v*10} 张工单${beta?'（beta 期）':''}`);
    // 升级件墨核：小抖动墨块，压偏一点，像印刷压痕
    if(!beta){
      const ox=(rnd(seed+1,17)-.5)*r*.3,oy=(rnd(seed+3,19)-.5)*r*.3;
      el(g,'path',{d:blob(x+ox,y+oy,Math.max(1.4,r*.17),seed+29),fill:isTop?HERO:TXT});
    }
    if(top3.includes(vals[k]))
      txt(s,{x,y:y-r-5,'font-size':8.5,'font-weight':800,fill:HERO,'text-anchor':'middle',
        style:`paint-order:stroke;stroke:${BG};stroke-width:3px;animation-delay:1s`,
        class:'fade'},v*10);
  });
  AREAS.forEach((a,j)=>{
    const x=colX(j);
    txt(s,{x,y:34,'font-size':8,'font-weight':700,fill:MUT,'letter-spacing':'.06em',
      transform:`rotate(-32 ${x} 34)`,class:'fade',style:`animation-delay:${j*.03}s`},a);
  });
  // 旁注：指针发丝 + 小字批注，像原版年鉴的手记。
  // 只保留右上这条——左半图气泡太密，任何批注放进去都会被淹掉。
  el(s,'path',{d:`M${colX(9)+16} ${rowY(2)+8} C${colX(9)+40} ${rowY(2)+26} ${colX(9)+60} ${rowY(2)+30} ${colX(9)+80} ${rowY(2)+30}`,
    fill:'none',stroke:FAINT,'stroke-width':.7,class:'fade',style:'animation-delay:1.2s'});
  txt(s,{x:colX(9)+86,y:rowY(2)+33,'font-size':7.5,fill:LAB,
    class:'fade',style:'animation-delay:1.2s'},'beta 几乎不产生工单——没人给玩具报 bug');
  // 底部大事记：年鉴的时间线搁板
  const evY=360;
  el(s,'line',{x1:56,y1:evY-16,x2:822,y2:evY-16,stroke:FAINT,'stroke-width':.8,
    class:'fade',style:'animation-delay:1.2s'});
  txt(s,{x:56,y:evY-24,'font-size':7.5,'font-weight':800,fill:MUT,'letter-spacing':'.14em',
    class:'fade',style:'animation-delay:1.2s'},'大事记');
  [['2020','引入 SLA'],['2022','自助帮助中心上线'],['2023','GA 大年'],['2025','AI 分流上线']]
  .forEach(([yr,note],k)=>{
    const x=90+k*196;
    el(s,'line',{x1:x,y1:evY-16,x2:x,y2:evY-6,stroke:MUT,'stroke-width':1,
      class:'fade',style:`animation-delay:${1.3+k*.08}s`});
    txt(s,{x,y:evY+4,'font-size':8.5,'font-weight':800,fill:TXT,
      class:'fade',style:`animation-delay:${1.3+k*.08}s`},yr);
    txt(s,{x,y:evY+15,'font-size':7.5,fill:MUT,
      class:'fade',style:`animation-delay:${1.3+k*.08}s`},note);
  });
});
})();

/* ════ 图D · L9 hourglass stream ════
   结构照搬 lupi-gallery "hourglass stream"：每层条带是 barcode
   （一根 ≈ 40 人），层间 34 根细线涓流承接，左缘停靠转化率，
   右侧发丝引出层名和人数。 */
(()=>{
const STAGE=[['访客',4200],['注册',1900],['激活',960],['留存',540],['付费',310]];
obsReveal('hourglass',s=>{
  const CXm=185,sy=k=>34+k*64,w=c=>c/4200*290;
  STAGE.forEach(([name,c],k)=>{
    const y=sy(k),hw=w(c)/2;
    // barcode 条带：一根 ≈ 40 人
    const n=Math.round(c/40);
    for(let t=0;t<n;t++){
      const x=CXm-hw+(t+.5)/n*hw*2+(rnd(t+1,k+3)-.5)*3;
      el(s,'line',{x1:x,y1:y-6,x2:x,y2:y+6,stroke:RAMP[k],'stroke-width':1.4,
        opacity:.7+rnd(t+2,k+5)*.3,class:'fade',style:`animation-delay:${k*.12+t*.004}s`});
    }
    // 涓流细线，流向下一层条带
    if(k<4){
      const hw1=w(STAGE[k+1][1])/2;
      for(let t=0;t<34;t++){
        const xt=CXm+(rnd(t+1,k*7+1)-.5)*2*hw*.94;
        const xb=CXm+(rnd(t+3,k*7+5)-.5)*2*hw1*.94;
        el(s,'path',{d:`M${xt} ${y+8} C${xt} ${y+34} ${xb} ${sy(k+1)-34} ${xb} ${sy(k+1)-8}`,
          fill:'none',stroke:FAINTDATA,'stroke-width':.7,opacity:.45,pathLength:1,
          class:'draw',style:`animation-delay:${.2+k*.15+t*.008}s;animation-duration:.8s`});
      }
      // 层间转化率，停靠左缘
      const pct=Math.round(STAGE[k+1][1]/c*100);
      txt(s,{x:26,y:(y+sy(k+1))/2+3,'font-size':8.5,'font-weight':800,fill:DATA,
        class:'fade',style:`animation-delay:${.5+k*.15}s`},pct+'%');
      txt(s,{x:26,y:(y+sy(k+1))/2+13,'font-size':6.5,'font-weight':600,fill:FAINT,
        'letter-spacing':'.06em',class:'fade',style:`animation-delay:${.5+k*.15}s`},'走到下层');
    }
    // 层名，发丝拴在条带边上
    el(s,'line',{x1:CXm+hw+6,y1:y,x2:340,y2:y,stroke:GRID,'stroke-width':.8,
      class:'fade',style:`animation-delay:${.3+k*.12}s`});
    txt(s,{x:344,y:y-1,'font-size':8,'font-weight':700,fill:LAB,
      'letter-spacing':'.06em',class:'fade',style:`animation-delay:${.35+k*.12}s`},name);
    txt(s,{x:344,y:y+10,'font-size':9.5,'font-weight':800,fill:TXT,
      class:'fade',style:`animation-delay:${.4+k*.12}s`},c.toLocaleString());
  });
});
})();

