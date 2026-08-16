// Canvas 2D port of the coordinate system used by Android cat/CatArt.kt.
// All geometry is expressed in a square (u) around the supplied center.
export function drawMurchik(ctx, { x, y, u, time, facing = 1, activity = 'calm' }) {
  const fur = { base: '#d99152', shade: '#75402e', belly: '#f7d6ab', patch: '#b86b42' };
  const pt = (px, py) => [x + (px - .5) * u, y + (py - .5) * u];
  const oval = (px, py, rx, ry, fill) => { const [a,b]=pt(px,py);ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(a,b,rx*u,ry*u,0,0,Math.PI*2);ctx.fill(); };
  const line = (points, width, color) => {ctx.strokeStyle=color;ctx.lineWidth=width*u;ctx.lineCap='round';ctx.beginPath();points.forEach(([px,py],i)=>{const [a,b]=pt(px,py);i?ctx.lineTo(a,b):ctx.moveTo(a,b);});ctx.stroke();};
  const sway=Math.sin(time*1.4)*.07;
  ctx.save(); ctx.translate(x,y); ctx.scale(facing,1); ctx.translate(-x,-y);
  oval(.5,.96,.3,.032,'#13203322');
  // Tail behind body, matching the Android CatArt hierarchy.
  ctx.strokeStyle=fur.base;ctx.lineWidth=.095*u;ctx.lineCap='round';ctx.beginPath();let p=pt(.66,.86);ctx.moveTo(...p);let c1=pt(.94,.93+sway*.02),c2=pt(1.03+.05*sway,.62),p3=pt(.85+.05*sway,.50+.07*sway);ctx.bezierCurveTo(...c1,...c2,...p3);ctx.stroke();
  oval(.5,.735,.28,.245,fur.base); oval(.5,.75,.145,.165,fur.belly);
  // Tabby stripes on body.
  for (const yy of [.62,.68,.74,.80]) line([[.27,yy],[.73,yy]],.026,fur.shade);
  // Paws and head.
  oval(.37,.83,.105,.16,fur.base); oval(.63,.83,.105,.16,fur.base);
  ctx.fillStyle=fur.base;ctx.beginPath();ctx.moveTo(...pt(.28,.47));ctx.lineTo(...pt(.34,.19));ctx.lineTo(...pt(.47,.43));ctx.moveTo(...pt(.53,.43));ctx.lineTo(...pt(.66,.19));ctx.lineTo(...pt(.72,.47));ctx.fill();
  oval(.5,.47,.27,.245,fur.base); oval(.5,.56,.17,.10,fur.belly);
  // Forehead M and side tabby marks.
  line([[.38,.36],[.44,.30],[.50,.37],[.56,.30],[.62,.36]],.026,fur.shade);
  line([[.27,.47],[.38,.49]],.024,fur.shade); line([[.73,.47],[.62,.49]],.024,fur.shade);
  const blink=Math.sin(time*.73)>.94;
  for(const eye of [.41,.59]) { const [ex,ey]=pt(eye,.47);ctx.strokeStyle=fur.shade;ctx.lineWidth=.024*u;ctx.beginPath();if(blink){ctx.moveTo(ex-.035*u,ey);ctx.lineTo(ex+.035*u,ey);}else ctx.arc(ex,ey,.047*u,0,Math.PI*2);ctx.stroke(); }
  const [nx,ny]=pt(.5,.55);ctx.fillStyle='#cc7180';ctx.beginPath();ctx.moveTo(nx-.035*u,ny);ctx.lineTo(nx+.035*u,ny);ctx.lineTo(nx,ny+.032*u);ctx.fill();
  for(const side of [-1,1]) for(const off of [-.04,.035,.11]) line([[.5+side*.12,.56],[.5+side*.40,.56+off]],.012,fur.shade);
  if(activity==='wash') line([[.60,.76],[.54,.52]],.075,fur.belly);
  ctx.restore();
}
