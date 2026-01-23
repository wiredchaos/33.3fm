import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import NFTMuseum from '@/components/museum/NFTMuseum';

export default function NFTMuseumPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <NFTMuseum />
      
      {/* Back Button */}
      <Link 
        to={createPageUrl('Home')}
        className="fixed top-6 left-6 z-20 backdrop-blur-xl bg-black/60 border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 text-white/60 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wider">Back</span>
      </Link>
    </div>
  );
}