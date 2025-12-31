import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Send, Crown, Zap, Heart, Gift, MessageSquare, Radio } from 'lucide-react';

export default function MultiplayerChat({ room = 'studio' }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [reactionMenu, setReactionMenu] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    simulateOnlineUsers();
  }, [room]);

  const loadMessages = async () => {
    // Simulate loading recent messages
    setMessages([
      { id: 1, user: 'DJ Red Fang', message: 'Welcome to 33.3FM! 🎵', timestamp: Date.now() - 60000, isHost: true },
      { id: 2, user: 'Artist_Mike', message: 'This 3D studio is incredible!', timestamp: Date.now() - 30000, reactions: { fire: 3 } },
      { id: 3, user: 'Producer_Sarah', message: 'Can someone play that chord progression again?', timestamp: Date.now() - 10000 }
    ]);
  };

  const simulateOnlineUsers = () => {
    setOnlineUsers([
      { name: 'DJ Red Fang', status: 'broadcasting', tier: 'host' },
      { name: 'Artist_Mike', status: 'listening', tier: 'vip' },
      { name: 'Producer_Sarah', status: 'active', tier: 'artist' },
      { name: 'Listener_John', status: 'idle', tier: 'free' }
    ]);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: 'You',
      message: inputValue,
      timestamp: Date.now(),
      reactions: {}
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const addReaction = (messageId, emoji) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...msg, reactions };
      }
      return msg;
    }));
    setReactionMenu(null);
  };

  const reactions = ['🔥', '❤️', '👏', '🎵', '💯', '⚡'];

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-black/95 to-purple-950/40 border-2 border-purple-500/50 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wide">Live Community</h3>
            <p className="text-cyan-400 text-xs">{onlineUsers.length} online • {room}</p>
          </div>
        </div>
        <Radio className="w-5 h-5 text-purple-400 animate-pulse" />
      </div>

      {/* Online Users */}
      <div className="p-3 border-b border-purple-500/30">
        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Online Now</div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {onlineUsers.map((user, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 whitespace-nowrap">
              <div className={`w-2 h-2 rounded-full ${
                user.status === 'broadcasting' ? 'bg-red-500 animate-pulse' :
                user.status === 'active' ? 'bg-green-500' :
                user.status === 'listening' ? 'bg-cyan-400' :
                'bg-white/40'
              }`} />
              <span className="text-xs text-white">{user.name}</span>
              {user.tier === 'host' && <Crown className="w-3 h-3 text-red-400" />}
              {user.tier === 'vip' && <Zap className="w-3 h-3 text-cyan-400" />}
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="group">
            <div className={`flex flex-col ${msg.isHost ? 'items-start' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                msg.isHost 
                  ? 'bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-red-500/30' 
                  : 'bg-white/5 border border-white/10'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium ${msg.isHost ? 'text-red-400' : 'text-cyan-400'}`}>
                    {msg.user}
                  </span>
                  <span className="text-[10px] text-white/40">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-white text-sm">{msg.message}</div>
              </div>
              
              {/* Reactions */}
              <div className="flex items-center gap-2 mt-1 ml-2">
                {msg.reactions && Object.entries(msg.reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs"
                  >
                    <span>{emoji}</span>
                    <span className="text-white/60">{count}</span>
                  </button>
                ))}
                <button
                  onClick={() => setReactionMenu(reactionMenu === msg.id ? null : msg.id)}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                >
                  <Heart className="w-3 h-3 text-white/60" />
                </button>
              </div>

              {/* Reaction Menu */}
              {reactionMenu === msg.id && (
                <div className="flex gap-1 mt-1 ml-2 p-2 rounded-lg bg-black/80 border border-white/20">
                  {reactions.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => addReaction(msg.id, emoji)}
                      className="text-lg hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-purple-500/30">
        <div className="flex gap-2">
          <Input
            placeholder="Message the community..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
          <Button
            onClick={sendMessage}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="ghost" className="text-xs text-white/60 hover:text-cyan-400">
            <Gift className="w-3 h-3 mr-1" />
            Send Gift
          </Button>
          <Button size="sm" variant="ghost" className="text-xs text-white/60 hover:text-purple-400">
            <MessageSquare className="w-3 h-3 mr-1" />
            Start Thread
          </Button>
        </div>
      </div>
    </div>
  );
}