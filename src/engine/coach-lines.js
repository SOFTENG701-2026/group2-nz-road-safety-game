// Every line "Coach Hemi" / "Whaea Mere" / Dispatch can say.
// Keyed by id; `tone` drives the HUD colour (info / warn / good / bad).

export const COACH_LINES = {
  start:           { text: 'Kia ora! Drive to the finish line. Remember — in Aotearoa we keep LEFT.', tone: 'info' },
  schoolEnter:     { text: '⚠ School zone ahead — drop to 30 km/h.',                                   tone: 'warn' },
  schoolSpeeding:  { text: "🚸 Slow down! It's 30 here when children are around.",                     tone: 'bad'  },
  schoolGood:      { text: '✓ Great — nice and slow past the school.',                                 tone: 'good' },
  pedAhead:        { text: '🚶 Pedestrian crossing — be ready to stop.',                               tone: 'warn' },
  pedHit:          { text: "✗ You didn't stop! Pedestrians have right of way on a zebra crossing.",    tone: 'bad'  },
  pedGood:         { text: '✓ Good — you let them cross.',                                             tone: 'good' },
  giveWayAhead:    { text: '✋ Give Way ahead. Watch the side road.',                                  tone: 'warn' },
  giveWayGood:     { text: '✓ Right of way well managed.',                                             tone: 'good' },
  wrongSide:       { text: '↤ Keep LEFT! Right-side driving is illegal in NZ.',                        tone: 'bad'  },
  speeding:        { text: '⚠ Over the limit — ease off.',                                             tone: 'warn' },
  finish:          { text: '🏁 You made it! Check your score.',                                        tone: 'good' },
};
