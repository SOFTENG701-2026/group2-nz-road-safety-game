// Bottom-center dispatch radio log with animated EQ bars + timestamps.
import { useRadioLog } from './useRadioLog.js';
import { TONE_COLOR } from './tone-colors.js';

export default function RadioLog({ game }) {
  const log = useRadioLog(game);
  if (log.length === 0) return null;

  const accent = TONE_COLOR[game.coach.tone]?.accent || '#7ec8ff';

  return (
    <div style={{
      position: 'absolute', bottom: 14, left: '50%',
      transform: 'translateX(-50%)',
      width: 340,
      background: 'rgba(14,18,26,0.95)',
      border: `1px solid ${accent}55`,
      borderRadius: 6,
      boxShadow: `0 8px 20px rgba(0,0,0,0.5), 0 0 0 1px ${accent}11`,
      backdropFilter: 'blur(8px)',
      overflow: 'hidden',
    }}>
      <Header accent={accent} />
      <div style={{ padding: '4px 12px 10px' }}>
        {log.map((entry, i) => (
          <LogRow key={i + entry.ts} entry={entry} isHead={i === 0} />
        ))}
      </div>
    </div>
  );
}

function Header({ accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            width: 2,
            height: 3 + ((i * 7) % 6),
            background: accent,
            borderRadius: 1,
            animation: `mmWave 1.2s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
      <span style={{ fontSize: 8, letterSpacing: 2, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
        RADIO - DISPATCH
      </span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontVariantNumeric: 'tabular-nums' }}>CH 04</span>
    </div>
  );
}

function LogRow({ entry, isHead }) {
  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'flex-start',
      fontSize: isHead ? 12 : 10,
      color: isHead ? '#fff' : 'rgba(255,255,255,0.45)',
      lineHeight: 1.35,
      paddingTop: isHead ? 4 : 2,
      fontWeight: isHead ? 500 : 400,
    }}>
      <span style={{
        flexShrink: 0,
        fontFamily: 'ui-monospace, monospace',
        fontSize: isHead ? 10 : 9,
        color: 'rgba(255,255,255,0.4)',
        fontVariantNumeric: 'tabular-nums',
        marginTop: isHead ? 1 : 0,
      }}>[{entry.ts}]</span>
      <span style={{ flex: 1 }}>{entry.text}</span>
    </div>
  );
}
