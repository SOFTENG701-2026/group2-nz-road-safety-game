// Background fill — colour and width vary by level.
import { W, H } from '../engine/constants.js';

export function drawPasture(ctx, worldWidth = W, bgColor = '#7fb35a') {
  ctx.fillStyle = bgColor;
  // Fill well beyond world bounds so the background covers the full screen
  // even when worldWidth < viewport width.
  ctx.fillRect(-500, -500, worldWidth + 1000, H + 1000);

  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  for (let i = 0; i < 80; i++) {
    const px = (i * 173) % worldWidth;
    const py = (i * 257) % H;
    ctx.fillRect(px, py, 60, 30);
  }
}
