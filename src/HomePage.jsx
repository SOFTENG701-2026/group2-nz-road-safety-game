import React, { useState, useEffect } from 'react';
import { LEVELS } from './levels/index.js';
import { isLevelUnlocked } from './engine/progress.js';
import { useGame } from './engine/useGame.js';
import { setBgMuted, isBgMuted } from './engine/sound.js';

// Education-focused theme colors
const THEME_COLORS = {
  suburban: '#f5b81d', // Gold
  city:     '#a78bfa', // Purple
  rural:    '#7ce69a', // Forest Green
  mountain: '#7ec8ff', // Ice Blue
};

export default function HomePage({ onSelectLevel, progress }) {
  const [selectedBriefing, setSelectedBriefing] = useState(null);
  const [muted, setMuted] = useState(() => isBgMuted());

  function toggleMute() {
    const next = !muted;
    setBgMuted(next);
    setMuted(next);
  }
  const [windowSize, setWindowSize] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight,
    isMobile: window.innerWidth < 1024
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ 
      width: window.innerWidth, 
      height: window.innerHeight,
      isMobile: window.innerWidth < 1024
    });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.isMobile;

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#04060b',
      color: '#fff',
      fontFamily: '"Space Grotesk", ui-sans-serif, system-ui',
      overflowX: 'hidden',
      overflowY: isMobile ? 'auto' : 'hidden',
      position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* ── Background Simulation ─────────────────────────────────────── */}
      <BackgroundSim width={windowSize.width} height={windowSize.height} />

      {/* ── Overlay Vignette & Grid ─────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(circle at 50% 50%, transparent 20%, rgba(4,6,11,0.25) 70%, rgba(4,6,11,0.6) 100%),
          linear-gradient(rgba(126,200,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(126,200,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* ── Header (Official Branding) ─────────────────────────────── */}
      <header style={{
        position: 'relative', zIndex: 10,
        padding: isMobile ? '24px 20px' : '40px 64px',
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
        background: 'linear-gradient(180deg, rgba(4,6,11,0.8) 0%, transparent 100%)',
        gap: isMobile ? 20 : 0
      }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ width: isMobile ? 4 : 6, height: isMobile ? 40 : 60, background: '#7ec8ff', borderRadius: 3, boxShadow: '0 0 20px #7ec8ff' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <NZFlag size={isMobile ? 'small' : 'normal'} />
              <span style={{ fontSize: 12, letterSpacing: 6, color: '#7ec8ff', fontWeight: 800, opacity: 0.8 }}>
                NZ TRANSPORT AGENCY · WAKA KOTAHI
              </span>
            </div>
            <h1 style={{ fontSize: isMobile ? 28 : 52, fontWeight: 900, margin: 0, letterSpacing: -1, textTransform: 'uppercase', lineHeight: 0.9 }}>
              <span style={{ color: '#fff' }}>NZ</span> ROAD SAFETY <span style={{ color: '#7ec8ff', textShadow: '0 0 30px rgba(126,200,255,0.6)' }}>CHALLENGE</span>
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 24 }}>
          <div style={{
            textAlign: isMobile ? 'left' : 'right',
            display: 'flex', gap: isMobile ? 24 : 40,
            background: isMobile ? 'transparent' : 'rgba(13, 30, 48, 0.7)',
            padding: isMobile ? 0 : '20px 40px',
            borderRadius: 12, border: isMobile ? 'none' : '1px solid rgba(126,200,255,0.3)',
            backdropFilter: isMobile ? 'none' : 'blur(10px)'
          }}>
            <GlobalStat label="LEVELS COMPLETED" value={`${Object.keys(progress).length}/${LEVELS.length}`} isMobile={isMobile} />
            <GlobalStat label="STARS EARNED" value={`${Object.values(progress).reduce((a, b) => a + b, 0)}/${LEVELS.length * 3} ★`} isMobile={isMobile} />
          </div>
          <button onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'} style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff', borderRadius: 8,
            width: 40, height: 40, fontSize: 18,
            cursor: 'pointer', flexShrink: 0,
          }}>
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>

      {/* ── Level Selector ────────────────────────────────────────── */}
      <main style={{
        position: 'relative', zIndex: 5,
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '40px 20px' : '0 80px',
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center', 
          gap: isMobile ? 30 : 40, 
          position: 'relative',
          width: isMobile ? '100%' : 'auto'
        }}>
          {!isMobile && (
            <svg style={{ position: 'absolute', top: '50%', left: 100, right: 100, width: 'calc(100% - 200px)', height: 2, transform: 'translateY(-50%)', zIndex: -1 }}>
              <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(126,200,255,0.2)" strokeWidth="2" strokeDasharray="16 12" />
            </svg>
          )}

          {LEVELS.map((level, idx) => {
            const unlocked = isLevelUnlocked(idx, LEVELS, progress);
            const stars    = progress[level.id] ?? 0;
            const themeColor = THEME_COLORS[level.id] || level.color;
            return (
              <InteractiveLevelNode
                key={level.id}
                level={level}
                unlocked={unlocked}
                stars={stars}
                themeColor={themeColor}
                isMobile={isMobile}
                onClick={() => unlocked && setSelectedBriefing({ ...level, color: themeColor })}
              />
            );
          })}
        </div>
      </main>

      {/* ── Footer Controls ─────────────────────────────────────────── */}
      <footer style={{
        position: 'relative', zIndex: 10,
        padding: isMobile ? '30px 20px' : '60px 64px 40px',
        background: 'linear-gradient(0deg, rgba(4,6,11,0.9) 0%, transparent 100%)',
        display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}>
        {!isMobile ? (
          <div style={{ display: 'flex', gap: 40 }}>
            {[
              { keys: 'W A S D / ↑ ← ↓ →', label: 'ACCELERATE & STEER' },
              { keys: 'SPACE', label: 'BRAKE' },
              { keys: 'R', label: 'RESTART LEVEL' },
            ].map(ctrl => (
              <div key={ctrl.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  fontSize: 18, fontWeight: 900, color: '#fff', 
                  background: 'rgba(126,200,255,0.15)', border: '2px solid rgba(126,200,255,0.4)', 
                  padding: '10px 24px', borderRadius: 8, boxShadow: '0 0 20px rgba(126,200,255,0.2)',
                  letterSpacing: 2
                }}>{ctrl.keys}</div>
                <div style={{ fontSize: 11, letterSpacing: 3, fontWeight: 800, color: 'rgba(126,200,255,0.6)' }}>{ctrl.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'rgba(126,200,255,0.5)', fontSize: 12, fontWeight: 800, letterSpacing: 2 }}>
            USE ON-SCREEN CONTROLS TO DRIVE
          </div>
        )}
      </footer>

      {selectedBriefing && (
        <LevelBriefing
          level={selectedBriefing}
          stars={progress[selectedBriefing.id] ?? 0}
          isMobile={isMobile}
          onClose={() => setSelectedBriefing(null)}
          onStart={() => onSelectLevel(selectedBriefing)}
        />
      )}
    </div>
  );
}

