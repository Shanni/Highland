import { useState, useRef, useEffect } from 'react';
import { Send } from 'react-feather';
import io from 'socket.io-client';
import '../styles/OnchainActions.css';

const formatMessage = (content) => {
  if (!content) return '';
  
  return content.split('\n').map((line, i) => {
    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return line.trim() ? (
      <p key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
    ) : (
      <br key={i} />
    );
  });
};

const OnchainActions = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:4000/baseAction');

    // Listen for status updates
    socket.current.on('status', (message) => {
      setMessages(prev => [...prev, { type: 'assistant', content: message }]);
      setIsTyping(false);
    });

    // Listen for AI responses
    socket.current.on('output', (message) => {
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: message 
      }]);
      setIsTyping(false);
    });

    // Listen for errors
    socket.current.on('error', (error) => {
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: `Error: ${error}` 
      }]);
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

    setMessages(prev => [...prev, { 
      type: 'user', 
      content: inputMessage 
    }]);
    
    socket.current.emit('input', inputMessage);
    setIsTyping(true);
    setInputMessage('');
  };

  return (
    <div className="actions-container">
      <div className="actions-header">
        <div className="header-title">
          <h2>Onchain Actions</h2>
          <span className="beta-tag">BETA</span>
        </div>
        <p>Sponsored by CDP Agentkit</p>
      </div>

      <div className="messages-area">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.type}`}
          >
            {formatMessage(msg.content)}
          </div>
        ))}
        {isTyping && (
          <div className="message ai typing">
            AI is analyzing<span>.</span><span>.</span><span>.</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Describe your transaction plan..."
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