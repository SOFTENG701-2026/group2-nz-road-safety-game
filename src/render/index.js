import { W, H } from '../engine/constants.js';
import { drawPasture }    from './pasture.js';
import { drawScenery }    from './scenery.js';
import { drawRoads }      from './roads.js';
import { drawSigns }      from './signs.js';
import { drawPedestrian } from './pedestrian.js';
import { drawCar }        from './car.js';
import { drawIntersectionTraffic } from './intersection-traffic.js';

export function drawWorld(ctx, g, { hideCar = false } = {}) {
  const worldW  = g.level?.worldWidth ?? W;
  const bgColor = g.level?.bgColor   ?? '#7fb35a';
  
  const zoom = 1.45;
  const dpr = window.devicePixelRatio || 1;
  const canvasW = ctx.canvas.width / dpr;
  const canvasH = ctx.canvas.height / dpr;

  // Calculate the ideal camera position (top-left of viewport in world space)
  // Initially we want car to be at (canvasW/2, canvasH/2)
  let camX = g.car.x - canvasW / (2 * zoom);
  let camY = g.car.y - canvasH / (2 * zoom);

  // Clamp camera to world bounds to avoid showing blank areas outside 0..worldW and 0..H
  // Map dimensions in world space: [0, worldW] x [0, H]
  // Viewport size in world space: [canvasW/zoom, canvasH/zoom]
  const viewW = canvasW / zoom;
  const viewH = canvasH / zoom;

  camX = Math.max(0, Math.min(worldW - viewW, camX));
  camY = Math.max(0, Math.min(H - viewH, camY));

  ctx.save();
  
  // Apply transformation:
  // 1. Scale up
  // 2. Translate by negative camera position
  ctx.scale(zoom, zoom);
  ctx.translate(-camX, -camY);

  drawPasture(ctx, worldW, bgColor);
  drawScenery(ctx, g.level?.scenery ?? []);
  drawRoads(ctx, g);
  drawIntersectionTraffic(ctx, g);
  drawSigns(ctx, g);

  if (g.ped.state !== 'done') drawPedestrian(ctx, g.ped);

  if (!hideCar) drawCar(ctx, g.car.x, g.car.y, g.car.angle, '#d83a2e');

  ctx.restore();
}
