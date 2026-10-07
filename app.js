const player=document.querySelector('#motion-player');
const play=document.querySelector('#play');
const stagePlay=document.querySelector('#stage-play');
const scrub=document.querySelector('#scrub');
const frames=[...document.querySelectorAll('.frame')];
let state={time:0,duration:2.5432,playing:false,rate:1,loop:false};
const format=t=>`00:${Math.max(0,t).toFixed(2).padStart(5,'0')}`;
function command(command,value){player.contentWindow.postMessage({type:'kelen-command',command,value},location.origin);}
function renderPlayback(){
 document.querySelector('#play-icon').textContent=state.playing?'Ⅱ':'▶';
 document.querySelector('#play-label').textContent=state.playing?'暂停':'播放';
 play.setAttribute('aria-label',state.playing?'暂停':'播放');
 stagePlay.hidden=state.playing||state.time>0;
 scrub.max=state.duration;scrub.value=state.time;
 document.querySelector('#time').textContent=`${format(state.time)} / ${format(state.duration)}`;
 const loop=document.querySelector('#loop');loop.setAttribute('aria-pressed',String(state.loop));loop.querySelector('span').textContent=state.loop?'ON':'OFF';
}
window.addEventListener('message',e=>{if(e.origin===location.origin&&e.source===player.contentWindow&&e.data?.type==='kelen-state'){state=e.data;renderPlayback();}});
player.addEventListener('load',()=>{command('state');command('rate',document.querySelector('#speed').value);});
function toggle(){command(state.playing?'pause':'play');}
play.addEventListener('click',toggle);stagePlay.addEventListener('click',toggle);
document.querySelector('#restart').addEventListener('click',()=>command('restart'));
scrub.addEventListener('input',()=>command('seek',Number(scrub.value)));
document.querySelector('#loop').addEventListener('click',()=>command('loop',!state.loop));
document.querySelector('#speed').addEventListener('change',e=>command('rate',Number(e.target.value)));
document.querySelector('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('#video-stage').requestFullscreen();}catch{document.querySelector('#player-message').textContent='全屏暂时不可用，可以直接放大页面。';}});
frames.forEach(frame=>frame.addEventListener('click',()=>{
 command('pause');command('seek',Number(frame.dataset.time));frames.forEach(f=>f.setAttribute('aria-pressed',String(f===frame)));
 document.querySelector('#frame-status').textContent=`已定位：${frame.querySelector('b').textContent}`;
 document.querySelector('#preview').scrollIntoView({behavior:'instant'});
}));
const dialog = document.querySelector('#share-dialog');
document.querySelectorAll('.demo-replay').forEach(button=>button.addEventListener('click',()=>{
  document.getElementById(button.dataset.demo).src=button.dataset.source+'?replay='+Date.now();
  button.textContent=button.dataset.demo==='intro-demo'?'↺ 重播开场':'↺ 重新开始';
}));
document.querySelector('#share').addEventListener('click',()=>{
  const url=new URL(location.href);url.hash='';
  document.querySelector('#share-url').value=url.href;document.querySelector('#copy-status').textContent='';dialog.showModal();
});
document.querySelector('#copy-link').addEventListener('click',async()=>{
  const input=document.querySelector('#share-url');
  try{await navigator.clipboard.writeText(input.value);document.querySelector('#copy-status').textContent='链接已复制。';document.querySelector('#share-status').textContent='网页链接已复制，粘贴即可分享。';}
  catch{input.focus();input.select();document.querySelector('#copy-status').textContent='请选择并手动复制链接。';}
});
dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
const observer=new IntersectionObserver(entries=>{const active=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(active)document.querySelectorAll('.rail nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+active.target.id));},{rootMargin:'-10% 0px -40% 0px',threshold:[0,.1,.5]});
document.querySelectorAll('main>section').forEach(section=>observer.observe(section));
renderPlayback();
