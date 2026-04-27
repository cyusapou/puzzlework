# 🧩 PUZZLEVERSE — Full-Stack Puzzle Game Platform
## Comprehensive Project Architecture & Design Guide

> **Stack:** Vue 3 (Composition API) + Express.js + MongoDB Atlas + Socket.io  
> **Deploy:** Single-service deployment on Render / Railway  
> **Author Brief:** This document is the complete handoff guide for an AI code editor to implement PuzzleVerse from scratch.

---

## TABLE OF CONTENTS

1. [Project Vision](#1-project-vision)
2. [The Games — Original Concepts](#2-the-games--original-concepts)
3. [Feature Specification](#3-feature-specification)
4. [System Architecture Overview](#4-system-architecture-overview)
5. [Repository & Folder Structure](#5-repository--folder-structure)
6. [Database Schema (MongoDB)](#6-database-schema-mongodb)
7. [Backend API Specification](#7-backend-api-specification)
8. [Real-Time Multiplayer Design (Socket.io)](#8-real-time-multiplayer-design-socketio)
9. [Frontend Architecture (Vue 3)](#9-frontend-architecture-vue-3)
10. [Authentication System](#10-authentication-system)
11. [Deployment Strategy (Single Deploy)](#11-deployment-strategy-single-deploy)
12. [Environment Variables](#12-environment-variables)
13. [Implementation Milestones](#13-implementation-milestones)
14. [Acceptance Criteria](#14-acceptance-criteria)

---

## 1. PROJECT VISION

**PuzzleVerse** is a browser-based multi-game puzzle platform with a strong social layer. Players create accounts, compete on global leaderboards, save/resume games, build favourite collections, and challenge friends or strangers in real-time multiplayer rooms. The platform hosts multiple unique, original puzzle games — not clones of existing titles.

**Design Tone:** Dark cosmic theme — deep navy/purple backgrounds, glowing neon accents, smooth micro-animations. Think "puzzle lab in space."

---

## 2. THE GAMES — ORIGINAL CONCEPTS

### 🎮 Game 1: NEUROLINK
**Concept:** A grid of circular neuron nodes. Each node has a colour and a signal strength number. The player must draw synaptic paths between matching-colour neurons without any paths crossing. When all neurons are linked, the level is solved.

**Unique Mechanic:** Signal strength dictates path length — a node with strength 3 must connect to its pair via exactly 3 cells. This forces spatial planning.

**Multiplayer Mode (Race):** Both players receive an identical board. First player to link all neurons wins. Live progress bars show each player's completion percentage.

**Difficulty Scaling:**
- Easy: 5×5 grid, 4 colour pairs, no signal strength constraint
- Medium: 7×7 grid, 6 colour pairs, signal strength active
- Hard: 9×9 grid, 8 colour pairs, dynamic signal strength (changes every 60s)

---

### 🎮 Game 2: CHROMAFLOW
**Concept:** A pipeline network of connected chambers. The player pours coloured liquids from source bottles into the top of the network. Liquids mix according to colour theory (red + blue = purple, etc.) as they travel through pipe junctions. The goal is to fill all target bottles at the bottom with specific mixed colours.

**Unique Mechanic:** Gravity routing — the player can tilt the entire board left or right to change liquid flow direction mid-pour. Each tilt costs a "tilt token" (limited per level).

**Multiplayer Mode (Co-op):** One player controls the left half of the pipe network, the other controls the right half. They must communicate and coordinate pours to achieve the correct final colours.

**Difficulty Scaling:**
- Easy: 3 colours, no mixing required, 6 tilt tokens
- Medium: 5 colours, 2-way mixing, 4 tilt tokens
- Hard: 7 colours, 3-way mixing, 2 tilt tokens

---

### 🎮 Game 3: GRAVITYSHIFT
**Concept:** A 2D room filled with coloured blocks and matching-colour target holes. The player controls gravity direction (Up / Down / Left / Right). When gravity is activated, ALL blocks fall in that direction simultaneously. The goal is to slide every block into its corresponding hole.

**Unique Mechanic:** Some blocks are "anchored" — they don't move with gravity but act as ramps or walls for other blocks. Anchored blocks can be temporarily unanchored by collecting power cells scattered around the room.

**Multiplayer Mode (Sabotage):** Two players compete on mirrored boards. Every time a player correctly places a block in a hole, one of the opponent's anchored blocks becomes randomly unanchored.

**Difficulty Scaling:**
- Easy: 4×4 room, 3 blocks, 2 gravity directions
- Medium: 6×6 room, 5 blocks, 4 gravity directions, 2 anchored blocks
- Hard: 8×8 room, 7 blocks, 4 gravity directions, anchored blocks with power cells required

---

### 🎮 Game 4: SHADOWCRAFT
**Concept:** A 3D wireframe object rotates slowly in the center of the screen, casting a shadow on a flat panel behind it. The player sees a target silhouette. They must add or remove geometric primitives (cubes, cylinders, spheres) to the wireframe object until its shadow EXACTLY matches the target silhouette when viewed from the light source angle.

**Unique Mechanic:** The light source angle shifts slowly during Hard difficulty, meaning the shadow changes over time. Players must build an object that works for multiple angles simultaneously.

**Multiplayer Mode (Judged Race):** Both players get the same target silhouette but start with different random wireframe shapes. A countdown timer runs; when it expires, both shadows are compared to the target and scored by percentage match accuracy.

**Difficulty Scaling:**
- Easy: Static light, simple silhouettes (letter shapes), 5 primitives available
- Medium: Slow light movement, moderate silhouettes, 8 primitives
- Hard: Fast light movement, complex compound silhouettes, 12 primitives

*Rendering:* Three.js for 3D wireframe rendering, orthographic projection for shadow calculation.

---

### 🎮 Game 5: QUANTUMFLIP
**Concept:** A grid of hex-tiles, each showing one of three states: ◯ (empty), △ (triangle), □ (square). The goal is to reach a target pattern. When the player flips a tile, it changes state AND triggers "quantum entanglement" — 2 to 4 other tiles on the board also change state according to a hidden entanglement map shown as faint connecting lines.

**Unique Mechanic:** Players can "measure" an entanglement pair (spend a move) to reveal what that tile will become if the anchor tile is flipped. This is the core deduction mechanic.

**Multiplayer Mode (Turn-Based):** Players alternate flips on a shared board. A player scores a point for every row or column they complete to the target state. The player with the most completed rows/columns when the board is solved wins.

**Difficulty Scaling:**
- Easy: 4×4 grid, 2 entanglement pairs, 2 states (◯ / △)
- Medium: 5×5 grid, 4 entanglement pairs, 3 states
- Hard: 6×6 grid, 6 entanglement pairs, 3 states, entanglement map is hidden (no faint lines)

---

### 🎮 Game 6: ECHOMAZE
**Concept:** A top-down maze filled with sound emitters and receivers. The player places "reflector tiles" (mirrors, absorbers, amplifiers) on empty cells to guide sound waves from every emitter to every receiver. Sound waves travel in straight lines and bounce off reflectors. Receivers need a minimum amplitude to activate.

**Unique Mechanic:** Sound waves can overlap and their amplitudes add or cancel (destructive interference). An amplifier tile doubles amplitude, an absorber tile halves it. Players must manage total amplitude carefully.

**Multiplayer Mode (Co-op Race):** Two players work on the SAME maze simultaneously. Each player controls a different colour of reflector tile. Both tile colours work together to route the sound. They compete in parallel against another team of two.

**Difficulty Scaling:**
- Easy: 6×6 grid, 2 emitters, 2 receivers, reflectors only
- Medium: 8×8 grid, 3 emitters, 4 receivers, reflectors + absorbers
- Hard: 10×10 grid, 5 emitters, 6 receivers, all tile types, amplitude management critical

---

## 3. FEATURE SPECIFICATION

### 3.1 Authentication & User Identity
- **Sign Up:** Username (unique), email, password (bcrypt hashed)
- **Log In:** Email + password → JWT access token (15min expiry) + refresh token (7 days, stored in HttpOnly cookie)
- **Google OAuth:** Optional social login via Passport.js
- **Profile Page:** Avatar (gravatar or upload), username, join date, stats
- **Account Settings:** Change username, email, password, delete account

### 3.2 User Dashboard (Home after login)
- Greeting card with player name and streak
- "Continue Playing" section — list of paused/in-progress games
- Quick-play buttons for each game
- "Your Favourites" shelf — pinned games
- Recent activity feed — your last 5 completed games with scores
- "Challenge a Friend" button — creates a room instantly

### 3.3 Game Session Management
- **Auto-save:** Game state is saved to DB every 30 seconds during play AND on tab close (beforeunload)
- **Resume:** Dashboard shows paused sessions with a resume button that restores exact board state
- **Abandon:** Player can abandon a session (marks it as abandoned, removes from active sessions)
- **Session model stores:** gameId, userId, boardState (JSON), timeElapsed, moveCount, difficulty, lastSaved

### 3.4 Favourites System
- Each game card has a ♡ icon
- Clicking adds/removes the game from user's favourites list
- Favourites displayed in a dedicated shelf on the dashboard
- Favourites are stored as an array of game slugs on the User document

### 3.5 Leaderboard System
- Per-game leaderboard filtered by difficulty
- Top 10 all-time scores
- Player's personal best shown with their rank
- Weekly leaderboard tab (resets every Monday)
- Entries show: rank, avatar, username, score, time, moves, difficulty, date

### 3.6 Scoring Formula
```
score = Math.round(
  (basePoints[difficulty] / timeSeconds) * 1000 * (1 / (1 + moves * 0.01))
)
```
Where basePoints = { easy: 500, medium: 1500, hard: 3000 }

### 3.7 Multiplayer Rooms
- **Private Room:** Player generates a 6-character room code and shares it
- **Quick Match:** Matchmaking queue per game and difficulty
- **Room States:** WAITING → READY → COUNTDOWN → PLAYING → RESULTS
- **Game Modes per game:** See game descriptions above (race, co-op, sabotage, turn-based)
- **Room Chat:** Simple text chat during the game (Socket.io)
- **Spectator Mode:** Up to 5 spectators can watch a live match via room code

### 3.8 Notifications & Engagement
- **Daily Challenge:** One special puzzle available per day, globally shared. Completing it awards bonus XP.
- **Achievement System:** Badges for milestones (first win, 10-game streak, beat hard mode, etc.)
- **XP & Level System:** Players earn XP for completing games, beating scores, winning multiplayer. Level displayed on profile.
- **Streak Counter:** Consecutive days with at least one completed game. Displayed on dashboard.

### 3.9 UX & Accessibility
- Dark/Light mode toggle (persisted in localStorage and user profile)
- Keyboard navigation support for all games
- Sound effects toggle (stored in user preferences)
- Animations can be disabled (respects prefers-reduced-motion)
- Mobile-first responsive layout

---

## 4. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                    SINGLE RENDER SERVICE                        │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                   Express.js Server                     │  │
│   │                                                         │  │
│   │  ┌─────────────┐    ┌──────────────┐    ┌───────────┐  │  │
│   │  │ REST API    │    │ Socket.io    │    │ Static    │  │  │
│   │  │ /api/*      │    │ Real-Time    │    │ File      │  │  │
│   │  │             │    │ Multiplayer  │    │ Server    │  │  │
│   │  │ Auth routes │    │              │    │ (Vue dist)│  │  │
│   │  │ Game routes │    │ Room manager │    │           │  │  │
│   │  │ Score routes│    │ Game engines │    │           │  │  │
│   │  │ User routes │    │ Matchmaking  │    │           │  │  │
│   │  └──────┬──────┘    └──────┬───────┘    └───────────┘  │  │
│   │         │                  │                             │  │
│   │  ┌──────▼──────────────────▼───────┐                    │  │
│   │  │         MongoDB (Atlas)          │                    │  │
│   │  │  users, sessions, scores,        │                    │  │
│   │  │  rooms, achievements             │                    │  │
│   │  └─────────────────────────────────┘                    │  │
│   └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                    HTTP + WebSocket
                              │
              ┌───────────────┴───────────────┐
              │         Browser Client        │
              │         Vue 3 SPA             │
              │   (served from /dist)         │
              └───────────────────────────────┘
```

**Key Principle:** The Express server serves the built Vue app as static files AND handles all API + WebSocket traffic. This means ONE service, ONE URL, ONE deployment.

---

## 5. REPOSITORY & FOLDER STRUCTURE

```
puzzleverse/
│
├── client/                          # Vue 3 Frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   └── sounds/                  # Audio assets
│   │       ├── move.mp3
│   │       ├── complete.mp3
│   │       ├── error.mp3
│   │       └── multiplayer-join.mp3
│   │
│   ├── src/
│   │   ├── main.js                  # Vue app entry
│   │   ├── App.vue                  # Root component
│   │   │
│   │   ├── router/
│   │   │   └── index.js             # Vue Router routes + auth guards
│   │   │
│   │   ├── stores/                  # Pinia stores
│   │   │   ├── auth.js              # User state, login/logout
│   │   │   ├── ui.js                # Theme, sound prefs
│   │   │   ├── session.js           # Active game sessions
│   │   │   └── multiplayer.js       # Room/socket state
│   │   │
│   │   ├── composables/
│   │   │   ├── useAuth.js           # Login/signup/token logic
│   │   │   ├── useGameSession.js    # Save/resume game session
│   │   │   ├── useLeaderboard.js    # Fetch leaderboard data
│   │   │   ├── useSocket.js         # Socket.io connection wrapper
│   │   │   ├── useRoom.js           # Room join/create/leave
│   │   │   ├── useSound.js          # Sound effect player
│   │   │   ├── useScore.js          # Score calculation + submission
│   │   │   └── useAchievements.js   # Achievement trigger logic
│   │   │
│   │   ├── views/
│   │   │   ├── HomeView.vue         # Landing page (logged out)
│   │   │   ├── DashboardView.vue    # User home (logged in)
│   │   │   ├── LoginView.vue
│   │   │   ├── SignupView.vue
│   │   │   ├── ProfileView.vue
│   │   │   ├── LeaderboardView.vue
│   │   │   ├── GameSelectView.vue   # Browse all games
│   │   │   ├── MultiplayerLobbyView.vue
│   │   │   ├── RoomView.vue         # Waiting room + game
│   │   │   └── NotFoundView.vue
│   │   │
│   │   ├── games/                   # One folder per game
│   │   │   ├── neurolink/
│   │   │   │   ├── NeuroLinkView.vue       # Game page
│   │   │   │   ├── NeuroLinkBoard.vue      # Game board component
│   │   │   │   ├── NeuroLinkHUD.vue        # Timer, moves, controls
│   │   │   │   └── neurolink.engine.js     # Pure game logic (no Vue)
│   │   │   │
│   │   │   ├── chromaflow/
│   │   │   │   ├── ChromaFlowView.vue
│   │   │   │   ├── ChromaFlowBoard.vue
│   │   │   │   ├── ChromaFlowHUD.vue
│   │   │   │   └── chromaflow.engine.js
│   │   │   │
│   │   │   ├── gravityshift/
│   │   │   │   ├── GravityShiftView.vue
│   │   │   │   ├── GravityShiftBoard.vue
│   │   │   │   ├── GravityShiftHUD.vue
│   │   │   │   └── gravityshift.engine.js
│   │   │   │
│   │   │   ├── shadowcraft/
│   │   │   │   ├── ShadowCraftView.vue
│   │   │   │   ├── ShadowCraftRenderer.vue  # Three.js wrapper
│   │   │   │   ├── ShadowCraftHUD.vue
│   │   │   │   └── shadowcraft.engine.js
│   │   │   │
│   │   │   ├── quantumflip/
│   │   │   │   ├── QuantumFlipView.vue
│   │   │   │   ├── QuantumFlipBoard.vue
│   │   │   │   ├── QuantumFlipHUD.vue
│   │   │   │   └── quantumflip.engine.js
│   │   │   │
│   │   │   └── echomaze/
│   │   │       ├── EchoMazeView.vue
│   │   │       ├── EchoMazeBoard.vue
│   │   │       ├── EchoMazeHUD.vue
│   │   │       └── echomaze.engine.js
│   │   │
│   │   ├── components/              # Shared UI components
│   │   │   ├── layout/
│   │   │   │   ├── AppNav.vue
│   │   │   │   ├── AppFooter.vue
│   │   │   │   └── AppSidebar.vue
│   │   │   │
│   │   │   ├── ui/
│   │   │   │   ├── BaseButton.vue
│   │   │   │   ├── BaseModal.vue
│   │   │   │   ├── BaseToast.vue
│   │   │   │   ├── BaseInput.vue
│   │   │   │   ├── BaseAvatar.vue
│   │   │   │   ├── BaseCard.vue
│   │   │   │   ├── SkeletonLoader.vue
│   │   │   │   └── ThemeToggle.vue
│   │   │   │
│   │   │   ├── game/
│   │   │   │   ├── GameCard.vue          # Game thumbnail card with fav btn
│   │   │   │   ├── GameHUD.vue           # Shared timer + moves display
│   │   │   │   ├── DifficultyPicker.vue
│   │   │   │   ├── ScoreSubmitModal.vue  # Post-win name entry + score show
│   │   │   │   ├── LeaderboardTable.vue
│   │   │   │   ├── AchievementToast.vue
│   │   │   │   └── DailyChallengeCard.vue
│   │   │   │
│   │   │   └── multiplayer/
│   │   │       ├── RoomCodeDisplay.vue
│   │   │       ├── PlayerSlot.vue
│   │   │       ├── MatchmakingSpinner.vue
│   │   │       ├── LiveProgressBar.vue
│   │   │       └── RoomChat.vue
│   │   │
│   │   ├── assets/
│   │   │   ├── styles/
│   │   │   │   ├── main.css           # Global styles, CSS vars, theme
│   │   │   │   ├── animations.css     # Keyframes
│   │   │   │   └── games.css          # Game-shared layout styles
│   │   │   └── images/
│   │   │       └── game-thumbnails/   # Static preview images per game
│   │   │
│   │   └── utils/
│   │       ├── api.js                 # Axios instance with interceptors
│   │       ├── constants.js           # Game slugs, difficulty configs
│   │       ├── formatters.js          # Time, score formatters
│   │       └── validators.js          # Form validation helpers
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Express.js Backend
│   ├── index.js                     # Entry point — binds Express + Socket.io
│   │
│   ├── config/
│   │   └── db.js                    # MongoDB Atlas connection (Mongoose)
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js        # JWT verify middleware
│   │   ├── error.middleware.js       # Global error handler
│   │   ├── rateLimit.middleware.js   # express-rate-limit configs
│   │   └── validate.middleware.js    # Request body validation (Joi)
│   │
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Score.model.js
│   │   ├── GameSession.model.js
│   │   ├── Room.model.js
│   │   └── Achievement.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js           # POST /api/auth/signup, /login, /refresh, /logout
│   │   ├── user.routes.js           # GET/PATCH /api/users/me, favourites
│   │   ├── scores.routes.js         # POST /api/scores, GET /api/scores
│   │   ├── sessions.routes.js       # GET/POST/PATCH/DELETE /api/sessions
│   │   └── daily.routes.js          # GET /api/daily
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── scores.controller.js
│   │   ├── sessions.controller.js
│   │   └── daily.controller.js
│   │
│   ├── socket/
│   │   ├── socket.manager.js        # Socket.io init and namespace setup
│   │   ├── room.handler.js          # Room create/join/leave events
│   │   ├── game.handler.js          # Game state sync events
│   │   └── chat.handler.js          # In-room chat events
│   │
│   ├── game-engines/                # Server-side game logic (authoritative)
│   │   ├── neurolink.server.js
│   │   ├── chromaflow.server.js
│   │   ├── gravityshift.server.js
│   │   ├── shadowcraft.server.js
│   │   ├── quantumflip.server.js
│   │   └── echomaze.server.js
│   │
│   └── utils/
│       ├── jwt.utils.js             # Token sign/verify helpers
│       ├── score.utils.js           # Score calculation
│       └── matchmaking.utils.js     # Matchmaking queue logic
│
├── .env                             # Never committed
├── .env.example                     # Template for environment variables
├── .gitignore
├── package.json                     # Root package.json with build scripts
└── README.md
```

---

## 6. DATABASE SCHEMA (MongoDB)

### 6.1 User Collection
```javascript
// models/User.model.js
{
  _id: ObjectId,
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20 },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },           // bcrypt, rounds: 12
  avatar: { type: String, default: null },                  // URL or null (gravatar fallback)
  favourites: [{ type: String }],                           // array of game slugs e.g. ['neurolink', 'echomaze']
  preferences: {
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    soundEnabled: { type: Boolean, default: true },
    reducedMotion: { type: Boolean, default: false }
  },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: {
    current: { type: Number, default: 0 },
    lastPlayedDate: { type: Date, default: null }
  },
  achievements: [{ type: String }],                         // array of achievement slugs
  refreshTokenHash: { type: String, default: null },        // hashed refresh token
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### 6.2 Score Collection
```javascript
// models/Score.model.js
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },               // denormalized for leaderboard speed
  gameSlug: { type: String, required: true },               // 'neurolink', 'chromaflow', etc.
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  score: { type: Number, required: true },
  timeSeconds: { type: Number, required: true },
  moveCount: { type: Number, required: true },
  isMultiplayer: { type: Boolean, default: false },
  completedAt: { type: Date, default: Date.now }
}
// Indexes: { gameSlug: 1, difficulty: 1, score: -1 } for leaderboard queries
// Indexes: { userId: 1, gameSlug: 1 } for personal best
```

### 6.3 GameSession Collection
```javascript
// models/GameSession.model.js
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', required: true },
  gameSlug: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  status: { type: String, enum: ['active', 'paused', 'completed', 'abandoned'], default: 'active' },
  boardState: { type: Object, required: true },             // game-specific serialised state (JSON)
  seed: { type: String, required: true },                   // random seed used to generate this puzzle
  timeElapsed: { type: Number, default: 0 },                // seconds elapsed so far
  moveCount: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  lastSavedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
}
// Index: { userId: 1, status: 1 } for dashboard resume list
```

### 6.4 Room Collection
```javascript
// models/Room.model.js
{
  _id: ObjectId,
  code: { type: String, required: true, unique: true },     // 6-char alphanumeric
  gameSlug: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  mode: { type: String, enum: ['race', 'coop', 'sabotage', 'turnbased'] },
  status: { type: String, enum: ['waiting', 'ready', 'countdown', 'playing', 'results', 'closed'] },
  players: [{
    userId: { type: ObjectId, ref: 'User' },
    username: String,
    socketId: String,
    isReady: Boolean,
    isSpectator: Boolean,
    score: { type: Number, default: 0 },
    completedAt: { type: Date, default: null }
  }],
  gameState: { type: Object, default: null },               // shared authoritative board state
  seed: { type: String },
  maxPlayers: { type: Number, default: 2 },
  maxSpectators: { type: Number, default: 5 },
  isPrivate: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date, default: null }
}
```

### 6.5 Achievement Collection (reference data)
```javascript
// Seeded into DB, not user-generated
{
  slug: 'first_win',
  title: 'First Victory',
  description: 'Complete your first puzzle',
  icon: '🏆',
  xpReward: 50
}
// Full list defined in server/utils/achievements.seed.js
```

---

## 7. BACKEND API SPECIFICATION

### Base URL: `/api`

### Authentication Routes (`/api/auth`)
```
POST   /api/auth/signup
  Body: { username, email, password }
  Returns: { user: {...}, accessToken }
  Sets: HttpOnly cookie 'refreshToken'

POST   /api/auth/login
  Body: { email, password }
  Returns: { user: {...}, accessToken }
  Sets: HttpOnly cookie 'refreshToken'

POST   /api/auth/refresh
  Cookie: refreshToken
  Returns: { accessToken }

POST   /api/auth/logout
  Clears: refreshToken cookie
  Returns: { message: 'Logged out' }
```

### User Routes (`/api/users`) — Requires Auth
```
GET    /api/users/me
  Returns: full user profile + stats

PATCH  /api/users/me
  Body: { username?, avatar?, preferences? }
  Returns: updated user

PUT    /api/users/me/favourites
  Body: { gameSlug, action: 'add' | 'remove' }
  Returns: updated favourites array

GET    /api/users/me/achievements
  Returns: list of earned achievements with metadata
```

### Score Routes (`/api/scores`)
```
POST   /api/scores
  Auth: Required
  Body: { gameSlug, difficulty, score, timeSeconds, moveCount, isMultiplayer? }
  Returns: { score, rank, personalBest: boolean }

GET    /api/scores?gameSlug=neurolink&difficulty=medium&period=alltime|weekly
  Auth: Not required (public leaderboard)
  Returns: {
    leaderboard: [top 10 entries with userId, username, score, timeSeconds, moveCount, completedAt],
    playerEntry: { rank, score } | null   // included if auth token present
  }

GET    /api/scores/personal?gameSlug=neurolink
  Auth: Required
  Returns: player's scores for the game, best per difficulty
```

### Session Routes (`/api/sessions`) — Requires Auth
```
POST   /api/sessions
  Body: { gameSlug, difficulty, seed, boardState }
  Returns: { sessionId }

GET    /api/sessions?status=active|paused
  Returns: list of user's in-progress sessions

GET    /api/sessions/:id
  Returns: full session with boardState (only if owner)

PATCH  /api/sessions/:id
  Body: { boardState, timeElapsed, moveCount, status? }
  Returns: { lastSavedAt }

DELETE /api/sessions/:id
  Body: { status: 'abandoned' }
  Returns: { message: 'Session abandoned' }
```

### Daily Challenge Route (`/api/daily`)
```
GET    /api/daily
  Returns: { gameSlug, difficulty, seed, expiresAt, completedToday: boolean }
  Note: seed is deterministic from date — same puzzle for everyone each day
```

---

## 8. REAL-TIME MULTIPLAYER DESIGN (Socket.io)

### 8.1 Connection and Namespaces
```javascript
// All multiplayer uses a single namespace: /multiplayer
// Client connects:
const socket = io('/multiplayer', {
  auth: { token: accessToken }
})
// Server verifies JWT on connection
```

### 8.2 Room Lifecycle — Events

**Client → Server events:**
```
'room:create'    { gameSlug, difficulty, mode, isPrivate }
  Server creates room, joins socket to room, emits 'room:created' with code

'room:join'      { code }
  Server adds player to room, emits 'room:updated' to all in room

'room:leave'     {}
  Server removes player, emits 'room:updated' to remaining players

'room:ready'     {}
  Player marks themselves ready. If all players ready → emit 'room:allReady'

'room:startGame' {}  (host only)
  Server validates all ready, starts 3s countdown, emits 'room:countdown'

'matchmaking:join'   { gameSlug, difficulty, mode }
  Server adds to matchmaking queue. When pair found → creates room, emits 'room:matched'

'matchmaking:leave'  {}
  Removes from matchmaking queue

'chat:message'   { text }
  Server broadcasts to room: 'chat:message' { username, text, timestamp }

'game:move'      { moveData }
  Server validates move via authoritative engine, applies it, broadcasts updated state

'game:complete'  { finalState }
  Server verifies win condition, records result, emits 'game:results' to all
```

**Server → Client events:**
```
'room:created'     { code, room }
'room:updated'     { room }
'room:allReady'    { room }
'room:countdown'   { seconds: 3 }
'room:closed'      { reason }
'room:matched'     { code, room }

'chat:message'     { username, text, timestamp }

'game:stateUpdate' { boardState, players }   // after each validated move
'game:results'     { winner, scores, xpEarned }

'error'            { code, message }
```

### 8.3 Authoritative Server Pattern
For competitive modes (race, sabotage, turn-based):
- Client sends a **move intent**, not a new board state
- Server validates the move using the same engine logic (server-side engine files)
- Server applies the move to the authoritative `room.gameState`
- Server broadcasts the new `boardState` to ALL players in the room
- Clients replace their local state with the server broadcast

For co-op mode:
- Each player's moves are independently applied and broadcast
- The server maintains one shared board state
- Move validation still happens server-side

### 8.4 Matchmaking Queue
```javascript
// In-memory queue (can upgrade to Redis for scaling)
const queues = {
  'neurolink:easy:race': [],
  'neurolink:medium:race': [],
  // ... etc
}
// When 2 players in same queue entry → create room → emit 'room:matched' to both
// Timeout after 30s: emit 'matchmaking:timeout', remove from queue
```

---

## 9. FRONTEND ARCHITECTURE (Vue 3)

### 9.1 Router Structure
```javascript
// All routes under /
const routes = [
  { path: '/', component: HomeView },                       // landing (redirects if logged in)
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/login', component: LoginView },
  { path: '/signup', component: SignupView },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/leaderboard', component: LeaderboardView },
  { path: '/games', component: GameSelectView },
  { path: '/games/neurolink', component: NeuroLinkView, meta: { requiresAuth: true } },
  { path: '/games/chromaflow', component: ChromaFlowView, meta: { requiresAuth: true } },
  { path: '/games/gravityshift', component: GravityShiftView, meta: { requiresAuth: true } },
  { path: '/games/shadowcraft', component: ShadowCraftView, meta: { requiresAuth: true } },
  { path: '/games/quantumflip', component: QuantumFlipView, meta: { requiresAuth: true } },
  { path: '/games/echomaze', component: EchoMazeView, meta: { requiresAuth: true } },
  { path: '/multiplayer', component: MultiplayerLobbyView, meta: { requiresAuth: true } },
  { path: '/room/:code', component: RoomView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', component: NotFoundView }
]

// Navigation guard
router.beforeEach((to, from) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})
```

### 9.2 Pinia Stores

**auth.js store:**
```javascript
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(null)
  const isLoggedIn = computed(() => !!user.value)

  async function login(email, password) { /* ... */ }
  async function signup(username, email, password) { /* ... */ }
  async function logout() { /* ... */ }
  async function refreshToken() { /* ... */ }
  async function fetchMe() { /* ... */ }

  return { user, accessToken, isLoggedIn, login, signup, logout, refreshToken, fetchMe }
})
```

**session.js store:**
```javascript
export const useSessionStore = defineStore('session', () => {
  const activeSessions = ref([])    // paused sessions from server
  const currentSession = ref(null)  // the session being played right now

  async function loadSessions() { /* GET /api/sessions */ }
  async function saveSession(sessionId, boardState, timeElapsed, moveCount) { /* PATCH */ }
  async function abandonSession(sessionId) { /* DELETE */ }
  async function resumeSession(session) { /* navigate to game with session data */ }

  return { activeSessions, currentSession, loadSessions, saveSession, abandonSession, resumeSession }
})
```

**multiplayer.js store:**
```javascript
export const useMultiplayerStore = defineStore('multiplayer', () => {
  const socket = ref(null)
  const room = ref(null)
  const isConnected = ref(false)
  const messages = ref([])

  function connect() { /* init socket */ }
  function createRoom(config) { /* emit room:create */ }
  function joinRoom(code) { /* emit room:join */ }
  function sendMove(moveData) { /* emit game:move */ }
  function disconnect() { /* socket.disconnect() */ }

  return { socket, room, isConnected, messages, connect, createRoom, joinRoom, sendMove, disconnect }
})
```

### 9.3 Axios API Client
```javascript
// utils/api.js
import axios from 'axios'
const api = axios.create({ baseURL: '/api', withCredentials: true })

// Request interceptor — attach access token
api.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.accessToken) config.headers.Authorization = `Bearer ${auth.accessToken}`
  return config
})

// Response interceptor — auto-refresh on 401
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true
      await useAuthStore().refreshToken()
      return api(err.config)
    }
    return Promise.reject(err)
  }
)

export default api
```

### 9.4 Game Engine Pattern
Each game has a pure JS engine file that is UI-framework agnostic:
```javascript
// games/neurolink/neurolink.engine.js
export function createBoard(seed, difficulty) { /* deterministic board from seed */ }
export function applyMove(boardState, move) { /* returns new immutable state */ }
export function checkWin(boardState) { /* returns boolean */ }
export function serializeState(boardState) { /* for DB storage */ }
export function deserializeState(data) { /* restore from DB */ }
export function getValidMoves(boardState) { /* for hint system */ }
```

The game View component owns the reactive state and calls the engine:
```javascript
// In NeuroLinkView.vue — setup()
const boardState = ref(createBoard(session.seed, props.difficulty))
const moveCount = ref(0)
const timer = useTimer()

function handleMove(move) {
  const next = applyMove(boardState.value, move)
  boardState.value = next
  moveCount.value++
  playSound('move')
  autoSave()
  if (checkWin(boardState.value)) handleWin()
}
```

### 9.5 Auto-Save Logic
```javascript
// composables/useGameSession.js
export function useGameSession(sessionId, getState) {
  const AUTOSAVE_INTERVAL = 30_000 // 30 seconds
  let intervalId = null

  function save() {
    api.patch(`/sessions/${sessionId}`, {
      boardState: getState(),
      timeElapsed: timer.value,
      moveCount: moves.value
    })
  }

  onMounted(() => {
    intervalId = setInterval(save, AUTOSAVE_INTERVAL)
    window.addEventListener('beforeunload', save) // save on tab close
  })

  onUnmounted(() => {
    clearInterval(intervalId)
    window.removeEventListener('beforeunload', save)
  })

  return { save }
}
```

### 9.6 CSS Design System
```css
/* assets/styles/main.css */
:root {
  /* Dark theme (default) */
  --color-bg-base: #0b0f1a;
  --color-bg-surface: #141929;
  --color-bg-card: #1c2237;
  --color-accent-primary: #7c4dff;       /* electric violet */
  --color-accent-secondary: #00e5ff;     /* cosmic cyan */
  --color-accent-success: #00e676;       /* neon green */
  --color-accent-danger: #ff1744;        /* plasma red */
  --color-accent-warning: #ffab00;       /* star yellow */
  --color-text-primary: #e8eaf6;
  --color-text-secondary: #90a4ae;
  --color-border: rgba(124, 77, 255, 0.2);

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 32px;

  --shadow-glow-purple: 0 0 20px rgba(124, 77, 255, 0.4);
  --shadow-glow-cyan: 0 0 20px rgba(0, 229, 255, 0.4);

  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

[data-theme="light"] {
  --color-bg-base: #f0f4ff;
  --color-bg-surface: #ffffff;
  --color-bg-card: #e8edf8;
  --color-text-primary: #0d1117;
  --color-text-secondary: #4a5568;
  --color-border: rgba(124, 77, 255, 0.15);
}
```

---

## 10. AUTHENTICATION SYSTEM

### 10.1 Token Strategy
- **Access Token:** JWT, 15-minute expiry, stored in memory (Pinia store only — never localStorage)
- **Refresh Token:** JWT, 7-day expiry, stored in HttpOnly + Secure + SameSite=Strict cookie
- **Rotation:** Refresh token is rotated on every use (old token invalidated, new one issued)
- **Revocation:** Refresh token hash stored in User document. On logout, hash is cleared.

### 10.2 Password Security
- bcrypt with 12 salt rounds
- Minimum 8 characters enforced client and server side
- Rate limiting on login route: 5 attempts per 15 minutes per IP

### 10.3 Middleware
```javascript
// middleware/auth.middleware.js
export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token expired or invalid' })
  }
}
```

---

## 11. DEPLOYMENT STRATEGY (SINGLE DEPLOY)

### 11.1 The Core Trick — Express Serves Vue
```javascript
// server/index.js
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

// API routes first
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/scores', scoresRoutes)
app.use('/api/sessions', sessionsRoutes)
app.use('/api/daily', dailyRoutes)

// Then serve Vue build as static
app.use(express.static(path.join(__dirname, '../client/dist')))

// Catch-all: send index.html for any non-API route (Vue Router handles it)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})
```

### 11.2 Root package.json (Monorepo Build Scripts)
```json
{
  "name": "puzzleverse",
  "scripts": {
    "install:all": "npm install && cd client && npm install && cd ../server && npm install",
    "build": "cd client && npm run build",
    "start": "node server/index.js",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && node --watch index.js",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\""
  }
}
```

### 11.3 Render Deployment (render.yaml)
```yaml
services:
  - type: web
    name: puzzleverse
    env: node
    buildCommand: npm install && npm run install:all && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: JWT_REFRESH_SECRET
        sync: false
      - key: CLIENT_URL
        value: https://puzzleverse.onrender.com
```

### 11.4 Vite Config (Client — Proxy for Local Dev)
```javascript
// client/vite.config.js
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:3000', ws: true }
    }
  },
  build: {
    outDir: '../client/dist'
  }
})
```

### 11.5 Local Development Flow
```bash
# One-time setup
npm run install:all

