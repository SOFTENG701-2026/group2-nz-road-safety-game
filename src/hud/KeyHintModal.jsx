import React, { useState, useEffect } from 'react';

// ── Animation: cycling key highlights ────────────────────────────────────────

function useKeyCycle(keys, interval = 700) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % keys.length), interval);
    return () => clearInterval(t);
  }, [keys.length, interval]);
  return keys[idx];
}

// ── Shared key-cap component ──────────────────────────────────────────────────

function KeyCap({ label, active, wide, small }) {
  return (
    <div style={{
      minWidth: wide ? 120 : small ? 32 : 44,
      height: small ? 32 : 44,
      borderRadius: 8,
      background: active
        ? 'linear-gradient(180deg,#7ec8ff 0%,#3a9fd8 100%)'
        : 'linear-gradient(180deg,#2a3a50 0%,#1a2535 100%)',
      border: `2px solid ${active ? '#7ec8ff' : 'rgba(126,200,255,0.18)'}`,
      boxShadow: active ? '0 0 18px rgba(126,200,255,0.65)' : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: small ? 10 : 13,
      fontWeight: 800,
      color: active ? '#04060b' : 'rgba(255,255,255,0.5)',
      letterSpacing: 1,
      transition: 'all 0.12s',
      userSelect: 'none',
    }}>
      {label}
    </div>
  );
}

// ── Page 1: Movement ──────────────────────────────────────────────────────────

const MOVE_SEQUENCE = [
  { key: 'W',    dir: '↑ Accelerate', angle: 0    },
  { key: 'D',    dir: '→ Steer Right', angle: 30  },
  { key: 'S',    dir: '↓ Reverse',    angle: 0    },
  { key: 'A',    dir: '← Steer Left', angle: -30  },
];

function MovementPage() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % MOVE_SEQUENCE.length), 800);
    return () => clearInterval(t);
  }, []);

  const current = MOVE_SEQUENCE[step];

  return (
    <div>
      {/* "Video" box */}
      <div style={{
        background: '#06101a',
        border: '1px solid rgba(126,200,255,0.15)',
        borderRadius: 12,
        padding: '28px 20px 20px',
        marginBottom: 24,
        position: 'relative',
        minHeight: 210,
      }}>
        {/* REC indicator */}
        <RecBadge />

        {/* WASD keyboard */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <KeyCap label="W" active={current.key === 'W'} />
          <div style={{ display: 'flex', gap: 5 }}>
            <KeyCap label="A" active={current.key === 'A'} />
            <KeyCap label="S" active={current.key === 'S'} />
            <KeyCap label="D" active={current.key === 'D'} />
          </div>
        </div>

        {/* Divider + arrow keys */}
        <div style={{ textAlign: 'center', margin: '10px 0', fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 2 }}>
          OR
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <KeyCap label="↑" active={current.key === 'W'} small />
          <div style={{ display: 'flex', gap: 4 }}>
            <KeyCap label="←" active={current.key === 'A'} small />
            <KeyCap label="↓" active={current.key === 'S'} small />
            <KeyCap label="→" active={current.key === 'D'} small />
          </div>
        </div>

        {/* Current action label */}
        <div style={{
          marginTop: 16,
          textAlign: 'center',
          fontSize: 14, fontWeight: 800,
          color: '#7ec8ff',
          letterSpacing: 1.5,
          minHeight: 22,
          transition: 'opacity 0.2s',
        }}>
          {current.dir}
        </div>
      </div>

      <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
        Use <b style={{ color: '#fff' }}>W A S D</b> or <b style={{ color: '#fff' }}>Arrow Keys</b> to
        accelerate, steer, and reverse. The faster you go, the better your steering response.
      </p>
    </div>
  );
}

// ── Page 2: Braking ───────────────────────────────────────────────────────────

