import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'react-feather';
import io from 'socket.io-client';
import '../styles/ChatBox.css';

const formatMessage = (content) => {
  if (!content) return '';
  
  // Split by newlines and filter out empty strings
  return content.split('\n').map((line, i) => {
    // Handle markdown-style bold text
    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return line.trim() ? (
      <p key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
    ) : (
      <br key={i} />
    );
  });
};

const ChatBox = ({ 
  walletAddress, 
  selectedChain, 
  walletData, 
  totalValue,
  isConnected 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Initialize socket connection with context data
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
  }, [walletAddress, selectedChain, isConnected]);

  // Scroll to bottom of chat
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
    
    console.log(walletAddress, selectedChain.name, totalValue, walletData);
    const currentChainAssets = walletData?.balances?.items?.map(asset => ({
      symbol: asset.contract_ticker_symbol,
      contract_address: asset.contract_address,
      name: asset.contract_name,
      ticker: asset.contract_ticker_symbol,
      balance: Number(asset.balance) / Math.pow(10, asset.contract_decimals),
      value: asset.quote,
      price: asset.quote_rate,
      value_24: asset.quote_24h,
      price_24: asset.quote_rate_24h,
      type: asset.type,
      isNative: asset.native_token
    })) || [];

    // Prepare context object with relevant data
    const context = {
      walletAddress,
      chainName: selectedChain.name,
      totalValue,
      assets: currentChainAssets
    };

    // Emit message with formatted context
    socket.current.emit('input', JSON.stringify({
      message: inputMessage,
      context
    }));
    
    setIsTyping(true);
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
            <h3>Financial Analysis Assistant</h3>
            {/* <div className="chat-context">
              {selectedChain.name}
            </div> */}
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
                {formatMessage(msg.content)}
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
              placeholder={`Ask about ${selectedChain.name} portfolio...`}
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