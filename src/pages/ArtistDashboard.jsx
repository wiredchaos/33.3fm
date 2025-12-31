import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import ArtistAnalytics from '@/components/analytics/ArtistAnalytics';
import CommunityEvents from '@/components/events/CommunityEvents';
import MusicDiscovery from '@/components/ai/MusicDiscovery';

export default function ArtistDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      base44.auth.redirectToLogin();
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="backdrop-blur-xl bg-black/60 border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to={createPageUrl('Home')}
              className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wider">Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h1 className="text-xl font-light">Artist Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <ArtistAnalytics artistEmail={user.email} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CommunityEvents artistEmail={user.email} isOwner={true} />
          <MusicDiscovery />
        </div>
      </div>
    </div>
  );
}