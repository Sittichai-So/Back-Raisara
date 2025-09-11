export default function setupChatHandlers(io, socket) {
  socket.on('join_room', async (data) => {
    try {
      const { roomId, userId, username, avatar } = data;

      await socket.join(roomId);

      socket.roomId = roomId;
      socket.userId = userId;
      socket.username = username;
      
      socket.to(roomId).emit('user_joined', {
        userId,
        username,
        avatar,
        joinedAt: new Date()
      });
      
      const socketsInRoom = await io.in(roomId).fetchSockets();
      const onlineUsers = socketsInRoom.map(s => ({
        userId: s.userId,
        username: s.username,
        socketId: s.id
      }));
      
      socket.emit('online_users', onlineUsers);
      
    } catch (error) {
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  socket.on('leave_room', async (data) => {
    try {
      const { roomId, userId } = data;
      
      await socket.leave(roomId);
      
      socket.to(roomId).emit('user_left', userId);
      
    } catch (error) {
      socket.emit('error', { message: 'Failed to leave room' });
    }
  });

  socket.on('send_message', async (messageData) => {
    try {
      const chatService = new (await import('../services/chat.service.js')).default();
      
      const fullMessageData = {
        ...messageData,
        userId: socket.userId,
        username: socket.username,
        metadata: {
          socketId: socket.id,
          timestamp: new Date()
        }
      };
      
      const savedMessage = await chatService.sendMessage(fullMessageData);
      
      io.to(messageData.roomId).emit('new_message', savedMessage);
      
    } catch (error) {
      socket.emit('message_error', { 
        error: error.message,
        originalData: messageData 
      });
    }
  });

  socket.on('typing_start', (data) => {
    const { roomId } = data;
    socket.to(roomId).emit('user_typing', {
      userId: socket.userId,
      username: socket.username
    });
  });

  socket.on('typing_stop', (data) => {
    const { roomId } = data;
    socket.to(roomId).emit('user_stop_typing', socket.userId);
  });

  socket.on('toggle_reaction', async (data) => {
    try {
      const { messageId, emoji } = data;
      const chatService = new (await import('../services/chat.service.js')).default();
      
      const message = await chatService.toggleReaction(
        messageId, 
        socket.userId, 
        socket.username, 
        emoji
      );
      
      io.to(socket.roomId).emit('message_updated', message);
      
    } catch (error) {
      socket.emit('reaction_error', { error: error.message });
    }
  });

  socket.on('delete_message', async (data) => {
    try {
      const { messageId, roomId } = data;
      const chatService = new (await import('../services/chat.service.js')).default();
      
      await chatService.deleteMessage(messageId, socket.userId);
      
      io.to(roomId).emit('message_deleted', messageId);
      
    } catch (error) {
      socket.emit('delete_error', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    if (socket.roomId && socket.userId) {
      socket.to(socket.roomId).emit('user_left', socket.userId);
    }
  });
}