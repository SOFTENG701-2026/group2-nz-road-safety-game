// Display-unit helpers.
import { KMH_PER_PXS } from './constants.js';

export function pxToKmh(px) {
  return Math.max(0, Math.round(px * KMH_PER_PXS));
}
