// "Where is the car?" queries, all derived from constants.js.
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
  const worldW = g?.level?.worldWidth ?? W;
  const sideX = g?.level?.config?.sideX;
  return onRoadMain(x, y, worldW) || onRoadSide(x, y, sideX);
}

// In New Zealand we keep left. Heading east on the main road means the
// left lane is above the centerline.
export function onLeftSide(car) {
  if (!onRoadMain(car.x, car.y)) return true; // Do not penalise off-main.
  const facingEast = Math.cos(car.angle) > 0;
  return facingEast ? car.y < MAIN_Y : car.y > MAIN_Y;
}
