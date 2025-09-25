// chatLog.model.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messageItemSchema = new Schema({
  _id: { 
    type: Schema.Types.ObjectId, 
    auto: true 
  },
  text: { 
    type: String, 
    required: true,
    maxlength: 2000 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: () => new Date()
  }
}, { _id: true });

const chatLogSchema = new Schema({
  roomId: { 
    type: Schema.Types.ObjectId, 
    ref: "Room", 
    required: true, 
    unique: true 
  },
  chatAll: [messageItemSchema]
}, { 
  timestamps: true 
});

chatLogSchema.virtual("chatAllWithThaiTime").get(function () {
  return this.chatAll.map(msg => ({
    ...msg.toObject(),
    thaiTime: new Intl.DateTimeFormat("th-TH", {
      dateStyle: "short",
      timeStyle: "medium"
    }).format(msg.timestamp)
  }));
});

const ChatLog = model("ChatLog", chatLogSchema, "messages");
export default ChatLog;
