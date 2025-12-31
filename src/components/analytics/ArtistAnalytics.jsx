import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Users, Heart, Radio, DollarSign, Activity } from 'lucide-react';

export default function ArtistAnalytics({ artistEmail }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [artistEmail]);

  const loadAnalytics = async () => {
    try {
      const [followers, interactions, tips, verification] = await Promise.all([
        base44.entities.ArtistFollow.filter({ artist_email: artistEmail }),
        base44.entities.FanInteraction.filter({ artist_email: artistEmail }),
        base44.entities.Tip.filter({ to_user: artistEmail }),
        base44.entities.ArtistVerification.filter({ artist_email: artistEmail })
      ]);

      const totalRevenue = tips.reduce((sum, tip) => sum + tip.amount, 0);
      const avgEngagement = interactions.length / Math.max(followers.length, 1);

      setStats({
        followers: followers.length,
        interactions: interactions.length,
        revenue: totalRevenue,
        engagement: avgEngagement.toFixed(1),
        inscriptions: verification[0]?.inscription_count || 0,
        verified: verification[0]?.verified || false
      });
    } catch (error) {
      console.error('Analytics failed:', error);
      setStats({ followers: 0, interactions: 0, revenue: 0, engagement: 0, inscriptions: 0, verified: false });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-2xl p-6">
        <div className="animate-pulse text-white/40">Loading analytics...</div>
      </div>
    );
  }

  const metrics = [
    { label: 'Followers', value: stats.followers, icon: Users, color: 'cyan' },
    { label: 'Interactions', value: stats.interactions, icon: Heart, color: 'purple' },
    { label: 'Engagement', value: stats.engagement + 'x', icon: Activity, color: 'pink' },
    { label: 'Revenue', value: '$' + stats.revenue, icon: DollarSign, color: 'lime' },
    { label: 'Inscriptions', value: stats.inscriptions, icon: Radio, color: 'orange' }
  ];

  return (
    <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-light text-white">Artist Analytics</h2>
        </div>
        {stats.verified && (
          <div className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400 text-xs uppercase tracking-wider border border-cyan-400/30">
            ✓ Blockchain Verified
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 hover:border-cyan-400/50 transition-all"
          >
            <div className={`w-10 h-10 rounded-lg bg-${metric.color}-400/20 flex items-center justify-center mb-3`}>
              <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
            </div>
            <div className="text-2xl font-light text-white mb-1">{metric.value}</div>
            <div className="text-xs text-white/60 uppercase tracking-wider">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="text-xs text-white/60 uppercase tracking-wider mb-2">Blockchain Status</div>
        <div className="text-sm text-white/80">
          {stats.verified 
            ? `Verified artist with ${stats.inscriptions} permanent music inscriptions on Dogechain`
            : 'Not yet verified. Inscribe your music to become blockchain verified.'}
        </div>
      </div>
    </div>
  );
}