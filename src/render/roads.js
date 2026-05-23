// All road surfaces, lane markings, crossings, school-zone overlay,
// give-way markings, start and finish lines.
import { W, H, ROAD_W, MAIN_Y, START_X, FINISH_X } from '../engine/constants.js';

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

  // Shoulders — skip through the junction box so no grey line crosses it
  ctx.fillStyle = '#5a5a5e';
  const _hw = ROAD_W / 2; // 55
  if (sideX) {
    // Main road shoulders — two segments either side of junction
    ctx.fillRect(0,           MAIN_Y - _hw - 3, sideX - _hw, 3);
    ctx.fillRect(sideX + _hw, MAIN_Y - _hw - 3, worldW - sideX - _hw, 3);
    ctx.fillRect(0,           MAIN_Y + _hw,     sideX - _hw, 3);
    ctx.fillRect(sideX + _hw, MAIN_Y + _hw,     worldW - sideX - _hw, 3);
    // Side road shoulders — stop at main road edges
    ctx.fillRect(sideX - _hw - 3, 0,           3, MAIN_Y - _hw);
    ctx.fillRect(sideX + _hw,     0,           3, MAIN_Y - _hw);
    ctx.fillRect(sideX - _hw - 3, MAIN_Y + _hw, 3, H - MAIN_Y - _hw);
    ctx.fillRect(sideX + _hw,     MAIN_Y + _hw, 3, H - MAIN_Y - _hw);
  } else {
    ctx.fillRect(0, MAIN_Y - ROAD_W / 2 - 3, worldW, 3);
    ctx.fillRect(0, MAIN_Y + ROAD_W / 2,     worldW, 3);
  }

  // ── School zone / icy road overlay
  if (schoolZone) {
    const isMountain = level?.id === 'mountain';
    ctx.fillStyle = isMountain ? 'rgba(180,220,255,0.28)' : 'rgba(255,200,80,0.18)';
    ctx.fillRect(schoolZone.x1, MAIN_Y - ROAD_W / 2, schoolZone.x2 - schoolZone.x1, ROAD_W);

    // Clip zigzag strictly to the school zone so it can't bleed onto bridge chevrons
    ctx.save();
    ctx.beginPath();
    ctx.rect(schoolZone.x1, MAIN_Y - ROAD_W / 2, schoolZone.x2 - schoolZone.x1, ROAD_W);
    ctx.clip();
    ctx.strokeStyle = isMountain ? '#a8d8ff' : '#f5d56a';
    ctx.lineWidth   = 3;
    ctx.beginPath();
    for (let x = schoolZone.x1 - 60; x < schoolZone.x2 + 60; x += 18) {
      ctx.moveTo(x,      MAIN_Y - ROAD_W / 2 + 6);
      ctx.lineTo(x + 9,  MAIN_Y - ROAD_W / 2 + 14);
      ctx.lineTo(x + 18, MAIN_Y - ROAD_W / 2 + 6);
    }
    ctx.stroke();
    ctx.restore();
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

  // Build a sorted list of x-ranges where no centre line should appear:
  //   • intersection box  → [sideX - lane, sideX + lane]
  //   • bridge + approach → [bridgeX - 180, bridgeX + 180]  (100 deck + 80 chevrons)
  const skipRanges = [];
  if (sideX)   skipRanges.push([sideX - _hw,   sideX + _hw]);
  if (bridgeX) skipRanges.push([bridgeX - 200, bridgeX + 200]); // stop line to stop line
  skipRanges.sort((a, b) => a[0] - b[0]);

  let lx = 0;
  for (const [lo, hi] of skipRanges) {
    if (lx < lo) drawDashed(ctx, lx, MAIN_Y, lo, MAIN_Y, [22, 16]);
    lx = Math.max(lx, hi);
  }
  if (lx < worldW) drawDashed(ctx, lx, MAIN_Y, worldW, MAIN_Y, [22, 16]);

  // Side-road centre dashes (vertical, skipping the main road junction)
  if (sideX) {
    drawDashed(ctx, sideX, 0,            sideX, MAIN_Y - _hw, [18, 14]);
    drawDashed(ctx, sideX, MAIN_Y + _hw, sideX, H,            [18, 14]);
  }

  // ── Intersection stop lines — one lane each, not full road width
  // NZ left-hand traffic: each direction stays in its own half.
  if (sideX) {
    ctx.fillStyle = '#fff';
    const hw = ROAD_W / 2; // half road = 55 px = one lane
    const lw = 4;

    // Main road — each stop line spans only the approaching lane (half road):
    // Eastbound (upper lane, y < MAIN_Y) stops at west junction edge
    ctx.fillRect(sideX - hw - lw, MAIN_Y - hw, lw, hw);
    // Westbound (lower lane, y > MAIN_Y) stops at east junction edge
    ctx.fillRect(sideX + hw,      MAIN_Y,      lw, hw);

    // Side road — each stop line spans only the approaching lane:
    // Southbound (east half, x > sideX) stops at north junction edge
    ctx.fillRect(sideX,      MAIN_Y - hw - lw, hw, lw);
    // Northbound (west half, x < sideX) stops at south junction edge
    ctx.fillRect(sideX - hw, MAIN_Y + hw,      hw, lw);
  }

  // ── Pedestrian crossing (zebra)
  if (pedX) {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(pedX - 30, MAIN_Y - ROAD_W / 2 + 12 + i * 16, 60, 8);
    }
  }

  // ── One-lane bridge: river/gorge + deck + guardrails
  if (bridgeX) {
    const BL      = bridgeX - 100;
    const BR      = bridgeX + 100;
    const BLen    = 200;
    const deckTop = MAIN_Y - ROAD_W / 4;
    const deckBot = MAIN_Y + ROAD_W / 4;
    const deckH   = ROAD_W / 2;
    const roadTop = MAIN_Y - ROAD_W / 2;
    const roadBot = MAIN_Y + ROAD_W / 2;

    // ① River / gorge beneath — fills the full road-width slot
    ctx.fillStyle = '#4e8ab5';
    ctx.fillRect(BL, roadTop, BLen, roadBot - roadTop);

    // Water ripples — clipped to the river rectangle so arcs can't bleed outside
    ctx.save();
    ctx.beginPath();
    ctx.rect(BL, roadTop, BLen, roadBot - roadTop);
    ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1;
    for (let rx = BL + 14; rx < BR; rx += 26) {
      ctx.beginPath(); ctx.arc(rx,      MAIN_Y - ROAD_W * 0.34, 6, Math.PI, 0); ctx.stroke();
      ctx.beginPath(); ctx.arc(rx + 13, MAIN_Y + ROAD_W * 0.34, 5, Math.PI, 0); ctx.stroke();
    }
    ctx.restore();

    // ② Steel girder frame (slightly wider/taller than the deck)
    ctx.fillStyle = '#6a6a74';
    ctx.fillRect(BL, deckTop - 5, BLen, deckH + 10);

    // ③ Bridge deck — single-lane concrete surface
    ctx.fillStyle = '#3c3c44';
    ctx.fillRect(BL, deckTop, BLen, deckH);

    // ④ Guardrails along the deck edges
    ctx.strokeStyle = '#b8bcc4';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(BL, deckTop); ctx.lineTo(BR, deckTop); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(BL, deckBot); ctx.lineTo(BR, deckBot); ctx.stroke();

    // Rail posts (vertical stubs, evenly spaced)
    ctx.lineWidth = 1.5;
    for (let px = BL; px <= BR; px += 14) {
      ctx.beginPath(); ctx.moveTo(px, deckTop - 5); ctx.lineTo(px, deckTop); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, deckBot);     ctx.lineTo(px, deckBot + 5); ctx.stroke();
    }

    // ⑤ Stop lines — placed at the OUTER edge of the approach chevron zone
    //   (BL-82 / BR+82), so drivers wait before the road narrows.
    ctx.fillStyle = '#fff';
    const _bHw = ROAD_W / 2; // 55 px — one lane width
    // West entry: eastbound traffic (upper/north lane)
    ctx.fillRect(BL - 100, MAIN_Y - _bHw, 4, _bHw);
    // East entry: westbound traffic (lower/south lane)
    ctx.fillRect(BR + 96, MAIN_Y, 4, _bHw);

    // ⑥ Approach chevrons on road surface — warn of lane narrowing
    // Painted on the asphalt BEFORE and AFTER the bridge, each side
    ctx.fillStyle = 'rgba(245,184,29,0.60)';
    for (let side = -1; side <= 1; side += 2) {
      const inner = MAIN_Y + side * ROAD_W / 4;
      const outer = MAIN_Y + side * (ROAD_W / 2 - 4);
      for (let i = 0; i < 4; i++) {
        // Left approach: chevrons pointing RIGHT (toward bridge)
        const lx = BL - 18 - i * 20;
        ctx.beginPath();
        ctx.moveTo(lx - 8, outer); ctx.lineTo(lx + 8, outer);
        ctx.lineTo(lx + 2, inner); ctx.lineTo(lx - 14, inner);
        ctx.closePath(); ctx.fill();
        // Right approach: chevrons pointing LEFT (back to full road)
        const rx = BR + 18 + i * 20;
        ctx.beginPath();
        ctx.moveTo(rx + 8, outer); ctx.lineTo(rx - 8, outer);
        ctx.lineTo(rx - 2, inner); ctx.lineTo(rx + 14, inner);
        ctx.closePath(); ctx.fill();
      }
    }
  }

  // ── Roundabout: 4-way junction (N/S arms + E/W main road) + clockwise ring
  const roundaboutX = level?.config?.roundaboutX;
  if (roundaboutX) {
    const R_OUT = 80;
    const R_IN  = 22;
    const R_MID = (R_OUT + R_IN) / 2;
    const hw    = ROAD_W / 2; // 55

    // ① North and south road arm. Draw it through the roundabout so it tucks
    // underneath the circular road, matching the natural E/W road join.
    ctx.fillStyle = '#3a3a3e';
    ctx.fillRect(roundaboutX - hw, 0, ROAD_W, H);

    // Arm shoulders
    ctx.fillStyle = '#5a5a5e';
    ctx.fillRect(roundaboutX - hw - 3, 0,              3, MAIN_Y - R_OUT);
    ctx.fillRect(roundaboutX + hw,     0,              3, MAIN_Y - R_OUT);
    ctx.fillRect(roundaboutX - hw - 3, MAIN_Y + R_OUT, 3, H - MAIN_Y - R_OUT);
    ctx.fillRect(roundaboutX + hw,     MAIN_Y + R_OUT, 3, H - MAIN_Y - R_OUT);

    // Arm centre dashed lines (yellow)
    ctx.strokeStyle = '#f6c945';
    ctx.lineWidth   = 3;
    drawDashed(ctx, roundaboutX, 0,              roundaboutX, MAIN_Y - R_OUT, [18, 14]);
    drawDashed(ctx, roundaboutX, MAIN_Y + R_OUT, roundaboutX, H,             [18, 14]);

    // ② Ring road disc
    ctx.fillStyle = '#3a3a3e';
    ctx.beginPath(); ctx.arc(roundaboutX, MAIN_Y, R_OUT, 0, Math.PI * 2); ctx.fill();

    // // ③ Dashed outer border
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth   = 3;
    ctx.setLineDash([14, 8]);
    ctx.beginPath(); ctx.arc(roundaboutX, MAIN_Y, R_OUT, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    // ④ Central grass island
    ctx.fillStyle = '#4e7a4e';
    ctx.beginPath(); ctx.arc(roundaboutX, MAIN_Y, R_IN, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b8bcc4';
    ctx.lineWidth   = 2.5;
    ctx.beginPath(); ctx.arc(roundaboutX, MAIN_Y, R_IN, 0, Math.PI * 2); ctx.stroke();

    // ⑤ Clockwise direction arrows on the ring road
    // tx/ty = clockwise tangent direction at each arrow position
    // ctx.fillStyle = 'rgba(255,255,255,0.85)';
    // for (let i = 0; i < 4; i++) {
    //   const a  = i * Math.PI / 2;
    //   const px = roundaboutX + Math.cos(a) * R_MID;
    //   const py = MAIN_Y      + Math.sin(a) * R_MID;
    //   const tx = -Math.sin(a); // clockwise tangent x
    //   const ty =  Math.cos(a); // clockwise tangent y
    //   ctx.save();
    //   ctx.translate(px, py);
    //   ctx.beginPath();
    //   ctx.moveTo(tx * 7,              ty * 7);
    //   ctx.lineTo(-tx * 4 - ty * 3.5, -ty * 4 + tx * 3.5);
    //   ctx.lineTo(-tx * 4 + ty * 3.5, -ty * 4 - tx * 3.5);
    //   ctx.closePath();
    //   ctx.fill();
    //   ctx.restore();
    // }

    // ⑥ Give-way lines at each entry (dashed white across approach lane)
    ctx.strokeStyle = 'rgba(255,255,255,1)';
    ctx.lineWidth   = 3;
    // ctx.setLineDash([8, 6]);
    // East entry (westbound lane: lower half)
    ctx.beginPath();
    ctx.moveTo(roundaboutX + R_OUT, MAIN_Y);
    ctx.lineTo(roundaboutX + R_OUT, MAIN_Y + hw);
    ctx.stroke();
    // West entry (eastbound lane: upper half)
    ctx.beginPath();
    ctx.moveTo(roundaboutX - R_OUT, MAIN_Y - hw);
    ctx.lineTo(roundaboutX - R_OUT, MAIN_Y);
    ctx.stroke();
    // North entry (southbound lane: east half)
    ctx.beginPath();
    ctx.moveTo(roundaboutX,      MAIN_Y - R_OUT);
    ctx.lineTo(roundaboutX + hw, MAIN_Y - R_OUT);
    ctx.stroke();
    // South entry (northbound lane: west half)
    ctx.beginPath();
    ctx.moveTo(roundaboutX - hw, MAIN_Y + R_OUT);
    ctx.lineTo(roundaboutX,      MAIN_Y + R_OUT);
    ctx.stroke();
    ctx.setLineDash([]);
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


  // Finish line (checkered)
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 2; j++) {
      ctx.fillStyle = (i + j) % 2 ? '#fff' : '#000';
      ctx.fillRect(finishX + j * 12, MAIN_Y - ROAD_W / 2 + i * 14, 12, 14);
    }
  }

  // Start line
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
