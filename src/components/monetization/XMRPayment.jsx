import React, { useState } from 'react';
import { Copy, CheckCircle, ExternalLink, Shield, AlertCircle } from 'lucide-react';

/**
 * XMRPayment — Monero payment option component
 *
 * Displays the XMR address, amount (with 10% privacy discount applied),
 * a copy button, and a link to a block explorer.
 *
 * Props:
 *   productName   {string}  — e.g. "Creator Tier"
 *   usdPrice      {number}  — base price in USD
 *   xmrAddress    {string}  — your Monero wallet address
 *   onConfirm     {fn}      — called when user clicks "I've sent payment"
 */
export default function XMRPayment({ productName, usdPrice, xmrAddress, onConfirm }) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // 10% privacy discount for XMR payments
  const DISCOUNT_PCT = 10;
  const discountedUsd = (usdPrice * (1 - DISCOUNT_PCT / 100)).toFixed(2);

  // XMR/USD rate placeholder — in production fetch from CoinGecko
  const XMR_RATE_PLACEHOLDER = '~0.0063 XMR per USD';

  const copyAddress = () => {
    navigator.clipboard.writeText(xmrAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm?.({ method: 'XMR', productName, usdPrice: discountedUsd });
  };

  return (
    <div className="rounded-2xl border border-orange-400/30 bg-black/60 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        {/* XMR logo placeholder — orange circle with ɱ */}
        <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center flex-shrink-0">
          <span className="text-orange-400 font-bold text-lg">ɱ</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">Pay with Monero (XMR)</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-400/15 text-orange-400 border border-orange-400/30 font-mono">
              {DISCOUNT_PCT}% DISCOUNT
            </span>
          </div>
          <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
            <Shield className="h-3 w-3" /> Private · Fungible · Permissionless
          </p>
        </div>
      </div>

      {/* Pricing */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-white/50">{productName}</span>
          <span className="text-white/50 line-through">${usdPrice.toFixed(2)} USD</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-orange-400">XMR Price (after {DISCOUNT_PCT}% discount)</span>
          <span className="text-white">${discountedUsd} USD equivalent</span>
        </div>
        <div className="text-[10px] text-white/30 font-mono">{XMR_RATE_PLACEHOLDER} · Rate updates at checkout</div>
      </div>

      {/* Address */}
      <div>
        <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1.5 block">
          Send XMR to this address
        </label>
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2.5">
          <code className="text-xs text-orange-300 flex-1 break-all font-mono leading-relaxed">
            {xmrAddress}
          </code>
          <button
            type="button"
            onClick={copyAddress}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Copy XMR address"
          >
            {copied
              ? <CheckCircle className="h-4 w-4 text-lime-400" />
              : <Copy className="h-4 w-4 text-white/40" />
            }
          </button>
        </div>
      </div>

      {/* Important notes */}
      <div className="rounded-xl bg-orange-400/5 border border-orange-400/20 p-3 space-y-1.5">
        <div className="flex items-start gap-2 text-xs text-white/50">
          <AlertCircle className="h-3.5 w-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
          <span>You are responsible for all network transaction fees. The amount sent must cover the full discounted price after fees.</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-white/50">
          <AlertCircle className="h-3.5 w-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
          <span>Send <strong className="text-white/70">exact amount only</strong>. After sending, click the confirmation button below and include your transaction ID in the notes.</span>
        </div>
      </div>

      {/* Block explorer link */}
      <a
        href="https://xmrchain.net"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-orange-400/70 hover:text-orange-400 transition-colors"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Verify on XMR Block Explorer
      </a>

      {/* Confirm button */}
      {!confirmed ? (
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl bg-orange-500/20 border border-orange-400/40 text-orange-400 hover:bg-orange-500/30 text-sm font-medium transition-all"
        >
          I've Sent the Payment →
        </button>
      ) : (
        <div className="w-full py-3 rounded-xl bg-lime-400/10 border border-lime-400/30 text-lime-400 text-sm font-medium text-center flex items-center justify-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Payment Confirmation Received — We'll verify on-chain
        </div>
      )}
    </div>
  );
}
