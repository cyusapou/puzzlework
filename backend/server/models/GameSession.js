import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameType: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['singleplayer', 'multiplayer'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  score: {
    type: Number,
    default: 0
  },
  isWon: {
    type: Boolean,
    default: false
  },
  timeElapsed: {
    type: Number,
    default: 0
  },
  moves: {
    type: Number,
    default: 0
  },
  gameState: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

gameSessionSchema.index({ user: 1, gameType: 1 });
gameSessionSchema.index({ startedAt: -1 });

export default mongoose.model('GameSession', gameSessionSchema);
