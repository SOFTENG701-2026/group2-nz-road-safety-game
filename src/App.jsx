import React, { useState } from 'react';
import MissionVariant from './hud/MissionVariant.jsx';

// Root component. The Mission HUD captures keys as soon as it mounts
// (there is only one game on the page, so we don't need the click-to-focus
// gate that the multi-artboard version had).
export default function App() {
  const [active, setActive] = useState(true);

  return (
    <div className="page">
      <div className="game-frame">
        <MissionVariant
          active={active}
          onActivate={() => setActive(true)}
          difficulty="easy"
          hudDensity="full"
          width={720}
          height={500}
        />
      </div>
    </div>
  );
}
