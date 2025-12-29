import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import TipButton from '@/components/monetization/TipButton';
import ChatPoll from './ChatPoll';

export default function LiveChat({ isLive = false, activePoll = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { user: 'DJ Red Fang', message: 'Welcome to the broadcast! Chat is live.', timestamp: Date.now(), isHost: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    setMessages([...messages, {
      user: 'You',
      message: inputValue,
      timestamp: Date.now(),
      isHost: false
    }]);
    setInputValue('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all group"
      >
        <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        {isLive && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-black" />
        )}
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-40 bg-black/90 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl shadow-2xl shadow-red-500/30 transition-all ${
      isMinimized ? 'w-80 h-14' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-red-500/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            {isLive && <div className="absolute inset-0 rounded-full bg-red-500 animate-ping" />}
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">Live Chat</h3>
            <p className="text-cyan-400 text-xs">{messages.length} messages</p>
          </div>
        </div>
        <div className="flex gap-2">
          <TipButton recipientEmail="dj@33.3fm.com" recipientName="DJ Red Fang" room="broadcast" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/60 hover:text-cyan-400"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white/60 hover:text-red-400"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[480px] overflow-y-auto p-4 space-y-3">
            {activePoll && (
              <ChatPoll 
                question={activePoll.question} 
                options={activePoll.options || ['House', 'Techno', 'Drum & Bass', 'Dubstep']} 
              />
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.isHost ? 'items-start' : 'items-end'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.isHost 
                    ? 'bg-gradient-to-r from-red-500/20 to-cyan-400/20 border border-red-500/30' 
                    : 'bg-white/5 border border-white/10'
                }`}>
                  <div className={`text-xs mb-1 ${msg.isHost ? 'text-red-400' : 'text-cyan-400'}`}>
                    {msg.user}
                  </div>
                  <div className="text-white text-sm">{msg.message}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-red-500/30">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-red-500 to-cyan-400 hover:from-red-600 hover:to-cyan-500 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}