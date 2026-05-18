// "Where is the car?" queries, all derived from constants.js.
import { W, ROAD_W, MAIN_Y, SIDE_X, SCHOOL_ZONE } from './constants.js';

export function inSchoolZone(x) {
  return x >= SCHOOL_ZONE.x1 && x <= SCHOOL_ZONE.x2;
}

export function onRoadMain(x, y) {
  return x >= 0 && x <= W && Math.abs(y - MAIN_Y) <= ROAD_W / 2;
}

export function onRoadSide(x, y) {
  return y >= MAIN_Y && Math.abs(x - SIDE_X) <= ROAD_W / 2;
}

export function onRoad(x, y) {
  return onRoadMain(x, y) || onRoadSide(x, y);
}

// In New Zealand we keep left. Heading east on the main road means the
// left lane is above the centerline.
export function onLeftSide(car) {
  if (!onRoadMain(car.x, car.y)) return true; // Do not penalise off-main.
  const facingEast = Math.cos(car.angle) > 0;
  return facingEast ? car.y < MAIN_Y : car.y > MAIN_Y;
}
