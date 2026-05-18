// Pedestrian crossing logic. The pedestrian starts crossing when the player
// is far away or has stopped close to the zebra crossing.
import { MAIN_Y, PED_X } from './constants.js';
import { setCoach, logEvent } from './state.js';

export function stepPedestrian(g, dt) {
  const p = g.ped;
  const c = g.car;
  p.t += dt;

  if (p.state === 'waiting') {
    const dx = c.x - PED_X;
    const playerApproaching = dx < 0 && dx > -180;

    if (!playerApproaching) {
      if (p.t > 3) { p.state = 'crossing'; p.t = 0; }
    } else if (Math.abs(c.speed) < 8 && dx > -110) {
      p.state = 'crossing';
      p.t = 0;
      if (!g.flags.pedAlerted) {
        logEvent(g, 'Stopped for pedestrian', +5);
        g.flags.pedAlerted = true;
        g.objectives.find(o => o.id === 'ped').done = true;
        setCoach(g, 'pedGood');
      }
    }
  } else if (p.state === 'crossing') {
    p.y += p.dir * 32 * dt;
    if (p.y > MAIN_Y + 40)  p.dir   = -1;
    if (p.y < MAIN_Y - 90)  p.state = 'done';
  }
}
