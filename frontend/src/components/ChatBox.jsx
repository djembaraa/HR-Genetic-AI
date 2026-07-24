import React, { useState } from 'react';
import { Button } from './Button';

export const ChatBox = () => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your AI HR Assistant. How can I help you with candidates today?' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userQuery = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/hr/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, the system is currently offline.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <>
      <div className="chat-box" style={{ flexGrow: 1 }} role="log" aria-live="polite">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        {isChatLoading && <div className="message bot" aria-busy="true">Thinking...</div>}
      </div>
      <form onSubmit={handleChat} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }} aria-label="Chat Form">
        <input 
          type="text" 
          className="input-modern" 
          placeholder="Ask: 'Who is good at React?'" 
          value={chatInput} 
          onChange={e => setChatInput(e.target.value)} 
          disabled={isChatLoading}
          aria-label="Chat Input"
        />
        <Button type="submit" disabled={isChatLoading} aria-label="Send Message">Send</Button>
      </form>
    </>
  );
};
