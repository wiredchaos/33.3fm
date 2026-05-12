import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Crown, CreditCard, CheckCircle } from 'lucide-react';
import SubscriptionTiers from '@/components/monetization/SubscriptionTiers';
import XMRPayment from '@/components/monetization/XMRPayment';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

const TIERS = [
  {
    id: 'creator',
    name: 'Creator',
    price: 9.99,
    color: 'text-purple-400',
    border: 'border-purple-400/30',
    features: ['Signal Booth recording', 'AI presets (4)', 'Broadcast Portal', '5 stations'],
  },
  {
    id: 'producer',
    name: 'Producer',
    price: 24.99,
    color: 'text-orange-400',
    border: 'border-orange-400/30',
    features: ['Everything in Creator', 'Mix Room (16 tracks)', 'Gesture Studio', 'NFT Minting'],
  },
  {
    id: 'syndicate',
    name: 'Syndicate',
    price: 49.99,
    color: 'text-lime-400',
    border: 'border-lime-400/30',
    features: ['Everything in Producer', 'Unlimited NFT minting', 'Revenue splits', 'Priority support'],
  },
];

const XMR_WALLET_ADDRESS =
  '4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx3skxNgYeYTRj5UzqtReoS44qo9mtmXCqY45DJ852K2Chc2MVXWz';

export default function Subscription() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showPayment, setShowPayment] = useState(false);

  const openXMR = (tier) => {
    setSelectedTier(tier);
    setPaymentMethod('xmr');
    setShowPayment(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCard = (tier) => {
    setSelectedTier(tier);
    setPaymentMethod('card');
    setShowPayment(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full min-h-screen overflow-y-auto bg-black circuit-pattern">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between backdrop-blur-xl bg-black/60 border-b border-red-500/30">
        <Link
          to={createPageUrl('Home')}
          className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm uppercase tracking-wider hidden sm:inline">Back</span>
        </Link>
        <div className="flex items-center gap-3">
          <Crown className="w-5 h-5 text-red-400" />
          <h1 className="text-lg font-light text-white tracking-wide">Subscription Plans</h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-400/10 border border-orange-400/30 text-orange-400 text-xs font-mono">
          <span className="font-bold">ɱ</span>
          <span className="hidden sm:inline">10% XMR Discount</span>
        </div>
      </div>

      <div className="pt-20 pb-20">
        {/* Payment modal */}
        {showPayment && selectedTier && (
          <div className="max-w-lg mx-auto px-4 mb-10">
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">
                  {selectedTier.name} Plan
                  <span className="ml-2 text-sm font-normal text-white/40">${selectedTier.price}/mo</span>
                </h2>
                <button type="button" onClick={() => setShowPayment(false)} className="text-white/40 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="flex gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all ${paymentMethod === 'card' ? 'bg-white/10 border border-white/30 text-white' : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'}`}
                >
                  <CreditCard className="h-4 w-4" /> Card / Stripe
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('xmr')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all ${paymentMethod === 'xmr' ? 'bg-orange-400/15 border border-orange-400/40 text-orange-400' : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'}`}
                >
                  <span className="font-bold">ɱ</span> XMR <span className="text-[10px] ml-1 text-lime-400">-10%</span>
                </button>
              </div>
              {paymentMethod === 'card' && (
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center text-white/50 text-sm">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-white/20" />
                  Connect your Stripe account in the Base44 dashboard to enable card payments.
                </div>
              )}
              {paymentMethod === 'xmr' && (
                <XMRPayment
                  productName={`${selectedTier.name} Tier — Monthly`}
                  usdPrice={selectedTier.price}
                  xmrAddress={XMR_WALLET_ADDRESS}
                  onConfirm={() => setShowPayment(false)}
                />
              )}
            </div>
          </div>
        )}

        {/* Tier cards */}
        <div className="max-w-5xl mx-auto px-4 mb-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight mb-3">
              Choose Your <span className="text-red-400">Tier</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              From free discovery to premium broadcast infrastructure.
              Save <strong className="text-orange-400">10%</strong> by paying with Monero (XMR).
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {TIERS.map((tier) => (
              <div key={tier.id} className={`glass-panel rounded-2xl p-6 border ${tier.border} hover:neon-glow-cyan transition-all`}>
                <div className={`text-2xl font-bold ${tier.color} mb-1`}>{tier.name}</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-light text-white">${tier.price}</span>
                  <span className="text-white/40 text-sm">/mo</span>
                  <span className="ml-2 text-xs text-orange-400 font-mono">or ${(tier.price * 0.9).toFixed(2)} XMR</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                      <CheckCircle className="h-4 w-4 text-lime-400 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <div className="space-y-2">
                  <button type="button" onClick={() => openCard(tier)} className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all bg-gradient-to-r from-white/10 to-white/5 border ${tier.border} ${tier.color} hover:bg-white/15`}>
                    Subscribe
                  </button>
                  <button type="button" onClick={() => openXMR(tier)} className="w-full py-2 rounded-xl text-xs font-mono transition-all bg-orange-400/10 border border-orange-400/30 text-orange-400 hover:bg-orange-400/20 flex items-center justify-center gap-1.5">
                    <span className="font-bold">ɱ</span> Pay with XMR (10% off)
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* XMR info banner */}
          <div className="rounded-2xl bg-orange-400/5 border border-orange-400/20 p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-400 font-bold text-2xl">ɱ</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Why pay with Monero?</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Monero (XMR) is a privacy-first, fungible cryptocurrency. Payments are untraceable and unlinkable.
                We offer a <strong className="text-orange-400">10% discount</strong> on all subscriptions paid in XMR.
                You are responsible for all network transaction fees — ensure the amount sent covers the full discounted price after fees are deducted.
              </p>
            </div>
          </div>
        </div>

        {/* Original SubscriptionTiers component */}
        <ContainerScroll
          titleComponent={
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-light text-white/60 tracking-tight">Full Feature Comparison</h2>
            </div>
          }
        >
          <div className="w-full h-full bg-gradient-to-br from-black via-red-950/20 to-black p-8">
            <SubscriptionTiers />
          </div>
        </ContainerScroll>
      </div>
    </div>
  );
}
