// Draws every road sign in SIGNS. Each kind is a small standalone helper
// so you can add new sign types without touching the others.
import { SIGNS } from '../engine/signs-data.js';

export function drawSigns(ctx) {
  for (const s of SIGNS) drawSign(ctx, s);
}

function drawSign(ctx, s) {
  ctx.save();
  ctx.translate(s.x, s.y);
  switch (s.kind) {
    case 'keep-left':         drawKeepLeft(ctx);            break;
    case 'school-30-start':
    case 'school-30-end':     drawSchool30(ctx);            break;
    case 'speed-50':          drawSpeedLimit(ctx, 50);      break;
    case 'kiwi-crossing':     drawKiwiCrossing(ctx);        break;
    case 'give-way':          drawGiveWay(ctx);             break;
  }
  ctx.restore();
}

function drawKeepLeft(ctx) {
  ctx.fillStyle = '#1a5fb4';
  ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(-8, 0); ctx.lineTo(4, -8); ctx.lineTo(4, -3);
  ctx.lineTo(10, -3); ctx.lineTo(10, 3); ctx.lineTo(4, 3); ctx.lineTo(4, 8);
  ctx.closePath();
  ctx.fill();
  drawPole(ctx);
}

function drawSchool30(ctx) {
  drawSpeedRoundel(ctx, 17, 13, 'bold 12px ui-sans-serif', '30');
  // SCHOOL plate below
  ctx.fillStyle = '#f5b81d';
  ctx.fillRect(-18, 18, 36, 12);
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 8px ui-sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('SCHOOL', 0, 24);
  ctx.fillStyle = '#888';
  ctx.fillRect(-1, 30, 2, 12);
}

function drawSpeedLimit(ctx, kmh) {
  drawSpeedRoundel(ctx, 14, 11, 'bold 11px ui-sans-serif', String(kmh));
  drawPole(ctx, 14);
}

function drawSpeedRoundel(ctx, outer, inner, font, label) {
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(0, 0, outer, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#c0282a';
  ctx.beginPath(); ctx.arc(0, 0, outer, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(0, 0, inner, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.font = font;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, 0, 1);
}

function drawKiwiCrossing(ctx) {
  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#f5b81d';
  ctx.fillRect(-15, -15, 30, 30);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-15, -15, 30, 30);
  ctx.restore();
  // Kiwi silhouette
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.ellipse(0, 2, 8, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-8, 1); ctx.lineTo(-15, 0); ctx.lineTo(-8, 3); ctx.closePath();
  ctx.fill();
  ctx.fillRect(-2, 6, 1.5, 4);
  ctx.fillRect( 3, 6, 1.5, 4);
  drawPole(ctx);
}

function drawGiveWay(ctx) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(-16, -12); ctx.lineTo(16, -12); ctx.lineTo(0, 14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#c0282a';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 7px ui-sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('GIVE', 0, -6);
  ctx.fillText('WAY',  0,  2);
  ctx.fillStyle = '#888';
  ctx.fillRect(-1, 14, 2, 12);
}

function drawPole(ctx, top = 16) {
  ctx.fillStyle = '#888';
  ctx.fillRect(-1, top, 2, 14);
}
