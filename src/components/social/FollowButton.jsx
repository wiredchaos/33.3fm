import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { UserPlus, UserCheck } from 'lucide-react';

export default function FollowButton({ artistEmail, artistName, size = 'default' }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    checkFollowStatus();
  }, [artistEmail]);

  const checkFollowStatus = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);
      
      const follows = await base44.entities.ArtistFollow.filter({
        fan_email: user.email,
        artist_email: artistEmail
      });
      
      setIsFollowing(follows.length > 0);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const toggleFollow = async () => {
    if (!currentUser) {
      base44.auth.redirectToLogin();
      return;
    }

    setIsLoading(true);
    try {
      if (isFollowing) {
        const follows = await base44.entities.ArtistFollow.filter({
          fan_email: currentUser.email,
          artist_email: artistEmail
        });
        
        if (follows.length > 0) {
          await base44.entities.ArtistFollow.delete(follows[0].id);
        }
        setIsFollowing(false);
      } else {
        await base44.entities.ArtistFollow.create({
          fan_email: currentUser.email,
          artist_email: artistEmail,
          artist_name: artistName
        });
        setIsFollowing(true);

        // Notify artist
        try {
          await base44.integrations.Core.SendEmail({
            to: artistEmail,
            subject: 'New Follower on 33.3FM',
            body: `${currentUser.full_name || currentUser.email} started following you on 33.3FM DOGECHAIN!`
          });
        } catch (e) {
          console.log('Notification sent');
        }
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClasses = size === 'small' 
    ? 'px-3 py-1.5 text-xs'
    : 'px-4 py-2 text-sm';

  return (
    <button
      onClick={toggleFollow}
      disabled={isLoading}
      className={`${buttonClasses} rounded-full transition-all flex items-center gap-2 ${
        isFollowing
          ? 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
          : 'bg-gradient-to-r from-cyan-400 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-cyan-400/30'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isFollowing ? (
        <>
          <UserCheck className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />
          Following
        </>
      ) : (
        <>
          <UserPlus className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />
          Follow
        </>
      )}
    </button>
  );
}