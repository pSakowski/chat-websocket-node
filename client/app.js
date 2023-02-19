// Create a socket instance for the client to communicate with the server
const socket = io();

// Listen for the 'message' event, which the server will emit whenever a new message is received
socket.on('message', ({ author, content }) => {
  // Call the addMessage function to add the new message to the message list
  addMessage(author, content);
});

// Listen for the 'user joined' event, which the server will emit when a new user joins the chat
socket.on('user joined', (user) => {
  // Call the addMessage function to add a notification that a new user has joined the chat
  addMessage('Chat Bot', `User-${user.name} has joined the conversation!`);
});

// Listen for the 'user left' event, which the server will emit when a user leaves the chat
socket.on('user left', (user) => {
  // Call the addMessage function to add a notification that a user has left the chat
  addMessage('Chat Bot', `User-${user.name} has left the conversation.`);
});

// Get references to HTML elements
const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');

// Initialize userName variable
let userName = '';

// Define login function
const login = (e) => {
  e.preventDefault();
  if (userNameInput.value === '') {
    alert('Please enter your name.');
  } else {
    // Store the user's name in the userName variable
    userName = userNameInput.value;
    // Emit a 'join' event to the server with the user's name
    socket.emit('join', userName);
    // Hide the login form and show the messages section
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  }
};

// Define sendMessage function
const sendMessage = (e) => {
  e.preventDefault();

  const messageContent = messageContentInput.value;

  if (messageContent === '') {
    alert('Message content cannot be empty!');
    return;
  }

  // Call the addMessage function to add the user's message to the message list
  addMessage(userName, messageContent);
  // Emit a 'message' event to the server with the user's name and message content
  socket.emit('message', { author: userName, content: messageContent });
  // Clear the message input field
  messageContentInput.value = '';
};

// Define addMessage function
const addMessage = (author, content, style = '') => {
  // Create a new li element to hold the message
  const message = document.createElement('li');

  // Add the 'message' and 'message--received' classes to the message element
  message.classList.add('message', 'message--received');

  // If the message is from the current user, add the 'message--self' class
  if (author === userName) {
    message.classList.add('message--self');
  }

  // Set the innerHTML of the message element to include the author and content of the message
  message.innerHTML = `
    <h3 class="message__author">${author === userName ? 'You' : author}</h3>
    <div class="message__content" style="font-style: ${style}">${content}</div>
  `;

  // Append the message element to the message list
  messagesList.appendChild(message);
};

// Add event listeners for the login and send message
loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);