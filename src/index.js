const path = require("path");
const http = require("http");
const express = require("express");

const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

io.on("connection", (socket) => {
  socket.emit("message", "Welcome!");
  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("sendMessage", (message, cb) => {
    io.emit("message", message);
    cb();
  });

  socket.on("sendLocation", ({ latitude, longitude }, cb) => {
    io.emit("message", `https://google.com/maps?q=${latitude},${longitude}`);

    cb();
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left!");
  });
});

app.use(express.static(publicPath));
server.listen(port);
