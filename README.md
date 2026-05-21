# School Run Aotearoa - Mission Map

A top-down New Zealand road-safety driving game built with **React + Vite**. One complete level is included: drive east past a school, watch for the pedestrian crossing, handle the give-way intersection, and reach the finish line. The overlay uses a tactical dispatch-style HUD.

![Gameplay screenshot placeholder](./docs/screenshot.png)
<sub>Add a gameplay screenshot at `docs/screenshot.png`.</sub>

## Quick Start

```bash
git clone <your-repo-url>
cd <repo-folder>
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` by default. Edit files under `src/` and Vite will reload the app.

## Scripts

| Command           | What it does                                      |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot reload         |
| `npm run build`   | Build the production bundle into `dist/`          |
| `npm run preview` | Serve the built `dist/` locally for a quick check |

## Controls

| Key              | Action        |
| ---------------- | ------------- |
| `Up` / `W`       | Accelerate    |
| `Down` / `S`     | Reverse       |
| `Left` / `A`     | Steer left    |
| `Right` / `D`    | Steer right   |
| `Space`          | Brake         |
| `R`              | Reset the run |

## File Map

```text
src/
  main.jsx              Vite entry; mounts <App>
  App.jsx               Root component
  index.css             Global page styles

  engine/               Game logic
    constants.js        World dimensions and key positions
    units.js            px-to-km/h conversion
    geofence.js         Road, lane, and zone checks
    scenery.js          Decorative scenery data
    signs-data.js       Road sign positions
    coach-lines.js      Coach and dispatch copy
    hazards.js          Ordered route hazards for the HUD
    state.js            createGame() factory and mutators
    physics.js          Car physics step
    npc.js              NPC car behaviour
    pedestrian.js       Pedestrian crossing behaviour
    coach-events.js     Scoring and coach triggers
    tick.js             Per-frame game step
    useGame.js          React hook for state, input, and rendering

  render/               Canvas drawing functions
    index.js            Per-frame world draw composition
    shapes.js           Drawing primitives
    pasture.js          Grass and background patches
    scenery.js          Houses, school, bushes, and details
    roads.js            Roads, lane lines, crossings, finish line
    signs.js            Road sign drawing
    pedestrian.js       Pedestrian sprite
    car.js              Car sprite

  hud/                  React HUD overlay components
    MissionVariant.jsx  Main HUD layout
    TopStrip.jsx        Mission title, score, rating, retry
    ProgressBar.jsx     Route progress bar
    ObjectivesPanel.jsx Objective checklist
    NextHazardCallout.jsx
    NextHazardStrip.jsx
    Minimap.jsx
    SpeedPanel.jsx
    RadioLog.jsx
    FinishCard.jsx
    ClickOverlay.jsx
    KeyHint.jsx
    StarRating.jsx
```

## Common Changes

| What you want to change                | Edit this file                                      |
| -------------------------------------- | --------------------------------------------------- |
| World size, road layout, school zone   | `src/engine/constants.js`                           |
| Pedestrian, NPC, coach behaviour       | `src/engine/pedestrian.js`, `npc.js`, `coach-events.js` |
| Scoring or new objectives              | `src/engine/state.js` and `coach-events.js`         |
| Coach wording or new lines             | `src/engine/coach-lines.js`                         |
| Decorative scenery                     | `src/engine/scenery.js`                             |
| Road sign appearance                   | `src/render/signs.js`                               |
| HUD layout                             | `src/hud/MissionVariant.jsx`                        |
| One HUD panel                          | `src/hud/<PanelName>.jsx`                           |

## Architecture

```text
Keyboard input
    |
    v
useGame.js
    - owns the mutable game object
    - runs requestAnimationFrame
    - calls tick(g, dt)
    - calls drawWorld(ctx, g, camera)
    - refreshes the React HUD about 10 times per second

tick(g, dt)
    - stepPhysics
    - stepNpc
    - stepPedestrian
    - stepCoachEvents

drawWorld(ctx, g, camera)
    - drawPasture
    - drawScenery
    - drawRoads
    - drawSigns
    - drawPedestrian
    - drawCar
```

The engine is the source of truth. The render layer only draws from game state. The HUD reads game state and displays it as React overlays.

## GitHub Pages

The workflow at `.github/workflows/deploy.yml` builds and deploys on pushes to `main`.

1. Push the repo to GitHub.
2. In **Settings > Pages**, set Source to **GitHub Actions**.
3. Push to `main`.

For Vercel, Netlify, or a custom domain, leave the Vite `base` value at its default unless the hosting platform requires otherwise.

## License

MIT. See [LICENSE](./LICENSE).
