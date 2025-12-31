import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Info, X } from 'lucide-react';

export default function InscriptionExplainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-30 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg hover:shadow-purple-500/50 transition-all group"
      >
        <Info className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4">
          <div className="relative max-w-2xl w-full backdrop-blur-xl bg-gradient-to-br from-black/95 to-purple-950/40 border-2 border-purple-500/50 rounded-2xl p-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-3xl font-light text-white mb-6">
              What is a Music Inscription?
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed">
              <div className="p-5 rounded-xl bg-white/5 border border-cyan-400/30">
                <h3 className="text-cyan-400 font-medium mb-2 text-lg">
                  NFTs point to music.
                </h3>
                <p className="text-sm">
                  Traditional NFTs store a link to your music file, which lives on someone else's server. 
                  If the server goes down, your music disappears.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30">
                <h3 className="text-purple-400 font-medium mb-2 text-lg">
                  Inscriptions ARE the music.
                </h3>
                <p className="text-sm">
                  On 33.3FM, your track isn't uploaded to a platform. It's written directly onto Dogechain, 
                  creating a permanent public record that can never be deleted or changed.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white font-medium mb-3">Why This Matters</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span><strong className="text-white">Permanent:</strong> Your music exists forever on the blockchain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span><strong className="text-white">Owned:</strong> You control it, not a platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span><strong className="text-white">Trustless:</strong> No servers to fail, no companies to shut down</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span><strong className="text-white">Public:</strong> Anyone can verify and play it, forever</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 text-xs text-white/40">
                No wallet complexity. No gas fees for listeners. Just permanent music infrastructure.
              </div>
            </div>

            <Button
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Got It
            </Button>
          </div>
        </div>
      )}
    </>
  );
}