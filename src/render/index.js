// Composite world draw — called once per frame from useGame.js.
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

  // Ambient westbound traffic (lower lane)
  for (const npc of g.ambientNpcs ?? []) {
    drawCar(ctx, npc.x, npc.y, Math.PI, npc.color);
  }

  if (g.ped.state !== 'done') drawPedestrian(ctx, g.ped);

  // Side-road NPC — only on levels with sideX
  if (g.level?.config?.sideX && g.npc.state !== 'done') {
    drawCar(ctx, g.npc.x, g.npc.y, Math.PI / 2, '#3b6ec8');
  }

  // Player car
  drawCar(ctx, g.car.x, g.car.y, g.car.angle, '#d83a2e');

  ctx.restore();
}
