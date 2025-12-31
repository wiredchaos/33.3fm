import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Check, Eye, EyeOff } from 'lucide-react';

export default function WatermarkRemoval() {
  const [hasRemoved, setHasRemoved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const user = await base44.auth.me();
        const purchases = await base44.entities.Purchase.filter({ 
          user_email: user.email,
          item_name: 'Watermark Removal'
        });
        setHasRemoved(purchases.length > 0);
      } catch (error) {
        setHasRemoved(false);
      }
    };
    checkStatus();
  }, []);

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const user = await base44.auth.me();
      await base44.entities.Purchase.create({
        user_email: user.email,
        item_id: 'watermark_removal',
        item_name: 'Watermark Removal',
        amount_paid: 9.99,
        is_equipped: true
      });
      setHasRemoved(true);
      setIsOpen(false);
      window.location.reload(); // Refresh to remove watermark
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={`flex items-center gap-2 ${
            hasRemoved 
              ? 'border-green-400/50 text-green-400 hover:bg-green-400/10' 
              : 'border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10'
          }`}
        >
          {hasRemoved ? (
            <>
              <Check className="w-3 h-3" />
              <span className="text-xs">Watermark Removed</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3" />
              <span className="text-xs">Remove 3D Watermark</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-black/95 border-cyan-400/50 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-cyan-400">
            <Sparkles className="w-5 h-5" />
            Remove 33.3FM Watermark
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {hasRemoved ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-400/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Watermark Removed!</h3>
                <p className="text-sm text-white/60">
                  All 3D environments now display without the 33.3FM branding.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Current Experience</h4>
                    <p className="text-xs text-white/60">
                      All 3D rooms display the 33.3FM octane render watermark with animated glow effects.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <EyeOff className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Premium Experience</h4>
                    <p className="text-xs text-white/60">
                      Remove all watermarks for a clean, professional broadcast environment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/60">One-time payment</span>
                  <span className="text-2xl font-bold text-cyan-400">$9.99</span>
                </div>

                <Button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700 text-white"
                >
                  {isProcessing ? 'Processing...' : 'Remove Watermark'}
                </Button>

                <p className="text-xs text-white/40 text-center mt-3">
                  Applies to all 3D environments • Permanent removal
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}