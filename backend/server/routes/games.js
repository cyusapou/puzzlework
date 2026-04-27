import express from 'express';
import GameSession from '../models/GameSession.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user's game history
router.get('/history', protect, async (req, res) => {
  try {
    const sessions = await GameSession.find({ user: req.user._id })
      .sort({ startedAt: -1 })
      .limit(50)
      .populate('room');
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get stats for a specific game
router.get('/stats/:gameType', protect, async (req, res) => {
  try {
    const { gameType } = req.params;
    
    const sessions = await GameSession.find({ 
      user: req.user._id, 
      gameType 
    });
    
    const stats = {
      totalGames: sessions.length,
      gamesWon: sessions.filter(s => s.isWon).length,
      totalScore: sessions.reduce((sum, s) => sum + s.score, 0),
      averageTime: sessions.length > 0 
        ? sessions.reduce((sum, s) => sum + s.timeElapsed, 0) / sessions.length 
        : 0,
      bestScore: sessions.length > 0 
        ? Math.max(...sessions.map(s => s.score)) 
        : 0
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save game session
router.post('/session', protect, async (req, res) => {
  try {
    const { gameType, mode, difficulty, score, isWon, timeElapsed, moves, gameState, room } = req.body;
    
    const session = await GameSession.create({
      user: req.user._id,
      gameType,
      mode,
      difficulty,
      score,
      isWon,
      timeElapsed,
      moves,
      gameState,
      room,
      completedAt: isWon ? Date.now() : null
    });
    
    // Update user stats
    const user = req.user;
    user.stats.gamesPlayed += 1;
    if (isWon) {
      user.stats.gamesWon += 1;
    }
    user.stats.totalScore += score;
    await user.save();
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
