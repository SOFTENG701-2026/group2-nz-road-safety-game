import React, { useState, useEffect } from 'react';
import MissionVariant from './hud/MissionVariant.jsx';
import HomePage from './HomePage.jsx';
import { LEVELS } from './levels/index.js';
import { loadProgress, saveLevel } from './engine/progress.js';

function useWindowSize() {
  const [size, setSize] = useState({ width: globalThis.innerWidth, height: globalThis.innerHeight });
  useEffect(() => {
    const handleResize = () => setSize({ width: globalThis.innerWidth, height: globalThis.innerHeight });
    globalThis.addEventListener('resize', handleResize);
    return () => globalThis.removeEventListener('resize', handleResize);
  }, []);
  return size;
}

export default function App() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [progress,      setProgress]      = useState(() => loadProgress());
  const { width, height } = useWindowSize();

  function handleLevelComplete(score) {
    if (!selectedLevel) return;
    const newProgress = saveLevel(selectedLevel.id, score);
    setProgress(newProgress);
  }

  function handleNextLevel() {
    if (!selectedLevel) return;
    const idx = LEVELS.findIndex(l => l.id === selectedLevel.id);
    if (idx >= 0 && idx < LEVELS.length - 1) {
      setSelectedLevel(LEVELS[idx + 1]);
    } else {
      setSelectedLevel(null);
    }
  }

  if (!selectedLevel) {
    return (
      <HomePage
        onSelectLevel={setSelectedLevel}
        progress={progress}
      />
    );
  }

  return (
    <div className="page">
      <div className="game-frame">
        <MissionVariant
          active
          level={selectedLevel}
          onBack={() => setSelectedLevel(null)}
          onNextLevel={handleNextLevel}
          onComplete={handleLevelComplete}
          difficulty="normal"
          hudDensity="full"
          width={width}
          height={height}
        />
      </div>
    </div>
  );
}
