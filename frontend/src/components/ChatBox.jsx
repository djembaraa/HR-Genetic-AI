import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { Send, Bot, User } from 'lucide-react';

export const ChatBox = () => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your AI HR Assistant. How can I help you with candidates today?' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatLoading]);

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
    <div className="flex flex-col h-[500px] border border-border rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="bg-background-secondary p-4 border-b border-border font-semibold flex items-center gap-2">
        <Bot className="w-5 h-5 text-accent" /> AI Assistant
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto bg-white flex flex-col gap-4" role="log" aria-live="polite">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-accent-light text-accent'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-background-secondary text-primary rounded-tl-none border border-border'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isChatLoading && (
          <div className="flex gap-3 max-w-[85%] self-start" aria-busy="true">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-light text-accent flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-2xl bg-background-secondary rounded-tl-none border border-border flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-white border-t border-border">
        <form onSubmit={handleChat} className="flex gap-2" aria-label="Chat Form">
          <input 
            type="text" 
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all" 
            placeholder="Ask: 'Who is good at React?'" 
            value={chatInput} 
            onChange={e => setChatInput(e.target.value)} 
            disabled={isChatLoading}
            aria-label="Chat Input"
          />
          <Button type="submit" disabled={isChatLoading} icon={Send} variant="accent" aria-label="Send Message">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};
