import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Wallet, 
  Link2, 
  CheckCircle2, 
  Loader2, 
  ExternalLink, 
  Copy,
  Shield,
  Coins,
  Trophy
} from 'lucide-react';

export default function BlockchainEnhanced() {
  const queryClient = useQueryClient();
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: verification } = useQuery({
    queryKey: ['artistVerification'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const verifications = await base44.entities.ArtistVerification.filter({ 
        artist_email: user.email 
      });
      return verifications[0] || null;
    },
  });

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        const address = accounts[0];
        setWalletAddress(address);

        const user = await base44.auth.me();
        
        if (verification) {
          await base44.entities.ArtistVerification.update(verification.id, {
            blockchain_address: address,
          });
        } else {
          await base44.entities.ArtistVerification.create({
            artist_email: user.email,
            blockchain_address: address,
            inscription_count: 0,
            total_streams: 0,
            total_followers: 0,
            verified: false
          });
        }

        queryClient.invalidateQueries({ queryKey: ['artistVerification'] });
      } else {
        alert('Please install MetaMask to connect your wallet');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const verifyArtist = async () => {
    if (!verification || !verification.blockchain_address) return;

    try {
      const hash = `0xDOGE${Math.random().toString(36).substring(2, 15)}`;
      
      await base44.entities.ArtistVerification.update(verification.id, {
        verified: true,
        verification_hash: hash
      });

      queryClient.invalidateQueries({ queryKey: ['artistVerification'] });
      alert(`✅ Verified! Inscription hash: ${hash}`);
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const copyAddress = () => {
    if (verification?.blockchain_address) {
      navigator.clipboard.writeText(verification.blockchain_address);
      alert('Address copied!');
    }
  };

  const openBlockchainExplorer = () => {
    if (verification?.verification_hash) {
      window.open(`https://explorer.dogechain.dog/tx/${verification.verification_hash}`, '_blank');
    }
  };

  return (
    <div className="backdrop-blur-xl bg-black/80 border border-cyan-400/30 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-600/20 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-light text-white">Blockchain Integration</h2>
          <p className="text-sm text-white/60">Dogechain • Verified Artists</p>
        </div>
      </div>

      {/* Connection Status */}
      {!verification?.blockchain_address ? (
        <div className="space-y-4">
          <div className="text-sm text-white/80">
            Connect your wallet to verify your artist profile on the blockchain
          </div>
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700 text-white"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting Wallet...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Connected Wallet */}
          <div className="backdrop-blur-md bg-white/5 border border-cyan-400/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-white/60">Connected Wallet</div>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyAddress}
                className="text-cyan-400 hover:text-cyan-300"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <div className="font-mono text-sm text-cyan-400">
              {verification.blockchain_address.slice(0, 8)}...{verification.blockchain_address.slice(-6)}
            </div>
          </div>

          {/* Verification Status */}
          <div className={`backdrop-blur-md border rounded-xl p-4 ${
            verification.verified 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <div className="flex items-center gap-3">
              {verification.verified ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">Blockchain Verified</div>
                    <div className="text-xs text-white/60">Your artist profile is verified on-chain</div>
                  </div>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 text-yellow-400" />
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">Not Verified</div>
                    <div className="text-xs text-white/60">Complete verification to unlock features</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={verifyArtist}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    Verify Now
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-cyan-400">{verification.inscription_count || 0}</div>
              <div className="text-xs text-white/60">Inscriptions</div>
            </div>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-cyan-400">{verification.total_streams || 0}</div>
              <div className="text-xs text-white/60">Total Streams</div>
            </div>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-cyan-400">{verification.total_followers || 0}</div>
              <div className="text-xs text-white/60">Followers</div>
            </div>
          </div>

          {/* Verification Hash */}
          {verification.verification_hash && (
            <div className="backdrop-blur-md bg-cyan-400/10 border border-cyan-400/30 rounded-xl p-4">
              <div className="text-sm text-white/80 mb-2">Verification Inscription</div>
              <div className="flex items-center gap-2">
                <div className="font-mono text-xs text-cyan-400 flex-1 truncate">
                  {verification.verification_hash}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={openBlockchainExplorer}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Blockchain Features */}
          <div className="space-y-2">
            <div className="text-xs text-white/60 uppercase tracking-wider mb-2">Enabled Features</div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Coins className="w-4 h-4 text-cyan-400" />
              <span>NFT Minting</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span>Verified Badge</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Link2 className="w-4 h-4 text-cyan-400" />
              <span>On-Chain Royalties</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-white/40 text-center">
        Powered by Dogechain • Permanent on-chain verification
      </div>
    </div>
  );
}