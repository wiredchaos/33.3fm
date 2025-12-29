import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, X, Radio } from 'lucide-react';

export default function NeuroConcierge({ isActive, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const tour = [
    {
      title: "Welcome to 33.3FM DOGECHAIN",
      message: "I'm your NEURO CONCIERGE. Let me guide you through the WIRED CHAOS META broadcast universe. We'll explore all four environments in the CRAB 3DT TRINITY MODEL.",
      action: null,
    },
    {
      title: "Artist Profile Portal",
      message: "Your free 3D discovery space. Think of it as a next-gen link-in-bio with Liquid Glass aesthetics. Perfect for introducing your identity to the world.",
      action: { label: "Visit Artist Profile", page: "ArtistProfile" },
    },
    {
      title: "Podcast Booth",
      message: "Voice-first broadcast environment. Intimate, focused space for conversations, interviews, and live radio. Watch the waveforms react to your voice in real-time.",
      action: { label: "Enter Podcast Booth", page: "PodcastBooth" },
    },
    {
      title: "Recording Studio",
      message: "Where music creation happens. Split between vocal booth and control room. Notice the lime green pulse when you save—that's permanent inscription.",
      action: { label: "Open Recording Studio", page: "RecordingStudio" },
    },
    {
      title: "Broadcast Portal",
      message: "Your personal radio station. Always-on presence with live streaming, scheduled shows, and full creative control. This is your OTT channel in the metaverse.",
      action: { label: "Launch Broadcast Portal", page: "BroadcastPortal" },
    },
    {
      title: "Tour Complete",
      message: "You've seen all four environments. Each room serves a purpose in the CRAB model: Core identity, Room presence, Access control, and Broadcast state. Ready to build your station?",
      action: { label: "Start Building", page: "BroadcastPortal" },
    },
  ];

  useEffect(() => {
    if (!isActive) return;
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 1500);
    return () => clearTimeout(timer);
  }, [step, isActive]);

  if (!isActive) return null;

  const currentStep = tour[step];

  const handleNext = () => {
    if (step < tour.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handleAction = () => {
    if (currentStep.action) {
      navigate(createPageUrl(currentStep.action.page));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <div className="relative max-w-2xl w-full">
        {/* Concierge Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <Radio className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
          </div>
        </div>

        {/* Message Card */}
        <div className="backdrop-blur-md bg-black/60 border border-cyan-400/30 rounded-2xl p-8 shadow-2xl shadow-cyan-400/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-light text-cyan-400 uppercase tracking-wider">
                NEURO CONCIERGE
              </h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5 text-white/60" />
            </Button>
          </div>

          <h2 className="text-2xl font-light text-white mb-4 tracking-wide">
            {currentStep.title}
          </h2>

          <div className="relative min-h-[120px]">
            {isTyping ? (
              <div className="flex items-center gap-2 text-white/60">
                <span className="text-lg">Transmitting</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : (
              <p className="text-white/80 leading-relaxed">
                {currentStep.message}
              </p>
            )}
          </div>

          {/* Progress */}
          <div className="mt-6 flex items-center gap-2">
            {tour.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index === step ? 'bg-cyan-400' : index < step ? 'bg-cyan-400/50' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            {currentStep.action && (
              <Button
                onClick={handleAction}
                className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black"
              >
                {currentStep.action.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            <Button
              onClick={handleNext}
              variant={currentStep.action ? "outline" : "default"}
              className={currentStep.action ? "border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10" : "flex-1 bg-cyan-400 hover:bg-cyan-500 text-black"}
            >
              {step < tour.length - 1 ? "Next" : "Finish Tour"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Step Counter */}
        <div className="text-center mt-4 text-sm text-white/40">
          Step {step + 1} of {tour.length}
        </div>
      </div>
    </div>
  );
}