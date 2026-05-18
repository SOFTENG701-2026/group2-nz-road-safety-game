// Car physics step: input, acceleration, steering, then position.
// Difficulty only changes the top speed.
import { W, H } from './constants.js';
import { onRoad } from './geofence.js';

const ACCEL       = 220; // forward accel, px/s^2
const REVERSE     = 120; // reverse accel, px/s^2
const FRICTION    =  80; // engine-off drag, px/s^2
const BRAKE_FORCE = 320; // active brake decel, px/s^2
const OFF_ROAD    = 260; // extra drag on grass, px/s^2

const MAX_SPEED = { easy: 110, normal: 140, hard: 170 };

export function stepPhysics(g, dt, difficulty = 'normal') {
  const c = g.car;
  const maxSpeed = MAX_SPEED[difficulty] ?? MAX_SPEED.normal;

  if (g.keys.up)        c.speed += ACCEL   * dt;
  else if (g.keys.down) c.speed -= REVERSE * dt;
  else                  c.speed = decay(c.speed, FRICTION * dt);

  if (g.keys.brake) c.speed = decay(c.speed, BRAKE_FORCE * dt);
  if (!onRoad(c.x, c.y)) c.speed = decay(c.speed, OFF_ROAD * dt);

  c.speed = Math.max(-60, Math.min(maxSpeed, c.speed));

  const steerRate = 2.4 * Math.min(1, Math.abs(c.speed) / 60);
  const dir = Math.sign(c.speed || 1);
  if (g.keys.left)  c.angle -= steerRate * dt * dir;
  if (g.keys.right) c.angle += steerRate * dt * dir;

  c.x += Math.cos(c.angle) * c.speed * dt;
  c.y += Math.sin(c.angle) * c.speed * dt;

  c.x = Math.max(20, Math.min(W - 20, c.x));
  c.y = Math.max(20, Math.min(H - 20, c.y));
}

function decay(speed, decel) {
  if (Math.abs(speed) < decel) return 0;
  return speed - Math.sign(speed) * decel;
}
