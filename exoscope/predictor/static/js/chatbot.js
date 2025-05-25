document.addEventListener('DOMContentLoaded', function() {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatMessages = document.getElementById('chat-messages');
  const sendButton = document.getElementById('send-button');
  const chatbotContainer = document.querySelector('.chatbot-container');
  
  // Get the chatbot URL from the data attribute
  const CHATBOT_URL = chatbotContainer.dataset.chatbotUrl;
  
  // Function to add a message to the chat
  function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `<div class="message-text">${text}</div>`;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getCurrentTime();
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Function to show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-content">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Function to hide typing indicator
  function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  // Function to get current time in HH:MM format
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Handle form submission
  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessage('user', message);
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Send message to backend
    fetch(CHATBOT_URL, {
      method: "POST",
      headers: {
        "X-CSRFToken": CSRF_TOKEN,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ message })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      hideTypingIndicator();
      addMessage('bot', data.response);
    })
    .catch(error => {
      hideTypingIndicator();
      addMessage('bot', "Sorry, I'm having trouble connecting to the space knowledge base. Please try again later.");
      console.error('Error:', error);
    });
  });
  
  // Allow sending message with Enter key
  userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });
  
  // Focus input field on page load
  userInput.focus();
});