// Top-down car body: shadow, body, windows, lights, outline.
import { roundRect } from './shapes.js';

export function drawCar(ctx, x, y, angle, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(-16, -8, 34, 18);

  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  roundRect(ctx, -17, -10, 36, 20, 4);
  ctx.fill();

  // Windshield (front of car points to +x)
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(2, -7, 9, 14);

  // Rear window
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(-13, -7, 8, 14);

  // Headlights / tail lights
  ctx.fillStyle = '#fff7c0';
  ctx.fillRect(17, -8, 2, 4);
  ctx.fillRect(17,  4, 2, 4);
  ctx.fillStyle = '#c0282a';
  ctx.fillRect(-19, -8, 2, 3);
  ctx.fillRect(-19,  5, 2, 3);

  // Outline
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  roundRect(ctx, -17, -10, 36, 20, 4);
  ctx.stroke();

  ctx.restore();
}
