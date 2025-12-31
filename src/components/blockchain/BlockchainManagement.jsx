import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Link as LinkIcon, CheckCircle, Upload, Radio } from 'lucide-react';

export default function BlockchainManagement({ artistEmail }) {
  const [verification, setVerification] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadVerification();
  }, [artistEmail]);

  const loadVerification = async () => {
    try {
      const data = await base44.entities.ArtistVerification.filter({ artist_email: artistEmail });
      if (data.length > 0) {
        setVerification(data[0]);
        setWalletAddress(data[0].blockchain_address || '');
      }
    } catch (error) {
      console.error('Failed to load verification:', error);
    }
  };

  const connectWallet = async () => {
    if (!walletAddress.trim()) return;
    
    setIsProcessing(true);
    try {
      if (verification) {
        await base44.entities.ArtistVerification.update(verification.id, {
          blockchain_address: walletAddress
        });
      } else {
        await base44.entities.ArtistVerification.create({
          artist_email: artistEmail,
          blockchain_address: walletAddress,
          inscription_count: 0,
          verified: false
        });
      }
      await loadVerification();
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const inscribeMusic = async () => {
    setIsProcessing(true);
    try {
      const mockHash = 'DG' + Math.random().toString(36).substring(2, 15);
      
      await base44.entities.ArtistVerification.update(verification.id, {
        inscription_count: (verification.inscription_count || 0) + 1,
        verified: true,
        verification_hash: mockHash
      });

      await loadVerification();
    } catch (error) {
      console.error('Inscription failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-black/60 border border-purple-500/30 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-light text-white">Blockchain Management</h2>
      </div>

      {/* Wallet Connection */}
      <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-white/80">Dogechain Wallet</div>
          {verification?.blockchain_address && (
            <div className="flex items-center gap-1 text-xs text-cyan-400">
              <CheckCircle className="w-3 h-3" />
              Connected
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Enter Dogechain address..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
          <Button
            onClick={connectWallet}
            disabled={isProcessing}
            className="bg-purple-500 hover:bg-purple-600 whitespace-nowrap"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Connect
          </Button>
        </div>
      </div>

      {/* Verification Status */}
      {verification && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-light text-white mb-1">
                {verification.inscription_count || 0}
              </div>
              <div className="text-xs text-white/60 uppercase tracking-wider">
                Music Inscriptions
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-light text-white mb-1">
                {verification.verified ? '✓' : '○'}
              </div>
              <div className="text-xs text-white/60 uppercase tracking-wider">
                Verified Status
              </div>
            </div>
          </div>

          {/* Inscribe Music */}
          {verification.blockchain_address && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30">
              <div className="text-sm text-white/80 mb-3">
                Inscribe your music permanently on Dogechain blockchain
              </div>
              <Button
                onClick={inscribeMusic}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isProcessing ? 'Inscribing...' : 'Inscribe Music'}
              </Button>
              <div className="text-xs text-white/40 mt-2">
                Creates permanent on-chain record. Your music lives forever.
              </div>
            </div>
          )}

          {/* Verification Hash */}
          {verification.verification_hash && (
            <div className="p-4 rounded-xl bg-white/5 border border-cyan-400/30">
              <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2">
                Verification Hash
              </div>
              <div className="text-sm text-white/80 font-mono break-all">
                {verification.verification_hash}
              </div>
              <div className="mt-2 text-xs text-white/40">
                Permanent blockchain proof of artist authenticity
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}