
import Message from "../model/message.model.js";
import Room from "../model/room.model.js";

export default class ChatService {
  async getMessages(roomId, offset = 0, limit = 50) {
    try {
      const messages = await Message.getRecentMessages(roomId, limit, offset);
      return messages.reverse();
    } catch (error) {
      throw new Error(`Failed to get messages: ${error.message}`);
    }
  }

  async sendMessage(messageData) {
    try {
      const { roomId, userId, username, avatar, content, type, replyTo, metadata } = messageData;

      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      const isMember = room.members.some(member => member.userId === userId);
      if (!isMember) {
        throw new Error('User is not a member of this room');
      }

      const message = new Message({
        roomId,
        userId,
        username,
        avatar,
        content,
        type: type || 'text',
        replyTo: replyTo || null,
        metadata
      });

      const savedMessage = await message.save();
      
      await Room.findByIdAndUpdate(roomId, {
        'lastMessage.content': content,
        'lastMessage.userId': userId,
        'lastMessage.createdAt': new Date(),
        $inc: { messageCount: 1 }
      });

      await savedMessage.populate('replyTo', 'content username createdAt');

      return savedMessage;
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  async updateMessage(messageId, userId, newContent) {
    try {
      const message = await Message.findOne({
        _id: messageId,
        userId,
        isDeleted: false
      });

      if (!message) {
        throw new Error('Message not found or unauthorized');
      }

      message.content = newContent;
      message.isEdited = true;
      message.editedAt = new Date();

      return await message.save();
    } catch (error) {
      throw new Error(`Failed to update message: ${error.message}`);
    }
  }

  async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findOne({
        _id: messageId,
        userId
      });

      if (!message) {
        throw new Error('Message not found or unauthorized');
      }

      await message.softDelete();
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  async toggleReaction(messageId, userId, username, emoji) {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      await message.addReaction(userId, username, emoji);
      return message;
    } catch (error) {
      throw new Error(`Failed to toggle reaction: ${error.message}`);
    }
  }

  async markMessagesAsRead(roomId, userId) {
    try {
      const unreadMessages = await Message.find({
        roomId,
        userId: { $ne: userId },
        'readBy.userId': { $ne: userId },
        isDeleted: false
      });

      const promises = unreadMessages.map(message => message.markAsRead(userId));
      await Promise.all(promises);

      return { readCount: unreadMessages.length };
    } catch (error) {
      throw new Error(`Failed to mark messages as read: ${error.message}`);
    }
  }

  async searchMessages(roomId, query) {
    try {
      return await Message.searchMessages(roomId, query);
    } catch (error) {
      throw new Error(`Failed to search messages: ${error.message}`);
    }
  }

  // Get message statistics
  async getMessageStats(roomId) {
    try {
      const stats = await Message.aggregate([
        { $match: { roomId: new mongoose.Types.ObjectId(roomId), isDeleted: false } },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            totalReactions: { $sum: { $size: '$reactions' } },
            messagesByType: {
              $push: {
                type: '$type',
                count: 1
              }
            },
            topUsers: {
              $push: {
                userId: '$userId',
                username: '$username'
              }
            }
          }
        }
      ]);

      return stats[0] || {
        totalMessages: 0,
        totalReactions: 0,
        messagesByType: [],
        topUsers: []
      };
    } catch (error) {
      throw new Error(`Failed to get message stats: ${error.message}`);
    }
  }
}