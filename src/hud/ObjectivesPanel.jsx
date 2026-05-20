// Bottom-right list of mission objectives with done/fail indicators and
// an embedded "NEXT AHEAD" callout.
import NextHazardCallout from './NextHazardCallout.jsx';

export default function ObjectivesPanel({ objectives, upcoming, distance, finished }) {
  const done = objectives.filter((o) => o.done).length;

  return (
    <div style={{
      position: 'absolute', bottom: 14, right: 16, width: 200,
      background: 'rgba(14,18,26,0.55)',
      border: '1px solid rgba(126,200,255,0.18)',
      borderRadius: 6,
      padding: '10px 12px',
      color: '#fff',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(10px)',
      overflow: 'hidden',
    }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 9, letterSpacing: 2, color: '#7ec8ff', fontWeight: 600 }}>OBJECTIVES</span>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontVariantNumeric: 'tabular-nums' }}>
          {done}/{objectives.length}
        </span>
      </header>

      {objectives.map((o, i) => (
        <ObjectiveRow key={o.id} o={o} last={i === objectives.length - 1} />
      ))}

      {!finished && (
        <NextHazardCallout hazard={upcoming} distance={distance} />
      )}
    </div>
  );
}

function ObjectiveRow({ o, last }) {
  const color = o.fail ? '#ff8a7a' : o.done ? '#7ce69a' : 'rgba(255,255,255,0.88)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9,
      padding: '5px 0', fontSize: 11.5,
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.05)',
      color,
      transition: 'color 0.3s',
    }}>
      <Checkbox o={o} />
      <span style={{ textDecoration: o.fail ? 'line-through' : 'none', flex: 1 }}>{o.label}</span>
    </div>
  );
}

function Checkbox({ o }) {
  const border = o.fail ? '#ff8a7a' : o.done ? '#7ce69a' : 'rgba(255,255,255,0.3)';
  const fill   = o.done ? '#7ce69a' : o.fail ? '#ff8a7a' : 'transparent';
  return (
    <div style={{
      width: 14, height: 14, borderRadius: 7, flexShrink: 0,
      border: `1.5px solid ${border}`,
      background: fill,
      color: '#0a0d12', fontSize: 9,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800,
    }}>
      {o.done ? 'Y' : o.fail ? 'X' : ''}
    </div>
  );
}
