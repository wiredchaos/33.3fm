import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Twitter, Mail, Wallet } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SocialAuth({ onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      // OAuth flow - open popup window
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      // Simulate OAuth popup (in production, this would redirect to provider OAuth)
      const popup = window.open(
        `https://oauth-provider.com/${provider}/authorize`,
        'OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Simulate OAuth response with profile data
      setTimeout(async () => {
        popup?.close();
        
        const mockProfileData = {
          twitter: { name: 'Artist Name', username: '@artistname', bio: 'Electronic Music Producer', followers: 12500, avatar: 'https://i.pravatar.cc/150?img=33' },
          github: { name: 'Developer Name', username: 'devname', bio: 'Full Stack Developer', repos: 87, avatar: 'https://i.pravatar.cc/150?img=12' },
          google: { name: 'User Name', email: 'user@gmail.com', avatar: 'https://i.pravatar.cc/150?img=68' }
        };

        const profileData = mockProfileData[provider] || {};
        
        const user = await base44.auth.me();
        await base44.auth.updateMe({
          social_connected: provider,
          social_profile: profileData,
          imported_bio: profileData.bio || user.imported_bio,
          imported_avatar: profileData.avatar || user.imported_avatar,
          imported_name: profileData.name || user.imported_name,
        });
        
        if (onSuccess) onSuccess(profileData);
      }, 2000);
      
    } catch (error) {
      console.error('Social login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    setIsLoading(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        const address = accounts[0];
        setWalletAddress(address);

        // Fetch NFT metadata (read-only)
        const nftData = await fetchNFTProfile(address);
        
        const user = await base44.auth.me();
        await base44.auth.updateMe({
          wallet_address: address,
          nft_pfp: nftData?.image || null,
          nft_metadata: nftData || null
        });

        if (onSuccess) onSuccess({ wallet: address, nft: nftData });
      } else {
        alert('Please install MetaMask or another Web3 wallet');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNFTProfile = async (address) => {
    // Simplified NFT fetch - in production, use OpenSea API or similar
    try {
      const response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${address}&limit=1`);
      const data = await response.json();
      if (data.assets && data.assets.length > 0) {
        return {
          image: data.assets[0].image_url,
          name: data.assets[0].name,
          collection: data.assets[0].collection.name
        };
      }
      return null;
    } catch (error) {
      console.error('NFT fetch failed:', error);
      return null;
    }
  };

  return (
    <div className="backdrop-blur-xl bg-black/80 border border-cyan-400/30 rounded-2xl p-6 w-full max-w-md">
      <h2 className="text-2xl font-light text-white mb-6 text-center">
        Connect Your Profile
      </h2>

      <div className="space-y-3">
        <Button
          onClick={() => handleSocialLogin('twitter')}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white"
        >
          <Twitter className="w-4 h-4 mr-2" />
          Connect Twitter
        </Button>

        <Button
          onClick={() => handleSocialLogin('github')}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white"
        >
          <Github className="w-4 h-4 mr-2" />
          Connect GitHub
        </Button>

        <Button
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
          className="w-full bg-white hover:bg-gray-100 text-black"
        >
          <Mail className="w-4 h-4 mr-2" />
          Connect Google
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-white/40">Or connect wallet</span>
          </div>
        </div>

        <Button
          onClick={handleWalletConnect}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Crypto Wallet (NFT PFP)
        </Button>

        {walletAddress && (
          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-cyan-400/30">
            <div className="text-xs text-white/60 mb-1">Connected Wallet</div>
            <div className="text-xs text-cyan-400 font-mono">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-white/40 text-center">
        Read-only access • No transactions required
      </div>
    </div>
  );
}