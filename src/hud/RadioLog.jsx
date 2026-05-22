// Coach radio log — most-recent message is large and prominent;
// older history fades so the player always reads the current cue first.
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
      width: 380,
      background: 'rgba(8,12,22,0.97)',
      border: `1px solid ${accent}55`,
      borderRadius: 10,
      boxShadow: `0 10px 28px rgba(0,0,0,0.55), 0 0 0 1px ${accent}11`,
      backdropFilter: 'blur(14px)',
      overflow: 'hidden',
    }}>
      <Header accent={accent} />
      <div style={{ padding: '4px 14px 12px' }}>
        {log.map((entry, i) => (
          <LogRow key={`${i}-${entry.ts}`} entry={entry} index={i} />
        ))}
      </div>
    </div>
  );
}

function Header({ accent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 14px 6px',
      borderBottom: `1px solid ${accent}22`,
    }}>
      {/* EQ bars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            width: 2.5,
            height: 4 + ((i * 7) % 6),
            background: accent,
            borderRadius: 1,
            animation: `mmWave 1.2s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
      <span style={{
        fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.6)',
        fontWeight: 700,
      }}>
        RADIO — DISPATCH
      </span>
      <div style={{ flex: 1 }} />
      <span style={{
        fontSize: 10, color: 'rgba(255,255,255,0.4)',
        fontVariantNumeric: 'tabular-nums', letterSpacing: 0.5,
      }}>
        CH 04
      </span>
    </div>
  );
}

// index 0 = most recent (large), 1 = previous (medium), 2+ = old (small+dim)
function LogRow({ entry, index }) {
  const sizes   = [16, 11, 10];
  const opacity = [1, 0.45, 0.28];
  const weights = [600, 400, 400];

  const fs  = sizes[index]   ?? 10;
  const op  = opacity[index] ?? 0.2;
  const fw  = weights[index] ?? 400;
  const tfs = index === 0 ? 11 : 9;
  const pt  = index === 0 ? 8 : 3;

  return (
    <div style={{
      display: 'flex', gap: 9, alignItems: 'flex-start',
      fontSize: fs, color: '#fff', opacity: op,
      lineHeight: 1.45, paddingTop: pt,
      fontWeight: fw,
    }}>
      <span style={{
        flexShrink: 0,
        fontFamily: 'ui-monospace, monospace',
        fontSize: tfs, color: 'rgba(255,255,255,0.5)',
        fontVariantNumeric: 'tabular-nums',
        marginTop: index === 0 ? 1 : 0,
      }}>
        [{entry.ts}]
      </span>
      <span style={{ flex: 1 }}>{entry.text}</span>
    </div>
  );
}
