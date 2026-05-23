import { getTrafficVehiclePoses } from '../engine/intersection-traffic.js';
import { drawCar } from './car.js';

export function drawIntersectionTraffic(ctx, g) {
  getTrafficVehiclePoses(g).forEach((vehicle) => {
    drawCar(ctx, vehicle.x, vehicle.y, vehicle.angle, vehicle.color);
  });
}
