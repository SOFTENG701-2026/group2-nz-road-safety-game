// Green grass base + soft variation patches.
import { W, H } from '../engine/constants.js';

export function drawPasture(ctx) {
  ctx.fillStyle = '#7fb35a';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(101, 156, 75, 0.55)';
  for (let i = 0; i < 60; i++) {
    const px = (i * 173) % W;
    const py = (i * 257) % H;
    ctx.fillRect(px, py, 60, 30);
  }
}
