import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/info').then(res => { setData(res.data); setLoading(false); }).catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { type: 'user', text: input, timestamp: new Date() }]);
      setInput('');
      setTimeout(() => { setMessages(prev => [...prev, { type: 'ai', text: `Echo: ${input}`, timestamp: new Date() }]); }, 500);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 Bebe AI Real</h1>
        <p>Advanced AI Application</p>
        {loading && <p className="status">Loading...</p>}
        {error && <p className="error">Error: {error}</p>}
        {data && <div className="api-info"><h2>Backend Status:</h2><pre>{JSON.stringify(data, null, 2)}</pre></div>}
      </header>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              <strong>{msg.type === 'user' ? 'You' : 'AI'}:</strong>
              <p>{msg.text}</p>
              <small>{msg.timestamp.toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
        <div className="input-area">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
export default App;
