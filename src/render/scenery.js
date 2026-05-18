// Render the SCENERY array: pastures, sheep, school building, houses,
// bushes, ferns. Each branch is independent and easy to extend.
import { SCENERY } from '../engine/scenery.js';

export function drawScenery(ctx) {
  for (const s of SCENERY) {
    switch (s.kind) {
      case 'pasture': drawPasture(ctx, s); break;
      case 'school':  drawSchool(ctx, s);  break;
      case 'house':   drawHouse(ctx, s);   break;
      case 'bush':    drawBush(ctx, s);    break;
      case 'fern':    drawFern(ctx, s);    break;
    }
  }
}

function drawPasture(ctx, s) {
  ctx.fillStyle = '#86c462';
  ctx.fillRect(s.x, s.y, s.w, s.h);
  ctx.strokeStyle = '#6a7c5a';
  ctx.lineWidth   = 2;
  ctx.setLineDash([6, 6]);
  ctx.strokeRect(s.x, s.y, s.w, s.h);
  ctx.setLineDash([]);
  // Sheep
  for (let i = 0; i < s.sheep; i++) {
    const sx = s.x + 30 + ((i * 71) % (s.w - 50));
    const sy = s.y + 40 + ((i * 53) % (s.h - 60));
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#222';
    ctx.fillRect(sx - 2, sy - 3, 2, 2);
  }
}

function drawSchool(ctx, s) {
  ctx.fillStyle = '#f4e4b8'; ctx.fillRect(s.x, s.y, s.w, s.h);
  ctx.fillStyle = '#c4503a'; ctx.fillRect(s.x, s.y, s.w, 26);          // roof stripe
  ctx.fillStyle = '#7ec1d8';                                           // windows
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(s.x + 20 + i * 42, s.y + 60,  24, 30);
    ctx.fillRect(s.x + 20 + i * 42, s.y + 100, 24, 30);
  }
  ctx.fillStyle = '#5a3826';                                            // door
  ctx.fillRect(s.x + s.w / 2 - 12, s.y + s.h - 36, 24, 36);
  ctx.fillStyle = '#1a3a5a';                                            // sign plate
  ctx.fillRect(s.x + 8, s.y + 6, 70, 14);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 9px ui-sans-serif';
  ctx.fillText('TE KURA', s.x + 14, s.y + 16);
}

function drawHouse(ctx, s) {
  const c1 = `oklch(0.78 0.10 ${s.hue})`;
  const c2 = `oklch(0.45 0.12 ${s.hue})`;
  ctx.fillStyle = c1; ctx.fillRect(s.x, s.y, s.w, s.h);
  ctx.fillStyle = c2; ctx.fillRect(s.x, s.y, s.w, 14);                  // roof
  ctx.fillStyle = '#5a3826'; ctx.fillRect(s.x + s.w / 2 - 8, s.y + s.h - 22, 16, 22);
  ctx.fillStyle = '#9cd6e8';                                            // windows
  ctx.fillRect(s.x + 10, s.y + 24, 18, 16);
  ctx.fillRect(s.x + s.w - 28, s.y + 24, 18, 16);
}

function drawBush(ctx, s) {
  ctx.fillStyle = '#3d6e2a';
  ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4d8a35';
  ctx.beginPath(); ctx.arc(s.x - s.r * 0.3, s.y - s.r * 0.3, s.r * 0.6, 0, Math.PI * 2); ctx.fill();
}

function drawFern(ctx, s) {
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.scale(s.s, s.s);
  ctx.fillStyle = '#2a4a1f';
  ctx.beginPath(); ctx.ellipse(0, 0, 6, 20, 0, 0, Math.PI * 2); ctx.fill();
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.ellipse(i * 2, i * 4, 10 - Math.abs(i), 4, i * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
