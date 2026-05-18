# Architecture

This is a one-page primer on how the code fits together. Read this once before making big changes.

## Three layers

```
                ┌────────────────────────┐
                │  HUD (React)            │  src/hud/
                │  reads game state,       │
                │  draws overlays          │
                └────────────┬───────────┘
                             │
                ┌────────────▼───────────┐
                │  Engine (plain JS)      │  src/engine/
                │  owns the game object,   │
                │  ticks it every frame    │
                └────────────┬───────────┘
                             │
                ┌────────────▼───────────┐
                │  Render (canvas)        │  src/render/
                │  pure ctx-takers         │
                │  no state, no React      │
                └────────────────────────┘
```

- The **engine** is the source of truth. The game state is a single mutable object created by `createGame()` in `engine/state.js`. Every frame, `tick(g, dt)` mutates it.
- The **render layer** is a tree of pure functions: `drawWorld(ctx, g, camera)` paints the scene from `g` and the camera offset. Render functions never read or write React state.
- The **HUD layer** is React components that read `g` and render overlays. They never mutate the game.

## The frame loop

Lives in `src/engine/useGame.js`. Each `requestAnimationFrame`:

1. Compute `dt` (clamped to 50ms to survive tab-switch stalls).
2. `tick(g, dt)` mutates the game state.
3. Move the camera toward the car with smoothing.
4. `drawWorld(ctx, g, camera)` paints the canvas.
5. Every 6 frames, call `force()` to re-render the HUD. We don't re-render on *every* frame because the HUD doesn't need 60fps — 10fps is plenty for readouts.

## Game state shape

See `createGame()` in `engine/state.js`. The important slices:

- `car`: `{ x, y, angle, speed }`
- `keys`: input state, set from `keydown/keyup` listeners
- `npc`, `ped`: positions + state machines
- `flags`: one-shot booleans so events fire once (`schoolWarned`, `pedHit`, …)
- `score`, `demerits`
- `coach`: `{ id, text, tone, shown }` — the current line on screen
- `objectives`: array of `{ id, label, done, fail }`
- `events`: ring buffer of recent +/- score events

## Adding a new objective

1. Add an entry to `objectives` in `engine/state.js`.
2. In `engine/coach-events.js`, detect the condition and set `.done` or `.fail`.
3. Optionally add a line in `engine/coach-lines.js` and call `setCoach(g, id)`.

That's it. The HUD's `ObjectivesPanel` picks it up automatically.

## Adding a new HUD panel

1. Create `src/hud/MyPanel.jsx`. Take what it needs as props (don't reach into globals).
2. Import + place it in `src/hud/MissionVariant.jsx`.

If the panel needs a derived value (like the trail or radio log), put the derivation in a custom hook (`useTrail.js`, `useRadioLog.js` are existing patterns).

## Adding a new level

Right now the level is hard-coded in `engine/constants.js` + `engine/scenery.js` + `engine/signs-data.js`. To make levels swappable:

1. Move those constants into a `levels/level-01.js` module.
2. Have `createGame()` take a `level` argument.
3. Render functions take constants from `game.level` instead of importing them.

(Not implemented yet — open as a feature request issue if you want it.)
