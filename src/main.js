const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');
const hint = document.querySelector('#hint');
const menu = document.querySelector('#menu');
let night = false;
let menuOpen = false;
let last = performance.now();
let elapsed = 0;
let lastInput = performance.now();

function fit() {
  const scale = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * scale; canvas.height = innerHeight * scale;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}
addEventListener('resize', fit); fit();

function draw(t) {
  const w = innerWidth, h = innerHeight;
  const day = night ? ['#0a1225', '#24355f'] : ['#68b4d4', '#f5b08b'];
  const sky = ctx.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, day[0]); sky.addColorStop(1, day[1]);
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
  // Slow, non-repeating drift keeps every element moving on OLED panels.
  const x = w * (.5 + .23 * Math.sin(t / 97) + .04 * Math.sin(t / 31));
  const y = h * (.55 + .12 * Math.sin(t / 143));
  const s = Math.min(w, h) * .19;
  const bob = Math.sin(t * 2.1) * s * .018;
  drawCat(x, y + bob, s, t);
  drawClock(w, h, t);
}

function ellipse(x, y, rx, ry, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
function drawCat(x, y, s, t) {
  const fur = '#e6aa70', dark = '#7d4a39', cream = '#fff0d3';
  ellipse(x, y + s*.46, s*.72, s*.15, '#17203022');
  // tail, body, head and ears: an intentionally simple vector cousin of the Android cat.
  ctx.strokeStyle = fur; ctx.lineWidth = s*.17; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x+s*.53,y+s*.34); ctx.bezierCurveTo(x+s*.98,y+s*.1,x+s*.82,y-s*.18,x+s*.62,y); ctx.stroke();
  ellipse(x, y+s*.17, s*.48, s*.53, fur);
  ctx.fillStyle = fur; ctx.beginPath(); ctx.moveTo(x-s*.33,y-s*.34); ctx.lineTo(x-s*.2,y-s*.85); ctx.lineTo(x-.02*s,y-s*.38); ctx.fill(); ctx.beginPath(); ctx.moveTo(x+s*.06,y-s*.38); ctx.lineTo(x+s*.25,y-s*.84); ctx.lineTo(x+s*.37,y-s*.3); ctx.fill();
  ellipse(x, y-s*.22, s*.43, s*.37, fur); ellipse(x, y-s*.12, s*.27, s*.18, cream);
  const blink = Math.sin(t * .73) > .94;
  ctx.strokeStyle = dark; ctx.lineWidth = s*.03; for (const eye of [-1,1]) { ctx.beginPath(); if (blink) { ctx.moveTo(x+eye*s*.16,y-s*.25); ctx.lineTo(x+eye*s*.25,y-s*.25); } else { ctx.arc(x+eye*s*.2,y-s*.25,s*.065,0,Math.PI*2); } ctx.stroke(); }
  ctx.fillStyle = '#cf7080'; ctx.beginPath(); ctx.moveTo(x-s*.045,y-s*.09); ctx.lineTo(x+s*.045,y-s*.09); ctx.lineTo(x,y-s*.035); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth=s*.018; for (const side of [-1,1]) for (const off of [-.06,.03,.12]) {ctx.beginPath();ctx.moveTo(x+side*s*.18,y-s*.08);ctx.lineTo(x+side*s*.48,y+off*s);ctx.stroke();}
  ctx.strokeStyle = dark; ctx.lineWidth=s*.035; for (const k of [-.2,0,.2]) {ctx.beginPath();ctx.moveTo(x-s*.32,y+s*(.15+k*.25));ctx.lineTo(x+s*.32,y+s*(.15+k*.25));ctx.stroke();}
}
function drawClock(w, h, t) { const now = new Date(); const time = now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); const dx = Math.sin(t/211)*w*.04, dy = Math.sin(t/296)*h*.025; ctx.font = `${Math.min(w,h)*.07}px system-ui`; ctx.fillStyle='#fff8e0aa'; ctx.textAlign='right'; ctx.fillText(time,w*.93+dx,h*.12+dy); }

function frame(now) { const dt = Math.min((now-last)/1000,.1); last=now; elapsed+=dt; draw(elapsed); hint.style.opacity = menuOpen || now-lastInput > 4500 ? '0' : '1'; requestAnimationFrame(frame); }
requestAnimationFrame(frame);

function toggleMenu(show) { menuOpen = show; menu.hidden = !show; if (show) menu.querySelector('button').focus(); }
addEventListener('keydown', e => { lastInput=performance.now(); if (e.key === 'Escape' || e.key === 'Backspace') return toggleMenu(false); if (['Enter',' '].includes(e.key)) { if (!menuOpen) toggleMenu(true); return; } if (menuOpen && e.key.startsWith('Arrow')) { e.preventDefault(); const buttons=[...menu.querySelectorAll('button')], i=buttons.indexOf(document.activeElement); buttons[(i+(e.key==='ArrowDown'||e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length].focus(); }});
menu.addEventListener('click', e => { const a=e.target.dataset.action; if (!a) return; if (a==='night') night=!night; if(a==='calm') lastInput=0; toggleMenu(false); });
