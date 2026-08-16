// Web port of game/TvIdleLife.kt. Coordinates deliberately stay platform-neutral (0..1).
export class TvIdleLife {
  constructor({ idleAfter = 0, seed = 4 } = {}) {
    this.idleAfter = idleAfter; this.rng = mulberry32(seed); this.activity = 'calm'; this.scene = 'room';
    this.catX = .5; this.catY = .62; this.facing = 1; this.lift = 0; this.prey = null;
    this.preyX = .5; this.preyY = .5; this.idleFor = 0; this.left = 0; this.pounce = 0; this.wobble = 0;
  }
  wake() { this.idleFor = 0; this.activity = 'calm'; this.scene = 'room'; this.prey = null; this.pounce = 0; }
  advance(dt) {
    this.idleFor += dt;
    if (this.activity === 'calm') { this.home(dt); if (this.idleFor >= this.idleAfter) this.start(this.pick()); return; }
    this.left -= dt; if (this.left <= 0) { this.start(this.activity === 'wash' ? this.pick() : 'wash'); return; }
    this.wobble += dt;
    if (this.activity === 'mouse') { this.preyX += Math.sin(this.wobble * 4) * dt * .24; this.preyY = .81 + Math.sin(this.wobble*2)*.015; this.chase(dt,.34); }
    if (this.activity === 'butterfly') { this.preyX = .5 + Math.sin(this.wobble*1.3)*.35; this.preyY = .25 + Math.sin(this.wobble*3)*.1; this.chase(dt,.22); this.lift = Math.max(0, 1-Math.abs(this.preyX-this.catX)/.25); }
    if (this.activity === 'laser') { this.preyX=.5+Math.sin(this.wobble*1.7)*.38; this.preyY=.54+Math.cos(this.wobble*2.7)*.25; this.chase(dt,.38); }
    if (this.activity === 'zoomies') { this.catX=.5+Math.sin(this.wobble*2.8)*.39; this.catY=.62+Math.cos(this.wobble*4.3)*.12; this.facing=Math.cos(this.wobble*2.8)>0?1:-1; }
    if (this.activity === 'wash') { this.lift = .1 + Math.sin(this.wobble*5)*.06; }
    this.preyX = clamp(this.preyX,.08,.92);
  }
  home(dt) { this.catX += (.5-this.catX)*dt*2; this.catY += (.62-this.catY)*dt*2; this.lift *= Math.max(0,1-dt*4); }
  chase(dt, speed) { const dx=this.preyX-this.catX, dy=this.preyY-this.catY; const d=Math.hypot(dx,dy)||1; this.catX+=dx/d*speed*dt; this.catY+=dy/d*speed*dt; this.facing=dx>=0?1:-1; }
  pick() { const options=['mouse','butterfly','laser','zoomies']; return options.filter(x=>x!==this.activity)[Math.floor(this.rng()*3)]; }
  start(next) { this.activity=next; this.pounce=0; this.lift=0; this.left=next==='wash'?18+this.rng()*8:next==='zoomies'?6+this.rng()*4:14+this.rng()*8; this.wobble=this.rng()*6.28; this.prey={mouse:'mouse',butterfly:'butterfly',laser:'dot'}[next]||null; const scenes={mouse:['room','yard'],butterfly:['yard','river'],laser:['room','fireplace'],zoomies:['yard','room'],wash:['fireplace','room','river']}; const all=scenes[next]||['room']; this.scene=all[Math.floor(this.rng()*all.length)]; }
}
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function mulberry32(a) { return () => { let t=a+=0x6D2B79F5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
