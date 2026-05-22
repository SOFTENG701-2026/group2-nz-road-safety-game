import { W } from '../engine/constants.js';
import { drawPasture }    from './pasture.js';
import { drawScenery }    from './scenery.js';
import { drawRoads }      from './roads.js';
import { drawSigns }      from './signs.js';
import { drawPedestrian } from './pedestrian.js';
import { drawCar }        from './car.js';

export function drawWorld(ctx, g, camera) {
  const worldW  = g.level?.worldWidth ?? W;
  const bgColor = g.level?.bgColor   ?? '#7fb35a';

  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  drawPasture(ctx, worldW, bgColor);
  drawScenery(ctx, g.level?.scenery ?? []);
  drawRoads(ctx, g);
  drawSigns(ctx, g);

  if (g.ped.state !== 'done') drawPedestrian(ctx, g.ped);

  drawCar(ctx, g.car.x, g.car.y, g.car.angle, '#d83a2e');

  ctx.restore();
}