# Create .env in root from .env.example, fill in values

# Run both dev servers concurrently
npm run dev

# Vue dev server:  http://localhost:5173
# Express server:  http://localhost:3000
# In dev: Vite proxies /api and /socket.io to Express automatically
# In production: Express serves everything from one port
```

---

## 12. ENVIRONMENT VARIABLES

```bash
# .env.example

# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/puzzleverse?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-different-from-above
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS (in production, this is same as your app URL)
CLIENT_URL=http://localhost:5173

# Optional: Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## 13. IMPLEMENTATION MILESTONES

### Phase 1 — Foundation (Day 1–2)
- [ ] Initialize repo, root package.json with scripts
- [ ] Set up Vue 3 + Vite client project
- [ ] Set up Express server with MongoDB connection
- [ ] Configure single-deploy serving (Express serves Vue dist)
- [ ] Implement auth system (signup, login, JWT, refresh)
- [ ] Create base UI components (Button, Input, Modal, Toast)
- [ ] Set up Pinia stores (auth, ui)
- [ ] Apply global CSS design tokens and dark theme

### Phase 2 — Core Game Logic (Day 3–6)
- [ ] Implement NeuroLink engine (recommended first — pure grid logic)
- [ ] Implement GravityShift engine
- [ ] Implement QuantumFlip engine
- [ ] Implement ChromaFlow engine
- [ ] Implement EchoMaze engine
- [ ] Implement ShadowCraft engine (Three.js — do last, most complex)
- [ ] Connect each engine to its Vue game view
- [ ] Implement timer, move counter, HUD components
- [ ] Implement difficulty picker

