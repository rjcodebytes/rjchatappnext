const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
     origin: process.env.CLIENT_URL, // frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = {}; // { username: socketId }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ Register user
  socket.on("register", (username) => {
    if (!username) return;
    socket.username = username;
    onlineUsers[username] = socket.id;

    console.log(username, "registered with id", socket.id);

    // Broadcast updated online users
    io.emit("updateUsers", Object.keys(onlineUsers));
  });

  // ✅ Private message event
  socket.on("private_message", ({ sender, recipient, text, time }) => {
    console.log("Private message event:", { sender, recipient, text, time });

    const recipientSocketId = onlineUsers[recipient];
    console.log("Recipient socketId:", recipientSocketId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("private_message", {
        sender,
        recipient,
        text,
        time,
      });
    }

    // Echo back to sender so sender sees their own message
    socket.emit("private_message", { sender, recipient, text, time });
  });

  // ✅ Handle disconnect
  socket.on("disconnect", () => {
    if (socket.username) {
      delete onlineUsers[socket.username];
      console.log(socket.username, "disconnected");

      // Broadcast updated list after disconnect
      io.emit("updateUsers", Object.keys(onlineUsers));
    }
  });
});

server.listen(5000, () => {
  console.log("✅ Socket.IO server running on port 5000");
});
