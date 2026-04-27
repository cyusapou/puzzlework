import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    length: 6
  },
  gameType: {
    type: String,
    required: true,
    enum: ['2048', 'chess', 'checkers', 'connect4', 'flappy', 'match3', 'memory', 'minesweeper', 'pong', 'snake', 'solitaire', 'sudoku', 'tetris', 'wordle', 'hangman', 'crossword', 'simon', 'breakout']
  },
  mode: {
    type: String,
    required: true,
    enum: ['multiplayer', 'singleplayer']
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxPlayers: {
    type: Number,
    default: 2
  },
  status: {
    type: String,
    enum: ['waiting', 'playing', 'completed'],
    default: 'waiting'
  },
  gameState: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  isRandomMatch: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Index for finding waiting rooms for random matchmaking
roomSchema.index({ status: 1, gameType: 1, isRandomMatch: 1 });

export default mongoose.model('Room', roomSchema);
