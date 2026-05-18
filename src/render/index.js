// Composite world draw — called once per frame from useGame.js.
import { drawPasture }    from './pasture.js';
import { drawScenery }    from './scenery.js';
import { drawRoads }      from './roads.js';
import { drawSigns }      from './signs.js';
import { drawPedestrian } from './pedestrian.js';
import { drawCar }        from './car.js';

export function drawWorld(ctx, g, camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  drawPasture(ctx);
  drawScenery(ctx);
  drawRoads(ctx, g);
  drawSigns(ctx, g);

  if (g.ped.state !== 'done') drawPedestrian(ctx, g.ped);

  // NPC car heading. `waiting` and `going` face north (-π/2);
  // `turning` eases toward east.
  const npAngle =
    g.npc.state === 'turning'
      ? -Math.PI / 4 + Math.min(0, (g.npc.x - 1180) / 200)
      : -Math.PI / 2;
  drawCar(ctx, g.npc.x, g.npc.y, npAngle, '#3b6ec8');

  drawCar(ctx, g.car.x, g.car.y, g.car.angle, '#d83a2e');

  ctx.restore();
}
