// Draws road signs defined in g.level.signs. Each kind is a small standalone helper.
export function drawSigns(ctx, g) {
  const signs = g.level?.signs ?? [];
  for (const s of signs) drawSign(ctx, s);
}

function drawSign(ctx, s) {
  ctx.save();
  ctx.translate(s.x, s.y);
  switch (s.kind) {
    case 'keep-left':         drawKeepLeft(ctx);            break;
    case 'school-30-start':
    case 'school-30-end':     drawSchool30(ctx);            break;
    case 'speed-30':          drawSpeedLimit(ctx, 30);       break;
    case 'speed-50':          drawSpeedLimit(ctx, 50);       break;
    case 'speed-100':         drawSpeedLimit(ctx, 100);      break;
    case 'slippery-surface':    drawSlipperySurface(ctx);    break;
    case 'roundabout-warning':  drawRoundaboutWarning(ctx);  break;
    case 'kiwi-crossing':       drawKiwiCrossing(ctx);       break;
    case 'give-way':          drawGiveWay(ctx);             break;
    case 'one-lane-bridge':   drawOneLaneBridge(ctx);       break;
    case 'railway-crossing':  drawRailwayCrossing(ctx);     break;
  }
  ctx.restore();
}

function drawRailwayCrossing(ctx) {
  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#f5b81d';
  ctx.fillRect(-15, -15, 30, 30);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-15, -15, 30, 30);
  ctx.restore();
  
  // Locomotive symbol
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(-10, 0, 20, 8); // body
  ctx.fillRect(-8, -6, 8, 6);  // cabin
  ctx.fillRect(4, -8, 4, 8);   // chimney
  ctx.beginPath(); ctx.arc(-6, 8, 3, 0, Math.PI * 2); ctx.fill(); // wheel
  ctx.beginPath(); ctx.arc(6, 8, 3, 0, Math.PI * 2); ctx.fill();  // wheel
  drawPole(ctx);
}

function drawOneLaneBridge(ctx) {
  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#f5b81d';
  ctx.fillRect(-15, -15, 30, 30);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-15, -15, 30, 30);
  ctx.restore();
  
  // Bridge symbol (two vertical bars narrowing)
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(-8, -10, 3, 20);
  ctx.fillRect(5, -10, 3, 20);
  ctx.fillRect(-8, -10, 16, 3);
  ctx.fillRect(-8, 7, 16, 3);
  drawPole(ctx);
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

// NZ W011 — Pedestrian Crossing Ahead.
// Fluorescent lime-green diamond with a centre road line and zebra bars.
function drawKiwiCrossing(ctx) {
  drawPole(ctx, 22);

  // Diamond background with a bright outer edge and black inset border.
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  drawDiamondPath(ctx, 24);
  ctx.fillStyle = '#caff12';
  ctx.fill();

  drawDiamondPath(ctx, 21);
  ctx.strokeStyle = '#050505';
  ctx.lineWidth = 3.2;
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#050505';
  [-14, -9, -4.8].forEach((x) => drawCrossingBar(ctx, x, -1));
  [4.8, 9, 14].forEach((x) => drawCrossingBar(ctx, x, 1));

  ctx.fillRect(-1.45, -8, 2.9, 23.5);
}

function drawDiamondPath(ctx, radius) {
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.lineTo(radius, 0);
  ctx.lineTo(0, radius);
  ctx.lineTo(-radius, 0);
  ctx.closePath();
}

function drawCrossingBar(ctx, x, side) {
  const halfWidth = 1.65;
  const top = -2.5;
  const bottom = 7.5;
  const slant = side * 0.9;

  ctx.beginPath();
  ctx.moveTo(x - halfWidth - slant, top);
  ctx.lineTo(x + halfWidth - slant, top);
  ctx.lineTo(x + halfWidth + slant, bottom);
  ctx.lineTo(x - halfWidth + slant, bottom);
  ctx.closePath();
  ctx.fill();
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

// NZ W087 — Roundabout Ahead warning sign.
// Yellow diamond, clockwise circular arrow (~270° arc) + arrowhead + central dot.
function drawRoundaboutWarning(ctx) {
  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#f5b81d';
  ctx.fillRect(-15, -15, 30, 30);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-15, -15, 30, 30);
  ctx.restore();

  // Arc: from 4 o'clock (~60°) clockwise ~270° to 2 o'clock (~330°)
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 8, Math.PI / 3, Math.PI * 11 / 6, false);
  ctx.stroke();

  // Arrowhead at 2 o'clock (angle = 330° = 11π/6)
  const ea = Math.PI * 11 / 6;
  const ex = Math.cos(ea) * 8;
  const ey = Math.sin(ea) * 8;
  const tx = -Math.sin(ea);   // clockwise tangent x  =  0.5
  const ty =  Math.cos(ea);   // clockwise tangent y  =  0.866
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.moveTo(ex + tx * 4.5,              ey + ty * 4.5);
  ctx.lineTo(ex - tx * 3 - ty * 3.5,    ey - ty * 3 + tx * 3.5);
  ctx.lineTo(ex - tx * 3 + ty * 3.5,    ey - ty * 3 - tx * 3.5);
  ctx.closePath();
  ctx.fill();

  // Central island dot
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();

  drawPole(ctx);
}

// NZ W073 — Slippery Surface warning sign.
// Yellow diamond with a car fishtailing + wavy lines (wet/icy road).
function drawSlipperySurface(ctx) {
  // Yellow diamond background
  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#f5b81d';
  ctx.fillRect(-15, -15, 30, 30);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-15, -15, 30, 30);
  ctx.restore();

  // Car body — slightly rotated to suggest fishtailing / skidding
  ctx.save();
  ctx.rotate(0.22);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(-8, -5, 16, 6);    // car body
  ctx.fillRect(-5, -10, 10, 6);   // roof
  ctx.beginPath(); ctx.arc(-5, 1, 1.8, 0, Math.PI * 2); ctx.fill(); // front wheel
  ctx.beginPath(); ctx.arc( 5, 1, 1.8, 0, Math.PI * 2); ctx.fill(); // rear wheel
  ctx.restore();

  // Wavy lines below the car = slippery/icy surface
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-9, 6);
  ctx.bezierCurveTo(-5, 3.5, -2, 8.5, 0, 6);
  ctx.bezierCurveTo( 2, 3.5,  5, 8.5, 9, 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-9, 10);
  ctx.bezierCurveTo(-5, 7.5, -2, 12.5, 0, 10);
  ctx.bezierCurveTo( 2, 7.5,  5, 12.5, 9, 10);
  ctx.stroke();

  drawPole(ctx);
}

function drawPole(ctx, top = 16) {
  ctx.fillStyle = '#888';
  ctx.fillRect(-1, top, 2, 14);
}
