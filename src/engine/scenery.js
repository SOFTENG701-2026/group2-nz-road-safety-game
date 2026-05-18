// Decorative scenery placed in the world. Drawn by render/scenery.js.
// Add/remove items here to change the map's look.

export const SCENERY = [
  { kind: 'pasture', x:   60, y:  60, w: 380, h: 380, sheep: 4 },
  { kind: 'pasture', x:   60, y: 720, w: 360, h: 340, sheep: 3 },
  { kind: 'pasture', x: 1200, y:  60, w: 360, h: 360, sheep: 2 },
  { kind: 'pasture', x: 1260, y: 800, w: 300, h: 260, sheep: 2 },

  { kind: 'school', x: 600, y: 350, w: 240, h: 160 },

  { kind: 'house', x:  200, y: 380, w:  90, h: 80, hue:  14 },
  { kind: 'house', x:  320, y: 660, w: 100, h: 90, hue: 200 },
  { kind: 'house', x: 1340, y: 380, w:  90, h: 80, hue:  40 },
  { kind: 'house', x:  880, y: 760, w: 100, h: 90, hue: 320 },

  { kind: 'bush', x:  480, y: 470, r: 18 },
  { kind: 'bush', x:  520, y: 480, r: 14 },
  { kind: 'bush', x:  920, y: 640, r: 16 },
  { kind: 'bush', x:   80, y: 580, r: 20 },
  { kind: 'bush', x:   30, y: 540, r: 14 },
  { kind: 'bush', x: 1440, y: 600, r: 18 },
  { kind: 'bush', x: 1480, y: 540, r: 14 },

  { kind: 'fern', x:  460, y: 520, s: 1   },
  { kind: 'fern', x:  920, y: 620, s: 1.2 },
  { kind: 'fern', x: 1480, y: 660, s: 0.9 },
  { kind: 'fern', x:   60, y: 510, s: 1.1 },
];
