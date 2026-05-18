// Sample the car's position into a breadcrumb trail for the minimap.
import { useRef } from 'react';

export function useTrail(game) {
  const trail  = useRef([]);
  const lastT  = useRef(0);

  // Reset on a fresh game (t resets to ~0 after a restart).
  if (game.t < 0.1) trail.current = [];

  if (game.t - lastT.current > 0.15 || (trail.current.length === 0 && game.t > 0)) {
    const last = trail.current[trail.current.length - 1];
    const dx   = last ? game.car.x - last[0] : Infinity;
    const dy   = last ? game.car.y - last[1] : Infinity;
    if (!last || Math.hypot(dx, dy) > 14) {
      trail.current.push([game.car.x, game.car.y]);
      if (trail.current.length > 80) trail.current.shift();
    }
    lastT.current = game.t;
  }

  return trail.current;
}
