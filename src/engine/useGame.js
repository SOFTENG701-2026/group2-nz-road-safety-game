// React hook that owns the game state, runs the render+tick loop,
// and wires keyboard input. The HUD overlays read from `game` and `reset`.
import { useRef, useReducer, useEffect, useCallback } from 'react';
import { W, H } from './constants.js';
import { createGame } from './state.js';
import { tick } from './tick.js';
import { drawWorld } from '../render/index.js';

export function useGame({ width, height, active, difficulty = 'normal' }) {
  const canvasRef = useRef(null);
  const gameRef   = useRef(createGame());
  const [, force] = useReducer((x) => x + 1, 0);

  // Keyboard
  // Only the "active" instance listens, so you can have multiple games
  // on a page without them all reacting at once.
  useEffect(() => {
    if (!active) return;
    const onKey = (e, down) => {
      const g = gameRef.current;
      if (e.key === 'ArrowUp'    || e.key === 'w') { g.keys.up    = down; e.preventDefault(); }
      if (e.key === 'ArrowDown'  || e.key === 's') { g.keys.down  = down; e.preventDefault(); }
      if (e.key === 'ArrowLeft'  || e.key === 'a') { g.keys.left  = down; e.preventDefault(); }
      if (e.key === 'ArrowRight' || e.key === 'd') { g.keys.right = down; e.preventDefault(); }
      if (e.key === ' ')                            { g.keys.brake = down; e.preventDefault(); }
      if (down && e.key === 'r') { gameRef.current = createGame(); force(); }
    };
    const dn = (e) => onKey(e, true);
    const up = (e) => onKey(e, false);
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup',   up);
    return () => {
      window.removeEventListener('keydown', dn);
      window.removeEventListener('keyup',   up);
    };
  }, [active]);

  // Render + tick loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width        = width  * dpr;
    canvas.height       = height * dpr;
    canvas.style.width  = width  + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;

    let raf, last = performance.now();
    let cam = { x: 0, y: 0 };
    let frameCount = 0;

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const g = gameRef.current;
      if (active) tick(g, dt, difficulty);

      // Smooth camera follow (constrained to world bounds)
      const tx = g.car.x - width  / 2;
      const ty = g.car.y - height / 2;
      const k  = Math.min(1, dt * 4);
      cam.x += (tx - cam.x) * k;
      cam.y += (ty - cam.y) * k;
      cam.x = Math.max(0, Math.min(W - width,  cam.x));
      cam.y = Math.max(0, Math.min(H - height, cam.y));

      ctx.clearRect(0, 0, width, height);
      drawWorld(ctx, g, cam);

      // Re-render React HUD about 10 times per second, which is enough
      // that we don't thrash on every animation frame.
      frameCount++;
      if (frameCount % 6 === 0) force();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [width, height, active, difficulty]);

  const reset = useCallback(() => {
    gameRef.current = createGame();
    force();
  }, []);

  return { canvasRef, game: gameRef.current, reset };
}
