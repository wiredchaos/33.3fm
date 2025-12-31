import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, User } from 'lucide-react';

export default function FanInteractions({ artistEmail, artistName }) {
  const [interactions, setInteractions] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadInteractions();
    loadUser();
  }, [artistEmail]);

  const loadUser = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);
    } catch (error) {
      console.log('User not logged in');
    }
  };

  const loadInteractions = async () => {
    try {
      const data = await base44.entities.FanInteraction.filter(
        { artist_email: artistEmail, status: 'responded' },
        '-created_date',
        20
      );
      setInteractions(data);
    } catch (error) {
      console.error('Failed to load interactions:', error);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || !currentUser) return;

    setIsLoading(true);
    try {
      await base44.entities.FanInteraction.create({
        fan_email: currentUser.email,
        artist_email: artistEmail,
        interaction_type: 'comment',
        content: newComment,
        status: 'pending'
      });

      setNewComment('');
      
      // Notify artist
      try {
        await base44.integrations.Core.SendEmail({
          to: artistEmail,
          subject: 'New Comment on Your Profile',
          body: `${currentUser.full_name || currentUser.email} left a comment: "${newComment}"`
        });
      } catch (e) {
        console.log('Notification sent');
      }

      await loadInteractions();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6 max-w-md animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-5 h-5 text-cyan-400 animate-pulse" />
        <h3 className="text-lg font-light text-white tracking-wide">Fan Wall</h3>
      </div>

      {/* Comment Input */}
      {currentUser ? (
        <div className="mb-6">
          <Textarea
            placeholder={`Leave a message for ${artistName || 'this artist'}...`}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 mb-3 h-24"
          />
          <Button
            onClick={submitComment}
            disabled={isLoading || !newComment.trim()}
            className="w-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-90 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-white/60 text-sm mb-3">Sign in to interact with artists</p>
          <Button
            onClick={() => base44.auth.redirectToLogin()}
            variant="outline"
            className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
          >
            Sign In
          </Button>
        </div>
      )}

      {/* Interactions Feed */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {interactions.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-sm">
            No interactions yet. Be the first to leave a message!
          </div>
        ) : (
          interactions.map((interaction) => (
            <div
              key={interaction.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="text-white/80 text-sm font-medium">
                    {interaction.fan_email.split('@')[0]}
                  </div>
                  <div className="text-white/40 text-xs">
                    {new Date(interaction.created_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-3">{interaction.content}</p>
              
              {interaction.artist_response && (
                <div className="mt-3 pl-4 border-l-2 border-cyan-400/30">
                  <div className="text-cyan-400 text-xs font-medium mb-1">
                    Artist Response
                  </div>
                  <p className="text-white/70 text-sm">{interaction.artist_response}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}