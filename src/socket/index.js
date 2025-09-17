import { Server } from "socket.io";
import chatHandler from "./chatHandler.js";

export default function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("มีผู้ใช้เชื่อมต่อ:", socket.id);
    chatHandler(io, socket);
  });

  return io;
}
