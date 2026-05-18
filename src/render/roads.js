// All road surfaces, lane markings, crossings, school-zone overlay,
// give-way markings, start and finish lines.
import { W, H, ROAD_W, MAIN_Y, SIDE_X, SCHOOL_ZONE, PED_X, START_X, FINISH_X } from '../engine/constants.js';

export function drawRoads(ctx) {
  // ── Asphalt
  ctx.fillStyle = '#3a3a3e';
  ctx.fillRect(0, MAIN_Y - ROAD_W / 2, W, ROAD_W);                                 // main
  ctx.fillRect(SIDE_X - ROAD_W / 2, MAIN_Y - ROAD_W / 2, ROAD_W, H - MAIN_Y + ROAD_W / 2); // side

  // Shoulders
  ctx.fillStyle = '#5a5a5e';
  ctx.fillRect(0, MAIN_Y - ROAD_W / 2 - 3, W, 3);
  ctx.fillRect(0, MAIN_Y + ROAD_W / 2,     W, 3);
  ctx.fillRect(SIDE_X - ROAD_W / 2 - 3, MAIN_Y - ROAD_W / 2, 3, H - MAIN_Y + ROAD_W / 2);
  ctx.fillRect(SIDE_X + ROAD_W / 2,     MAIN_Y - ROAD_W / 2, 3, H - MAIN_Y + ROAD_W / 2);

  // ── School zone overlay (warm tint on asphalt)
  ctx.fillStyle = 'rgba(255, 200, 80, 0.18)';
  ctx.fillRect(SCHOOL_ZONE.x1, MAIN_Y - ROAD_W / 2, SCHOOL_ZONE.x2 - SCHOOL_ZONE.x1, ROAD_W);

  // School zone zig-zag warning markings
  ctx.strokeStyle = '#f5d56a';
  ctx.lineWidth   = 3;
  ctx.beginPath();
  for (let x = SCHOOL_ZONE.x1 - 60; x < SCHOOL_ZONE.x2 + 60; x += 18) {
    ctx.moveTo(x,      MAIN_Y - ROAD_W / 2 + 6);
    ctx.lineTo(x + 9,  MAIN_Y - ROAD_W / 2 + 14);
    ctx.lineTo(x + 18, MAIN_Y - ROAD_W / 2 + 6);
  }
  ctx.stroke();

  // ── Center yellow line (dashed except near intersection)
  ctx.strokeStyle = '#f6c945';
  ctx.lineWidth   = 3;
  drawDashed(ctx, 0,            MAIN_Y, SIDE_X - 80, MAIN_Y, [22, 16]);
  drawSolid (ctx, SIDE_X - 80,  MAIN_Y, SIDE_X + 80, MAIN_Y);
  drawDashed(ctx, SIDE_X + 80,  MAIN_Y, W,           MAIN_Y, [22, 16]);
  drawDashed(ctx, SIDE_X,       MAIN_Y + 80, SIDE_X, H,      [18, 14]);

  // ── Pedestrian crossing (zebra)
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(PED_X - 30, MAIN_Y - ROAD_W / 2 + 12 + i * 16, 60, 8);
  }

  // ── Give-way triangle painted on side road
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(SIDE_X - 18, MAIN_Y + ROAD_W / 2 + 8);
  ctx.lineTo(SIDE_X + 18, MAIN_Y + ROAD_W / 2 + 8);
  ctx.lineTo(SIDE_X,      MAIN_Y + ROAD_W / 2 + 36);
  ctx.closePath();
  ctx.fill();

  // ── Finish line (checkered)
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 2; j++) {
      ctx.fillStyle = (i + j) % 2 ? '#fff' : '#000';
      ctx.fillRect(FINISH_X + j * 12, MAIN_Y - ROAD_W / 2 + i * 14, 12, 14);
    }
  }

  // ── Start line
  ctx.fillStyle = '#fff';
  ctx.fillRect(START_X - 30, MAIN_Y - ROAD_W / 2, 4, ROAD_W);
}

function drawDashed(ctx, x1, y1, x2, y2, dash) {
  ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.setLineDash([]);
}
function drawSolid(ctx, x1, y1, x2, y2) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
