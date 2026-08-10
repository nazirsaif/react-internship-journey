const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');

let typingTimeout;

input.addEventListener('input', () => {
  socket.emit('typing');
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('stop typing');
  }, 1000);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('message', input.value);
    input.value = '';
    socket.emit('stop typing');
  }
});

socket.on('message', (msg) => {
  const item = document.createElement('div');
  item.textContent = msg;
  item.classList.add('message');
  messages.appendChild(item);
  messages.scrollTo(0, messages.scrollHeight);
});

socket.on('system', (msg) => {
  const item = document.createElement('div');
  item.textContent = msg;
  item.classList.add('message', 'system');
  messages.appendChild(item);
  messages.scrollTo(0, messages.scrollHeight);
});

socket.on('typing', () => {
  typingIndicator.textContent = 'Someone is typing...';
});

socket.on('stop typing', () => {
  typingIndicator.textContent = '';
});
