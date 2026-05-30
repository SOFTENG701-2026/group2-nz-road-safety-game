// Top bar: back · mission title · timer · score · stars · retry · mute
import { useState } from 'react';
import StarRating from './StarRating.jsx';
import { setBgMuted, isBgMuted } from '../engine/sound.js';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function TopStrip({ score, elapsed = 0, onReset, onBack, level, isMobile }) {
  const [muted, setMuted] = useState(() => isBgMuted());

  function toggleMute() {
    const next = !muted;
    setBgMuted(next);
    setMuted(next);
  }

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      padding: isMobile ? '6px 10px 10px' : '10px 16px 16px',
      background: 'linear-gradient(180deg, rgba(8,12,22,0.98) 0%, rgba(8,12,22,0) 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      color: '#fff',
      zIndex: 30,
    }}>
      {/* Left: back + mission name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
        <button
          onClick={onBack}
          title="Back to menu"
          style={{
            width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, borderRadius: 6,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isMobile ? 14 : 16, color: '#fff', cursor: 'pointer', flexShrink: 0,
          }}
        >←</button>
        <div>
          <div style={{ fontSize: isMobile ? 7 : 9, letterSpacing: 3, color: '#7ec8ff', fontWeight: 700, opacity: 0.8, marginBottom: 2 }}>
            {level?.name?.toUpperCase() ?? 'MISSION'}
          </div>
          <div style={{ fontSize: isMobile ? 14 : 20, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.1 }}>
            {level?.missionName ?? 'Drive Safely'}
          </div>
        </div>
      </div>

      {/* Right: stats + controls */}
      <div style={{ display: 'flex', gap: isMobile ? 8 : 16, alignItems: 'center' }}>
        <Stat label="TIME"   value={formatTime(elapsed)} isMobile={isMobile} />
        <Stat label="SCORE"  value={String(score).padStart(3, '0')} highlight={score < 60} isMobile={isMobile} />
        {!isMobile && <Stat label="RATING" value={<StarRating score={score} />} />}
        <button onClick={onReset} style={{...ctrlBtn, padding: isMobile ? '4px 8px' : '7px 14px', fontSize: isMobile ? 10 : 12 }}>Retry</button>
        <button onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'} style={{...ctrlBtn, padding: isMobile ? '4px 8px' : '7px 14px', fontSize: isMobile ? 10 : 12 }}>
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  );
}

const ctrlBtn = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.18)',
  color: '#fff', padding: '7px 14px', borderRadius: 6,
  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
};

function Stat({ label, value, highlight, isMobile }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: isMobile ? 7 : 9, letterSpacing: 1.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)' }}>
        {label}
      </div>
      <div style={{
        fontSize: isMobile ? 14 : 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
        color: highlight ? '#ff8a7a' : '#fff',
        transition: 'color 0.3s',
      }}>
        {value}
      </div>
    </div>
  );
}
