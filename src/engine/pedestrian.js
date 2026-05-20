// Pedestrian crossing logic: starts crossing when the player either is
// far away OR has stopped close to the zebra.
import { MAIN_Y } from './constants.js';
import { setCoach, logEvent } from './state.js';

export function stepPedestrian(g, dt) {
  const p = g.ped;
  const c = g.car;
  if (p.state === 'done') return;

  if (p.state === 'waiting') {
    const dx = c.x - p.x;
    const playerApproaching = dx < 0 && dx > -180;

    if (!playerApproaching) {
      // Player is far away — keep timer at zero so it only counts while player is near
      p.t = 0;
    } else if (Math.abs(c.speed) < 8 && dx > -110 && dx < -30) {
      // Player stopped 30–110 px BEFORE the crossing (not on it) → success
      p.state = 'crossing';
      p.t = 0;
      if (!g.flags.pedAlerted) {
        logEvent(g, 'Stopped for pedestrian', +8);
        g.flags.pedAlerted = true;
        const obj = g.objectives.find(o => o.id === 'ped');
        if (obj) obj.done = true;
        setCoach(g, 'pedGood');
      }
    } else {
      // Player is approaching but hasn't stopped — count up; cross after 5 s
      // so hit-detection can fire if the player drives through at speed.
      p.t += dt;
      if (p.t > 5) { p.state = 'crossing'; p.t = 0; }
    }
  } else if (p.state === 'crossing') {
    p.y += p.dir * 32 * dt;
    if (p.y > MAIN_Y + 60) p.state = 'done';  // crossed south side — done, no return
  }
}
