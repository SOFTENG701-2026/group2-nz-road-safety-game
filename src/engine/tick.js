// One game step. Composes physics + NPC + pedestrian + coach/scoring.
import { stepPhysics }     from './physics.js';
import { stepNpc }         from './npc.js';
import { stepPedestrian }  from './pedestrian.js';
import { stepCoachEvents } from './coach-events.js';

export function tick(g, dt, difficulty = 'normal') {
  g.t += dt;
  stepPhysics(g, dt, difficulty);
  stepNpc(g, dt);
  stepPedestrian(g, dt);
  stepCoachEvents(g, dt);
}
