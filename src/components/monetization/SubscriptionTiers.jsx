import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Check, Zap, Crown, Sparkles } from 'lucide-react';

export default function SubscriptionTiers({ currentTier = 'free' }) {
  const [loading, setLoading] = useState(null);

  const tiers = [
    {
      name: 'Free',
      id: 'free',
      price: 0,
      icon: Sparkles,
      color: 'from-white/10 to-white/5',
      features: [
        'Artist Profile access',
        'Basic chat features',
        'Public broadcasts viewing',
        'Limited storage'
      ]
    },
    {
      name: 'Artist',
      id: 'artist',
      price: 9.99,
      icon: Zap,
      color: 'from-cyan-400 to-cyan-600',
      features: [
        'Recording Studio access',
        'Podcast Booth access',
        'Priority chat badges',
        '10GB storage',
        'Custom branding'
      ]
    },
    {
      name: 'Broadcaster',
      id: 'broadcaster',
      price: 29.99,
      icon: Crown,
      color: 'from-red-500 to-red-700',
      popular: true,
      features: [
        'Full Broadcast Portal',
        'Live streaming capabilities',
        'DJ Red Fang priority support',
        'Unlimited storage',
        'Analytics dashboard',
        'Monetization features'
      ]
    },
    {
      name: 'VIP',
      id: 'vip',
      price: 99.99,
      icon: Crown,
      color: 'from-red-500 via-cyan-400 to-red-500',
      features: [
        'All Broadcaster features',
        'White-label options',
        'API access',
        'Priority support 24/7',
        'Custom integrations',
        'Revenue sharing'
      ]
    }
  ];

  const handleSubscribe = async (tier) => {
    setLoading(tier.id);
    try {
      const user = await base44.auth.me();
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await base44.entities.Subscription.create({
        user_email: user.email,
        tier: tier.id,
        status: 'active',
        expires_at: expiresAt.toISOString(),
        auto_renew: true
      });
      
      // Reload to show new tier
      window.location.reload();
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {tiers.map((tier) => (
        <div
          key={tier.id}
          className={`relative backdrop-blur-xl bg-black/60 border-2 rounded-2xl p-6 transition-all hover:scale-105 ${
            tier.popular 
              ? 'border-red-500 shadow-2xl shadow-red-500/30' 
              : 'border-white/10'
          } ${currentTier === tier.id ? 'ring-2 ring-cyan-400' : ''}`}
        >
          {tier.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-red-500 to-cyan-400 text-white text-xs uppercase tracking-wider">
              Most Popular
            </div>
          )}

          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
            <tier.icon className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl font-light text-white mb-2">{tier.name}</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-white">${tier.price}</span>
            <span className="text-white/40">/month</span>
          </div>

          <ul className="space-y-3 mb-6">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={() => handleSubscribe(tier)}
            disabled={loading === tier.id || currentTier === tier.id}
            className={`w-full ${
              currentTier === tier.id
                ? 'bg-white/10 text-white/60 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-cyan-400 hover:from-red-600 hover:to-cyan-500 text-white'
            }`}
          >
            {loading === tier.id ? 'Processing...' : currentTier === tier.id ? 'Current Plan' : 'Subscribe'}
          </Button>
        </div>
      ))}
    </div>
  );
}