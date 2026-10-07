const scene=document.querySelector('.archive-scene');
const button=document.querySelector('.scene-motion');
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches||new URLSearchParams(location.search).has('paused');
function render(){scene.classList.toggle('is-paused',paused);button.setAttribute('aria-pressed',String(paused));button.querySelector('.motion-label').textContent=paused?'开启动效':'暂停动效';button.firstElementChild.textContent=paused?'▷':'Ⅱ';}
button.addEventListener('click',()=>{paused=!paused;render();});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{paused=e.matches;render();});
render();
