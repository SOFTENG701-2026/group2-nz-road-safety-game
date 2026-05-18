// NPC car on the side road: waits for player to pass, then turns east.
import { W, MAIN_Y, LANE, SIDE_X } from './constants.js';

export function stepNpc(g, dt) {
  const np = g.npc;
  const c  = g.car;
  const playerNearInter = c.x > SIDE_X - 260 && c.x < SIDE_X + 80;

  if (np.state === 'waiting') {
    if (c.x > SIDE_X + 80) np.state = 'going';
  } else if (np.state === 'going') {
    np.speed = Math.min(70, np.speed + 60 * dt);
    np.y -= np.speed * dt;
    if (np.y < MAIN_Y - 40) np.state = 'turning';
  } else if (np.state === 'turning') {
    np.speed = Math.min(80, np.speed + 30 * dt);
    np.x += np.speed * dt * 0.7;
    np.y += (MAIN_Y + LANE / 2 - np.y) * Math.min(1, dt * 4);
    if (np.x > W - 40) np.state = 'done';
  }
}