function BrakePage() {
  const [pressed, setPressed] = useState(false);
  const [speed, setSpeed] = useState(72);

  useEffect(() => {
    let phase = 'waiting';
    let currentSpeed = 72;

    const t = setInterval(() => {
      if (phase === 'waiting') {
        setPressed(false);
        currentSpeed = 72;
        setSpeed(72);
        setTimeout(() => { phase = 'braking'; }, 600);
      } else if (phase === 'braking') {
        setPressed(true);
        currentSpeed = Math.max(0, currentSpeed - 18);
        setSpeed(currentSpeed);
        if (currentSpeed <= 0) {
          phase = 'waiting';
          setTimeout(() => {}, 800);
        }
      }
    }, 160);
    return () => clearInterval(t);
  }, []);

  const pct = (speed / 150) * 100;

  return (
    <div>
      {/* "Video" box */}
      <div style={{
        background: '#06101a',
        border: '1px solid rgba(126,200,255,0.15)',
        borderRadius: 12,
        padding: '28px 20px 24px',
        marginBottom: 24,
        position: 'relative',
        minHeight: 210,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        <RecBadge />

        {/* Speed gauge */}
        <div style={{ width: '80%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.35)' }}>SPEED</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: pct > 30 ? '#ff7a6a' : '#7ce69a', fontVariantNumeric: 'tabular-nums' }}>
              {speed} km/h
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{
              width: `${pct}%`, height: '100%', borderRadius: 4,
              background: `linear-gradient(90deg, #7ce69a, ${pct > 50 ? '#ff7a6a' : '#f5b81d'})`,
              transition: 'width 0.15s, background 0.3s',
            }} />
          </div>
        </div>

        {/* Spacebar */}
        <KeyCap label="SPACE" active={pressed} wide />

        {/* Brake label */}
        <div style={{
          fontSize: 13, fontWeight: 800, letterSpacing: 2,
          color: pressed ? '#ff7a6a' : 'rgba(255,255,255,0.3)',
          transition: 'color 0.12s',
        }}>
          {pressed ? '⚠ BRAKING' : 'PRESS TO BRAKE'}
        </div>
      </div>

      <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
        Press <b style={{ color: '#fff' }}>SPACE</b> to apply the brakes.
        Always stop <b style={{ color: '#fff' }}>before</b> pedestrian crossings,
        railway crossings, and give-way signs — not on them.
      </p>
    </div>
  );
}

// ── REC badge (makes it feel like a video) ────────────────────────────────────

function RecBadge() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn(v => !v), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      position: 'absolute', top: 10, right: 12,
      display: 'flex', alignItems: 'center', gap: 5,
      fontSize: 9, fontWeight: 800, letterSpacing: 2,
      color: on ? '#ff6b6b' : 'rgba(255,107,107,0.3)',
      transition: 'color 0.3s',
    }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%',
        background: on ? '#ff6b6b' : 'rgba(255,107,107,0.2)',
        transition: 'background 0.3s',
      }} />
      REC
    </div>
  );
}

// ── Step dots ─────────────────────────────────────────────────────────────────

function StepDots({ total, current }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 6, borderRadius: 3,
          width: i === current ? 28 : 8,
          background: i <= current ? '#7ec8ff' : 'rgba(126,200,255,0.18)',
          transition: 'all 0.3s',
        }} />
      ))}
    </div>
  );
}

// ── Pages config ──────────────────────────────────────────────────────────────

const PAGES = [
  { title: 'Drive / Steer', subtitle: 'Control Your Vehicle', Content: MovementPage },
  { title: 'Brake', subtitle: 'Stopping & Braking', Content: BrakePage },
];

// ── Main modal ────────────────────────────────────────────────────────────────

export default function KeyHintModal({ onComplete }) {
  const [page, setPage] = useState(0);
  const { title, subtitle, Content } = PAGES[page];
  const isLast = page === PAGES.length - 1;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(4,6,11,0.82)',
      backdropFilter: 'blur(10px)',
      zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Space Grotesk", ui-sans-serif, system-ui',
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #0d1e30 0%, #081420 100%)',
        border: '1px solid rgba(126,200,255,0.22)',
        borderRadius: 18,
        padding: '36px 40px',
        width: 440,
        maxWidth: '92vw',
        boxShadow: '0 32px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(126,200,255,0.08)',
        color: '#fff',
      }}>
        <StepDots total={PAGES.length} current={page} />

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: '#7ec8ff', fontWeight: 700, marginBottom: 4 }}>
            {subtitle.toUpperCase()}
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>{title}</h2>
        </div>

        {/* Animated content */}
        <Content />

        {/* Navigation */}
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {page > 0 ? (
            <button onClick={() => setPage(p => p - 1)} style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.45)', borderRadius: 8,
              padding: '10px 20px', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 1,
            }}>
              ← Back
            </button>
          ) : <span />}

          <button
            onClick={() => isLast ? onComplete() : setPage(p => p + 1)}
            style={{
              background: isLast
                ? 'linear-gradient(135deg,#7ce69a,#38b86e)'
                : 'linear-gradient(135deg,#7ec8ff,#3a9fd8)',
              border: 'none', borderRadius: 10,
              color: '#04060b', padding: '12px 28px',
              fontSize: 13, fontWeight: 900, letterSpacing: 1.5,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: isLast ? '0 0 20px rgba(124,230,154,0.4)' : '0 0 20px rgba(126,200,255,0.3)',
            }}
          >
            {isLast ? 'START DRIVING →' : 'NEXT →'}
          </button>
        </div>
      </div>
    </div>
  );
}
