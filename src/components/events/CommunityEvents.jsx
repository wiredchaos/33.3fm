import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Users, Radio, Plus, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function CommunityEvents({ artistEmail, isOwner = false }) {
  const [events, setEvents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    event_type: 'live_broadcast',
    start_time: '',
    duration_minutes: 60
  });

  useEffect(() => {
    loadEvents();
  }, [artistEmail]);

  const loadEvents = async () => {
    try {
      const data = await base44.entities.CommunityEvent.filter(
        { artist_email: artistEmail },
        '-start_time',
        10
      );
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const createEvent = async () => {
    try {
      const user = await base44.auth.me();
      await base44.entities.CommunityEvent.create({
        artist_email: artistEmail,
        title: newEvent.title,
        event_type: newEvent.event_type,
        start_time: newEvent.start_time,
        duration_minutes: newEvent.duration_minutes,
        attendees: []
      });

      setNewEvent({ title: '', event_type: 'live_broadcast', start_time: '', duration_minutes: 60 });
      setShowCreate(false);
      loadEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const joinEvent = async (eventId) => {
    try {
      const user = await base44.auth.me();
      const event = events.find(e => e.id === eventId);
      
      if (!event.attendees.includes(user.email)) {
        await base44.entities.CommunityEvent.update(eventId, {
          attendees: [...event.attendees, user.email]
        });
        loadEvents();
      }
    } catch (error) {
      console.error('Failed to join event:', error);
    }
  };

  const eventTypes = {
    live_broadcast: { label: 'Live Broadcast', icon: Radio },
    listening_party: { label: 'Listening Party', icon: Users },
    meet_greet: { label: 'Meet & Greet', icon: Users },
    workshop: { label: 'Workshop', icon: Calendar },
    concert: { label: 'Concert', icon: Radio }
  };

  return (
    <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-light text-white">Community Events</h2>
        </div>
        {isOwner && (
          <Button
            onClick={() => setShowCreate(!showCreate)}
            size="sm"
            className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>

      {showCreate && (
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <Input
            placeholder="Event title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
          <select
            value={newEvent.event_type}
            onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            {Object.entries(eventTypes).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <Input
            type="datetime-local"
            value={newEvent.start_time}
            onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
          <Button onClick={createEvent} className="w-full bg-cyan-400 hover:bg-cyan-500 text-black">
            Create Event
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-sm">
            No upcoming events
          </div>
        ) : (
          events.map((event) => {
            const EventIcon = eventTypes[event.event_type]?.icon || Calendar;
            return (
              <div
                key={event.id}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 hover:border-cyan-400/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-400/20 flex items-center justify-center">
                      <EventIcon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{event.title}</h3>
                      <p className="text-xs text-white/60">{eventTypes[event.event_type]?.label}</p>
                    </div>
                  </div>
                  <div className="text-xs text-white/40">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {event.attendees?.length || 0}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/60">
                    {format(new Date(event.start_time), 'MMM d, yyyy · h:mm a')}
                  </div>
                  {!isOwner && (
                    <Button
                      onClick={() => joinEvent(event.id)}
                      size="sm"
                      variant="outline"
                      className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
                    >
                      Join
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}