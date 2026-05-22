import React from 'react';
import { LEVELS } from './levels/index.js';
import { isLevelUnlocked } from './engine/progress.js';

export default function HomePage({ onSelectLevel, progress }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #070c1a 0%, #0d1e30 55%, #091420 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: '"Space Grotesk", ui-sans-serif, system-ui',
      color: '#fff',
      padding: '48px 24px 60px',
      boxSizing: 'border-box',
    }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <NZFlag />
          <span style={{ fontSize: 13, letterSpacing: 3.5, color: '#7ec8ff', fontWeight: 700 }}>
            NZ TRANSPORT AGENCY · WAKA KOTAHI
          </span>
        </div>

        <h1 style={{
          fontSize: 42, fontWeight: 900, margin: 0, letterSpacing: -1.5,
          background: 'linear-gradient(135deg, #ffffff 0%, #a8d8ff 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          lineHeight: 1.1,
        }}>
          NZ Road Safety Game
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.5)', marginTop: 12, fontSize: 17,
          maxWidth: 500, lineHeight: 1.65,
        }}>
          Learn New Zealand road rules through four interactive driving challenges.
          Each level introduces new hazards and safety concepts from the NZTA guide.
        </p>

        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          {['Behaviourism', 'Cognitivism', 'Constructivism', 'Experientialism'].map(t => (
            <span key={t} style={{
              fontSize: 12, letterSpacing: 2, fontWeight: 700,
              padding: '4px 10px', borderRadius: 20,
              background: 'rgba(126,200,255,0.1)',
              border: '1px solid rgba(126,200,255,0.25)',
              color: '#7ec8ff',
            }}>{t.toUpperCase()}</span>
          ))}
        </div>
      </div>

      {/* ── Level grid ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: 20, width: '100%', maxWidth: 1400,
      }}>
        {LEVELS.map((level, idx) => {
          const unlocked = isLevelUnlocked(idx, LEVELS, progress);
          const stars    = progress[level.id] ?? 0;
          return (
            <LevelCard
              key={level.id}
              level={level}
              unlocked={unlocked}
              stars={stars}
              onSelect={() => onSelectLevel(level)}
            />
          );
        })}
      </div>

      {/* ── Controls hint ──────────────────────────────────────────────── */}
      <div style={{ marginTop: 48, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { key: '↑ W',   label: 'Accelerate' },
          { key: '↓ S',   label: 'Reverse'    },
          { key: '← →',  label: 'Steer'       },
          { key: 'Space', label: 'Brake'       },
          { key: 'R',     label: 'Restart'     },
        ].map(({ key, label }) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 6, padding: '4px 10px', fontSize: 14, fontWeight: 700, letterSpacing: 1,
            }}>{key}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: 1 }}>
              {label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, fontSize: 13, letterSpacing: 2, color: 'rgba(255,255,255,0.18)' }}>
        NZ TRANSPORT AGENCY WAKA KOTAHI · DRIVING IN NEW ZEALAND · ROAD SAFETY EDUCATION · SOFTENG 701 Group2 2026
      </div>
    </div>
  );
}

// ── Level card ────────────────────────────────────────────────────────────────

