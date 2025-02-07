import { useState, useRef, useEffect } from 'react';
import { Send } from 'react-feather';
import io from 'socket.io-client';
import '../styles/OnchainActions.css';

const OnchainActions = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:3001/actions');

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

    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);
    socket.current.emit('input', inputMessage);
    setIsTyping(true);
    setInputMessage('');
  };

  return (
    <div className="actions-container">
      <div className="actions-header">
        <h2>Onchain Actions</h2>
        <p>AI-Assisted Transaction Planning</p>
      </div>

      <div className="messages-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className="message assistant typing">
            AI is typing<span>.</span><span>.</span><span>.</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Plan your next onchain action..."
          autoComplete="off"
        />
        <button type="submit">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default OnchainActions; 