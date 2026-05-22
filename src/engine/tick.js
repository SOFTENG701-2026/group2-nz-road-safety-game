// One game step. Composes physics + NPC + pedestrian + coach/scoring.
import { stepPhysics }              from './physics.js';
import { stepNpc, stepAmbientNpcs } from './npc.js';
import { stepPedestrian }           from './pedestrian.js';
import { stepCoachEvents }          from './coach-events.js';

export function tick(g, dt, difficulty = 'normal') {
  g.t += dt;
  if (!g.finished) g.elapsed += dt;   // level timer stops at finish

  stepPhysics(g, dt, difficulty);
  stepNpc(g, dt);
  stepAmbientNpcs(g, dt);
  stepPedestrian(g, dt);
  stepCoachEvents(g, dt);
}
