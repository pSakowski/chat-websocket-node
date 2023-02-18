const express = require('express');
const path = require('path');

const app = express();
const port = 8000;

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Set up a route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});