import Room from '../models/Room.js';

// Store active rooms in memory for faster access
const activeRooms = new Map();

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a room
    socket.on('join-room', async ({ roomCode, userId, username }) => {
      try {
        const room = await Room.findOne({ roomCode })
          .populate('players', 'username email');
        
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        socket.join(roomCode);
        activeRooms.set(socket.id, { roomCode, userId, username });

        // Notify others in room
        socket.to(roomCode).emit('player-joined', {
          userId,
          username,
          players: room.players
        });

        // Send current room state to the joining player
        socket.emit('room-state', {
          room,
          players: room.players
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Leave a room
    socket.on('leave-room', async ({ roomCode }) => {
      try {
        socket.leave(roomCode);
        activeRooms.delete(socket.id);

        const room = await Room.findOne({ roomCode })
          .populate('players', 'username email');
        
        if (room) {
          socket.to(roomCode).emit('player-left', {
            players: room.players
          });
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Game state update (for real-time sync)
    socket.on('game-state-update', async ({ roomCode, gameState, userId }) => {
      try {
        const room = await Room.findOne({ roomCode });
        
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        room.gameState = gameState;
        await room.save();

        // Broadcast to all players in room except sender
        socket.to(roomCode).emit('game-state-updated', {
          gameState,
          userId
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Player progress update (for race mode)
    socket.on('progress-update', async ({ roomCode, progress, userId }) => {
      try {
        socket.to(roomCode).emit('player-progress', {
          userId,
          progress
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Game completion
    socket.on('game-complete', async ({ roomCode, userId, score, timeElapsed }) => {
      try {
        const room = await Room.findOne({ roomCode });
        
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        room.status = 'completed';
        room.completedAt = Date.now();
        room.winner = userId;
        await room.save();

        // Notify all players
        io.to(roomCode).emit('game-ended', {
          winner: userId,
          score,
          timeElapsed
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Chat message
    socket.on('chat-message', ({ roomCode, message, userId, username }) => {
      socket.to(roomCode).emit('chat-message', {
        userId,
        username,
        message,
        timestamp: new Date()
      });
    });

    // Ready status (for lobby)
    socket.on('player-ready', async ({ roomCode, userId, isReady }) => {
      try {
        socket.to(roomCode).emit('player-ready-update', {
          userId,
          isReady
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Start game (host only)
    socket.on('start-game', async ({ roomCode, userId }) => {
      try {
        const room = await Room.findOne({ roomCode });
        
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        if (room.host.toString() !== userId) {
          socket.emit('error', { message: 'Only host can start game' });
          return;
        }

        room.status = 'playing';
        room.startedAt = Date.now();
        await room.save();

        io.to(roomCode).emit('game-started', {
          startTime: room.startedAt
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      
      const playerData = activeRooms.get(socket.id);
      if (playerData) {
        const { roomCode, userId, username } = playerData;
        
        try {
          const room = await Room.findOne({ roomCode });
          if (room && room.status === 'playing') {
            // Handle disconnection during game
            socket.to(roomCode).emit('player-disconnected', {
              userId,
              username
            });
          }
        } catch (error) {
          console.error('Error handling disconnect:', error);
        }
        
        activeRooms.delete(socket.id);
      }
    });
  });
};
