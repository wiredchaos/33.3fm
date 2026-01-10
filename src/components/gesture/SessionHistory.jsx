import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Clock, Zap, Play, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import PerformanceReplay from './PerformanceReplay';
import PerformanceAnalyzer from './PerformanceAnalyzer';

export default function SessionHistory({ userEmail, onClose, onReplay }) {
  const [sessions, setSessions] = useState([]);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [analyzeSessionId, setAnalyzeSessionId] = useState(null);

  useEffect(() => {
    loadSessions();
  }, [userEmail]);

  const loadSessions = async () => {
    try {
      const userSessions = await base44.entities.GestureSession.filter(
        { user_email: userEmail },
        '-created_date',
        20
      );
      setSessions(userSessions);
    } catch (error) {
      console.error('Failed to load sessions');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="backdrop-blur-xl bg-black/90 border border-cyan-400/30 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light text-white">Session History</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="text-white/40 text-center py-8">No sessions recorded yet</div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-4 hover:border-cyan-400/30 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-white font-medium mb-1">
                      {session.session_name}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(session.timestamp || session.created_date), 'MMM d, h:mm a')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {session.gesture_count || 0} gestures
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.mapping_preset_id && (
                      <div className="px-2 py-1 rounded-full bg-cyan-400/20 text-cyan-400 text-xs">
                        Preset
                      </div>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onReplay(session.id);
                      }}
                      className="p-2 rounded-full bg-cyan-400/20 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-cyan-400/30"
                      title="Replay"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnalyzeSessionId(session.id);
                        setShowAnalyzer(true);
                      }}
                      className="p-2 rounded-full bg-purple-400/20 text-purple-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-400/30"
                      title="AI Analysis"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Performance Analyzer */}
        {showAnalyzer && analyzeSessionId && (
          <PerformanceAnalyzer
            sessionId={analyzeSessionId}
            onClose={() => {
              setShowAnalyzer(false);
              setAnalyzeSessionId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}