// All road surfaces, lane markings, crossings, school-zone overlay,
// give-way markings, start and finish lines.
import { W, H, ROAD_W, MAIN_Y, SIDE_X, SCHOOL_ZONE, PED_X, START_X, FINISH_X } from '../engine/constants.js';

export function drawRoads(ctx, g) {
  const level = g.level;
  const worldW = level?.worldWidth ?? W;
  const schoolZone = level?.config?.schoolZone;
  const pedX = level?.config?.pedX;
  const sideX = level?.config?.sideX;
  const bridgeX = level?.config?.bridgeX;
  const startX = level?.startX ?? START_X;
  const finishX = level?.finishX ?? FINISH_X;

  // ── Asphalt
  ctx.fillStyle = '#3a3a3e';
  ctx.fillRect(0, MAIN_Y - ROAD_W / 2, worldW, ROAD_W);  // main road
  if (sideX) {
    // Full crossroads: side road extends both north (y=0) and south (y=H)
    ctx.fillRect(sideX - ROAD_W / 2, 0, ROAD_W, H);
  }

  // Shoulders
  ctx.fillStyle = '#5a5a5e';
  ctx.fillRect(0, MAIN_Y - ROAD_W / 2 - 3, worldW, 3);
  ctx.fillRect(0, MAIN_Y + ROAD_W / 2,     worldW, 3);
  if (sideX) {
    ctx.fillRect(sideX - ROAD_W / 2 - 3, 0, 3, H);
    ctx.fillRect(sideX + ROAD_W / 2,     0, 3, H);
  }

  // ── School zone / icy road overlay
  if (schoolZone) {
    const isMountain = level?.id === 'mountain';
    ctx.fillStyle = isMountain ? 'rgba(180,220,255,0.28)' : 'rgba(255,200,80,0.18)';
    ctx.fillRect(schoolZone.x1, MAIN_Y - ROAD_W / 2, schoolZone.x2 - schoolZone.x1, ROAD_W);
    ctx.strokeStyle = isMountain ? '#a8d8ff' : '#f5d56a';
    ctx.lineWidth   = 3;
    ctx.beginPath();
    for (let x = schoolZone.x1 - 60; x < schoolZone.x2 + 60; x += 18) {
      ctx.moveTo(x,      MAIN_Y - ROAD_W / 2 + 6);
      ctx.lineTo(x + 9,  MAIN_Y - ROAD_W / 2 + 14);
      ctx.lineTo(x + 18, MAIN_Y - ROAD_W / 2 + 6);
    }
    ctx.stroke();
  }

  // ── Gravel / unsealed road overlay
  const gravelZone = level?.config?.gravelZone;
  if (gravelZone) {
    const gw = gravelZone.x2 - gravelZone.x1;
    ctx.fillStyle = 'rgba(160,120,60,0.55)';
    ctx.fillRect(gravelZone.x1, MAIN_Y - ROAD_W / 2, gw, ROAD_W);
    // Gravel texture dots
    for (let xi = 0; xi < gw; xi += 14) {
      for (let yi = 0; yi < ROAD_W; yi += 11) {
        const dotX = gravelZone.x1 + xi + ((xi * 7 + yi * 3) % 8);
        const dotY = MAIN_Y - ROAD_W / 2 + yi + ((xi * 3 + yi * 7) % 6);
        ctx.fillStyle = `rgba(${140 + (xi * 3) % 40},${100 + (yi * 2) % 30},${50 + (xi + yi) % 20},0.45)`;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 1.5 + (xi % 3) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ── Center yellow line
  ctx.strokeStyle = '#f6c945';
  ctx.lineWidth   = 3;
  if (sideX) {
    drawDashed(ctx, 0,            MAIN_Y, sideX - 80, MAIN_Y, [22, 16]);
    drawSolid (ctx, sideX - 80,  MAIN_Y, sideX + 80, MAIN_Y);
    drawDashed(ctx, sideX + 80,  MAIN_Y, worldW,     MAIN_Y, [22, 16]);
    drawDashed(ctx, sideX, 0,            sideX, MAIN_Y - 80, [18, 14]);  // north arm
    drawDashed(ctx, sideX, MAIN_Y + 80, sideX, H,           [18, 14]);  // south arm
  } else {
    drawDashed(ctx, 0,            MAIN_Y, worldW,     MAIN_Y, [22, 16]);
  }

  // ── Pedestrian crossing (zebra)
  if (pedX) {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(pedX - 30, MAIN_Y - ROAD_W / 2 + 12 + i * 16, 60, 8);
    }
  }

  // ── Bridge (Level 2)
  if (bridgeX) {
    // Bridge structure
    ctx.fillStyle = '#4a4a4e';
    ctx.fillRect(bridgeX - 100, MAIN_Y - ROAD_W / 2 - 10, 200, ROAD_W + 20);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.strokeRect(bridgeX - 100, MAIN_Y - ROAD_W / 2 - 10, 200, ROAD_W + 20);
    
    // Road narrowing (one lane only)
    ctx.fillStyle = '#3a3a3e';
    ctx.fillRect(bridgeX - 100, MAIN_Y - ROAD_W / 4, 200, ROAD_W / 2);
    
    // Narrowing markings (white diagonal lines on the blocked parts)
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.6;
    for (let x = bridgeX - 100; x < bridgeX + 100; x += 20) {
      // Top narrowing
      ctx.beginPath(); ctx.moveTo(x, MAIN_Y - ROAD_W / 2); ctx.lineTo(x + 10, MAIN_Y - ROAD_W / 2);
      ctx.lineTo(x + 20, MAIN_Y - ROAD_W / 4); ctx.lineTo(x + 10, MAIN_Y - ROAD_W / 4); ctx.closePath(); ctx.fill();
      // Bottom narrowing
      ctx.beginPath(); ctx.moveTo(x, MAIN_Y + ROAD_W / 2); ctx.lineTo(x + 10, MAIN_Y + ROAD_W / 2);
      ctx.lineTo(x + 20, MAIN_Y + ROAD_W / 4); ctx.lineTo(x + 10, MAIN_Y + ROAD_W / 4); ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  // ── Roundabout (Level 3)
  const roundaboutX = level?.config?.roundaboutX;
  if (roundaboutX) {
    // Outer circle
    ctx.fillStyle = '#3a3a3e';
    ctx.beginPath(); ctx.arc(roundaboutX, MAIN_Y, 80, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Central island
    ctx.fillStyle = '#4e7a4e'; // grass
    ctx.beginPath(); ctx.arc(roundaboutX, MAIN_Y, 40, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Directional arrows (visual only)
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
      ctx.save();
      ctx.translate(roundaboutX, MAIN_Y);
      ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(60, -10); ctx.lineTo(75, 0); ctx.lineTo(60, 10); ctx.stroke();
      ctx.restore();
    }
  }

  // ── Railway Crossing (Level 3)
  const railX = level?.config?.railX;
  if (railX) {
    // Rails
    ctx.fillStyle = '#555';
    ctx.fillRect(railX - 10, MAIN_Y - ROAD_W / 2 - 20, 5, ROAD_W + 40);
    ctx.fillRect(railX + 5,  MAIN_Y - ROAD_W / 2 - 20, 5, ROAD_W + 40);
    // Sleepers
    ctx.fillStyle = '#333';
    for (let y = MAIN_Y - ROAD_W / 2 - 20; y < MAIN_Y + ROAD_W / 2 + 20; y += 12) {
      ctx.fillRect(railX - 15, y, 30, 4);
    }
    
    // "X" Road markings
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(railX - 100, MAIN_Y - 30); ctx.lineTo(railX - 40, MAIN_Y + 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(railX - 100, MAIN_Y + 30); ctx.lineTo(railX - 40, MAIN_Y - 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(railX + 40, MAIN_Y - 30); ctx.lineTo(railX + 100, MAIN_Y + 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(railX + 40, MAIN_Y + 30); ctx.lineTo(railX + 100, MAIN_Y - 30); ctx.stroke();
  }

  // ── Give-way marking — white line + triangles across the player's lane
  // Player drives east in the north lane (y < MAIN_Y); marking faces west.
  if (sideX) {
    const laneTop = MAIN_Y - ROAD_W / 2 + 2;
    const laneMid = MAIN_Y - 2;
    // Stop line across the north lane
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.moveTo(sideX - 8, laneTop);
    ctx.lineTo(sideX - 8, laneMid);
    ctx.stroke();
    ctx.setLineDash([]);
    // Two triangles pointing left (west) = toward approaching player
    ctx.fillStyle = '#fff';
    const laneH = laneMid - laneTop;
    for (let i = 0; i < 2; i++) {
      const cy = laneTop + laneH * (0.28 + i * 0.44);
      ctx.beginPath();
      ctx.moveTo(sideX - 4, cy - 7);   // top-right
      ctx.lineTo(sideX - 4, cy + 7);   // bottom-right
      ctx.lineTo(sideX - 20, cy);       // apex pointing west
      ctx.closePath();
      ctx.fill();
    }
  }

  // ── Finish line (checkered)
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 2; j++) {
      ctx.fillStyle = (i + j) % 2 ? '#fff' : '#000';
      ctx.fillRect(finishX + j * 12, MAIN_Y - ROAD_W / 2 + i * 14, 12, 14);
    }
  }

  // ── Start line
  ctx.fillStyle = '#fff';
  ctx.fillRect(startX - 30, MAIN_Y - ROAD_W / 2, 4, ROAD_W);
}

function drawDashed(ctx, x1, y1, x2, y2, dash) {
  ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.setLineDash([]);
}
function drawSolid(ctx, x1, y1, x2, y2) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
