import React, { useState, useEffect } from 'react';
import MissionVariant from './hud/MissionVariant.jsx';
import { LEVELS } from './engine/levels.js';

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
}

export default function App() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [active, setActive] = useState(true);
  const { width, height } = useWindowSize();

  if (!selectedLevel) {
    return (
      <div className="page" style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        height: '100vh', background: '#0a0d12', color: '#fff',
        fontFamily: '"Space Grotesk", ui-sans-serif, system-ui'
      }}>
        <div style={{ maxWidth: 600, width: '90%', padding: '40px 20px', background: '#141a26', borderRadius: 12, border: '1px solid rgba(126,200,255,0.18)' }}>
          <h1 style={{ color: '#7ec8ff', marginBottom: 8, fontSize: 32, textAlign: 'center' }}>NZ Road Safety</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32, textAlign: 'center' }}>Select a level based on NZTA driving guidelines.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {LEVELS.map(level => (
              <button 
                key={level.id}
                onClick={() => setSelectedLevel(level)}
                style={{
                  padding: '20px 24px', textAlign: 'left', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer',
                  transition: 'all 0.2s ease', width: '100%'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              >
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{level.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{level.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="game-frame">
        <MissionVariant
          active={active}
          onActivate={() => setActive(true)}
          level={selectedLevel}
          onBack={() => setSelectedLevel(null)}
          difficulty="easy"
          hudDensity="full"
          width={width}
          height={height}
        />
      </div>
    </div>
  );
}
