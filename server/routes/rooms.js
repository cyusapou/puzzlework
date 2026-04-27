import express from 'express';
import Room from '../models/Room.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate random 6-character room code
const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Create a new room
router.post('/create', protect, async (req, res) => {
  try {
    const { gameType, mode, difficulty, maxPlayers } = req.body;
    
    let roomCode;
    let isUnique = false;
    
    // Generate unique room code
    while (!isUnique) {
      roomCode = generateRoomCode();
      const existing = await Room.findOne({ roomCode });
      if (!existing) isUnique = true;
    }
    
    const room = await Room.create({
      roomCode,
      gameType,
      mode,
      host: req.user._id,
      players: [req.user._id],
      maxPlayers: maxPlayers || 2,
      difficulty: difficulty || 'medium',
      isRandomMatch: false
    });
    
    await room.populate('host', 'username email');
    await room.populate('players', 'username email');
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join a room by code
router.post('/join/:roomCode', protect, async (req, res) => {
  try {
    const { roomCode } = req.params;
    
    const room = await Room.findOne({ roomCode });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (room.status !== 'waiting') {
      return res.status(400).json({ message: 'Room is not accepting players' });
    }
    
    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({ message: 'Room is full' });
    }
    
    if (room.players.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already in this room' });
    }
    
    room.players.push(req.user._id);
    
    // Start game if room is full
    if (room.players.length === room.maxPlayers) {
      room.status = 'playing';
      room.startedAt = Date.now();
    }
    
    await room.save();
    await room.populate('host', 'username email');
    await room.populate('players', 'username email');
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Find random match
router.post('/random', protect, async (req, res) => {
  try {
    const { gameType, difficulty } = req.body;
    
    // Look for waiting room with same game type and difficulty
    let room = await Room.findOne({
      gameType,
      difficulty,
      status: 'waiting',
      isRandomMatch: true,
      host: { $ne: req.user._id }
    }).populate('host', 'username email').populate('players', 'username email');
    
    if (room) {
      // Join existing room
      if (room.players.length >= room.maxPlayers) {
        return res.status(400).json({ message: 'No available rooms found' });
      }
      
      if (room.players.includes(req.user._id)) {
        return res.status(400).json({ message: 'Already in this room' });
      }
      
      room.players.push(req.user._id);
      room.status = 'playing';
      room.startedAt = Date.now();
      await room.save();
      await room.populate('players', 'username email');
      
      return res.json(room);
    }
    
    // Create new room for random matchmaking
    let roomCode;
    let isUnique = false;
    
    while (!isUnique) {
      roomCode = generateRoomCode();
      const existing = await Room.findOne({ roomCode });
      if (!existing) isUnique = true;
    }
    
    room = await Room.create({
      roomCode,
      gameType,
      mode: 'multiplayer',
      host: req.user._id,
      players: [req.user._id],
      maxPlayers: 2,
      difficulty: difficulty || 'medium',
      isRandomMatch: true
    });
    
    await room.populate('host', 'username email');
    await room.populate('players', 'username email');
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get room by code
router.get('/:roomCode', protect, async (req, res) => {
  try {
    const { roomCode } = req.params;
    
    const room = await Room.findOne({ roomCode })
      .populate('host', 'username email')
      .populate('players', 'username email')
      .populate('winner', 'username email');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Leave room
router.post('/leave/:roomCode', protect, async (req, res) => {
  try {
    const { roomCode } = req.params;
    
    const room = await Room.findOne({ roomCode });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (!room.players.includes(req.user._id)) {
      return res.status(400).json({ message: 'Not in this room' });
    }
    
    // Remove player from room
    room.players = room.players.filter(p => p.toString() !== req.user._id.toString());
    
    // If host leaves and there are other players, transfer host
    if (room.host.toString() === req.user._id.toString() && room.players.length > 0) {
      room.host = room.players[0];
    }
    
    // If no players left, delete room
    if (room.players.length === 0) {
      await Room.deleteOne({ _id: room._id });
      return res.json({ message: 'Room deleted' });
    }
    
    // If room was playing and a player left, mark as completed
    if (room.status === 'playing') {
      room.status = 'completed';
      room.completedAt = Date.now();
      room.winner = room.players[0]; // Remaining player wins
    }
    
    await room.save();
    await room.populate('host', 'username email');
    await room.populate('players', 'username email');
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update game state
router.put('/:roomCode/state', protect, async (req, res) => {
  try {
    const { roomCode } = req.params;
    const { gameState } = req.body;
    
    const room = await Room.findOne({ roomCode });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (!room.players.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not in this room' });
    }
    
    room.gameState = gameState;
    await room.save();
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
