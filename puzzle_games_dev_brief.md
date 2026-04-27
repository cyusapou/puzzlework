# 🧩 20 Famous Puzzle Games — Developer Build Brief

> **Who this document is for:** A developer being handed a spec to build or clone one of these games. Each entry covers mechanics, data structures, rendering approach, game loop logic, difficulty scaling, and UX considerations. Treat this as a hybrid between a game design document (GDD) and a technical spec.

---

## Table of Contents

1. [Tetris](#1-tetris)
2. [2048](#2-2048)
3. [Sudoku](#3-sudoku)
4. [Minesweeper](#4-minesweeper)
5. [Wordle](#5-wordle)
6. [Candy Crush Saga](#6-candy-crush-saga)
7. [Portal](#7-portal)
8. [Monument Valley](#8-monument-valley)
9. [The Witness](#9-the-witness)
10. [Sokoban](#10-sokoban)
11. [Crossword Puzzle](#11-crossword-puzzle)
12. [Bejeweled](#12-bejeweled)
13. [Cut the Rope](#13-cut-the-rope)
14. [Threes!](#14-threes)
15. [Nonogram (Picross)](#15-nonogram-picross)
16. [Flow Free](#16-flow-free)
17. [Snake Puzzle](#17-snake-puzzle)
18. [Rush Hour](#18-rush-hour)
19. [Simon Says](#19-simon-says)
20. [Mastermind](#20-mastermind)

---

## 1. Tetris

**Genre:** Tile-matching / falling block puzzle
**Platforms:** Every platform ever made — NES, Game Boy, PC, mobile, browser
**Player Base:** 500M+ copies sold across all versions. One of the best-selling games of all time.

### What It Is
Geometric pieces (called **Tetrominoes**) fall from the top of a rectangular well. The player rotates and positions them to form complete horizontal lines, which then disappear. The game ends when pieces stack to the top of the board.

### Core Mechanics
- **Board:** A 10-column × 20-row grid. Each cell is either empty or occupied.
- **Tetrominoes:** There are exactly 7 canonical pieces (I, O, T, S, Z, J, L). Each is a unique arrangement of 4 cells.
- **Rotation System:** The most widely used is the **Super Rotation System (SRS)**. Each piece has 4 rotation states (0°, 90°, 180°, 270°). Wall kicks allow a piece to "nudge" into position when blocked.
- **Gravity:** Pieces fall at a set speed in ticks per row. Speed increases with level.
- **Lock Delay:** When a piece touches the floor/stack, a short window (usually ~500ms) lets the player make final adjustments before it locks.
- **Line Clear:** When a row is fully filled, remove it and shift everything down. Award points based on how many rows cleared at once (1=Single, 2=Double, 3=Triple, 4=Tetris).

### Data Structures
```
Board: int[20][10]  // 0 = empty, 1–7 = piece color ID

Piece: {
  type: enum(I|O|T|S|Z|J|L),
  rotationState: int(0–3),
  x: int,
  y: int
}

RotationTable: Map<PieceType, Matrix[4][4x4]>
// Each rotation state defines which cells relative to origin are occupied
```

### Game Loop
```
while (!gameOver):
  spawnPiece()
  while (!landed):
    handleInput()       // left, right, rotate, soft drop, hard drop
    applyGravity()      // move piece down every N ms
    checkCollision()
  lockPiece()
  clearLines()
  updateScore()
  checkLevelUp()
  checkGameOver()       // new piece spawn collides immediately?
```

### Scoring (Guideline)
| Action | Points |
|--------|--------|
| Single | 100 × level |
| Double | 300 × level |
| Triple | 500 × level |
| Tetris | 800 × level |
| T-Spin + Single | 800 × level |
| Back-to-Back Tetris | 1200 × level |

### Difficulty Scaling
- Level increases every 10 lines cleared.
- Gravity speed follows a curve: at level 1, ~1 row/sec. At level 20+, near-instant drop.
- Use a **7-bag randomizer**: shuffle all 7 pieces and deal them in sequence; repeat. This prevents long droughts of a needed piece.

### UX Must-Haves
- **Ghost piece:** Show where the piece will land (transparent outline at the bottom).
- **Next piece preview:** Show the next 1–5 upcoming pieces.
- **Hold queue:** Player can "hold" one piece and swap it later (once per drop cycle).
- **DAS (Delayed Auto Shift):** When holding left/right, piece moves once then waits ~150ms before auto-repeating.

### Rendering Notes
- Canvas 2D or CSS Grid both work for browser. Canvas is preferred for 60fps animations.
- Each Tetromino color should be distinct. Standard palette: I=Cyan, O=Yellow, T=Purple, S=Green, Z=Red, J=Blue, L=Orange.

---

## 2. 2048

**Genre:** Sliding tile puzzle
**Platform:** Browser (web app), iOS, Android
**Player Base:** 100M+ plays within weeks of launch (2014). One of the most cloned browser games ever.

### What It Is
A 4×4 grid of numbered tiles. The player slides all tiles in one of 4 directions. Tiles with the same number merge into their sum. The goal is to reach the 2048 tile (though the game can continue beyond that).

### Core Mechanics
- **Board:** 4×4 grid. Each cell holds `null` or a power-of-2 number (2, 4, 8, 16, … 2048 …).
- **Slide + Merge Logic:** On a move direction, for each row/column:
  1. Compress all non-null values toward the slide direction (remove gaps).
  2. Merge adjacent equal values (left to right for left-slide; only one merge per tile per move).
  3. Compress again.
- **Tile Spawn:** After every valid move, spawn a new tile in a random empty cell. 90% chance of spawning `2`, 10% chance of `4`.
- **Win Condition:** Any tile reaches 2048.
- **Lose Condition:** Board is full AND no adjacent tiles share the same value (no valid moves exist).

### Data Structure
```
Board: int[4][4]  // 0 = empty

Move: enum(UP | DOWN | LEFT | RIGHT)

function slide(board, direction) -> { newBoard, score, moved: bool }
```

### Merge Algorithm (Left Slide Example)
```
for each row:
  tiles = filter out zeros
  for i in 0..len(tiles)-1:
    if tiles[i] == tiles[i+1]:
      tiles[i] *= 2
      score += tiles[i]
      tiles.splice(i+1, 1)
  pad row with zeros to length 4
```
For other directions: transpose/reverse the board, apply left-slide logic, then reverse/transpose back.

### Scoring
Score increases by the value of each merge. e.g., merging two 64s adds 128 to score.

### Difficulty Scaling
No formal levels. Difficulty is intrinsic — the board fills up naturally. You can extend to 5×5 or 6×6 for an easier experience, or add obstacles for hard mode.

### Animations
- Tile slide animation: CSS `transform: translate()` with 100ms ease.
- Merge pop: CSS `scale(1.2) → scale(1.0)` on the merged tile.
- Spawn fade-in: new tile appears with opacity 0 → 1 + slight scale-up.

### UX Must-Haves
- Swipe support on mobile (touch start/end delta detection).
- Undo button (store previous board state).
- Best score persistence via `localStorage`.
- Color gradient per tile value (2=light beige, 2048=gold/orange).

---

## 3. Sudoku

**Genre:** Logic-based number placement
**Platforms:** Everywhere — newspaper, books, apps, web, NDS
**Player Base:** Estimated 100M+ daily Sudoku players worldwide.

### What It Is
A 9×9 grid divided into nine 3×3 subgrids (called "boxes" or "regions"). Some cells are pre-filled (the "givens"). The player fills the rest so that each row, column, and 3×3 box contains every digit from 1–9 exactly once.

### Core Mechanics
- **Constraint Rules:**
  - No digit repeats in any row.
  - No digit repeats in any column.
  - No digit repeats in any 3×3 box.
- **Solving Strategies (also inform hint systems):**
  - **Naked Single:** Only one possible digit fits a cell.
  - **Hidden Single:** A digit can only go in one cell within a row/col/box.
  - **Naked/Hidden Pairs/Triples:** More advanced elimination.
  - **Backtracking (brute force):** Recursive attempt + undo. Guaranteed solver.

### Data Structures
```
Grid: int[9][9]          // 0 = empty
GivenMask: bool[9][9]    // true = pre-filled, cannot be edited
Notes: Set<int>[9][9]    // candidate digits player has pencil-marked

function isValid(grid, row, col, num) -> bool
function solve(grid) -> Grid | null      // backtracking solver
function generatePuzzle(difficulty) -> { puzzle, solution }
```

### Puzzle Generation
1. Start with a solved grid (generate via backtracking from empty grid with randomized digit order).
2. Remove digits one by one. After each removal, verify the puzzle still has a **unique solution** (run solver — if it finds more than one, put the digit back).
3. Stop removing based on difficulty target:
   - Easy: ~35–45 givens
   - Medium: ~27–35 givens
   - Hard: ~22–27 givens
   - Expert: <22 givens (requires advanced logic to solve without guessing)

### Difficulty Classification
Count which solving strategies are required:
- Easy → Naked/Hidden Singles only
- Medium → Pairs needed
- Hard → Triples, X-Wing needed
- Expert → Swordfish, forcing chains

### UX Must-Haves
- **Pencil/Notes mode:** Small candidate digit display inside cells.
- **Conflict highlighting:** Flash red when a duplicate is placed.
- **Timer:** Track solve time per puzzle.
- **Hint button:** Highlight the easiest next cell to fill.
- **Undo/redo stack.**
- **Auto-clear notes:** Remove a digit from notes in the same row/col/box when placed.

---

## 4. Minesweeper

**Genre:** Logic deduction / probability puzzle
**Platform:** Windows (bundled), browser, mobile
**Player Base:** Hundreds of millions played via Windows bundled game alone (1990–2000s).

### What It Is
A rectangular grid of cells, all initially hidden. A fixed number of mines are randomly placed. The player clicks cells to reveal them. Revealed cells show a number indicating how many of the 8 neighboring cells contain mines. The player must flag all mines and reveal all safe cells.

### Core Mechanics
- **Grid:** W×H cells (Classic: 9×9 / 16×16 / 30×16).
- **Mine Count:** Beginner=10, Intermediate=40, Expert=99.
- **Reveal Logic:**
  - If revealed cell has 0 adjacent mines → auto-reveal all 8 neighbors (flood fill / BFS).
  - If revealed cell has mines nearby → show count (1–8), stop.
  - If revealed cell IS a mine → game over.
- **First-Click Safety:** Mines are placed AFTER the first click. The clicked cell and its neighbors are always mine-free on the first reveal.
- **Flag:** Right-click marks a cell as suspected mine. Cannot reveal a flagged cell accidentally.
- **Win Condition:** All non-mine cells are revealed.

### Data Structures
```
Cell: {
  isMine: bool,
  isRevealed: bool,
  isFlagged: bool,
  adjacentMineCount: int   // 0–8, computed after mine placement
}

Grid: Cell[H][W]

function placeMines(grid, count, safeX, safeY)
function computeAdjacency(grid)
function reveal(grid, x, y)        // BFS flood-fill
function checkWin(grid) -> bool
```

### Timer
Starts on first click, stops on win or loss. Display as seconds. World records exist for each difficulty — Expert record is under 32 seconds.

### UX Must-Haves
- Right-click / long-press flagging.
- Chord click: clicking a revealed number when the correct flag count matches its number auto-reveals unflagged neighbors (quality-of-life feature in modern versions).
- Mine counter (total mines minus flags placed).
- Smiley face / reset button (iconic).
- On loss: reveal all mines, mark incorrectly flagged cells with an X.

### Difficulty Scaling
Custom grids: allow user-defined W, H, and mine count. Density matters — >25% mine density makes many games unsolvable without guessing.

---

## 5. Wordle

**Genre:** Word-guessing deduction puzzle
**Platform:** Web browser (NYT), many clones on web and mobile
**Player Base:** 300,000 daily players before NYT acquisition (Jan 2022); peaked at 2M+ daily.

### What It Is
A daily word-guessing game. The player gets 6 attempts to guess a secret 5-letter word. After each guess, each letter is color-coded: 🟩 Green = correct letter, correct position. 🟨 Yellow = correct letter, wrong position. ⬛ Gray = letter not in the word.

### Core Mechanics
- **Secret word:** One hidden 5-letter word per day (seeded by date).
- **Valid guesses:** Must be in an accepted word list (~12,000 valid guess words).
- **Answer pool:** A curated subset (~2,300 common words) used as daily answers.
- **Feedback Algorithm (critical edge case):**
  - Process greens first (exact matches).
  - For yellows: a letter only gets yellow if it still has remaining occurrences in the answer after greens are accounted for. This handles duplicate letters correctly.

### Feedback Algorithm (Pseudocode)
```
function score(guess, answer):
  result = ['gray','gray','gray','gray','gray']
  answerCounts = count occurrences of each char in answer

  // Pass 1: Greens
  for i in 0..4:
    if guess[i] == answer[i]:
      result[i] = 'green'
      answerCounts[guess[i]] -= 1

  // Pass 2: Yellows
  for i in 0..4:
    if result[i] != 'green':
      if answerCounts[guess[i]] > 0:
        result[i] = 'yellow'
        answerCounts[guess[i]] -= 1

  return result
```

### Data Structures
```
GameState: {
  answer: string,
  guesses: string[],         // up to 6
  feedbacks: Color[][],      // feedbacks[i] = score for guesses[i]
  status: 'playing'|'won'|'lost'
}

KeyboardState: Map<char, 'green'|'yellow'|'gray'|'unused'>
// Best color seen across all guesses for each letter
```

### Seed by Date
```
const MS_PER_DAY = 86400000
const start = new Date('2021-06-19')  // original Wordle start date
const dayIndex = Math.floor((today - start) / MS_PER_DAY)
const answer = ANSWER_LIST[dayIndex % ANSWER_LIST.length]
```

### UX Must-Haves
- On-screen keyboard with color state per key.
- Tile flip animation on submit (staggered per letter).
- Shake animation on invalid word.
- Hard mode: Every revealed hint must be used in subsequent guesses.
- Share result as emoji grid (no spoilers).
- localStorage persistence (one game per day, result stored).

---

## 6. Candy Crush Saga

**Genre:** Match-3 puzzle / mobile casual
**Platforms:** Facebook, iOS, Android
**Player Base:** 240M+ monthly active users at peak. King (Activision Blizzard) title.

### What It Is
A match-3 game where players swap adjacent candies on a grid to create rows or columns of 3+ matching candies, which then disappear. New candies fall from the top. Levels have specific objectives (clear X of color Y, score Z points in N moves).

### Core Mechanics
- **Grid:** Irregular shapes (not always rectangular), varies per level (typically 7–9 columns, 7–9 rows).
- **Swap Rule:** Only adjacent horizontal/vertical swaps. Only valid if it creates a match of 3+.
- **Match Detection:** After every swap and every gravity fill, scan entire board for groups of 3+ in a row/column.
- **Cascade:** After matches clear, candies fall down (gravity), new candies fill from top. Repeat match check. Each cascade tier multiplies score.
- **Special Candies (created by large matches):**
  - 4-in-a-row → Striped candy (clears entire row or column)
  - 5-in-a-row → Color bomb (clears all of one color)
  - 2×2 square → Wrapped candy (explodes in 3×3 area twice)
  - L/T shape → Combo of stripe + wrap
- **Objectives:** Score threshold, clear jelly/frosting tiles, collect ingredients, clear chocolate, etc.
- **Move Limit:** Most levels have a fixed number of moves.

### Data Structures
```
Cell: {
  candy: { color: CandyColor, type: 'normal'|'striped'|'wrapped'|'colorbomb' }
  | null,
  obstacle: 'jelly'|'frosting'|'chocolate'|'locked'|null,
  isPlayable: bool
}

Grid: Cell[rows][cols]

Level: {
  grid: Grid,
  objective: Objective,
  moves: int,
  starThresholds: [int, int, int]   // score for 1, 2, 3 stars
}
```

### Game Loop
```
awaitSwap()
if isValidSwap(a, b):
  executeSwap(a, b)
  while boardHasMatches():
    findAllMatches()
    createSpecialCandies()
    removeMatches()
    applyObstacleEffects()
    applyGravity()
    fillFromTop()
  updateObjective()
  decrementMoves()
  checkWinLoss()
else:
  animateInvalidSwap()
```

### Lives & Monetization (if building a full clone)
- 5 lives max. Lose one on each loss. Recharge 1 life every 30 minutes.
- Boosters: Hammer (remove one candy), Color bomb, Extra moves (+5 moves), Free switch.
- Level map with hundreds of levels, unlocked sequentially.

### UX Must-Haves
- Candy pop + particle effect on match.
- Screen shake on large cascades.
- Hint system: animate a suggested swap after player is idle ~5 seconds.
- End-of-level fireworks if all objectives met.
- Smooth gravity fall animation per candy (not teleport).

---

## 7. Portal

**Genre:** 3D first-person physics puzzle
**Platform:** PC (Steam), PS3, Xbox 360
**Player Base:** 4M+ copies (Portal 1) and 9M+ (Portal 2). Valve cult classic.

### What It Is
A 3D first-person puzzle game where the player uses a Portal Gun to create interconnected portals on flat surfaces. Objects and the player can pass through portals and exit from the other. The game uses momentum conservation — entering a portal at speed exits at the same speed from the other portal ("Speedy thing goes in, speedy thing comes out").

### Core Mechanics
- **Portal Gun:** Fires blue (primary) or orange (secondary) portals. Any flat white/portal-able surface accepts a portal.
- **Portal Linking:** Always 2 portals active. Entering blue exits orange and vice versa. Portals preserve velocity vector relative to exit portal's orientation.
- **Physics Objects:** Weighted cubes, buttons, laser redirectors can be carried and placed.
- **Momentum Conservation:** The key to puzzle solving — falling into a floor portal can launch you horizontally through a wall portal.
- **Turrets:** AI enemies that fire if they see the player. Can be toppled, portaled past, or blocked.
- **Gels (Portal 2):** Blue gel = bouncy, Orange gel = fast movement, White gel = makes surfaces portal-able.

### Technical Implementation Notes
- Built on Source Engine (modified Half-Life 2 engine).
- Portal rendering uses stencil buffer or recursive camera render technique.
- Collision for portals requires clipping the physics world — objects partially through a portal collide with both sides.
- **Render technique:** For each portal, render the scene from the perspective of the exit portal. Clip geometry to the portal's plane. Compose on screen. Recurse for portals within portals (usually limited to 2 levels deep).

### Portal Math
```
// Transforming velocity through a portal
exitVelocity = rotate(entryVelocity, entryPortal.normal, exitPortal.normal)
// Rotate the entry portal's frame to the exit portal's frame
// then mirror across the exit portal's facing direction
```

### Level Design Principles
Each test chamber introduces one new mechanic:
1. Simple portal from A to B.
2. Using portals to bypass barriers.
3. Using momentum to reach high platforms.
4. Turret avoidance.
5. Combining mechanics.

### UX Must-Haves
- Crosshair showing portal-able surface indicator.
- Portal edge glow (blue/orange outline).
- Sound design: portal whoosh, momentum swoop.
- GLaDOS AI narrative throughout (tutorial-as-story).

---

## 8. Monument Valley

**Genre:** Isometric optical illusion puzzle
**Platform:** iOS, Android
**Player Base:** 26M+ downloads across both games. Apple Design Award winner.

### What It Is
An isometric puzzle game where the player guides a silent princess (Ida) through impossible architectural structures inspired by M.C. Escher. The player manipulates the environment — rotating platforms, moving pillars — to create new paths exploiting optical illusions.

### Core Mechanics
- **Isometric View:** Fixed camera at 45° angle. 3D-looking but rendered in a forced perspective.
- **Path Traversal:** Ida walks on walkable surfaces. Tap a destination → she pathfinds there if a valid surface-connected path exists.
- **Illusion Paths:** Two surfaces that appear connected isometrically ARE connected for game logic, even if they'd be separate in true 3D space.
- **Rotating Structures:** Some parts of a level can be rotated by dragging. Rotating creates new valid paths.
- **Crow People (antagonists):** Block paths. Must be rerouted by moving structures.
- **Totems:** Companion character. Stands on buttons or can be guided alongside Ida.

### Technical Approach
- Unity 3D with an isometric camera (orthographic projection, 45° angle).
- Level geometry is real 3D but designed so specific viewpoints create illusion of connectivity.
- Path validation: a simplified A* or BFS on the actual 3D surface mesh, but with "illusion edges" — additional graph edges explicitly added where isometric illusions should allow passage.

### Data Structure
```
Level: {
  structures: Structure[],
  paths: PathNode[],    // graph nodes with edges (including illusion edges)
  idaStart: PathNode,
  exit: PathNode
}

Structure: {
  geometry: Mesh,
  rotatable: bool,
  rotationAxis: Vector3,
  currentAngle: float
}
```

### Level Design Notes
- Each level should introduce one new visual twist.
- Short levels (~3–5 minutes each) maintain wonder without frustration.
- No fail state — the player can always undo or try again.
- Color palette changes per level to signal new chapter/mood.

### UX Must-Haves
- Tap destination navigation (no joystick).
- Drag handles for rotating structures.
- Atmospheric ambient music (generative or looping).
- Minimal UI — no HUD during gameplay.
- Slow, deliberate animation speed (Ida walks slowly — part of the meditative feel).

---

## 9. The Witness

**Genre:** Open-world environmental puzzle (line-drawing)
**Platform:** PC, PS4, iOS
**Player Base:** ~500K copies. Critically acclaimed ($40 indie, 10/10 from many outlets).

### What It Is
An open-world island filled with 700+ line-drawing puzzles on panel grids. The core input is always the same: draw a line from start to exit. But each puzzle type introduces a new rule (color separation, tetromino shapes, star pairs, sounds, shadows). The island itself is a meta-puzzle — many puzzles require environmental observation (e.g., shadows on the ground form a panel solution).

### Core Mechanics — Panel Puzzle System
- **Grid:** Variable N×M grid with nodes at intersections.
- **Path:** Player draws a continuous path from the entry dot to the exit nub.
- **Symbols (each type has its own rule):**

| Symbol | Rule |
|--------|------|
| Black/White dots | Separate black and white regions |
| Tetromino shapes | Shapes in a region must tile exactly |
| Stars | Exactly 2 stars of same color must be in each region |
| Triangles (1–3) | Number = how many edges of that cell the path touches |
| Eliminated symbols | Cancel exactly one other symbol |

- **Environment Puzzles:** Draw panel paths that match shapes seen in the environment (trees, cables, sun reflections) when viewed from specific angles.

### Technical Implementation
```
PanelGrid: {
  nodes: Node[M+1][N+1],   // intersections
  cells: Cell[M][N],       // cells between nodes
  edges: Edge[],           // horizontal and vertical between adjacent nodes
  start: Node,
  end: Node (on border)
}

Path: Node[]              // ordered list of nodes, each adjacent to previous

Validator: {
  traceRegions(path, grid) -> Region[]
  checkAllRules(regions, cells, path) -> bool
}
```

### Validation Algorithm
1. Given a drawn path, split the grid into enclosed regions using the path as a divider (flood-fill from each unvisited cell).
2. For each region, collect all symbols within it.
3. Apply each symbol's rule. If any rule fails → invalid path.

### UX Must-Haves
- First-person 3D exploration between panels.
- No tutorial — player discovers rules purely through gentle sequence of panels.
- Satisfying "ding" + light-up on correct solution.
- Never tell the player what they did wrong — just reject the path silently.
- Ambient audio changes by area to hint at environmental puzzle solutions.

---

## 10. Sokoban

**Genre:** Warehouse box-pushing puzzle
**Platform:** Originally PC-88 (1982), now everywhere
**Player Base:** Thousands of fan-made puzzles; active puzzle community since 1982.

### What It Is
Top-down 2D puzzle. The player pushes boxes onto target spots. You can only push (never pull) one box at a time. Moving into a box's space pushes it one tile in the same direction, if the tile behind the box is free.

### Core Mechanics
- **Grid:** Tile-based. Each cell: `wall`, `floor`, `target`, `box`, `box-on-target`, `player`, `player-on-target`.
- **Push Rule:** Player moves into a box → box moves one tile in same direction. Valid only if box destination is `floor` or `target` (not wall or another box).
- **Win:** All boxes are on target tiles simultaneously.
- **Deadlock Detection (for hint/AI solvers):**
  - **Corner deadlock:** Box pushed into a non-target corner — can never be moved out.
  - **Edge deadlock:** Box along a wall with no targets on that wall segment.

### Data Structures
```
Tile: enum(WALL | FLOOR | TARGET | BOX | BOX_TARGET | PLAYER | PLAYER_TARGET)

Level: {
  grid: Tile[H][W],
  playerPos: {x, y},
  boxes: Set<{x, y}>,
  targets: Set<{x, y}>
}

HistoryStack: Level[]   // for undo
```

### Move Function
```
function move(direction):
  newPos = playerPos + direction
  if grid[newPos] == WALL: return
  if isBox(newPos):
    boxDest = newPos + direction
    if isWallOrBox(boxDest): return
    moveBox(newPos, boxDest)
  movePlayer(newPos)
  history.push(snapshot)
  checkWin()
```

### Level Design Considerations
- Easy levels: 2–3 boxes, open grid, obvious solution.
- Hard levels: 5–10 boxes, tight corridors, require planning 20+ moves ahead.
- Use the XSB format for level storage (industry standard for Sokoban levels).

### UX Must-Haves
- Undo (essential — no undo = unplayable).
- Move counter and push counter (competitive solving tracks both).
- Restart button.
- Solution replay animation.

---

## 11. Crossword Puzzle

**Genre:** Word-knowledge grid puzzle
**Platform:** Newspaper, NYT app, web, mobile
**Player Base:** NYT Crossword has 1M+ paid subscribers. Billions of crosswords solved globally.

### What It Is
A symmetric grid (usually 15×15 for daily, 21×21 for Sunday) of black and white squares. Numbered clues correspond to across/down answers. Player fills white squares with letters.

### Core Mechanics
- **Grid Symmetry:** Black squares have 180° rotational symmetry (standard).
- **Numbering:** A cell is numbered if it's white and either: starts an Across answer (left neighbor is black or edge) OR starts a Down answer (top neighbor is black or edge).
- **Answer Validation:** Each white cell belongs to exactly one Across word and one Down word.
- **Checking:** Compare player-filled letters against solution. Optional auto-check or check-on-demand.

### Data Structures
```
Cell: {
  isBlack: bool,
  number: int | null,
  letter: string,         // '' = empty
  solution: string,
  isRevealed: bool,
  isChecked: bool,
  isWrong: bool
}

Clue: {
  number: int,
  direction: 'across'|'down',
  text: string,
  cells: Cell[]
}

Puzzle: {
  grid: Cell[15][15],
  acrossClues: Clue[],
  downClues: Clue[],
  title: string,
  author: string,
  date: Date
}
```

### Puzzle File Formats
- `.puz` (Across Lite) — most common, binary format.
- `.jpz` (XML-based) — modern, more features.
- `.ipuz` (JSON) — open standard, recommended for new builds.

### UX Must-Haves
- Click a cell → selects the word; click again → toggles across/down.
- Arrow key navigation within a word.
- Clue list panel synchronized with grid selection.
- Auto-advance cursor to next cell/word after typing.
- Timer.
- Check / Reveal letter/word/puzzle options.
- Pencil mode (gray tentative letters vs black confirmed).

---

## 12. Bejeweled

**Genre:** Match-3 casual puzzle
**Platform:** Web, iOS, Android, PC (PopCap)
**Player Base:** 500M+ downloads across all versions. PopCap's flagship title.

### What It Is
An 8×8 grid of colored gems. Player swaps two adjacent gems to form rows/columns of 3+ matching gems. Matched gems disappear, gems above fall, new ones fill from top. Timed or untimed mode.

### Core Mechanics
- **Grid:** 8×8. 7 gem colors typically.
- **Valid Swap:** Only if it results in a match. Invalid swaps bounce back (animation only).
- **Special Gems:**
  - Power Gem (4 in a row): explodes a 3×3 area.
  - Hyper Cube (5 in a row): matches ANY color when swapped with a gem — removes all of that color.
  - Flame Gem (L or T shape): explodes 3×3.
- **Cascade Multiplier:** Each cascade tier of drops multiplies score.
- **Hint System:** Flash a valid move after player is idle ~5 seconds.
- **Shuffle:** If no valid moves exist, shuffle board.
- **Game Modes:**
  - Classic: No timer, ends when no moves exist.
  - Blitz: 60-second timed mode.
  - Zen: Infinite, relaxing, no end.
  - Quest: Specific objectives per level.

### Board State Check
```
function hasValidMoves(grid) -> bool:
  for each cell:
    for each direction (right, down):
      simulate swap
      if creates match of 3+: return true
  return false

function needsShuffle(grid):
  return !hasValidMoves(grid)
```

### UX Must-Haves
- Sparkle/glow animations on idle gems.
- Satisfying sound per match (pitched gems by color or position).
- Combo announcements: "Excellent!", "Incredible!", "Blazing!"
- Screen flash on large cascade.

---

## 13. Cut the Rope

**Genre:** Physics-based puzzle
**Platform:** iOS (2010), Android, web, Windows Phone
**Player Base:** 800M+ downloads across all games in the series. ZeptoLab.

### What It Is
A physics puzzle where candy hangs from ropes attached to pegs. The player cuts ropes by swiping, using physics (gravity, swing momentum) to collect stars and feed the candy to a frog character (Om Nom) at the bottom.

### Core Mechanics
- **Rope Simulation:** Each rope is a chain of segments (verlet integration or spring chain). Supports hanging, swinging, tension.
- **Cut Mechanic:** Swipe gesture intersects with a rope segment → rope splits at that point.
- **Physics Objects:**
  - Bubbles: Attach to candy and make it float upward.
  - Spikes: Destroy candy on contact.
  - Balloons: Fixed buoyancy.
  - Bouncy Pads: Reflect candy on contact.
  - Moving Platforms: Carry attached ropes.
  - Spiders: Try to steal candy.
- **Stars:** 3 stars per level, placed at different positions. Optional — just getting candy to frog wins the level.
- **Win Condition:** Candy touches the frog's mouth (detect overlap / proximity trigger).

### Rope Physics (Simplified Verlet)
```
RopeNode: { pos: Vector2, prevPos: Vector2, pinned: bool }

function updateRope(nodes, gravity, dt):
  for each node (not pinned):
    velocity = node.pos - node.prevPos
    node.prevPos = node.pos
    node.pos += velocity + gravity * dt²

  // Constraint satisfaction (10–20 iterations):
  for each pair of adjacent nodes:
    diff = node2.pos - node1.pos
    dist = length(diff)
    correction = diff * (1 - restLength/dist) * 0.5
    if !node1.pinned: node1.pos += correction
    if !node2.pinned: node2.pos -= correction
```

### Level Format
```
Level: {
  pegs: { pos, type }[],
  ropes: { from, to, segments }[],
  candy: { pos, attachedRope },
  stars: { pos }[3],
  frogMouth: { pos },
  obstacles: Obstacle[]
}
```

### UX Must-Haves
- Swipe to cut (multi-touch aware).
- Slow-motion on cut for readability.
- Om Nom animations (idle, eating, excited, sad on level fail).
- 3-star system with retry.
- Cheerful sound effects + music.

---

## 14. Threes!

**Genre:** Sliding tile number puzzle
**Platform:** iOS (2014), Android, PC
**Player Base:** Sold 300K+ copies in first month. Inspired 2048 (which became more popular).

### What It Is
A 4×4 grid where tiles slide all together in one direction. Matching tiles merge: 1+2=3, 3+3=6, 6+6=12, etc. A new tile slides in from the edge on each move. Game ends when no valid moves remain.

### Core Mechanics
- **Merge Rules:** Only 1+2 (and 2+1) merge into 3. 3 and above only merge with equal values.
- **New Tile Preview:** A small indicator shows the next incoming tile's value.
- **Slide Direction:** All tiles on the board slide simultaneously. New tile enters from the opposite edge of the slide direction.
- **Incoming Tile Position:** Determined by which column/row has a gap at the entry edge (chosen from valid positions). Adds strategic depth.
- **Tile Values:** 1, 2, 3, 6, 12, 24, 48, 96, 192, 384, 768, 1536, 3072, 6144. Rare high-value tiles appear as bonuses.

### Scoring
```
score = sum of all tiles' scores
tileScore(tile):
  if tile < 3: return 0
  else: return 3^(log2(tile/3) + 1)
  // 3=3pts, 6=9pts, 12=27pts, 48=81pts, etc.
```

### Comparison vs 2048

| Feature | Threes! | 2048 |
|---------|---------|------|
| Grid | 4×4 | 4×4 |
| Merge rule | 1+2, equal+equal | equal+equal |
| New tile behavior | Slides in from edge | Spawns at random empty cell |
| End condition | No valid moves | Board full + no merges |
| Feel | Strategic, slow | Frantic, fast |

### UX Must-Haves
- Tile personality (each high-value tile has a face/character).
- Swipe gesture.
- Next tile preview card.
- Best score + high tile badge on game over screen.

---

## 15. Nonogram (Picross)

**Genre:** Logic picture puzzle / paint-by-number
**Platform:** Nintendo DS (Picross DS), web, mobile apps
**Player Base:** Picross DS sold 1M+ copies. Web nonogram communities have millions of active players.

### What It Is
A grid puzzle where numbers beside each row and column indicate the lengths of consecutive filled-cell groups. The player deduces which cells to fill to satisfy all constraints. The completed grid forms a pixel art picture.

### Core Mechanics
- **Clues:** Each row and column has a sequence of numbers (e.g., `3 1 2`). This means 3 consecutive filled cells, then a gap of at least 1, then 1 filled cell, then a gap of at least 1, then 2 filled cells.
- **Cell States:** Empty (unknown), Filled (■), Crossed (✕ = definitely empty).
- **Solving Techniques:**
  - **Overlap:** If minimum leftmost and rightmost positions of a block overlap, the overlapping cells must be filled.
  - **Completed blocks:** Once a block is fully placed, mark adjacent cells as crossed.
  - **Contradiction:** If placing a block creates impossibility, the opposite must be true.

### Data Structure
```
Puzzle: {
  rows: int,
  cols: int,
  rowClues: int[][],     // clues[i] = sequence for row i
  colClues: int[][],
  solution: bool[][],    // true = filled
  grid: CellState[][]    // 'unknown'|'filled'|'empty'
}
```

### Puzzle Generation
1. Start with target pixel art (W×H binary image).
2. Compute row and column clues from the image (run-length encode each row/col of filled cells).
3. Verify puzzle has unique solution (run solver).

### Validator
```
function isRowValid(row: CellState[], clue: int[]): bool
  // Run-length encode filled cells in row
  // Compare sequence to clue
```

### UX Must-Haves
- Left-click to fill, right-click to cross.
- Click-drag to fill/cross multiple cells.
- Clue highlighting: dim a completed clue segment.
- Error indication (optional — some players prefer no error feedback).
- Timer.
- Zoom support for large grids (30×30+).
- Reveal pixel art animation on completion.

---

## 16. Flow Free

**Genre:** Pipe-connecting logic puzzle
**Platform:** iOS, Android (Big Duck Games)
**Player Base:** 100M+ downloads.

### What It Is
A grid with colored dots (pairs). The player draws pipes connecting each matching pair. Pipes cannot cross. The goal is to connect all pairs AND fill the entire grid with pipe paths.

### Core Mechanics
- **Grid:** NxN (5×5 for easy, up to 15×15 for hard).
- **Color Pairs:** 2–12 pairs per level.
- **Drawing:** Touch/drag from a dot to extend a pipe. Entering a previously filled cell removes the pipe from that cell onwards.
- **Win Condition:** All pairs connected + all cells filled.
- **Pipe Redraw:** Drawing a new path through an existing pipe segment breaks the existing pipe at that point.

### Data Structures
```
Cell: { color: Color | null, isEndpoint: bool }
Grid: Cell[N][N]

Pipe: { color: Color, path: {x,y}[] }
Pipes: Map<Color, Pipe>

function extendPipe(color, toCell):
  if toCell already in another pipe: break that pipe at that cell
  append toCell to this pipe's path
  update grid

function checkWin():
  allConnected = all pipes have both endpoints reached
  allFilled = no empty cells
  return allConnected && allFilled
```

### Puzzle Generation
1. Solve the grid yourself (or use backtracking) to generate a valid solution.
2. Extract only the endpoint pairs as the puzzle.
3. Validate the puzzle has a unique solution.

### Difficulty Scaling
- 5×5: 5 pairs, 1 solution path.
- 9×9: 9+ pairs, more complex routing needed.
- Add "warps" (portals that connect non-adjacent cells) for expert levels.

### UX Must-Haves
- Color-coded pipes (accessible: add line-end markers for color blindness).
- Smooth path drawing (anti-aliased lines).
- Pipe "fills" the cell visually (thick rounded line).
- Completion burst animation.
- Solution percentage shown (e.g., "Board 80% filled").

---

## 17. Snake Puzzle

**Genre:** Path-planning / grid traversal puzzle
**Platform:** Mobile, web
**Player Base:** Tens of millions (various implementations under different names).

### What It Is
A variant of the classic Snake game reframed as a puzzle. The snake must visit every cell on a grid exactly once and reach the exit. The player plans the path — often without time pressure — making it a logic puzzle rather than a reflex game.

### Core Mechanics
- **Grid:** N×M. Cells can be regular floor, walls/obstacles, or exit.
- **Snake:** Has a head and body. Moving head to an adjacent cell extends body into previous head position. No time limit — turn-based.
- **Objective:** Visit every non-wall cell exactly once, then exit.
- **Constraint:** Cannot revisit a cell (body is in the way). Cannot move into walls.
- **Color-coded variants:** Multiple colored snakes must be guided simultaneously, interleaving their moves.

### Data Structure
```
Snake: { body: {x,y}[], direction: Direction }
Grid: CellType[H][W]

function move(snake, direction):
  newHead = snake.body[0] + direction
  if collision(newHead): return false
  snake.body.unshift(newHead)
  if !isGrowTile(newHead): snake.body.pop()
  markVisited(newHead)
  return true
```

### Puzzle Design
- **Hamiltonian path problem** — finding a path that visits every node exactly once. NP-complete in general, but small grids are tractable.
- For puzzle generation: generate a Hamiltonian path randomly, then place exit at path endpoint, reveal only the start and obstacles.

### UX Must-Haves
- Swipe or arrow key input.
- Undo move (essential).
- Ghost trail showing visited cells.
- Smooth snake slide animation.
- Satisfying exit animation when completed.

---

## 18. Rush Hour

**Genre:** Sliding block logic puzzle
**Platform:** Physical board game (ThinkFun), iOS, Android, web
**Player Base:** 40M+ physical sets sold. One of the best-selling puzzle toys.

### What It Is
A 6×6 grid with cars and trucks of varying lengths. Cars (length 2) and trucks (length 3) slide horizontally or vertically only (based on their orientation). The red car must escape through the exit hole on the right edge of row 3.

### Core Mechanics
- **Vehicles:** Each occupies 2 or 3 consecutive cells, aligned either horizontally or vertically.
- **Slide Rule:** Can only move along their axis. Cannot move through other vehicles.
- **Goal:** Slide the red car to the right edge (exit).
- **No Rotation:** Vehicles never change orientation.
- **Move Count:** Optimize for minimum moves (competitive solving).

### Data Structures
```
Vehicle: {
  id: string,
  orientation: 'H'|'V',
  length: 2|3,
  row: int,
  col: int,       // top-left cell position
  isTarget: bool  // true for red car
}

Board: {
  grid: string[6][6],   // vehicle ID or null
  vehicles: Map<string, Vehicle>
}

function canMove(vehicle, direction, steps) -> bool
function move(vehicle, direction, steps)
function isSolved(board) -> bool   // red car at col 4 (exit position)
```

### Puzzle Difficulty (by BFS depth)
- Beginner: solution in ≤5 moves
- Intermediate: 6–12 moves
- Advanced: 13–20 moves
- Expert: 21+ moves

### Solver
BFS over board states (serialize full board as state key). Queue states, track moves. Guaranteed optimal (shortest) solution.

```
BFS:
  queue = [initialState]
  visited = Set{initialState}
  while queue:
    state = queue.dequeue()
    if solved(state): return path
    for each vehicle:
      for each valid slide (1..max steps):
        newState = applyMove(state, vehicle, slide)
        if newState not in visited:
          visited.add(newState)
          queue.enqueue(newState)
```

### UX Must-Haves
- Drag vehicle to slide (snap to grid).
- Highlight valid slide range on drag start.
- Move counter.
- Undo / reset.
- "Solve" button shows optimal solution as step-by-step animation.

---

## 19. Simon Says

**Genre:** Memory / pattern repetition puzzle
**Platform:** Electronic toy (1978), web, mobile apps
**Player Base:** 100M+ physical units sold since 1978. Digital versions have hundreds of millions of plays.

### What It Is
Four colored buttons (Red, Blue, Yellow, Green), each with a distinct sound. The game plays a sequence of button lights/sounds. The player must repeat the sequence exactly. Each successful round adds one more step to the sequence.

### Core Mechanics
- **Sequence:** Array of integers (0–3, each mapping to a color). Starts at length 1.
- **Playback Speed:** Sequence plays back at ~600ms per flash initially. Speeds up at higher levels.
- **Input Window:** After playback, player has a limited time to input the full sequence. Time limit often resets per button press.
- **Fail Condition:** Wrong button pressed, or input timeout.
- **Level Progression:** Win round → append one random element to sequence → replay full sequence.

### Data Structures
```
GameState: {
  sequence: int[],           // color indices
  playerInput: int[],
  phase: 'playing'|'input'|'fail'|'win',
  level: int,
  strictMode: bool           // instant fail vs grace
}

Colors: ['red', 'blue', 'yellow', 'green']
Sounds: [440Hz, 494Hz, 330Hz, 392Hz]  // or sample files
```

### Game Loop
```
startRound():
  sequence.push(random(0,3))
  playSequence()          // animate + play sound each element
  waitForPlayerInput()

onPlayerPress(color):
  playerInput.push(color)
  playSound(color)
  if playerInput[last] != sequence[last]: fail()
  if playerInput.length == sequence.length: nextRound()
```

### Timing Table
| Level | Flash duration | Gap between flashes |
|-------|---------------|---------------------|
| 1–5   | 420ms         | 200ms               |
| 6–13  | 320ms         | 200ms               |
| 14+   | 220ms         | 150ms               |

### UX Must-Haves
- Button press visual (darken + glow).
- Distinct audio tone per color (Web Audio API oscillator or samples).
- Score counter = level reached.
- Fail animation: all buttons flash red + harsh buzz.
- Classic circular 4-quadrant layout (iconic).
- Strict mode option: one wrong press = game over (vs. must repeat entire wrong sequence).

---

## 20. Mastermind

**Genre:** Code-breaking deduction puzzle
**Platform:** Board game (1970), web, mobile, console
**Player Base:** 50M+ physical copies sold. Universal code-breaking game.

### What It Is
One player (or the computer) thinks of a secret code: 4 colored pegs in a row, chosen from 6 colors (repetition allowed). The other player makes guesses. After each guess, they receive feedback: black peg = right color right position, white peg = right color wrong position. Player has 10 attempts to crack the code.

### Core Mechanics
- **Code:** Length 4, colors from set of 6 (default). Repetition allowed.
- **Guess:** Also length 4 from same color set.
- **Feedback Algorithm (same logic as Wordle's, but with pegs):**

```
function score(guess, secret):
  blacks = 0
  whites = 0
  secretCounts = count each color in secret
  guessCounts = count each color in guess

  // Count blacks (exact position matches)
  for i in 0..3:
    if guess[i] == secret[i]:
      blacks++
      secretCounts[guess[i]]--
      guessCounts[guess[i]]--

  // Count whites (color exists but wrong position)
  for each color:
    whites += min(secretCounts[color], guessCounts[color])

  return { blacks, whites }
```

- **Win:** blacks == 4 (all correct).
- **Lose:** 10 guesses used without cracking the code.

### Optimal Strategy (Knuth's Algorithm)
Donald Knuth proved any code can be cracked in at most 5 guesses:
1. Start with guess `1122`.
2. After feedback, eliminate all codes inconsistent with feedback.
3. Use minimax to choose next guess that minimizes the worst-case remaining possibilities.

### Variants
| Variant | Code Length | Colors | Max Guesses |
|---------|------------|--------|-------------|
| Classic | 4 | 6 | 10 |
| Easy | 4 | 6 | 12 |
| Hard | 5 | 8 | 10 |
| Ultra | 6 | 8 | 8 |

### Data Structures
```
Code: int[4]          // 0–5 representing colors
Guess: int[4]
Feedback: { blacks: int, whites: int }

GameState: {
  secret: Code,
  guesses: Guess[],
  feedbacks: Feedback[],
  status: 'playing'|'won'|'lost'
}
```

### UX Must-Haves
- Color peg selection (drag or click-to-cycle).
- Feedback pegs displayed clearly (black > white layout).
- History of all guesses + feedbacks visible.
- Reveal secret code on loss.
- "Play as codemaker" mode (player sets the secret, AI guesses).
- AI solver option using Knuth's algorithm.

---

## Summary Table

| # | Game | Grid/Board | Core Input | Key Algorithm | Tech Complexity |
|---|------|-----------|------------|---------------|-----------------|
| 1 | Tetris | 10×20 | Keyboard/touch | SRS rotation, line clear | ⭐⭐ |
| 2 | 2048 | 4×4 | Swipe | Slide+merge | ⭐ |
| 3 | Sudoku | 9×9 | Tap+number | Backtracking solver | ⭐⭐ |
| 4 | Minesweeper | 9–30×9–16 | Click | BFS flood-fill | ⭐ |
| 5 | Wordle | 6×5 letters | Keyboard | Scoring algorithm | ⭐ |
| 6 | Candy Crush | Irregular | Swap | Match-3 cascade engine | ⭐⭐⭐ |
| 7 | Portal | 3D world | FPS movement | Portal rendering, physics | ⭐⭐⭐⭐⭐ |
| 8 | Monument Valley | Isometric 3D | Tap/rotate | Illusion path graph | ⭐⭐⭐⭐ |
| 9 | The Witness | 3D world | Line draw | Region validator | ⭐⭐⭐⭐ |
| 10 | Sokoban | Tile grid | Arrow keys | Push logic, deadlock | ⭐⭐ |
| 11 | Crossword | 15×15 letters | Tap+keyboard | Grid numbering, .puz parser | ⭐⭐ |
| 12 | Bejeweled | 8×8 | Swap | Match-3 + specials | ⭐⭐⭐ |
| 13 | Cut the Rope | Physics world | Swipe cut | Verlet rope sim | ⭐⭐⭐⭐ |
| 14 | Threes! | 4×4 | Swipe | Slide+asymmetric merge | ⭐⭐ |
| 15 | Nonogram | N×M | Click | Constraint propagation | ⭐⭐ |
| 16 | Flow Free | N×N | Drag | Path filling | ⭐⭐ |
| 17 | Snake Puzzle | N×M | Swipe | Hamiltonian path | ⭐⭐ |
| 18 | Rush Hour | 6×6 | Drag | BFS state solver | ⭐⭐⭐ |
| 19 | Simon Says | 4 buttons | Tap | Sequence memory | ⭐ |
| 20 | Mastermind | Peg board | Click | Knuth minimax | ⭐⭐ |

---

## Common Patterns Across All These Games

### 1. Undo is Non-Negotiable
Every puzzle game needs undo. Without it, players feel punished and quit. Maintain a history stack of game states and allow rewinding.

### 2. Animation Budget
The "juice" of puzzle games lives in their animations: match pops, tile slides, cascades, board resets. Budget significant dev time for polish here — it's what makes the game feel satisfying vs sterile.

### 3. Responsive Input
Touch-first for mobile (swipe, tap, drag, long-press). Keyboard + mouse for web/desktop. For swipe-based games: detect direction only after a minimum distance threshold (15–20px) to avoid accidental triggers.

### 4. Difficulty Curve
Never tutorial-dump. Introduce one mechanic at a time. The best puzzle games (Witness, Monument Valley, Threes!) teach through level design alone — no text.

### 5. Save State Everywhere
Puzzle players are interrupted constantly. Auto-save on every move. Restore exact state on relaunch.

### 6. Fail Gracefully
Show what went wrong, never punish without explanation. Minesweeper shows all mines. Wordle keeps all guesses visible. Never clear the board silently on loss.

---

*Document prepared as a developer brief for puzzle game implementation. Each section can be treated as a standalone mini-GDD.*
