// Car physics step: input → acceleration → steering → position.
// Difficulty only changes the top speed.
import { W, H } from './constants.js';
import { onRoad } from './geofence.js';

const ACCEL       =  30; // forward accel,           px/s²
const REVERSE     =  18; // reverse accel,           px/s²
const FRICTION    =  22; // engine-off drag,         px/s²
const BRAKE_FORCE = 140; // active brake decel,      px/s²
const OFF_ROAD    = 130; // extra drag on grass,     px/s²

const MAX_SPEED = { easy: 270, normal: 310, hard: 360 };

export function stepPhysics(g, dt, difficulty = 'normal') {
  const c = g.car;
  const maxSpeed = MAX_SPEED[difficulty] ?? MAX_SPEED.normal;

  // Throttle / reverse / coast
  if (g.keys.up)        c.speed += ACCEL   * dt;
  else if (g.keys.down) c.speed -= REVERSE * dt;
  else                  c.speed = decay(c.speed, FRICTION * dt);

  // Brake
  if (g.keys.brake) c.speed = decay(c.speed, BRAKE_FORCE * dt);

  // Off-road drag
  if (!onRoad(c.x, c.y, g)) c.speed = decay(c.speed, OFF_ROAD * dt);

  c.speed = Math.max(-60, Math.min(maxSpeed, c.speed));

  // Steering rate depends on speed (no steering when stopped)
  const steerRate = 2.4 * Math.min(1, Math.abs(c.speed) / 60);
  const dir = Math.sign(c.speed || 1);
  if (g.keys.left)  c.angle -= steerRate * dt * dir;
  if (g.keys.right) c.angle += steerRate * dt * dir;

  // Move
  c.x += Math.cos(c.angle) * c.speed * dt;
  c.y += Math.sin(c.angle) * c.speed * dt;

  // Bounds
  const worldW = g.level?.worldWidth ?? W;
  c.x = Math.max(20, Math.min(worldW - 20, c.x));
  c.y = Math.max(20, Math.min(H - 20, c.y));
}

// Bring `speed` toward 0 by `decel`, snapping to 0 when close enough.
function decay(speed, decel) {
  if (Math.abs(speed) < decel) return 0;
  return speed - Math.sign(speed) * decel;
}
