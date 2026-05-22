// NPC car behaviours:
//   stepNpc        — the single side-road car that drives south through an intersection.
//   stepAmbientNpcs — westbound background traffic that loops across the world.
import { H } from './constants.js';

// ─── Side-road NPC ───────────────────────────────────────────────────────────

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
    np.y    += np.speed * dt;           // drive south (increasing y)
    if (np.y > H + 60) np.state = 'done';
  }
}

// ─── Ambient westbound traffic ────────────────────────────────────────────────

export function stepAmbientNpcs(g, dt) {
  const worldW = g.level?.worldWidth ?? 1600;
  for (const npc of g.ambientNpcs) {
    npc.x -= npc.speed * dt;           // drive west (decreasing x)
    if (npc.x < -120) {
      // Wrap around to the right side with some random spacing
      npc.x     = worldW + 80 + Math.random() * 220;
      npc.speed = npc.speed * (0.9 + Math.random() * 0.2); // slight speed variation
    }
  }
}
