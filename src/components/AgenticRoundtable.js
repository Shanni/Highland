import { useState, useRef, useEffect } from 'react';
import { Send, ExternalLink, MessageCircle } from 'react-feather';
import io from 'socket.io-client';
import '../styles/AgenticRoundtable.css';

const AgenticRoundtable = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [news, setNews] = useState([]);
  const [aiDiscussion, setAiDiscussion] = useState([]);
  const messagesEndRef = useRef(null);
  const discussionEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Chat socket connection
    socket.current = io('http://localhost:4000/roundtable');

    socket.current.on('output', (message) => {
      setMessages(prev => [...prev, { type: 'assistant', content: message }]);
      setIsTyping(false);
    });

    // News socket connection
    const newsSocket = io('http://localhost:4000/news');
    
    newsSocket.on('news-update', (newsData) => {
      setNews(prev => [...newsData, ...prev].slice(0, 20));
    });

    // AI Discussion socket connection
    const analysisSocket = io('http://localhost:4000/news-based-analysis');
    
    analysisSocket.on('analysis-update', (analysis) => {
      setAiDiscussion(prev => [...prev, analysis]);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
      if (newsSocket) newsSocket.disconnect();
      if (analysisSocket) analysisSocket.disconnect();
    };
  }, []);

  // Auto scroll for both chat areas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    discussionEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiDiscussion]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);
    socket.current.emit('input', inputMessage);
    setIsTyping(true);
    setInputMessage('');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="roundtable-container">
      <div className="roundtable-layout">
        {/* News Feed Section */}
        <div className="news-feed">
          <div className="news-header">
            <h3>Market News</h3>
            <p>Real-time updates</p>
          </div>
          <div className="news-list">
            {news.map((item, index) => (
              <div key={index} className="news-item">
                <div className="news-time">{formatTimestamp(item.timestamp)}</div>
                <div className="news-content">
                  <h4>{item.title}</h4>
                  <p>{item.summary}</p>
                  {item.url && (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="news-link"
                    >
                      Read more <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Section */}
        <div className="chat-section">
          <div className="chat-layout">
            {/* User Chat Area */}
            <div className="user-chat-area">
              <div className="roundtable-header">
                <h2>Agentic Roundtable</h2>
                <p>Collaborative AI Discussion for Portfolio Strategy</p>
              </div>

              <div className="messages-area">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type}`}>
                    {msg.content}
                  </div>
                ))}
                {isTyping && (
                  <div className="message assistant typing">
                    Advisor Agent is typing<span>.</span><span>.</span><span>.</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="message-input">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Discuss your portfolio strategy..."
                  autoComplete="off"
                />
                <button type="submit">
                  <Send size={20} />
                </button>
              </form>
            </div>

            {/* AI Discussion Area */}
            <div className="ai-discussion-area">
              <div className="discussion-header">
                <h3>AI Market Analysis</h3>
                <p>Real-time insights from AI agents</p>
              </div>
              <div className="discussion-messages">
                {aiDiscussion.map((item, index) => (
                  <div key={index} className="discussion-item">
                    <div className="discussion-meta">
                      <span className="agent-name">{item.agent}</span>
                      <span className="discussion-time">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="discussion-content">
                      {item.content}
                    </div>
                  </div>
                ))}
                <div ref={discussionEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgenticRoundtable; 