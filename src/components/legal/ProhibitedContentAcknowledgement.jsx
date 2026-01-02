import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ProhibitedContentAcknowledgement({ onAccept, context = 'signup' }) {
  const [checkboxes, setCheckboxes] = useState({
    dmca: false,
    copyrighted: false,
    trademarks: false,
    torrents: false,
    miners: false,
    remoteDesktop: false,
    illegal: false,
    termination: false,
    responsibility: false
  });

  const allChecked = Object.values(checkboxes).every(v => v);

  const handleCheckbox = (key) => {
    setCheckboxes({ ...checkboxes, [key]: !checkboxes[key] });
  };

  const contextText = context === 'minting' 
    ? 'Before minting or deploying content'
    : 'Before creating your profile';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 overflow-y-auto">
      <div className="max-w-2xl w-full backdrop-blur-xl bg-black/90 border-2 border-red-500/50 rounded-2xl p-8 shadow-2xl shadow-red-500/30">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-red-500/30">
          <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-light text-white tracking-wide">PROHIBITED CONTENT POLICY</h2>
            <p className="text-sm text-red-400 mt-1">WIRED CHAOS META • Mandatory Acknowledgement</p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-white/90 leading-relaxed">
            <strong className="text-red-400">CRITICAL:</strong> Violations may result in immediate account termination without notice. 
            The absence of automated blocking does NOT constitute permission.
          </div>
        </div>

        {/* Context Text */}
        <div className="mb-6">
          <p className="text-white font-medium mb-4">{contextText}, you must affirm:</p>
          <p className="text-cyan-400 text-lg font-medium mb-4">"I will not upload, mint, or deploy any of the following:"</p>
        </div>

        {/* Prohibited Items Checklist */}
        <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-2">
          <label className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxes.dmca}
              onChange={() => handleCheckbox('dmca')}
              className="mt-0.5 w-4 h-4 accent-cyan-400"
            />
            <span className="text-sm text-white/90">DMCA-protected content I do not own or license</span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxes.copyrighted}
              onChange={() => handleCheckbox('copyrighted')}
              className="mt-0.5 w-4 h-4 accent-cyan-400"
            />
            <span className="text-sm text-white/90">Copyrighted music, film, TV content, or commercial sound recordings (including samples, stems, beats)</span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxes.trademarks}
              onChange={() => handleCheckbox('trademarks')}
              className="mt-0.5 w-4 h-4 accent-cyan-400"
            />
            <span className="text-sm text-white/90">Brand logos, trademarks, or trade dress without authorization</span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxes.torrents}
              onChange={() => handleCheckbox('torrents')}
              className="mt-0.5 w-4 h-4 accent-cyan-400"
            />
            <span className="text-sm text-white/90">Torrent aggregators, mirrors, scraping systems, or indexing tools</span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxes.miners}
              onChange={() => handleCheckbox('miners')}
              className="mt-0.5 w-4 h-4 accent-cyan-400"
            />
            <span className="text-sm text-white/90">Crypto mining or resource-abuse systems</span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxes.remoteDesktop}
              onChange={() => handleCheckbox('remoteDesktop')}
              className="mt-0.5 w-4 h-4 accent-cyan-400"
            />
            <span className="text-sm text-white/90">Virtual desktops, VNC, or remote control environments</span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxes.illegal}
              onChange={() => handleCheckbox('illegal')}
              className="mt-0.5 w-4 h-4 accent-cyan-400"
            />
            <span className="text-sm text-white/90">Anything illegal, deceptive, or infringing under applicable law</span>
          </label>

          <div className="my-4 border-t border-white/10" />

          <label className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 hover:border-red-500/50 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxes.termination}
              onChange={() => handleCheckbox('termination')}
              className="mt-0.5 w-4 h-4 accent-red-400"
            />
            <span className="text-sm text-white/90"><strong className="text-red-400">I understand</strong> violations may result in permanent account termination</span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 hover:border-red-500/50 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxes.responsibility}
              onChange={() => handleCheckbox('responsibility')}
              className="mt-0.5 w-4 h-4 accent-red-400"
            />
            <span className="text-sm text-white/90"><strong className="text-red-400">I accept</strong> full legal responsibility for all uploaded or minted content</span>
          </label>
        </div>

        {/* Legal Fine Print */}
        <div className="mb-6 p-4 rounded-lg bg-black/60 border border-white/10 text-xs text-white/60 leading-relaxed">
          <p className="mb-2"><strong className="text-white/80">No Assumed Permission:</strong> Platform availability, AI tools, or system behavior does NOT constitute legal clearance.</p>
          <p className="mb-2"><strong className="text-white/80">Minting Liability:</strong> WIRED CHAOS META does not verify ownership, sync rights, master rights, performance rights, or distribution rights.</p>
          <p><strong className="text-white/80">Enforcement:</strong> We reserve the right to immediately suspend accounts, remove content, and revoke access without notice.</p>
        </div>

        {/* Action Button */}
        <Button
          onClick={onAccept}
          disabled={!allChecked}
          className={`w-full py-4 text-base uppercase tracking-wider transition-all ${
            allChecked 
              ? 'bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700 text-white' 
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          {allChecked ? '✓ I Acknowledge & Accept' : 'Check All Boxes to Continue'}
        </Button>

        <div className="mt-4 text-center text-xs text-white/40">
          Policy ID: WC-PROHIBITED-001 • Effective: 2026-01-02
        </div>
      </div>
    </div>
  );
}