// ── Background Simulation ────────────────────────────────────────────────────

function BackgroundSim({ width, height }) {
  const { canvasRef, game } = useGame({
    width, height,
    active: true,
    level: LEVELS[0],
    difficulty: 'easy',
    hideCar: true,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      game.keys.up = true;
      if (game.car.x > 1500) game.car.x = 50;
    }, 100);
    return () => clearInterval(timer);
  }, [game]);

  return (
    <div style={{
      position: 'absolute', inset: 0, opacity: 0.5,
      transform: 'scale(1.02)', filter: 'blur(2px) brightness(0.8)',
      pointerEvents: 'none', zIndex: 0,
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}

// ── Interactive Level Node ───────────────────────────────────────────────────

function InteractiveLevelNode({ level, unlocked, stars, themeColor, onClick, isMobile }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: isMobile ? '100%' : 280,
        height: isMobile ? 'auto' : 380,
        minHeight: isMobile ? 140 : 380,
        display: 'flex', 
        flexDirection: isMobile ? 'row' : 'column', 
        alignItems: 'center',
        cursor: unlocked ? 'pointer' : 'not-allowed',
        padding: isMobile ? '20px' : '30px 20px',
        background: unlocked 
          ? (hovered ? `linear-gradient(${isMobile ? '90deg' : '180deg'}, ${themeColor}22 0%, rgba(13,30,48,0.95) 100%)` : 'rgba(13,30,48,0.85)')
          : 'rgba(255,255,255,0.02)',
        border: `2px solid ${unlocked ? (hovered ? themeColor : 'rgba(255,255,255,0.15)') : 'rgba(255,255,255,0.05)'}`,
        borderRadius: 24,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered && unlocked ? (isMobile ? 'scale(1.02)' : 'translateY(-20px) scale(1.05)') : 'none',
        boxShadow: hovered && unlocked ? `0 30px 60px rgba(0,0,0,0.5), 0 0 30px ${themeColor}33` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center', justifyContent: isMobile ? 'space-between' : 'space-between', height: isMobile ? 'auto' : '100%', gap: isMobile ? 20 : 0 }}>
        <div style={{ textAlign: isMobile ? 'left' : 'center', flex: isMobile ? 1 : 'none' }}>
          <div style={{ fontSize: isMobile ? 9 : 10, letterSpacing: 4, fontWeight: 800, color: unlocked ? themeColor : 'rgba(255,255,255,0.2)', marginBottom: 4 }}>
            LEVEL 0{level.number}
          </div>
          <h3 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 900, margin: 0, textTransform: 'uppercase', color: unlocked ? '#fff' : 'rgba(255,255,255,0.2)' }}>
            {level.id}
          </h3>
        </div>

        <div style={{
          width: isMobile ? 60 : 100, height: isMobile ? 60 : 100,
          background: unlocked ? (hovered ? themeColor : 'rgba(255,255,255,0.03)') : 'rgba(255,255,255,0.02)',
          border: `2px solid ${unlocked ? (hovered ? '#fff' : themeColor) : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s',
          flexShrink: 0
        }}>
          {unlocked ? (
            <span style={{ fontSize: isMobile ? 20 : 32, color: hovered ? '#000' : themeColor }}>{hovered ? '▶' : level.number}</span>
          ) : (
            <span style={{ fontSize: isMobile ? 20 : 32 }}>🔒</span>
          )}
        </div>

        <div style={{ textAlign: isMobile ? 'right' : 'center', minWidth: isMobile ? 100 : 'none' }}>
          <div style={{ fontSize: isMobile ? 8 : 12, fontWeight: 700, color: unlocked ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)', marginBottom: 8, letterSpacing: 1 }}>
            {unlocked ? 'SAFETY PERFORMANCE' : 'LOCKED'}
          </div>
          <div style={{ display: 'flex', justifyContent: isMobile ? 'flex-end' : 'center' }}>
            <Stars earned={stars} color={themeColor} size={isMobile ? 16 : 24} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Level Briefing Modal ───────────────────────────────────────────────────

function LevelBriefing({ level, stars, onClose, onStart, isMobile }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(4, 6, 11, 0.95)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(40px)',
      padding: isMobile ? 0 : 20,
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%', 
        maxWidth: isMobile ? '100%' : 940,
        height: isMobile ? '100%' : 'auto',
        maxHeight: isMobile ? '100%' : '90vh',
        background: '#0d1e30',
        border: isMobile ? 'none' : `1px solid rgba(126,200,255,0.3)`,
        borderRadius: isMobile ? 0 : 12,
        overflow: 'hidden',
        boxShadow: isMobile ? 'none' : '0 100px 200px rgba(0,0,0,0.9)',
        animation: 'modalFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', 
        flexDirection: 'column',
      }}>
        <style>{`
          @keyframes modalFadeIn {
            from { transform: scale(0.97) translateY(50px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
          @keyframes glint {
            0% { left: -120%; }
            35% { left: 120%; }
            100% { left: 120%; }
          }
          @keyframes bloom {
            0% { box-shadow: 0 0 15px ${level.color}44; }
            100% { box-shadow: 0 0 40px ${level.color}88, 0 0 10px rgba(255,255,255,0.2); }
          }
        `}</style>

        {/* Fixed Header */}
        <div style={{ 
          background: '#08121d', 
          padding: isMobile ? '24px 20px' : '40px 60px', 
          borderBottom: '1px solid rgba(126,200,255,0.1)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexShrink: 0,
          zIndex: 10
        }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: '#7ec8ff', fontWeight: 800, opacity: 0.6, marginBottom: 8 }}>
              LEVEL_0{level.number}
            </div>
            <h2 style={{ fontSize: isMobile ? 24 : 44, fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: -1, lineHeight: 1 }}>
              {level.missionName}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              ...closeBtnStyle, 
              width: 'auto', 
              padding: isMobile ? '8px 16px' : '10px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? 8 : 12,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <span style={{ fontSize: isMobile ? 16 : 20 }}>✕</span>
            <span style={{ fontSize: isMobile ? 11 : 13, letterSpacing: 2, fontWeight: 800 }}>CLOSE</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: isMobile ? '30px 20px' : '60px 80px',
          WebkitOverflowScrolling: 'touch' 
        }}>
          <div style={{ marginBottom: isMobile ? 40 : 64 }}>
            <SectionHeader label="MISSION SUMMARY" />
            <p style={{ 
              fontSize: isMobile ? 16 : 22, color: '#fff', lineHeight: 1.6, marginTop: 20, fontWeight: 500
            }}>{level.description}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: isMobile ? 40 : 80 }}>
            <div>
              <SectionHeader label="LEARNING OBJECTIVES" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
                {level.objectives.filter(o => o.id !== 'finish').map(o => (
                  <div key={o.id} style={{ ...objRowStyle, padding: isMobile ? '12px 16px' : '16px 24px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: level.color, boxShadow: `0 0 12px ${level.color}`, flexShrink: 0 }} />
                    <span style={{ fontSize: isMobile ? 14 : 18, fontWeight: 600 }}>{o.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeader label="SCORING" />
              <div style={{ marginTop: 20, background: 'rgba(0,0,0,0.25)', padding: '24px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <Stars earned={stars} color="#f5b81d" size={isMobile ? 24 : 38} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <RatingHint stars={1} label="Passed" pts="1+" />
                  <RatingHint stars={2} label="Advanced" pts="60+" />
                  <RatingHint stars={3} label="Perfect" pts="85+" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div style={{ 
          padding: isMobile ? '20px' : '40px 80px', 
          background: 'rgba(8, 18, 29, 0.98)', 
          borderTop: '1px solid rgba(126,200,255,0.1)',
          flexShrink: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          position: 'relative'
        }}>
          <button 
            onClick={onStart} 
            style={{ 
              ...startBtnStyle, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: level.color, 
              color: level.textColor,
              fontSize: isMobile ? 18 : 22,
              height: isMobile ? 60 : 72,
              width: isMobile ? '90%' : '100%',
              maxWidth: isMobile ? 400 : 'none',
              position: 'relative',
              zIndex: 2,
              overflow: 'hidden',
              boxShadow: `0 10px 40px rgba(0,0,0,0.4), 0 0 20px ${level.color}44`,
              border: `1px solid rgba(255,255,255,0.2)`,
              animation: 'bloom 2s infinite alternate ease-in-out'
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: '-120%', width: '100%', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'glint 3.5s infinite linear'
            }} />
            
            <span style={{ position: 'relative', zIndex: 1, letterSpacing: isMobile ? 2 : 4 }}>
              START LEVEL 0{level.number}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}


// ── Shared UI ────────────────────────────────────────────────────────────────

function GlobalStat({ label, value, isMobile }) {
  return (
    <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
      <div style={{ fontSize: isMobile ? 8 : 11, letterSpacing: 2, fontWeight: 800, color: 'rgba(126,200,255,0.6)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: isMobile ? 18 : 32, fontWeight: 900, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

function SectionHeader({ label }) {
  return (
    <div style={{ fontSize: 11, letterSpacing: 4, fontWeight: 800, color: '#7ec8ff', paddingBottom: 10, borderBottom: '2px solid rgba(126,200,255,0.2)', display: 'inline-block' }}>{label}</div>
  );
}

function Stars({ earned, color, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[0, 1, 2].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={i < earned ? color : 'rgba(255,255,255,0.08)'} style={{ filter: i < earned ? `drop-shadow(0 0 15px ${color})` : 'none' }}>
          <path d="M10 1l2.6 5.6 6.2.7-4.7 4.2 1.3 6.1L10 14.7 4.6 17.6 5.9 11.5 1.2 7.3l6.2-.7z" />
        </svg>
      ))}
    </div>
  );
}

function RatingHint({ stars, label, pts }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>
      <span style={{ color: 'rgba(255,255,255,0.4)' }}>{stars} STAR: {label}</span>
      <span style={{ color: '#7ec8ff' }}>{pts} PTS</span>
    </div>
  );
}

function NZFlag({ size = 'normal' }) {
  const w = size === 'small' ? 24 : 32;
  const h = size === 'small' ? 14 : 18;
  return (
    <svg width={w} height={h} viewBox="0 0 28 16" style={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
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
      {size !== 'small' && [{ cx: 22, cy: 3 }, { cx: 25, cy: 6 }, { cx: 19, cy: 7 }, { cx: 24, cy: 11 }].map((s) => (
        <g key={`${s.cx}-${s.cy}`}>
          <circle cx={s.cx} cy={s.cy} r="1.6" fill="#fff" />
          <circle cx={s.cx} cy={s.cy} r="0.9" fill="#cc0001" />
        </g>
      ))}
    </svg>
  );
}

const closeBtnStyle = {
  background: 'rgba(255,255,255,0.1)', border: 'none',
  borderRadius: 8, color: '#fff',
  fontSize: 12, fontWeight: 900, cursor: 'pointer', letterSpacing: 1
};
const objRowStyle = {
  display: 'flex', alignItems: 'center', gap: 16,
  color: 'rgba(255,255,255,0.9)', background: 'rgba(126,200,255,0.06)',
  borderRadius: 8, borderLeft: '3px solid rgba(126,200,255,0.3)'
};
const startBtnStyle = {
  flex: 1, border: 'none', padding: '20px', borderRadius: 8,
  fontWeight: 900, cursor: 'pointer', letterSpacing: 4,
  boxShadow: '0 20px 40px rgba(0,0,0,0.5)', transition: 'transform 0.2s'
};
