import { stepPhysics }     from './physics.js';
import { stepPedestrian }  from './pedestrian.js';
import { stepCoachEvents } from './coach-events.js';

export function tick(g, dt, difficulty = 'normal') {
  g.t += dt;
  if (!g.finished) g.elapsed += dt;

  stepPhysics(g, dt, difficulty);
  stepPedestrian(g, dt);
  stepCoachEvents(g, dt);
}
