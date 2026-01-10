import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Clock, Zap } from 'lucide-react';
import { format } from 'date-fns';

export default function SessionHistory({ userEmail, onClose }) {
  const [sessions, setSessions] = useState([]);

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
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-4 hover:border-cyan-400/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-medium mb-1">{session.session_name}</div>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(session.timestamp), 'MMM d, h:mm a')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {session.gesture_count || 0} gestures
                      </div>
                    </div>
                  </div>
                  {session.mapping_preset_id && (
                    <div className="px-2 py-1 rounded-full bg-cyan-400/20 text-cyan-400 text-xs">
                      Preset Used
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}