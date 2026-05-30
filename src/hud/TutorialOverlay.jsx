// Step-by-step onboarding overlay — shows once on first play (localStorage flag).
// Highlights each HUD element with a glow ring and explains it.
import { useState } from 'react';

export const TUTORIAL_KEY = 'nzrs_tutorial_v1';

// Each step: card position + optional spotlight over the target element.
// Positions are desktop values; mobile falls back to centered card.
const STEPS = [
  {
    title: 'Welcome to NZ Road Safety!',
    body: "Drive safely through each level by following NZ road rules. Here's a quick tour of the screen.",
    card: { center: true },
    spotlight: null,
  },
  {
    title: 'Speed Panel',
    body: 'Your current speed (large number) and the speed limit (circle). The panel turns red when you exceed the limit — slow down!',
    card: { bottom: 215, left: 16 },
    spotlight: { bottom: 14, left: 16, w: 205, h: 188 },
  },
  {
    title: 'Objectives',
    body: 'Your tasks for this level. Blue border = current task,  ✓ = done,  ✕ = failed.\nComplete them all for a perfect score!',
    card: { bottom: 230, right: 16 },
    spotlight: { bottom: 14, right: 16, w: 284, h: 200 },
  },
  {
    title: 'Minimap',
    body: 'Your position on the route. The white arrow shows your car and the direction you are heading.',
    card: { top: 258, right: 16 },
    spotlight: { top: 84, right: 16, w: 240, h: 160 },
  },
  {
    title: 'Hazard Warning',
    body: 'The next road hazard and distance appear here. Prepare early — slow down before you reach it!',
    card: { top: 144, centerX: true },
    spotlight: { top: 84, centerX: true, w: 300, h: 46 },
  },
];

function spotlightStyle(spot) {
  if (!spot) return null;
  const s = {
    position: 'absolute',
    width: spot.w, height: spot.h,
    borderRadius: 10,
    boxShadow: '0 0 0 3px rgba(126,200,255,0.9), 0 0 0 9px rgba(126,200,255,0.18), 0 0 44px rgba(126,200,255,0.25)',
    pointerEvents: 'none',
    zIndex: 1002,
    transition: 'all 0.3s',
  };
  if (spot.bottom  !== undefined) s.bottom = spot.bottom;
  if (spot.top     !== undefined) s.top    = spot.top;
  if (spot.left    !== undefined) s.left   = spot.left;
  if (spot.right   !== undefined) s.right  = spot.right;
  if (spot.centerX) { s.left = '50%'; s.transform = `translateX(-${spot.w / 2}px)`; }
  return s;
}

function cardStyle(card, w = 340, isMobile = false) {
  if (isMobile || card.center) {
    return { position: 'absolute', width: w, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1003 };
  }
  const s = { position: 'absolute', width: w, zIndex: 1003 };
  if (card.centerX) { s.left = '50%'; s.transform = `translateX(-${w / 2}px)`; }
  if (card.top    !== undefined) s.top    = card.top;
  if (card.bottom !== undefined) s.bottom = card.bottom;
  if (card.left   !== undefined) s.left   = card.left;
  if (card.right  !== undefined) s.right  = card.right;
  return s;
}

export default function TutorialOverlay({ onDone, isMobile = false }) {
  const [step, setStep] = useState(0);
  const cur    = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst= step === 0;

  const next = () => isLast ? onDone() : setStep(s => s + 1);
  const prev = () => setStep(s => Math.max(0, s - 1));

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1000 }}>
      {/* Overlay — click anywhere to advance */}
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(1.5px)' }}
        onClick={next}
      />

      {/* Spotlight glow ring */}
      {!isMobile && cur.spotlight && <div style={spotlightStyle(cur.spotlight)} />}

      {/* Callout card */}
      <div
        style={{
          ...cardStyle(cur.card, 340, isMobile),
          background: 'rgba(8,14,26,0.98)',
          border: '1px solid rgba(126,200,255,0.45)',
          borderRadius: 14,
          padding: '22px 24px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
          fontFamily: '"Space Grotesk", ui-sans-serif, system-ui',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Step dots + skip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 20 : 6, height: 6, borderRadius: 3,
                background: i === step ? '#7ec8ff' : 'rgba(126,200,255,0.2)',
                transition: 'width 0.25s',
              }} />
            ))}
          </div>
          <button onClick={onDone} style={skipBtn}>SKIP</button>
        </div>

        {/* Title */}
        <div style={{ fontSize: 16, fontWeight: 800, color: '#7ec8ff', marginBottom: 10, letterSpacing: 0.3 }}>
          {cur.title}
        </div>

        {/* Body */}
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 1.65, marginBottom: 20, whiteSpace: 'pre-line' }}>
          {cur.body}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 10, justifyContent: isFirst ? 'flex-end' : 'space-between' }}>
          {!isFirst && (
            <button onClick={prev} style={navBtn('secondary')}>← BACK</button>
          )}
          <button onClick={next} style={navBtn('primary')}>
            NEXT →
          </button>
        </div>
      </div>
    </div>
  );
}

const skipBtn = {
  background: 'none', border: 'none',
  color: 'rgba(255,255,255,0.35)', cursor: 'pointer',
  fontSize: 11, fontWeight: 700, letterSpacing: 1.5, padding: '4px 8px',
};

function navBtn(variant) {
  return {
    flex: variant === 'primary' ? 1 : 'none',
    background: variant === 'primary' ? '#7ec8ff' : 'rgba(126,200,255,0.08)',
    color:      variant === 'primary' ? '#020810' : '#7ec8ff',
    border: variant === 'primary' ? 'none' : '1px solid rgba(126,200,255,0.25)',
    borderRadius: 7, padding: '10px 16px',
    fontSize: 12, fontWeight: 800, letterSpacing: 1.5, cursor: 'pointer',
  };
}
