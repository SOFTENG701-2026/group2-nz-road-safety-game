import React from 'react';
import { LEVELS } from './levels/index.js';

export default function HomePage({ onSelectLevel }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #070c1a 0%, #0d1e30 55%, #091420 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: '"Space Grotesk", ui-sans-serif, system-ui',
      color: '#fff',
      padding: '48px 24px 60px',
      boxSizing: 'border-box',
    }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginBottom: 18,
        }}>
          <NZFlag />
          <span style={{ fontSize: 10, letterSpacing: 3.5, color: '#7ec8ff', fontWeight: 700 }}>
            NZ TRANSPORT AGENCY · WAKA KOTAHI
          </span>
        </div>

        <h1 style={{
          fontSize: 42, fontWeight: 900, margin: 0, letterSpacing: -1.5,
          background: 'linear-gradient(135deg, #ffffff 0%, #a8d8ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.1,
        }}>
          NZ Road Safety Game
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.5)',
          marginTop: 12, fontSize: 14, maxWidth: 500,
          lineHeight: 1.65,
        }}>
          Learn New Zealand road rules through four interactive driving challenges.
          Each level introduces new hazards and safety concepts from the NZTA guide.
        </p>

        <div style={{
          display: 'flex', gap: 20, justifyContent: 'center',
          marginTop: 20, flexWrap: 'wrap',
        }}>
          {['Behaviourism', 'Cognitivism', 'Constructivism', 'Experientialism'].map(t => (
            <span key={t} style={{
              fontSize: 9, letterSpacing: 2, fontWeight: 700,
              padding: '4px 10px', borderRadius: 20,
              background: 'rgba(126,200,255,0.1)',
              border: '1px solid rgba(126,200,255,0.25)',
              color: '#7ec8ff',
            }}>{t.toUpperCase()}</span>
          ))}
        </div>
      </div>

      {/* ── Level grid ──────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: 20,
        width: '100%',
        maxWidth: 980,
      }}>
        {LEVELS.map(level => (
          <LevelCard key={level.id} level={level} onSelect={() => onSelectLevel(level)} />
        ))}
      </div>

      {/* ── Controls hint ───────────────────────────────────────── */}
      <div style={{
        marginTop: 48,
        display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {[
          { key: '↑ W',    label: 'Accelerate' },
          { key: '↓ S',    label: 'Reverse'    },
          { key: '← →',   label: 'Steer'       },
          { key: 'Space',  label: 'Brake'       },
          { key: 'R',      label: 'Restart'     },
        ].map(({ key, label }) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 6, padding: '4px 10px',
              fontSize: 11, fontWeight: 700, letterSpacing: 1,
            }}>{key}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: 1 }}>
              {label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.18)' }}>
        NZ TRANSPORT AGENCY WAKA KOTAHI · DRIVING IN NEW ZEALAND 2024
      </div>
    </div>
  );
}

// ── Level card ─────────────────────────────────────────────────────────────

function LevelCard({ level, onSelect }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? `${level.color}55` : 'rgba(255,255,255,0.09)'}`,
        borderRadius: 14,
        padding: '0 0 20px',
        cursor: 'pointer',
        transition: 'transform 0.15s, background 0.15s, border-color 0.15s, box-shadow 0.15s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? `0 12px 40px ${level.color}18` : '0 4px 16px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Colour accent top bar */}
      <div style={{
        height: 4,
        background: `linear-gradient(90deg, ${level.color}, ${level.color}88)`,
        borderRadius: '14px 14px 0 0',
      }} />

      <div style={{ padding: '18px 20px 0' }}>
        {/* Level badge */}
        <div style={{
          fontSize: 9, letterSpacing: 3.5, fontWeight: 800,
          color: level.color, marginBottom: 6,
        }}>
          {level.name.toUpperCase()}
        </div>

        {/* Title */}
        <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.15 }}>
          {level.title}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 5, lineHeight: 1.4 }}>
          {level.subtitle}
        </div>

        {/* Description */}
        <div style={{
          fontSize: 12, color: 'rgba(255,255,255,0.62)', marginTop: 12, lineHeight: 1.6,
          minHeight: 54,
        }}>
          {level.description}
        </div>

        {/* Objectives preview */}
        <div style={{ marginTop: 14 }}>
          {level.objectives.filter(o => o.id !== 'finish').map(o => (
            <div key={o.id} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 11, color: 'rgba(255,255,255,0.5)',
              marginBottom: 5,
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
              fontSize: 8, letterSpacing: 1.2, fontWeight: 700,
              padding: '3px 8px', borderRadius: 20,
              background: `${level.color}18`,
              border: `1px solid ${level.color}38`,
              color: level.color,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Play button */}
      <div style={{ padding: '16px 20px 0' }}>
        <button
          onClick={onSelect}
          style={{
            width: '100%',
            padding: '11px 0',
            background: hovered ? level.color : `${level.color}cc`,
            color: level.textColor,
            border: 'none', borderRadius: 9,
            fontWeight: 800, fontSize: 13,
            cursor: 'pointer',
            letterSpacing: 0.5,
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
        >
          Play Level {level.number} →
        </button>
      </div>
    </div>
  );
}

// ── Tiny NZ flag ───────────────────────────────────────────────────────────

function NZFlag() {
  return (
    <svg width="28" height="16" viewBox="0 0 28 16" style={{ borderRadius: 2 }}>
      <rect width="28" height="16" fill="#00247d" />
      {/* Union Jack top-left (simplified) */}
      <rect width="14" height="8" fill="#00247d" />
      <line x1="0" y1="0" x2="14" y2="8" stroke="#fff" strokeWidth="2" />
      <line x1="14" y1="0" x2="0" y2="8" stroke="#fff" strokeWidth="2" />
      <line x1="0" y1="0" x2="14" y2="8" stroke="#cc0001" strokeWidth="1" />
      <line x1="14" y1="0" x2="0" y2="8" stroke="#cc0001" strokeWidth="1" />
      <rect x="6" y="0" width="2" height="8" fill="#fff" />
      <rect x="0" y="3" width="14" height="2" fill="#fff" />
      <rect x="6.5" y="0" width="1" height="8" fill="#cc0001" />
      <rect x="0" y="3.5" width="14" height="1" fill="#cc0001" />
      {/* Southern Cross (4 red stars on right) */}
      {[
        { cx: 22, cy: 3 },
        { cx: 25, cy: 6 },
        { cx: 19, cy: 7 },
        { cx: 24, cy: 11 },
      ].map((s, i) => (
        <g key={i}>
          <circle cx={s.cx} cy={s.cy} r="1.6" fill="#fff" />
          <circle cx={s.cx} cy={s.cy} r="0.9" fill="#cc0001" />
        </g>
      ))}
    </svg>
  );
}
