import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Crown } from 'lucide-react';
import SubscriptionTiers from '@/components/monetization/SubscriptionTiers';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

export default function Subscription() {
  return (
    <div className="relative w-full min-h-screen overflow-y-auto bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 p-6 flex items-center justify-between backdrop-blur-md bg-black/40 border-b border-red-500/30">
        <Link 
          to={createPageUrl('Home')}
          className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm uppercase tracking-wider">Back</span>
        </Link>

        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-red-400" />
          <h1 className="text-2xl font-light text-white tracking-wide">Subscription Plans</h1>
        </div>
      </div>

      <ContainerScroll
        titleComponent={
          <div className="text-center space-y-4 mt-20">
            <h2 className="text-5xl md:text-7xl font-light text-white tracking-tight">
              Choose Your <span className="text-red-400">Tier</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              From free discovery to premium broadcast infrastructure
            </p>
          </div>
        }
      >
        <div className="w-full h-full bg-gradient-to-br from-black via-red-950/20 to-black p-8">
          <SubscriptionTiers />
        </div>
      </ContainerScroll>
    </div>
  );
}