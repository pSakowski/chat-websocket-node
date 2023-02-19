const socket = io();

socket.on('message', ({ author, content }) => {
  addMessage(author, content);
});

// Reference to the login form
const loginForm = document.querySelector('#welcome-form');

// Reference to the messages section
const messagesSection = document.querySelector('#messages-section');

// Reference to the message list
const messagesList = document.querySelector('#messages-list');

// Reference to the form for adding a message
const addMessageForm = document.querySelector('#add-messages-form');

// Reference to the text field for the username input
const userNameInput = document.querySelector('#username');

// Reference to the text field for the message content input
const messageContentInput = document.querySelector('#message-content');

let userName = '';

const login = (e) => {
  e.preventDefault();
  if (userNameInput.value === '') {
    alert('Please enter your name.');
  } else {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  }
};

const sendMessage = (e) => {
  e.preventDefault();

  const messageContent = messageContentInput.value;

  if (messageContent === '') {
    alert('Message content cannot be empty!');
    return;
  }

  addMessage(userName, messageContent);
  socket.emit('message', { author: 'John Doe', content: 'Lorem Ipsum' });
  messageContentInput.value = '';
};

const addMessage = (author, content) => {
  // create li element
  const message = document.createElement('li');

  // add classes
  message.classList.add('message', 'message--received');
  if (author === userName) {
    message.classList.add('message--self');
  }

  // create h3&div element for author&content
  message.innerHTML = `
    <h3 class="message__author">${author === userName ? 'You' : author}</h3>
    <div class="message__content">${content}</div>
  `;

  // append message li to message list
  messagesList.appendChild(message);
}

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);