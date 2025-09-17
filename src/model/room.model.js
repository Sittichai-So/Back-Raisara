import mongoose from "mongoose";

const { Schema, model } = mongoose;

const roomSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  members: {
    type: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        joinedAt: { type: Date, default: Date.now }
      }
    ],
    default: []
  },
  lastMessage: {
    content: { type: String, default: '' },
    userId: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  },
  messageCount: { type: Number, default: 0 },
  messages: { type: Number, default: 0 },
  status: { type: String, default: 'ออนไลน์' },
  tags: { type: [String], default: [] },
  icon: { type: String, default: '' },
  iconType: { type: String, enum: ['default', 'upload'], default: 'default' },
  iconUrl: { type: String, default: '' },
  iconGradient: { type: String, default: '' },
  online: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false }
}, { timestamps: true });

const Room = model('Room', roomSchema, 'room');
export default Room;
