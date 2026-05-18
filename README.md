# School Run · Aotearoa — Mission Map

[English](#english) · [中文](#中文)

---

## English

A top-down NZ road-safety driving game built with **React + Vite**. One full level: drive east past a school, watch for the pedestrian, give way at the intersection, hit the finish line. Tactical-style "dispatch" HUD.

![Gameplay screenshot placeholder](./docs/screenshot.png)
<sub>← drop a screenshot at `docs/screenshot.png`</sub>

### Quick start

```bash
git clone <your-repo-url>
cd <repo-folder>
npm install
npm run dev          # → http://localhost:5173
```

That's it. Edit any file under `src/`, save, see the change instantly.

### Scripts

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot reload      |
| `npm run build`   | Build production bundle into `dist/`           |
| `npm run preview` | Serve the built `dist/` locally for a quick check |

### Controls

| Key              | Action          |
| ---------------- | --------------- |
| `↑` / `W`        | Accelerate      |
| `↓` / `S`        | Reverse         |
| `←` / `A`        | Steer left      |
| `→` / `D`        | Steer right     |
| `Space`          | Brake           |
| `R`              | Reset the run   |

### File map

```
src/
├── main.jsx              # Vite entry — mounts <App>
├── App.jsx               # Root component (frames the game)
├── index.css             # Global page styles
│
├── engine/               # Pure game logic (no DOM, no React except useGame)
│   ├── constants.js      # World dimensions + key positions
│   ├── units.js          # px-to-km/h conversion
│   ├── geofence.js       # "Is the car on the road / left side / school zone?"
│   ├── scenery.js        # Decorative scenery data (houses, sheep, ferns)
│   ├── signs-data.js     # Road sign positions
│   ├── coach-lines.js    # Every line the coach can say
│   ├── hazards.js        # Ordered hazards along the route (for the HUD)
│   ├── state.js          # createGame() factory + small mutators
│   ├── physics.js        # Car physics step
│   ├── npc.js            # NPC car behaviour
│   ├── pedestrian.js     # Pedestrian crossing behaviour
│   ├── coach-events.js   # Position-triggered scoring + coach lines
│   ├── tick.js           # One step = physics + npc + ped + events
│   └── useGame.js        # React hook that owns game state + render loop
│
├── render/               # Canvas drawing (pure ctx-takers)
│   ├── index.js          # Composes the per-frame world draw
│   ├── shapes.js         # roundRect, other primitives
│   ├── pasture.js        # Grass + variation patches
│   ├── scenery.js        # Pastures, sheep, school, houses, bushes, ferns
│   ├── roads.js          # Asphalt, lane lines, crossings, finish line
│   ├── signs.js          # All road sign types
│   ├── pedestrian.js     # Top-down pedestrian sprite
│   └── car.js            # Top-down car sprite
│
└── hud/                  # React HUD overlay components
    ├── MissionVariant.jsx    # Top-level HUD — composes every panel
    ├── TopStrip.jsx          # Mission title, score, rating, retry
    ├── ProgressBar.jsx       # Distance bar with hazard ticks
    ├── ObjectivesPanel.jsx   # Bottom-right objectives checklist
    ├── NextHazardCallout.jsx # "NEXT AHEAD" card inside objectives
    ├── NextHazardStrip.jsx   # Floating "next hazard" chip
    ├── Minimap.jsx           # Tactical SVG minimap
    ├── SpeedPanel.jsx        # Speed + speed-limit roundel
    ├── RadioLog.jsx          # Dispatch radio log
    ├── FinishCard.jsx        # Mission-complete modal
    ├── ClickOverlay.jsx      # Click-to-focus splash
    ├── KeyHint.jsx           # Row of <kbd> chips
    ├── StarRating.jsx        # 0-3 gold stars
    ├── tone-colors.js        # Coach tone → palette
    ├── useTrail.js           # Hook: sample car position into a trail
    ├── useRadioLog.js        # Hook: build the radio log buffer
    └── animations.css        # Shared @keyframes
```

### Where to make common changes

| What you want to change                | Edit this file                         |
| -------------------------------------- | -------------------------------------- |
| World size / road layout / school zone | `src/engine/constants.js`              |
| Pedestrian / NPC car / coach behaviour | `src/engine/pedestrian.js` / `npc.js` / `coach-events.js` |
| Scoring or new objectives              | `src/engine/state.js` + `coach-events.js` |
| Coach phrasing / new lines             | `src/engine/coach-lines.js`            |
| Decorative scenery (houses, sheep)     | `src/engine/scenery.js`                |
| How a sign type looks                  | `src/render/signs.js`                  |
| HUD layout                             | `src/hud/MissionVariant.jsx`           |
| Any single HUD panel                   | `src/hud/<PanelName>.jsx`              |

### Architecture (data flow)

```
                ┌──────────────────────────┐
keyboard ─────► │  useGame.js              │ ◄── React renders HUD
                │  (state + render loop)   │
                └─────────┬────────────────┘
                          │ every frame
                          ▼
                ┌─────────────────────┐
                │  tick(g, dt)        │
                │  ├─ stepPhysics     │
                │  ├─ stepNpc         │
                │  ├─ stepPedestrian  │
                │  └─ stepCoachEvents │
                └─────────┬───────────┘
                          ▼
                ┌─────────────────────┐
                │  drawWorld(ctx, g)  │ ──► <canvas>
                │  ├─ drawPasture     │
                │  ├─ drawScenery     │
                │  ├─ drawRoads       │
                │  ├─ drawSigns       │
                │  ├─ drawPedestrian  │
                │  └─ drawCar (×2)    │
                └─────────────────────┘

React HUD overlays read game state (10×/s) and draw on top of <canvas>.
```

### Deploying to GitHub Pages

A workflow at `.github/workflows/deploy.yml` will build + deploy on every push to `main`. To enable it:

1. Push your repo to GitHub.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. Push to `main`. The action builds with `VITE_BASE=/<repo-name>/` so asset URLs resolve correctly under `https://<you>.github.io/<repo>/`.

For Vercel / Netlify / a custom domain: leave `base` at `'/'` (the default in `vite.config.js`).

### License

MIT — see [LICENSE](./LICENSE).

---

## 中文

一款用 **React + Vite** 写的俯视角新西兰道路安全驾驶游戏。一关完整关卡：开车向东经过学校 → 注意行人 → 路口让行 → 抵达终点。HUD 是战术调度风格。

### 快速开始

```bash
git clone <你的仓库地址>
cd <项目目录>
npm install
npm run dev          # → http://localhost:5173
```

编辑 `src/` 下的任何文件，保存即热重载。

### 常用命令

| 命令              | 作用                          |
| ----------------- | ----------------------------- |
| `npm run dev`     | 启动开发服务器（热重载）       |
| `npm run build`   | 打包到 `dist/` 目录           |
| `npm run preview` | 本地预览打包后的版本           |

### 操作

| 按键              | 动作            |
| ----------------- | --------------- |
| `↑` / `W`        | 加速            |
| `↓` / `S`        | 倒车            |
| `←` / `A`        | 左转            |
| `→` / `D`        | 右转            |
| `Space`          | 刹车            |
| `R`              | 重置            |

### 项目结构

代码分三层 —— **引擎 / 渲染 / HUD** —— 每一层职责单一，互不耦合：

- **`src/engine/`** 纯逻辑（不依赖 DOM，除了 `useGame.js`）
  - `constants.js` 世界尺寸 / 路面位置 / 学校区域 / 起终点
  - `physics.js` 车辆物理
  - `npc.js` NPC 车行为
  - `pedestrian.js` 行人过马路逻辑
  - `coach-events.js` 教练台词触发 + 计分
  - `tick.js` 每帧调用（组合上面几个 step）
  - `useGame.js` React Hook，封装状态和渲染循环
  - `coach-lines.js` 所有教练台词
  - `hazards.js` HUD 用的关键路点
  - 等等
- **`src/render/`** Canvas 绘制函数（接受 `ctx`，无副作用）
  - `pasture.js` 草地
  - `scenery.js` 房屋 / 羊 / 学校 / 灌木 / 蕨叶
  - `roads.js` 路面 / 车道线 / 斑马线 / 终点线
  - `signs.js` 各种路牌
  - `pedestrian.js` 行人
  - `car.js` 车辆
  - `index.js` 总绘制函数（按顺序调用上面这些）
- **`src/hud/`** React HUD 组件，**每个面板一个文件**
  - `MissionVariant.jsx` HUD 总装（包含所有面板的布局）
  - `TopStrip.jsx` 顶部任务条
  - `ProgressBar.jsx` 路程进度条
  - `Minimap.jsx` 战术小地图
  - `SpeedPanel.jsx` 速度 + 限速
  - `ObjectivesPanel.jsx` 任务清单
  - `RadioLog.jsx` 电台对讲
  - `FinishCard.jsx` 通关弹窗
  - 还有 `KeyHint`、`StarRating`、`ClickOverlay` 等小组件

### 常见修改在哪个文件

| 想改什么                              | 改哪个文件                              |
| ------------------------------------- | --------------------------------------- |
| 世界大小 / 路面布局 / 学校位置        | `src/engine/constants.js`              |
| 行人 / NPC 车 / 教练触发逻辑          | `src/engine/pedestrian.js` / `npc.js` / `coach-events.js` |
| 计分或加新任务                        | `src/engine/state.js` + `coach-events.js` |
| 教练台词措辞 / 加新台词                | `src/engine/coach-lines.js`            |
| 装饰场景（房屋、羊）                  | `src/engine/scenery.js`                |
| 某种路牌长什么样                      | `src/render/signs.js`                  |
| HUD 整体布局                          | `src/hud/MissionVariant.jsx`           |
| 某一个 HUD 面板                       | `src/hud/<面板名>.jsx`                 |

### 部署到 GitHub Pages

仓库里已经配了 `.github/workflows/deploy.yml`：

1. 把代码推到 GitHub
2. **Settings → Pages**，把 Source 设成 **GitHub Actions**
3. 推到 `main` 分支，Action 会自动构建并发布到 `https://<你>.github.io/<仓库名>/`

部署到 Vercel / Netlify / 自定义域名：保留 `vite.config.js` 里默认的 `base: '/'` 即可。

### 提交贡献

- 提 Issue 用 `.github/ISSUE_TEMPLATE/` 里的两个模板（bug / feature request）
- 提 PR 会自动套用 `.github/pull_request_template.md` 的清单

### 许可证

MIT，见 [LICENSE](./LICENSE)。
