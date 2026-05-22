// Web Audio API sound system.
// All AudioContext creation is lazy so it only fires after a user gesture.

let _ctx         = null;
let _engine      = null;   // fundamental triangle oscillator
let _engine2     = null;   // 2nd-harmonic triangle for warmth
let _filter      = null;   // lowpass — removes harshness
let _engineGain  = null;   // master gain for engine
let _engine2Gain = null;   // harmonic gain (quieter than fundamental)
let _muted       = false;

function getCtx() {
  if (!_ctx) {
    try {
      _ctx = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
  return _ctx;
}

// ─── Engine hum ─────────────────────────────────────────────────────────────
// Two triangle oscillators (fundamental + 2nd harmonic) run through a
// lowpass filter. Triangle waves have far fewer harmonics than sawtooth,
// and the filter removes the remaining edge — the result is a soft,
// round "engine hum" rather than a harsh buzz.

export function startEngine() {
  if (_engine) return;          // already running
  const c = getCtx();
  if (!c) return;

  // ── Fundamental ──────────────────────────────────────────────────────────
  _engine = c.createOscillator();
  _engine.type = 'triangle';
  _engine.frequency.value = 60;

  // ── 2nd harmonic (quieter, adds body without harshness) ──────────────────
  _engine2 = c.createOscillator();
  _engine2.type = 'triangle';
  _engine2.frequency.value = 120;

  _engine2Gain = c.createGain();
  _engine2Gain.gain.value = 0.3; // harmonic sits 70% below the fundamental

  // ── Lowpass filter ────────────────────────────────────────────────────────
  // Cuts high-frequency content so the sound stays warm and rounded.
  _filter = c.createBiquadFilter();
  _filter.type = 'lowpass';
  _filter.frequency.value = 280;
  _filter.Q.value = 0.7;

  // ── Master gain (starts silent, ramps up with speed) ─────────────────────
  _engineGain = c.createGain();
  _engineGain.gain.value = 0;

  // Signal chain: osc1 ─┐
  //               osc2 → gain2 ─┤→ filter → masterGain → output
  _engine.connect(_filter);
  _engine2.connect(_engine2Gain);
  _engine2Gain.connect(_filter);
  _filter.connect(_engineGain);
  _engineGain.connect(c.destination);

  _engine.start();
  _engine2.start();
}

export function updateEngine(speed) {
  if (!_engine || !_engineGain || _filter || _muted) {
    // Guard: if filter is missing, don't call (avoids null deref)
  }
  if (!_engine || !_engineGain || !_filter || _muted) return;
  const c = getCtx();
  if (!c) return;

  const spd = Math.abs(speed);

  // Frequency: idle ~60 Hz, cruising ~130 Hz, floored ~180 Hz
  const freq = 58 + spd * 0.45;
  _engine.frequency.setTargetAtTime(freq,       c.currentTime, 0.18);
  _engine2.frequency.setTargetAtTime(freq * 2,  c.currentTime, 0.18);

  // Filter opens up slightly at higher speeds (a bit more presence)
  const cut = 220 + spd * 1.4;
  _filter.frequency.setTargetAtTime(Math.min(cut, 700), c.currentTime, 0.2);

  // Volume: near-silent at idle, gentle hum at speed (max 0.045)
  const vol = spd < 4 ? 0.004 : Math.min(0.045, 0.016 + spd * 0.00012);
  _engineGain.gain.setTargetAtTime(vol, c.currentTime, 0.2);
}

export function stopEngine() {
  try { _engine?.stop();  } catch { /* ok */ }
  try { _engine2?.stop(); } catch { /* ok */ }
  try { _engineGain?.disconnect();  } catch { /* ok */ }
  try { _engine2Gain?.disconnect(); } catch { /* ok */ }
  try { _filter?.disconnect();      } catch { /* ok */ }
  _engine = _engine2 = _filter = _engineGain = _engine2Gain = null;
}

// ─── One-shot event tones ────────────────────────────────────────────────────

export function playTone(tone) {
  if (_muted) return;
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;

  switch (tone) {
    case 'good': {
      // Rising sine sweep — reward chime
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.connect(g); g.connect(c.destination);
      o.frequency.setValueAtTime(523, now);
      o.frequency.exponentialRampToValueAtTime(784, now + 0.18);
      g.gain.setValueAtTime(0.16, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      o.start(now); o.stop(now + 0.4);
      break;
    }
    case 'bad': {
      // Falling sine — soft penalty thud (sine, not square, so not harsh)
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.connect(g); g.connect(c.destination);
      o.frequency.setValueAtTime(300, now);
      o.frequency.exponentialRampToValueAtTime(120, now + 0.35);
      g.gain.setValueAtTime(0.16, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      o.start(now); o.stop(now + 0.48);
      break;
    }
    case 'warn': {
      // Two short triangle pings
      [0, 0.14].forEach(delay => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = 'triangle';
        o.connect(g); g.connect(c.destination);
        o.frequency.value = 600;
        g.gain.setValueAtTime(0.12, now + delay);
        g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);
        o.start(now + delay); o.stop(now + delay + 0.14);
      });
      break;
    }
    case 'finish': {
      // Three ascending sine notes — C E G
      [0, 0.18, 0.36].forEach((delay, i) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = 'sine';
        o.connect(g); g.connect(c.destination);
        o.frequency.value = [523, 659, 784][i];
        g.gain.setValueAtTime(0.20, now + delay);
        g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.3);
        o.start(now + delay); o.stop(now + delay + 0.34);
      });
      break;
    }
    default: break; // 'info' — silent
  }
}

export function playBrake() {
  if (_muted) return;
  const c = getCtx();
  if (!c) return;
  // Short filtered-noise burst (tyre screech feel but quieter)
  const bufLen = Math.floor(c.sampleRate * 0.1);
  const buf    = c.createBuffer(1, bufLen, c.sampleRate);
  const data   = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
  const src = c.createBufferSource();
  src.buffer = buf;
  const flt = c.createBiquadFilter();
  flt.type = 'bandpass';
  flt.frequency.value = 800;
  flt.Q.value = 2;
  const g = c.createGain();
  g.gain.value = 0.18;
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);
  src.connect(flt); flt.connect(g); g.connect(c.destination);
  src.start();
}

export function setMuted(m) { _muted = m; }
export function isMuted()   { return _muted; }
