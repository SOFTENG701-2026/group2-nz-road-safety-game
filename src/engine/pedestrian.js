// Pedestrian crossing logic: starts crossing when the player either is
// far away OR has stopped close to the zebra.
import { MAIN_Y } from './constants.js';
import { setCoach, logEvent } from './state.js';

export function stepPedestrian(g, dt) {
  const p = g.ped;
  const c = g.car;
  if (p.state === 'done') return;

  p.t += dt;

  if (p.state === 'waiting') {
    const dx = c.x - p.x;
    const playerApproaching = dx < 0 && dx > -180;

    if (!playerApproaching) {
      if (p.t > 3) { p.state = 'crossing'; p.t = 0; }
    } else if (Math.abs(c.speed) < 8 && dx > -110) {
      p.state = 'crossing';
      p.t = 0;
      if (!g.flags.pedAlerted) {
        logEvent(g, 'Stopped for pedestrian', +5);
        g.flags.pedAlerted = true;
        const obj = g.objectives.find(o => o.id === 'ped');
        if (obj) obj.done = true;
        setCoach(g, 'pedGood');
      }
    }
  } else if (p.state === 'crossing') {
    p.y += p.dir * 32 * dt;
    if (p.y > MAIN_Y + 40) p.dir   = -1;
    if (p.y < MAIN_Y - 90) p.state = 'done';
  }
}