function LevelCard({ level, unlocked, stars, onSelect }) {
  const [hovered, setHovered] = React.useState(false);
  const borderColor = hovered && unlocked ? `${level.color}55` : 'rgba(255,255,255,0.09)';

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && unlocked ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${borderColor}`,
        borderRadius: 14,
        padding: '0 0 20px',
        cursor: unlocked ? 'pointer' : 'default',
        transition: 'transform 0.15s, background 0.15s, border-color 0.15s, box-shadow 0.15s',
        transform: hovered && unlocked ? 'translateY(-3px)' : 'none',
        boxShadow: hovered && unlocked
          ? `0 12px 40px ${level.color}18`
          : '0 4px 16px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        opacity: unlocked ? 1 : 0.55,
      }}
    >
      {/* Colour accent bar */}
      <div style={{
        height: 4,
        background: `linear-gradient(90deg, ${level.color}, ${level.color}88)`,
        borderRadius: '14px 14px 0 0',
      }} />

      <div style={{ padding: '18px 20px 0' }}>
        {/* Level badge + stars */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 12, letterSpacing: 3.5, fontWeight: 800, color: level.color }}>
            {level.name.toUpperCase()}
          </div>
          <Stars earned={stars} color={level.color} />
        </div>

        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.15 }}>
          {level.title}
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 5, lineHeight: 1.4 }}>
          {level.subtitle}
        </div>

        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.82)', marginTop: 12, lineHeight: 1.6, minHeight: '8em' }}>
          {level.description}
        </div>

        {/* Objectives preview */}
        <div style={{ marginTop: 14, minHeight: '7em' }}>
          {level.objectives.filter(o => o.id !== 'finish').map(o => (
            <div key={o.id} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 5,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: level.color, flexShrink: 0, opacity: 0.8,
              }} />
              {o.label}
            </div>
          ))}
        </div>

        {/* Theme tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 14 }}>
          {level.themes.map(t => (
            <span key={t} style={{
              fontSize: 12, letterSpacing: 1.2, fontWeight: 700,
              padding: '3px 8px', borderRadius: 20,
              background: `${level.color}18`, border: `1px solid ${level.color}38`,
              color: level.color,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Play / Locked button */}
      <div style={{ padding: '16px 20px 0' }}>
        {unlocked ? (
          <button
            onClick={onSelect}
            style={{
              width: '100%', padding: '11px 0',
              background: hovered ? level.color : `${level.color}cc`,
              color: level.textColor,
              border: 'none', borderRadius: 9,
              fontWeight: 800, fontSize: 16, cursor: 'pointer',
              letterSpacing: 0.5, fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
          >
            {stars > 0 ? `Play again  ·  ` : `Play Level ${level.number}  →`}
            {stars > 0 && '★'.repeat(stars) + '☆'.repeat(3 - stars)}
          </button>
        ) : (
          <div style={{
            width: '100%', padding: '11px 0',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.35)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 9, fontWeight: 700, fontSize: 16,
            textAlign: 'center', letterSpacing: 0.5,
          }}>
            🔒 Complete Level {level.number - 1} first
          </div>
        )}
      </div>
    </article>
  );
}

// ── Star display ──────────────────────────────────────────────────────────────

function Stars({ earned, color }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[0, 1, 2].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20"
             fill={i < earned ? color : 'rgba(255,255,255,0.15)'}>
          <path d="M10 1l2.6 5.6 6.2.7-4.7 4.2 1.3 6.1L10 14.7 4.6 17.6 5.9 11.5 1.2 7.3l6.2-.7z" />
        </svg>
      ))}
    </div>
  );
}

// ── Tiny NZ flag ──────────────────────────────────────────────────────────────

function NZFlag() {
  return (
    <svg width="28" height="16" viewBox="0 0 28 16" style={{ borderRadius: 2 }}>
      <rect width="28" height="16" fill="#00247d" />
      <rect width="14" height="8" fill="#00247d" />
      <line x1="0" y1="0" x2="14" y2="8" stroke="#fff" strokeWidth="2" />
      <line x1="14" y1="0" x2="0" y2="8" stroke="#fff" strokeWidth="2" />
      <line x1="0" y1="0" x2="14" y2="8" stroke="#cc0001" strokeWidth="1" />
      <line x1="14" y1="0" x2="0" y2="8" stroke="#cc0001" strokeWidth="1" />
      <rect x="6"   y="0" width="2" height="8" fill="#fff" />
      <rect x="0"   y="3" width="14" height="2" fill="#fff" />
      <rect x="6.5" y="0" width="1" height="8" fill="#cc0001" />
      <rect x="0"   y="3.5" width="14" height="1" fill="#cc0001" />
      {[{ cx: 22, cy: 3 }, { cx: 25, cy: 6 }, { cx: 19, cy: 7 }, { cx: 24, cy: 11 }].map((s) => (
        <g key={`${s.cx}-${s.cy}`}>
          <circle cx={s.cx} cy={s.cy} r="1.6" fill="#fff" />
          <circle cx={s.cx} cy={s.cy} r="0.9" fill="#cc0001" />
        </g>
      ))}
    </svg>
  );
}
