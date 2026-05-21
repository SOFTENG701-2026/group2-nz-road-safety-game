// "Where is the car?" queries — all derived from constants.js.
import { W, ROAD_W, MAIN_Y, SIDE_X, SCHOOL_ZONE } from './constants.js';

export function inSchoolZone(x, schoolZone) {
  if (!schoolZone) return false;
  return x >= schoolZone.x1 && x <= schoolZone.x2;
}

export function onRoadMain(x, y, worldW = W) {
  return x >= 0 && x <= worldW && Math.abs(y - MAIN_Y) <= ROAD_W / 2;
}

export function onRoadSide(x, y, sideX) {
  if (!sideX) return false;
  return Math.abs(x - sideX) <= ROAD_W / 2;  // full height: north + south
}

export function onRoad(x, y, g) {
  const worldW      = g?.level?.worldWidth ?? W;
  const sideX       = g?.level?.config?.sideX;
  const roundaboutX = g?.level?.config?.roundaboutX;

  // Treat the entire roundabout disc as road — the disc (r=80) extends 25 px
  // beyond the road band (±55), so without this check the car gets stuck in the
  // visually-grey-but-logically-grass fringe above and below the main road.
  if (roundaboutX) {
    const dx = x - roundaboutX;
    const dy = y - MAIN_Y;
    if (dx * dx + dy * dy <= 80 * 80) return true;
  }

  return onRoadMain(x, y, worldW) || onRoadSide(x, y, sideX);
}

// In NZ we keep LEFT. Heading east on main road → left lane is above centerline.
export function onLeftSide(car) {
  if (!onRoadMain(car.x, car.y)) return true; // don't penalise off-main
  const facingEast = Math.cos(car.angle) > 0;
  return facingEast ? car.y < MAIN_Y : car.y > MAIN_Y;
}
