import { stepPhysics }     from './physics.js';
import { stepPedestrian }  from './pedestrian.js';
import { stepCoachEvents } from './coach-events.js';
import { stepIntersectionTraffic } from './intersection-traffic.js';

export function tick(g, dt, difficulty = 'normal') {
  if (g.crashed) return;

  g.t += dt;
  if (!g.finished) g.elapsed += dt;

  stepPhysics(g, dt, difficulty);
  stepIntersectionTraffic(g, dt);
  stepPedestrian(g, dt);
  stepCoachEvents(g, dt);
}
