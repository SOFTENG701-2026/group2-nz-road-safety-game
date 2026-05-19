// NPC car on the side road: only active when the level has a sideX intersection.
import { W, MAIN_Y, LANE } from './constants.js';

export function stepNpc(g, dt) {
  const sideX = g.level?.config?.sideX;
  if (!sideX) return;

  const np = g.npc;
  const c  = g.car;

  if (np.state === 'waiting') {
    if (c.x > sideX + 80) np.state = 'going';
  } else if (np.state === 'going') {
    np.speed = Math.min(70, np.speed + 60 * dt);
    np.y -= np.speed * dt;
    if (np.y < MAIN_Y - 40) np.state = 'turning';
  } else if (np.state === 'turning') {
    const worldW = g.level?.worldWidth ?? W;
    np.speed = Math.min(80, np.speed + 30 * dt);
    np.x += np.speed * dt * 0.7;
    np.y += (MAIN_Y + LANE / 2 - np.y) * Math.min(1, dt * 4);
    if (np.x > worldW - 40) np.state = 'done';
  }
}
