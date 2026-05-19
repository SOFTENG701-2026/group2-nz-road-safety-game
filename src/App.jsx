import React, { useState, useEffect } from 'react';
import MissionVariant from './hud/MissionVariant.jsx';
import HomePage from './HomePage.jsx';

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
    return <HomePage onSelectLevel={setSelectedLevel} />;
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