### Phase 3 — Backend Integration (Day 7–9)
- [ ] Implement score POST/GET endpoints + leaderboard
- [ ] Implement session save/resume endpoints
- [ ] Implement auto-save in useGameSession composable
- [ ] Implement win modal + score submission flow
- [ ] Implement dashboard with paused sessions and favourites
- [ ] Implement daily challenge endpoint

### Phase 4 — Multiplayer (Day 10–13)
- [ ] Set up Socket.io on server
- [ ] Implement room create/join/leave handlers
- [ ] Implement matchmaking queue
- [ ] Implement Race mode for NeuroLink (simplest first)
- [ ] Implement remaining game multiplayer modes
- [ ] Implement room chat
- [ ] Build RoomView and multiplayer lobby UI

### Phase 5 — Polish & Deploy (Day 14–15)
- [ ] Implement XP system and level display
- [ ] Implement achievement triggers and toast notifications
- [ ] Implement streak counter
- [ ] Add sound effects
- [ ] Implement light/dark mode toggle
- [ ] Animations + micro-interactions
- [ ] Mobile responsiveness pass
- [ ] Deploy to Render with MongoDB Atlas
- [ ] Write README.md

---

## 14. ACCEPTANCE CRITERIA

### Must Pass
- [ ] User can sign up, log in, and log out
- [ ] Access token is never stored in localStorage — memory only
- [ ] All 6 games are playable on desktop and mobile without layout breaks
- [ ] Timer and move counter are accurate and display in real-time
- [ ] Game state is auto-saved every 30 seconds
- [ ] Player can pause a game, leave, return to dashboard, and resume exact state
- [ ] Completed game submits score to MongoDB
- [ ] Leaderboard shows top 10, filterable by difficulty, per game
- [ ] Player's own rank is visible on leaderboard even if not in top 10
- [ ] Favourites persist across sessions
- [ ] Room code multiplayer works: two players can join same room and play
- [ ] Random matchmaking pairs two players for the same game + difficulty
- [ ] Win condition is correctly detected server-side for multiplayer
- [ ] Application is accessible via public Render URL
- [ ] No credentials or secrets are exposed in client-side code

### Nice to Have
- [ ] Google OAuth login
- [ ] Achievement notifications
- [ ] Daily challenge
- [ ] Spectator mode
- [ ] Streak counter
- [ ] Room chat
- [ ] Sound effects toggle
- [ ] Reduced motion preference respected

---

## APPENDIX: Key Third-Party Packages

### Client
```json
{
  "dependencies": {
    "vue": "^3.x",
    "vue-router": "^4.x",
    "pinia": "^2.x",
    "axios": "^1.x",
    "socket.io-client": "^4.x",
    "three": "^0.x"
  }
}
```

### Server
```json
{
  "dependencies": {
    "express": "^4.x",
    "mongoose": "^8.x",
    "socket.io": "^4.x",
    "bcryptjs": "^2.x",
    "jsonwebtoken": "^9.x",
    "cors": "^2.x",
    "cookie-parser": "^1.x",
    "express-rate-limit": "^7.x",
    "joi": "^17.x",
    "dotenv": "^16.x"
  },
  "devDependencies": {
    "concurrently": "^8.x"
  }
}
```

---

*Document Version: 1.0 | PuzzleVerse Platform*
