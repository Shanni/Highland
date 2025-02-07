import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'react-feather';
import io from 'socket.io-client';
import '../styles/ChatBox.css';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io('http://localhost:4000/chat');

    // Listen for incoming messages
    socket.current.on('output', (message) => {
      setMessages(prev => [...prev, { type: 'assistant', content: message }]);
      setIsTyping(false);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);
    
    // Emit message to server
    socket.current.emit('input', inputMessage);
    
    // Show AI is typing
    setIsTyping(true);
    
    // Clear input
    setInputMessage('');
  };

  return (
    <div className={`chatbox-container ${isOpen ? 'open' : ''}`}>
      {!isOpen ? (
        <button 
          className="chat-toggle"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare size={20} />
          <span>AI Advisor</span>
        </button>
      ) : (
        <div className="chatbox">
          <div className="chat-header">
            <h3>Financial Advisor AI</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="messages-container">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.type}`}
              >
                {msg.content}
              </div>
            ))}
            {isTyping && (
              <div className="message ai typing">
                Advisor Agent is typing<span>.</span><span>.</span><span>.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your portfolio..."
              autoComplete="off"
            />
            <button type="submit">
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBox; 