// Static road signs placed in the world. Drawn by render/signs.js.
import { SCHOOL_ZONE, PED_X, SIDE_X } from './constants.js';

export const SIGNS = [
  { kind: 'keep-left',        x: 80,                  y: 660 },
  { kind: 'school-30-start',  x: SCHOOL_ZONE.x1 - 30, y: 490 },
  { kind: 'school-30-end',    x: SCHOOL_ZONE.x2 + 30, y: 630 },
  { kind: 'kiwi-crossing',    x: PED_X - 60,          y: 490 },
  { kind: 'give-way',         x: SIDE_X - 70,         y: 680 },
  { kind: 'speed-50',         x: 300,                 y: 490 },
  { kind: 'speed-50',         x: 1320,                y: 630 },
];
