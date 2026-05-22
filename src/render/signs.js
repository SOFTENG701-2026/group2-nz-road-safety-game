// Draws road signs defined in g.level.signs. Each kind is a small standalone helper.
export function drawSigns(ctx, g) {
  const signs = g.level?.signs ?? [];
  for (const s of signs) drawSign(ctx, s);
}

function drawSign(ctx, s) {
  ctx.save();
  ctx.translate(s.x, s.y);
  switch (s.kind) {
    case 'keep-left':           drawKeepLeft(ctx);              break;
    case 'school-30-start':
    case 'school-30-end':
    case 'school-zone-start':
    case 'school-zone-end':     drawSchoolZone(ctx);            break;
    case 'speed-30':            drawSpeedLimit(ctx, 30);        break;
    case 'speed-40':            drawSpeedLimit(ctx, 40);        break;
    case 'speed-50':            drawSpeedLimit(ctx, 50);        break;
    case 'speed-100':           drawSpeedLimit(ctx, 100);       break;
    case 'slippery-surface':    drawSlipperySurface(ctx);       break;
    case 'loose-chippings':     drawLooseChippings(ctx);        break;
    case 'roundabout-warning':  drawRoundaboutWarning(ctx);     break;
    case 'kiwi-crossing':       drawKiwiCrossing(ctx);          break;
    case 'give-way':            drawGiveWay(ctx);               break;
    case 'one-lane-bridge':     drawOneLaneBridge(ctx);         break;
    case 'railway-crossing':    drawRailwayCrossing(ctx);       break;
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

// NZ R2-1 — Keep Left regulatory sign.
// Blue circle · white bollard on the right · white arrow curving left around it.
function drawKeepLeft(ctx) {
  // Blue circle background
  ctx.fillStyle = '#1a5fb4';
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();

  // White bollard (rounded rectangle) on the right side
  ctx.fillStyle = '#fff';
  ctx.fillRect(3, -8, 4, 14);          // body
  ctx.beginPath();
  ctx.arc(5, -8, 2, Math.PI, 0);       // rounded top
  ctx.fill();

  // Curved arrow: rises from bottom-centre, bends LEFT around the bollard
  ctx.strokeStyle = '#fff';
  ctx.lineWidth   = 2.8;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';

  ctx.beginPath();
  ctx.moveTo(-1, 12);                         // bottom
  ctx.lineTo(-1, -1);                         // straight up
  ctx.bezierCurveTo(-1, -8, -4, -10, -10, -10); // curve left
  ctx.stroke();

  // Arrowhead at the left end, pointing left
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(-13, -10);   // tip (far left)
  ctx.lineTo(-9,  -7);    // lower arm
  ctx.lineTo(-9,  -13);   // upper arm
  ctx.closePath();
  ctx.fill();

  ctx.restore();
  drawPole(ctx);
}

// NZ school zone sign: 40 km/h roundel · yellow flashing lights · SCHOOL ZONE plate
function drawSchoolZone(ctx) {
  // Speed roundel "40"
  drawSpeedRoundel(ctx, 17, 13, 'bold 12px ui-sans-serif', '40');

  // Yellow flashing light dots on either side of the roundel
  const dotR = 5.5;
  [-26, 26].forEach(dx => {
    ctx.beginPath();
    ctx.arc(dx, 0, dotR, 0, Math.PI * 2);
    ctx.fillStyle = '#ffdb00';
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Inner highlight to suggest a light fitting
    ctx.beginPath();
    ctx.arc(dx - 1, -1, dotR * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,180,0.6)';
    ctx.fill();
  });

  // "SCHOOL ZONE" yellow plate
  ctx.fillStyle = '#ffdb00';
  ctx.fillRect(-23, 19, 46, 20);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-23, 19, 46, 20);

  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 7.5px ui-sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SCHOOL', 0, 26);
  ctx.fillText('ZONE',   0, 34);

  // Pole
  ctx.fillStyle = '#888';
  ctx.fillRect(-1, 39, 2, 14);
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
// Yellow diamond with 3 separate clockwise curved arrows (120° apart).
function drawRoundaboutWarning(ctx) {
  // Yellow diamond
  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#ffdb00';
  ctx.fillRect(-15, -15, 30, 30);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-15, -15, 30, 30);
  ctx.restore();

  const R   = 8;              // arc radius
  const gap = 0.28;           // gap between each arrow (radians)
  const span = (2 * Math.PI / 3) - gap * 2; // arc sweep per arrow

  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth   = 2.5;
  ctx.lineCap     = 'round';
  ctx.fillStyle   = '#1a1a1a';

  for (let i = 0; i < 3; i++) {
    const startA = -Math.PI / 2 + i * (2 * Math.PI / 3) + gap;
    const endA   = startA + span;

    // Curved arc
    ctx.beginPath();
    ctx.arc(0, 0, R, startA, endA, false);
    ctx.stroke();

    // Arrowhead at endA — points in clockwise tangent direction
    const ex = Math.cos(endA) * R;
    const ey = Math.sin(endA) * R;
    const tx = -Math.sin(endA); // clockwise tangent x
    const ty =  Math.cos(endA); // clockwise tangent y
    ctx.beginPath();
    ctx.moveTo(ex + tx * 4,             ey + ty * 4);
    ctx.lineTo(ex - tx * 3 - ty * 3.2, ey - ty * 3 + tx * 3.2);
    ctx.lineTo(ex - tx * 3 + ty * 3.2, ey - ty * 3 - tx * 3.2);
    ctx.closePath();
    ctx.fill();
  }

  // Central island
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

// Loose chippings / gravel road warning — yellow diamond, two cars, flying stones.
function drawLooseChippings(ctx) {
  // Yellow diamond
  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#ffdb00';
  ctx.fillRect(-15, -15, 30, 30);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-15, -15, 30, 30);
  ctx.restore();

  ctx.fillStyle = '#1a1a1a';

  // Left car (driving right)
  ctx.fillRect(-13, -1, 8, 4);   // body
  ctx.fillRect(-11, -5, 6, 5);   // cabin
  ctx.beginPath(); ctx.arc(-11, 3, 1.5, 0, Math.PI * 2); ctx.fill(); // front wheel
  ctx.beginPath(); ctx.arc(-7,  3, 1.5, 0, Math.PI * 2); ctx.fill(); // rear wheel

  // Right car (driving left, slightly offset)
  ctx.fillRect(5, -1, 8, 4);
  ctx.fillRect(5, -5, 6, 5);
  ctx.beginPath(); ctx.arc(7,  3, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(11, 3, 1.5, 0, Math.PI * 2); ctx.fill();

  // Flying chips/stones between the cars
  [[-3,-7,2.5], [0,-4,2], [2,-9,2], [-1,-11,1.5]].forEach(([x, y, r]) => {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  });

  // Impact starburst
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth   = 1;
  for (let a = 0; a < 5; a++) {
    const angle = (a / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 2, -6 + Math.sin(angle) * 2);
    ctx.lineTo(Math.cos(angle) * 5, -6 + Math.sin(angle) * 5);
    ctx.stroke();
  }

  drawPole(ctx);
}

function drawPole(ctx, top = 16) {
  ctx.fillStyle = '#888';
  ctx.fillRect(-1, top, 2, 14);
}
