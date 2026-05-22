// NPC car behaviours:
//   stepNpc         — single side-road car driving south through an intersection.
//   stepAmbientNpcs — westbound background traffic that loops across the world.
//                     Near a roundabout, cars curve to the SOUTH arc (clockwise,
//                     NZ left-hand traffic). A minimum following-distance check
//                     prevents cars with different speeds from overlapping.
import { H, MAIN_Y, LANE } from './constants.js';

// ─── Side-road NPC ───────────────────────────────────────────────────────────

export function stepNpc(g, dt) {
  const sideX = g.level?.config?.sideX;
  if (!sideX) return;

  const np = g.npc;
  const c  = g.car;

  if (np.state === 'waiting') {
    if (c.x > sideX - 120) np.state = 'going';
  } else if (np.state === 'going') {
    np.speed = Math.min(78, np.speed + 70 * dt);
    np.y    += np.speed * dt;
    if (np.y > H + 60) np.state = 'done';
  }
}

// ─── Ambient westbound traffic ────────────────────────────────────────────────

const RAB_R_OUT  = 80;
const RAB_R_IN   = 22;
const RAB_R_MID  = (RAB_R_OUT + RAB_R_IN) / 2; // 51

const SOUTH_LANE = MAIN_Y + LANE / 2;           // normal westbound y (587.5)
const SOUTH_ARC  = MAIN_Y + RAB_R_MID;          // south apex at roundabout (611)
// Westbound cars: East entry → clockwise → South arc → West exit

const MIN_GAP = 90; // minimum pixel gap between car centres (car body ≈ 36 px)

export function stepAmbientNpcs(g, dt) {
  const worldW = g.level?.worldWidth ?? 1600;
  const rabX   = g.level?.config?.roundaboutX ?? null;

  // ── Move each car west ──────────────────────────────────────────────────────
  for (const npc of g.ambientNpcs) {
    npc.x -= npc.speed * dt;

    // Roundabout detour: curve to south arc (clockwise NZ)
    if (rabX !== null) {
      const dx = npc.x - rabX;
      if (Math.abs(dx) < RAB_R_OUT) {
        const t  = 1 - (dx / RAB_R_OUT) ** 2; // 0 at edges, 1 at centre
        npc.y = SOUTH_LANE + t * (SOUTH_ARC - SOUTH_LANE);
      } else {
        npc.y = SOUTH_LANE;
      }
    }

    // Wrap around to the right
    if (npc.x < -120) {
      npc.x     = worldW + 80 + Math.random() * 220;
      npc.y     = SOUTH_LANE;
      npc.speed = npc.speed * (0.9 + Math.random() * 0.2);
    }
  }

  // ── Following-distance check ──────────────────────────────────────────────
  // Sort west-first (smallest x = furthest west). Each car must stay at least
  // MIN_GAP pixels behind the car ahead of it.
  const queue = g.ambientNpcs.slice().sort((a, b) => a.x - b.x);
  for (let i = 1; i < queue.length; i++) {
    const ahead  = queue[i - 1]; // further west
    const behind = queue[i];     // further east
    if (behind.x - ahead.x < MIN_GAP) {
      behind.x = ahead.x + MIN_GAP; // nudge behind car east to restore gap
    }
  }
}
