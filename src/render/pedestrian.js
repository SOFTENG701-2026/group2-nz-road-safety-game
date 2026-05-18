// Top-down pedestrian sprite with shadow + walking-leg wiggle.

export function drawPedestrian(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(0, 3, 7, 3, 0, 0, Math.PI * 2); ctx.fill();

  // Shirt
  ctx.fillStyle = '#e84e76';
  ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();

  // Head
  ctx.fillStyle = '#f0c89c';
  ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();

  // Legs (animate with p.t)
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth   = 1;
  const wobble = Math.sin(p.t * 8) * 2;
  ctx.beginPath();
  ctx.moveTo(-3, 4); ctx.lineTo(-3 + wobble, 7);
  ctx.moveTo( 3, 4); ctx.lineTo( 3 - wobble, 7);
  ctx.stroke();

  ctx.restore();
}
