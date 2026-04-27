import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: () => import('../views/RoomLobbyView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/room/:roomCode',
      name: 'room',
      component: () => import('../views/RoomView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('../views/GameSelectView.vue')
    },
    {
      path: '/games/tetris',
      name: 'tetris',
      component: () => import('../games/tetris/TetrisView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/2048',
      name: '2048',
      component: () => import('../games/2048/Game2048View.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/sudoku',
      name: 'sudoku',
      component: () => import('../games/sudoku/SudokuView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/minesweeper',
      name: 'minesweeper',
      component: () => import('../games/minesweeper/MinesweeperView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/wordle',
      name: 'wordle',
      component: () => import('../games/wordle/WordleView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/match-3',
      name: 'match-3',
      component: () => import('../games/match3/Match3View.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/chess',
      name: 'chess',
      component: () => import('../games/chess/ChessView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/checkers',
      name: 'checkers',
      component: () => import('../games/checkers/CheckersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/snake',
      name: 'snake',
      component: () => import('../games/snake/SnakeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/flappy',
      name: 'flappy',
      component: () => import('../games/flappy/FlappyView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/solitaire',
      name: 'solitaire',
      component: () => import('../games/solitaire/SolitaireView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/memory-match',
      name: 'memory-match',
      component: () => import('../games/memory/MemoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/tic-tac-toe',
      name: 'tic-tac-toe',
      component: () => import('../games/board/TicTacToeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/connect-four',
      name: 'connect-four',
      component: () => import('../games/board/ConnectFourView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/hangman',
      name: 'hangman',
      component: () => import('../games/word/HangmanView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/trivia',
      name: 'trivia',
      component: () => import('../games/word/TriviaView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/simon-says',
      name: 'simon-says',
      component: () => import('../games/arcade/SimonView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/pong',
      name: 'pong',
      component: () => import('../games/arcade/PongView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/breakout',
      name: 'breakout',
      component: () => import('../games/arcade/BreakoutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games/crossword',
      name: 'crossword',
      component: () => import('../games/puzzle/CrosswordView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from) => {
  const auth = useAuthStore()
  
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return '/login'
  }
  
  // Redirect logged-in users away from auth pages
  if ((to.path === '/login' || to.path === '/signup') && auth.isLoggedIn) {
    return '/dashboard'
  }
})

export default router
