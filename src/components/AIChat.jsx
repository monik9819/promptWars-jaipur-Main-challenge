import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import DOMPurify from 'dompurify';
import SOSPanel from './SOSPanel';

const AIChat = ({ initialPrompt = null, systemContext }) => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hi there! I'm your MindEase companion. How are you feeling today?" }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const messagesEndRef = useRef(null);

  const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'self harm', 'don\'t want to live'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && messages.length === 1) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    // Check for crisis keywords
    const isCrisis = crisisKeywords.some(keyword => messageText.toLowerCase().includes(keyword));
    if (isCrisis) {
      setShowSOS(true);
      // Still proceed to send to AI, but SOS is immediately shown
    }

    const newMessages = [...messages, { role: 'user', content: messageText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemContext },
            ...newMessages
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from OpenAI');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: "I'm having a little trouble connecting right now. Please take a deep breath and try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {showSOS && <SOSPanel className="border-b border-rose-100 rounded-none rounded-t-2xl" />}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center mr-2 flex-shrink-0">
                <Sparkles className="w-4 h-4 text-violet-600" />
              </div>
            )}
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-sm' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-sm'
              }`}
            >
              <div 
                className="text-sm leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.content.replace(/\n/g, '<br/>')) }}
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center mr-2 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-violet-600" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
