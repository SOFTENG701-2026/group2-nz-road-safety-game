// NPC car on the side road: drives south through the intersection.
// Starts moving only when the player reaches the intersection entrance.
import { H } from './constants.js';

export function stepNpc(g, dt) {
  const sideX = g.level?.config?.sideX;
  if (!sideX) return;

  const np = g.npc;
  const c  = g.car;

  if (np.state === 'waiting') {
    // Trigger exactly when player reaches the intersection entrance
    if (c.x > sideX - 120) np.state = 'going';
  } else if (np.state === 'going') {
    np.speed = Math.min(78, np.speed + 70 * dt);
    np.y += np.speed * dt;          // drive south (increasing y)
    if (np.y > H + 60) np.state = 'done';
  }
}
