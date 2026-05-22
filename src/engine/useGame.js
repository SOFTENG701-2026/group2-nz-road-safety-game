// React hook that owns the game state, runs the render+tick loop,
// and wires keyboard / touch input. The HUD overlays read from `game`.
import { useRef, useReducer, useEffect, useCallback } from 'react';
import { W, H } from './constants.js';
import { createGame } from './state.js';
import { tick } from './tick.js';
import { drawWorld } from '../render/index.js';
import { startEngine, updateEngine, stopEngine, playTone } from './sound.js';

export function useGame({ width, height, active, level, difficulty = 'normal' }) {
  const canvasRef      = useRef(null);
  const gameRef        = useRef(createGame(level));
  const [, force]      = useReducer((x) => x + 1, 0);
  const prevCoachRef   = useRef(null);
  const audioStarted   = useRef(false);
  const levelIdRef     = useRef(level?.id);   // track level changes for Next Level

  // ── Keyboard input + audio bootstrap ──────────────────────────────────────
  useEffect(() => {
    if (!active) return;
    const onKey = (e, down) => {
      // Bootstrap AudioContext on the very first keypress (user-gesture rule)
      if (down && !audioStarted.current) {
        audioStarted.current = true;
        startEngine();
      }
      const g = gameRef.current;
      if (e.key === 'ArrowUp'    || e.key === 'w') { g.keys.up    = down; e.preventDefault(); }
      if (e.key === 'ArrowDown'  || e.key === 's') { g.keys.down  = down; e.preventDefault(); }
      if (e.key === 'ArrowLeft'  || e.key === 'a') { g.keys.left  = down; e.preventDefault(); }
      if (e.key === 'ArrowRight' || e.key === 'd') { g.keys.right = down; e.preventDefault(); }
      if (e.key === ' ')                            { g.keys.brake = down; e.preventDefault(); }
      if (down && e.key === 'r') {
        gameRef.current      = createGame(level);
        prevCoachRef.current = null;
        force();
      }
    };
    const dn = (e) => onKey(e, true);
    const up = (e) => onKey(e, false);
    globalThis.addEventListener('keydown', dn);
    globalThis.addEventListener('keyup',   up);
    return () => {
      globalThis.removeEventListener('keydown', dn);
      globalThis.removeEventListener('keyup',   up);
    };
  }, [active, level]);

  // ── Render + tick loop ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset game state when the level changes (e.g. clicking Next Level)
    if (levelIdRef.current !== level?.id) {
      gameRef.current      = createGame(level);
      prevCoachRef.current = null;
      levelIdRef.current   = level?.id;
    }

    const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
    canvas.width        = width  * dpr;
    canvas.height       = height * dpr;
    canvas.style.width  = width  + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;

    let raf, last = performance.now();
    let frameCount = 0;
    const worldW = level?.worldWidth ?? W;

    // Initialise camera directly at the car so frame-1 is already correct
    const g0 = gameRef.current;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    let cam = {
      x: clamp(g0.car.x - width  / 2, 0, Math.max(0, worldW - width)),
      y: clamp(g0.car.y - height / 2, 0, Math.max(0, H - height)),
    };

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const g = gameRef.current;
      if (active) tick(g, dt, difficulty);

      // ── Sound integration ──────────────────────────────────────────────────
      if (audioStarted.current) {
        updateEngine(g.car.speed);

        // Play tone when coach message changes
        if (g.coach.id !== prevCoachRef.current) {
          prevCoachRef.current = g.coach.id;
          playTone(g.coach.tone);
        }
      }

      // ── Camera (smooth follow, clamped to world bounds) ────────────────────
      const tx = g.car.x - width  / 2;
      const ty = g.car.y - height / 2;
      const k  = Math.min(1, dt * 6);   // slightly snappier follow
      cam.x += (tx - cam.x) * k;
      cam.y += (ty - cam.y) * k;
      cam.x = clamp(cam.x, 0, Math.max(0, worldW - width));
      cam.y = clamp(cam.y, 0, Math.max(0, H - height));

      ctx.clearRect(0, 0, width, height);
      drawWorld(ctx, g, cam);

      // Re-render React HUD ~10× per second
      frameCount++;
      if (frameCount % 6 === 0) force();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      stopEngine();
      audioStarted.current = false;
      prevCoachRef.current = null;
    };
  }, [width, height, active, level, difficulty]);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    gameRef.current      = createGame(level);
    prevCoachRef.current = null;
    force();
  }, [level]);

  // ── Touch / external key injection ────────────────────────────────────────
  const setKey = useCallback((key, down) => {
    // Bootstrap audio on first touch (also satisfies the user-gesture rule)
    if (down && !audioStarted.current) {
      audioStarted.current = true;
      startEngine();
    }
    gameRef.current.keys[key] = down;
  }, []);

  return { canvasRef, game: gameRef.current, reset, setKey };
}
