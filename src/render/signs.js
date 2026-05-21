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
  ctx.fillStyle = '#ffdb00';
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
  ctx.translate(0, -45);
  drawOneLaneBridgeSymbol(ctx);
  ctx.restore();
  
  ctx.save();
  ctx.translate(0, -5);
  drawOneLaneBridgeGiveWay(ctx);
  ctx.restore();

  drawPole(ctx);
}

function drawOneLaneBridgeSymbol(ctx) {
  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#ffdb00';
  ctx.fillRect(-15, -15, 30, 30);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-15, -15, 30, 30);
  ctx.restore();
  
  // Bridge symbol (two vertical bars narrowing)
  ctx.save();
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(-8, -8);
  ctx.lineTo(-4, -4);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(8, -8);
  ctx.lineTo(4, -4);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-4, -4);
  ctx.lineTo(-4, 5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(4, -4);
  ctx.lineTo(4, 5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-4, 7);
  ctx.lineTo(-7, 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(4, 7);
  ctx.lineTo(7, 10);
  ctx.stroke();

  ctx.restore();
}

function drawOneLaneBridgeGiveWay(ctx) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#d40000';
  ctx.stroke();

  ctx.fillStyle = '#d40000';

  ctx.beginPath();
  ctx.moveTo(-8, 10);
  ctx.lineTo(-4, 10);
  ctx.lineTo(-4, -2);
  ctx.lineTo(-1, -2);
  ctx.lineTo(-6, -14);
  ctx.lineTo(-11, -2);
  ctx.lineTo(-8, -2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#000000';

  ctx.beginPath();
  ctx.moveTo(8, -14);
  ctx.lineTo(2, -14);
  ctx.lineTo(2, 6);
  ctx.lineTo(-2, 6);
  ctx.lineTo(4.5, 15);
  ctx.lineTo(12, 6);
  ctx.lineTo(8, 6);
  ctx.closePath();
  ctx.fill();

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
  ctx.fillStyle = '#ffdb00';
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
  ctx.fillStyle = '#c0111e';
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
  ctx.fillStyle = '#a2ff31';
  ctx.fill();

  drawDiamondPath(ctx, 22);
  ctx.strokeStyle = '#050505';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#050505';
  [-13, -9, -4.8].forEach((x) => drawCrossingBar(ctx, x, -0.6));
  [4.8, 9, 13].forEach((x) => drawCrossingBar(ctx, x, 0.6));
  
  ctx.fillRect(-0.6, -10, 1.6, 24);
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
  const halfWidth = 1.15;
  const top = -5.5;
  const bottom = 5.5;
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
  ctx.moveTo(-17, -13); ctx.lineTo(17, -13); ctx.lineTo(0, 15);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#c0111e';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#c0111e';
  ctx.font = 'bold 7px ui-sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('GIVE', 0, -7);
  ctx.font = 'bold 6px ui-sans-serif';
  ctx.fillText('WAY',  0,  0);
  ctx.fillStyle = '#888';
  ctx.fillRect(-1, 14, 2, 12);
}

// NZ W087 — Roundabout Ahead warning sign.
// Yellow diamond, clockwise circular arrow (~270° arc) + arrowhead + central dot.
function drawRoundaboutWarning(ctx) {
  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#ffdb00';
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
  ctx.fillStyle = '#ffdb00';
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
