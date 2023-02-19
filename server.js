const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const port = 8000;

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Set up a route to serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Set up Socket.IO
const io = socket(server);

// Initialize the users array
let users = [];

// Handle a new connection to the server
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  // Handle a new user joining the chat
  socket.on('join', (name) => {
    const user = { name, id: socket.id };
    users.push(user);
    
    // Notify all clients that a new user has joined the chat
    const message = { author: 'Chat Bot', content: `<em>User-${name} has joined the conversation!</em>` };
    socket.broadcast.emit('message', message);
    console.log(`User ${name} connected`);
  });

  // Handle a new message from the client
  socket.on('message', (message) => {
    console.log(`Received message: ${message.content}`);

    // Broadcast the message to all clients except the sender
    socket.broadcast.emit('message', message);
  });

  // Handle disconnection from the client
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);

    // Remove the user from the list of connected users
    const user = users.find((user) => user.id === socket.id);
    if (user) {
      users = users.filter((user) => user.id !== socket.id);
      const message = { author: 'Chat Bot', content: `User-${user.name} has left the conversation!` };
      socket.broadcast.emit('message', message);
      console.log(`User ${user.name} disconnected`);
    }
  });
});