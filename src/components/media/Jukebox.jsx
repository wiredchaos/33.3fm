import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Music, Play, Pause, SkipForward, DollarSign, Crown, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Jukebox({ isLive = false }) {
  const [queue, setQueue] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [trackRequest, setTrackRequest] = useState('');
  const [tipAmount, setTipAmount] = useState(5);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      const requests = await base44.entities.TrackRequest.list('-created_date', 50);
      setQueue(requests);
      if (!currentTrack && requests.length > 0) {
        setCurrentTrack(requests[0]);
      }
    } catch (error) {
      console.error('Failed to load queue:', error);
    }
  };

  const requestTrack = async () => {
    if (!trackRequest.trim()) return;
    
    try {
      const user = await base44.auth.me();
      
      // Create track request
      await base44.entities.TrackRequest.create({
        user_email: user.email,
        track_name: trackRequest,
        tip_amount: tipAmount,
        status: 'pending',
        priority: tipAmount >= 10 ? 'high' : 'normal'
      });

      // Process tip if amount > 0
      if (tipAmount > 0) {
        await base44.entities.Tip.create({
          from_user: user.email,
          to_user: 'dj@33.3fm.com',
          amount: tipAmount,
          message: `Track request: ${trackRequest}`,
          room: 'jukebox'
        });
      }

      setTrackRequest('');
      setShowRequestModal(false);
      loadQueue();
    } catch (error) {
      console.error('Failed to request track:', error);
    }
  };

  const playNext = () => {
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex < queue.length - 1) {
      setCurrentTrack(queue[currentIndex + 1]);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-black/95 to-red-950/40 border-2 border-red-500/50 rounded-2xl shadow-2xl shadow-red-500/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-red-500/30 bg-gradient-to-r from-red-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-red-400 font-bold text-sm uppercase tracking-wide">33.3FM Jukebox</h3>
            <p className="text-cyan-400 text-xs">{queue.length} tracks in queue</p>
          </div>
        </div>
        <Button
          onClick={() => setShowRequestModal(true)}
          size="sm"
          className="bg-gradient-to-r from-red-500 to-cyan-400 hover:from-red-600 hover:to-cyan-500 text-white text-xs"
        >
          <DollarSign className="w-3 h-3 mr-1" />
          Request Track
        </Button>
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <div className="p-4 border-b border-red-500/30">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Now Playing</div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-white font-medium">{currentTrack.track_name}</div>
              <div className="text-xs text-cyan-400">
                Requested by {currentTrack.user_email.split('@')[0]}
                {currentTrack.tip_amount > 0 && (
                  <span className="ml-2 text-red-400">
                    • ${currentTrack.tip_amount} tip
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-cyan-400 hover:text-cyan-300"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={playNext}
                className="text-white/60 hover:text-white"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Queue */}
      <div className="max-h-64 overflow-y-auto p-4">
        <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Queue</div>
        <div className="space-y-2">
          {queue.slice(1, 10).map((track, i) => (
            <div 
              key={track.id}
              className={`p-3 rounded-lg transition-all ${
                track.priority === 'high' 
                  ? 'bg-gradient-to-r from-red-500/20 to-cyan-400/20 border border-red-500/30' 
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-white/40 text-xs w-4">#{i + 2}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{track.track_name}</div>
                    <div className="text-xs text-white/60">{track.user_email.split('@')[0]}</div>
                  </div>
                </div>
                {track.tip_amount > 0 && (
                  <div className="flex items-center gap-1 text-xs text-red-400">
                    <Crown className="w-3 h-3" />
                    ${track.tip_amount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="bg-black/95 border-cyan-400/50 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-cyan-400">
              <Music className="w-5 h-5" />
              Request a Track
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">
                Track Name / Artist
              </label>
              <Input
                placeholder="e.g. Sandstorm - Darude"
                value={trackRequest}
                onChange={(e) => setTrackRequest(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">
                Tip Amount (Higher tips = Priority Queue)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[0, 5, 10, 20].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTipAmount(amount)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      tipAmount === amount
                        ? 'bg-gradient-to-r from-red-500 to-cyan-400 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {amount === 0 ? 'Free' : `$${amount}`}
                  </button>
                ))}
              </div>
              <Input
                type="number"
                placeholder="Custom amount"
                value={tipAmount}
                onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <Heart className="w-3 h-3 text-red-400" />
                <span>Free requests go to regular queue</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-3 h-3 text-cyan-400" />
                <span>$10+ tips = Priority queue</span>
              </div>
            </div>

            <Button
              onClick={requestTrack}
              disabled={!trackRequest.trim()}
              className="w-full bg-gradient-to-r from-red-500 to-cyan-400 hover:from-red-600 hover:to-cyan-500 text-white"
            >
              Request Track {tipAmount > 0 && `• $${tipAmount} Tip`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}