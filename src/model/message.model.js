// message.model.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messageSchema = new Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'voice', 'system'],
    default: 'text'
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  reactions: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: String,
    emoji: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['sending', 'sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  readBy: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  editedAt: {
    type: Date,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    platform: String
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

messageSchema.index({ roomId: 1, createdAt: -1 });
messageSchema.index({ userId: 1, createdAt: -1 });
messageSchema.index({ replyTo: 1 });
messageSchema.index({ 'reactions.userId': 1 });

messageSchema.virtual('replyMessage', {
  ref: 'Message',
  localField: 'replyTo',
  foreignField: '_id',
  justOne: true
});

messageSchema.methods.addReaction = function(userId, username, emoji) {
  const existingReaction = this.reactions.find(
    r => r.userId.toString() === userId && r.emoji === emoji
  );
  
  if (existingReaction) {
    this.reactions = this.reactions.filter(
      r => !(r.userId.toString() === userId && r.emoji === emoji)
    );
  } else {
    this.reactions.push({ userId, username, emoji });
  }
  
  return this.save();
};

messageSchema.methods.markAsRead = function(userId) {
  const alreadyRead = this.readBy.find(r => r.userId.toString() === userId);
  if (!alreadyRead) {
    this.readBy.push({ userId, readAt: new Date() });
    return this.save();
  }
  return Promise.resolve(this);
};

messageSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.content = 'ข้อความนี้ถูกลบแล้ว';
  return this.save();
};

messageSchema.statics.getRecentMessages = function(roomId, limit = 50, offset = 0) {
  return this.find({ 
    roomId, 
    isDeleted: false 
  })
  .populate('replyTo', 'content username createdAt')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(offset);
};

messageSchema.statics.searchMessages = function(roomId, query) {
  return this.find({
    roomId,
    isDeleted: false,
    content: { $regex: query, $options: 'i' }
  })
  .populate('replyTo', 'content username createdAt')
  .sort({ createdAt: -1 })
  .limit(50);
};

const Message = model('Message', messageSchema, 'messages');
export default Message;