// On-screen D-pad for mobile / touch devices.
// Calls setKey(key, true/false) which directly mutates g.keys in the game ref.
import { useCallback } from 'react';

const BUTTONS = [
  { id: 'up',    label: '▲', row: 1, col: 2, key: 'up'    },
  { id: 'reset', label: '↺', row: 1, col: 1, key: 'reset'    },
  { id: 'left',  label: '◀', row: 2, col: 1, key: 'left'  },
  { id: 'down',  label: '▼', row: 2, col: 2, key: 'down'  },
  { id: 'right', label: '▶', row: 2, col: 3, key: 'right' },
  { id: 'brake', label: '⏸', row: 1, col: 3, key: 'brake' },
];

const BTN = {
  width: 50, height: 50,
  background: 'rgba(14,18,26,0.82)',
  border: '1px solid rgba(126,200,255,0.35)',
  borderRadius: 10,
  color: '#fff',
  fontSize: 20,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  touchAction: 'none',
  backdropFilter: 'blur(6px)',
  transition: 'background 0.08s',
};

export default function TouchControls({ setKey }) {
  const down = useCallback((key, e) => {
    e.preventDefault();
    setKey(key, true);
  }, [setKey]);

  const up = useCallback((key, e) => {
    e.preventDefault();
    setKey(key, false);
  }, [setKey]);

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: '20%',
      // transform: 'translateX(-50%)',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 54px)',
      gridTemplateRows:    'repeat(2, 54px)',
      gap: 4,
      zIndex: 20,
    }}>
      {BUTTONS.map(({ id, label, row, col, key }) => (
        <button
          key={id}
          onPointerDown={(e) => down(key, e)}
          onPointerUp  ={(e) => up  (key, e)}
          onPointerLeave={(e) => up (key, e)}
          style={{
            ...BTN,
            gridRow:    row,
            gridColumn: col,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
