import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { DollarSign, Heart, Zap, Star } from 'lucide-react';

export default function TipButton({ recipientEmail, recipientName, room }) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [open, setOpen] = useState(false);

  const quickAmounts = [
    { amount: 5, icon: Heart, color: 'from-pink-500 to-red-500' },
    { amount: 10, icon: Zap, color: 'from-cyan-400 to-cyan-600' },
    { amount: 25, icon: Star, color: 'from-red-500 to-red-700' },
  ];

  const handleTip = async (tipAmount) => {
    setIsSending(true);
    try {
      const user = await base44.auth.me();
      await base44.entities.Tip.create({
        from_user: user.email,
        to_user: recipientEmail,
        amount: parseFloat(tipAmount),
        message: message,
        room: room
      });
      setOpen(false);
      setAmount('');
      setMessage('');
      // Show success message
    } catch (error) {
      console.error('Tip failed:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gradient-to-r from-red-500 to-cyan-400 hover:from-red-600 hover:to-cyan-500 text-white"
        >
          <DollarSign className="w-4 h-4 mr-1" />
          Tip
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 border-2 border-red-500/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-light tracking-wide">
            Tip {recipientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Amounts */}
          <div className="grid grid-cols-3 gap-3">
            {quickAmounts.map((quick) => (
              <button
                key={quick.amount}
                onClick={() => handleTip(quick.amount)}
                disabled={isSending}
                className={`p-4 rounded-xl bg-gradient-to-br ${quick.color} hover:opacity-90 transition-all text-white`}
              >
                <quick.icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-lg font-bold">${quick.amount}</div>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">Custom Amount</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">Message (Optional)</label>
            <Input
              placeholder="Say something nice..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Send Custom */}
          {amount && (
            <Button
              onClick={() => handleTip(amount)}
              disabled={isSending}
              className="w-full bg-gradient-to-r from-red-500 to-cyan-400 hover:from-red-600 hover:to-cyan-500"
            >
              {isSending ? 'Sending...' : `Send $${amount} Tip`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}