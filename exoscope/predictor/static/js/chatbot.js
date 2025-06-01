document.addEventListener('DOMContentLoaded', function() {
  const chatContainer = document.querySelector('.chatbot-container');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const chatbotUrl = chatContainer.dataset.chatbotUrl;

  // Function to add a message to the chat
  function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    messageText.innerHTML = content;
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = getCurrentTime();
    
    messageContent.appendChild(messageText);
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // Function to show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
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

  // Function to scroll to the bottom of the chat
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessage('user', message);
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
      // Send message to backend
      const response = await fetch(chatbotUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': CSRF_TOKEN
        },
        body: new URLSearchParams({
          'message': message
        })
      });
      
      const data = await response.json();
      
      // Hide typing indicator and add bot response
      hideTypingIndicator();
      
      if (data.response) {
        addMessage('bot', data.response);
      } else if (data.error) {
        addMessage('bot', 'Sorry, there was an error processing your request.');
      }
    } catch (error) {
      console.error('Error:', error);
      hideTypingIndicator();
      addMessage('bot', 'Sorry, I encountered an error. Please try again later.');
    }
  }

  // Event listeners
  chatForm.addEventListener('submit', handleSubmit);
  
  // Allow sending message with Shift+Enter for new line, Enter to send
  userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });

  // Focus input on page load
  userInput.focus();
});