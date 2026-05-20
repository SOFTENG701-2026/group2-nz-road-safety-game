// Background fill — colour and width vary by level.
import { W, H } from '../engine/constants.js';

export function drawPasture(ctx, worldWidth = W, bgColor = '#7fb35a') {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, worldWidth, H);

  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  for (let i = 0; i < 80; i++) {
    const px = (i * 173) % worldWidth;
    const py = (i * 257) % H;
    ctx.fillRect(px, py, 60, 30);
  }
}
