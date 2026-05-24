// Objectives panel — dark tactical style, bottom-right.
// Visual hierarchy: CURRENT task (highlighted card) > done/failed (small) > pending (dim).
import NextHazardCallout from './NextHazardCallout.jsx';

function statusColor(o) {
  if (o.fail) return '#ff8a7a';
  if (o.done) return '#7ce69a';
  return 'rgba(255,255,255,0.88)';
}
function statusIcon(o) {
  if (o.done) return '✓';
  if (o.fail) return '✕';
  return '○';
}
function statusIconColor(o) {
  if (o.done) return '#7ce69a';
  if (o.fail) return '#ff8a7a';
  return 'rgba(255,255,255,0.3)';
}

export default function ObjectivesPanel({ objectives, upcoming, distance, finished, isMobile }) {
  const done = objectives.filter(o => o.done).length;

  const upcomingMatchesPending = upcoming
    && objectives.some(o => o.id === upcoming.id && !o.done && !o.fail);
  const currentId = upcomingMatchesPending
    ? upcoming.id
    : objectives.find(o => !o.done && !o.fail)?.id;

  return (
    <div style={{
      position: 'absolute',
      bottom: isMobile ? 185 : 14,
      right: 16,
      width: isMobile ? 190 : 280,
      maxWidth: isMobile ? 190 : 280,
      background: 'rgba(8,12,22,0.97)',
      border: '1px solid rgba(126,200,255,0.18)',
      borderRadius: 10,
      padding: isMobile ? '8px 10px' : '12px 14px',
      color: '#fff',
      boxShadow: '0 10px 32px rgba(0,0,0,0.55)',
      backdropFilter: 'blur(14px)',
      transform: isMobile ? 'scale(0.9)' : 'none',
      transformOrigin: 'top right',
    }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: isMobile ? 6 : 10, paddingBottom: isMobile ? 4 : 8,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <span style={{ fontSize: isMobile ? 9 : 11, letterSpacing: 2, color: '#7ec8ff', fontWeight: 700 }}>
          OBJECTIVES
        </span>
        <span style={{ fontSize: isMobile ? 9 : 11, color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums' }}>
          {done} / {objectives.length}
        </span>
      </header>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2, 
        height: isMobile ? 140 : 'auto',
        overflowY: isMobile ? 'auto' : 'none',
        paddingRight: 2
      }}>
        {objectives.map(o => {
          const isCurrent = o.id === currentId && !o.done && !o.fail;
          return (
            <ObjRow
              key={o.id} o={o} isCurrent={isCurrent}
              sColor={statusColor(o)}
              sIcon={statusIcon(o)}
              sIconColor={statusIconColor(o)}
              isMobile={isMobile}
            />
          );
        })}
      </div>

      {!finished && (
        <NextHazardCallout hazard={upcoming} distance={distance} isMobile={isMobile} />
      )}
    </div>
  );
}

function ObjRow({ o, isCurrent, sColor, sIcon, sIconColor, isMobile }) {
  if (isCurrent) {
    return (
      <div style={{
        background: 'rgba(126,200,255,0.10)',
        border: '1px solid rgba(126,200,255,0.30)',
        borderLeft: '3px solid #7ec8ff',
        borderRadius: 7,
        padding: isMobile ? '6px 8px' : '10px 12px',
        margin: isMobile ? '3px 0' : '5px 0',
      }}>
        <div style={{
          fontSize: isMobile ? 8 : 9, letterSpacing: 2.5, color: '#7ec8ff',
          fontWeight: 800, marginBottom: isMobile ? 2 : 6,
        }}>
          ▶ CURRENT TASK
        </div>
        <div style={{ fontSize: isMobile ? 12 : 15, fontWeight: 700, color: '#fff', lineHeight: 1.35 }}>
          {o.label}
        </div>
      </div>
    );
  }

  const dimmed = o.done || o.fail;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9,
      padding: '5px 4px',
      opacity: dimmed ? 0.5 : 0.38,
      transition: 'opacity 0.3s',
    }}>
      <span style={{ fontSize: isMobile ? 11 : 13, fontWeight: 900, flexShrink: 0, color: sIconColor, lineHeight: 1 }}>
        {sIcon}
      </span>
      <span style={{
        fontSize: isMobile ? 10 : 12, color: sColor, lineHeight: 1.3, flex: 1,
        textDecoration: dimmed ? 'line-through' : 'none',
      }}>
        {o.label}
      </span>
    </div>
  );
}
