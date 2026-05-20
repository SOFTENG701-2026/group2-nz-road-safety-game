// Every line "Coach Hemi" / "Whaea Mere" / Dispatch can say.
// Keyed by id; `tone` drives the HUD colour (info / warn / good / bad).

export const COACH_LINES = {
  // ── Generic ──────────────────────────────────────────────────────────────
  start:            { text: 'Drive to the finish line. Remember: in New Zealand we keep LEFT.',                       tone: 'info' },
  wrongSide:        { text: 'Keep LEFT! Right-side driving is illegal in New Zealand.',                               tone: 'bad'  },
  speeding:         { text: 'Over the limit — ease off the accelerator.',                                             tone: 'warn' },
  finish:           { text: 'You made it! Check your score.',                                                         tone: 'good' },

  // ── School zone ───────────────────────────────────────────────────────────
  schoolEnter:      { text: 'School zone ahead — drop to 30 km/h.',                                                  tone: 'warn' },
  schoolSpeeding:   { text: "Slow down! It's 30 km/h here when children are present.",                               tone: 'bad'  },
  schoolGood:       { text: 'Nice — you kept to 30 through the school zone.',                                        tone: 'good' },

  // ── Icy road (Level 4 — reuses school zone mechanic) ─────────────────────
  iceEnter:         { text: 'Icy road ahead — slow to 30 km/h and drive to the conditions.',                         tone: 'warn' },
  iceViolated:      { text: 'Too fast on ice! Reduce to 30 km/h — icy roads are extremely slippery.',                tone: 'bad'  },
  iceGood:          { text: 'Well done — careful speed on the icy mountain road.',                                    tone: 'good' },

  // ── Pedestrian crossing ───────────────────────────────────────────────────
  pedAhead:         { text: 'Pedestrian crossing ahead — stop before the line.',                                       tone: 'warn' },
  pedHit:           { text: "You hit a pedestrian! They have right of way on a zebra crossing.",                     tone: 'bad'  },
  pedMissed:        { text: 'You must stop before the crossing, not on it or past it.',                              tone: 'bad'  },
  pedGood:          { text: 'Good — you stopped before the line and let them cross.',                                 tone: 'good' },

  // ── Give-way intersection ─────────────────────────────────────────────────
  giveWayAhead:     { text: 'Give Way ahead — slow down and check the side road.',                                     tone: 'warn' },
  giveWayFail:      { text: "You didn't give way! Slow to ≤25 km/h and check before crossing.",                      tone: 'bad'  },
  giveWayGood:      { text: 'Good — you slowed and gave way correctly.',                                              tone: 'good' },

  // ── Roundabout ────────────────────────────────────────────────────────────
  roundaboutAhead:  { text: 'Roundabout ahead — slow down, go clockwise, give way to vehicles on your right.',       tone: 'warn' },
  roundaboutFast:   { text: 'Too fast through the roundabout! Slow right down and give way to the right.',           tone: 'bad'  },
  roundaboutGood:   { text: 'Roundabout navigated well — good speed and awareness.',                                  tone: 'good' },

  // ── Gravel / unsealed road ────────────────────────────────────────────────
  gravelAhead:      { text: 'Unsealed road ahead — slow down. Gravel is slippery and stones can chip your screen.',  tone: 'warn' },
  gravelFast:       { text: 'Too fast on gravel! Keep to 60 km/h or less — loose roads are dangerous.',              tone: 'bad'  },
  gravelGood:       { text: 'Good — safe and steady on the gravel road.',                                             tone: 'good' },

  // ── Railway crossing ──────────────────────────────────────────────────────
  railAhead:        { text: 'Railway crossing ahead — be prepared to stop if lights are flashing.',                   tone: 'warn' },
  railViolation:    { text: 'Danger! You must stop at a railway crossing when the lights are flashing.',              tone: 'bad'  },
  railStop:         { text: 'Good — you stopped safely at the railway crossing.',                                     tone: 'good' },

  // ── One-lane bridge ───────────────────────────────────────────────────────
  bridgeAhead:      { text: 'One-lane bridge ahead — slow down and check for oncoming traffic.',                      tone: 'warn' },
  bridgeFast:       { text: 'Too fast over the bridge! Keep to 40 km/h or less on a one-lane bridge.',               tone: 'bad'  },
  bridgeGood:       { text: 'Bridge crossed safely — well done.',                                                     tone: 'good' },
};
