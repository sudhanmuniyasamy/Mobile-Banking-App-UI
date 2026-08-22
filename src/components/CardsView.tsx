import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Wifi,
  Globe,
  Smartphone,
  ShieldCheck,
  Plus,
  Sliders,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  KeyRound,
  RotateCw,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { BankCard } from '../types';

export const CardsView: React.FC = () => {
  const {
    cards,
    activeCardIndex,
    setActiveCardIndex,
    toggleFreezeCard,
    updateCardLimit,
    toggleCardFeature,
    formatCurrency,
    user,
  } = useBanking();

  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showSensitiveData, setShowSensitiveData] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isBiometricVerifying, setIsBiometricVerifying] = useState<boolean>(false);

  const activeCard = cards[activeCardIndex] || cards[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleToggleReveal = () => {
    if (!showSensitiveData) {
      setIsBiometricVerifying(true);
      setTimeout(() => {
        setIsBiometricVerifying(false);
        setShowSensitiveData(true);
      }, 700);
    } else {
      setShowSensitiveData(false);
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div id="cards-view-content" className="space-y-4 p-4 pb-8 text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Apex Card Management
          </h2>
          <p className="text-xs text-slate-500 font-medium">Physical & Virtual Titanium Cards</p>
        </div>
        <button
          onClick={handleToggleReveal}
          disabled={isBiometricVerifying}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shadow-2xs ${
            showSensitiveData
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {isBiometricVerifying ? (
            <span className="animate-spin text-slate-700">⟳</span>
          ) : showSensitiveData ? (
            <EyeOff className="w-3.5 h-3.5" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
          <span>{showSensitiveData ? 'Hide Details' : 'Reveal CVV/PIN'}</span>
        </button>
      </div>

      {/* Card Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => {
              setActiveCardIndex(idx);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              activeCardIndex === idx
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {card.tier === 'black_titanium' && '♠ Titanium Black'}
            {card.tier === 'emerald_elite' && '✦ Emerald Vault'}
            {card.tier === 'virtual_disposable' && '◈ Disposable Virtual'}
            {card.isFrozen && ' (Frozen)'}
          </button>
        ))}
      </div>

      {/* 3D Interactive Card Canvas */}
      <div className="relative perspective-1000 my-2">
        <div
          onClick={handleFlip}
          className={`relative w-full aspect-[1.586/1] rounded-3xl p-6 cursor-pointer transition-transform duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT OF CARD */}
          <div
            className={`absolute inset-0 w-full h-full rounded-3xl p-6 flex flex-col justify-between backface-hidden border bg-gradient-to-br transition-all duration-300 shadow-xl ${
              activeCard.colorGradient
            } ${
              activeCard.isFrozen
                ? 'opacity-60 grayscale filter backdrop-blur-md ring-2 ring-cyan-400'
                : ''
            }`}
          >
            {/* Frozen Overlay */}
            {activeCard.isFrozen && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center text-cyan-300 font-bold z-20">
                <Lock className="w-8 h-8 mb-1 animate-bounce" />
                <span className="text-xs uppercase tracking-widest">Card Locked & Frozen</span>
              </div>
            )}

            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-sm">APEX</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-300 bg-black/40 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  {activeCard.tier.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <Wifi className="w-5 h-5 text-slate-300 rotate-90" />
            </div>

            {/* Chip & EMV */}
            <div className="flex items-center gap-3 my-auto">
              <div className="w-11 h-8 rounded-lg bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-400 border border-amber-400/80 shadow-md flex items-center justify-center">
                <div className="w-7 h-5 border border-amber-600/40 rounded grid grid-cols-2" />
              </div>
              {activeCard.isVirtual && (
                <span className="text-[10px] font-bold text-cyan-200 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  Single-Use Tokenized
                </span>
              )}
            </div>

            {/* Card Number & Holder */}
            <div>
              <div className="text-lg sm:text-xl font-mono tracking-widest text-white font-semibold drop-shadow">
                {showSensitiveData ? activeCard.cardNumber : activeCard.maskedNumber}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-200 mt-3 pt-2 border-t border-white/10">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300 block font-medium">
                    Cardholder
                  </span>
                  <span className="font-semibold tracking-wider font-mono">
                    {activeCard.cardHolder}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300 block font-medium">
                    Expires
                  </span>
                  <span className="font-semibold font-mono">{activeCard.expiry}</span>
                </div>
                <div className="text-right">
                  <span className="font-black italic text-lg text-white">
                    {activeCard.network.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div
            className={`absolute inset-0 w-full h-full rounded-3xl p-6 flex flex-col justify-between backface-hidden rotate-y-180 border bg-gradient-to-br shadow-xl ${
              activeCard.colorGradient
            }`}
          >
            {/* Magnetic Stripe */}
            <div className="-mx-6 -mt-1 h-12 bg-black/90 border-y border-white/10 shadow-inner" />

            {/* CVV Box & Signature Panel */}
            <div className="my-auto space-y-2">
              <div className="bg-slate-200/95 rounded-lg p-2 flex items-center justify-between text-slate-950">
                <span className="text-[10px] font-mono italic text-slate-700 font-semibold">
                  AUTHORIZED SIGNATURE
                </span>
                <div className="bg-white px-2 py-0.5 rounded text-xs font-mono font-bold text-slate-900 border border-slate-300">
                  CVV: {showSensitiveData ? activeCard.cvv : '•••'}
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium">
                <span>Card PIN: {showSensitiveData ? activeCard.pin : '••••'}</span>
                <span>24/7 Concierge: +1 (800) 555-APEX</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-[9px] text-slate-300 text-center font-medium">
              Issued by Apex Private Banking N.A. Member FDIC. Tap card to flip back.
            </div>
          </div>
        </div>

        {/* Flip Hint */}
        <p className="text-[11px] text-slate-500 text-center mt-1 flex items-center justify-center gap-1 font-medium">
          <RotateCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Tap card to view {isFlipped ? 'front' : 'back & CVV'}</span>
        </p>
      </div>

      {/* Quick Freeze & Copy Card Details Controls */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => toggleFreezeCard(activeCard.id)}
          className={`py-3 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs ${
            activeCard.isFrozen
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
          }`}
        >
          {activeCard.isFrozen ? (
            <>
              <Unlock className="w-4 h-4 text-emerald-600" />
              <span>Unfreeze Card</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-slate-700" />
              <span>Freeze Card</span>
            </>
          )}
        </button>

        <button
          onClick={() => handleCopy(activeCard.cardNumber.replace(/\s/g, ''), 'pan')}
          className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs"
        >
          {copiedField === 'pan' ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Copied Number</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Copy Number</span>
            </>
          )}
        </button>
      </div>

      {/* Daily Spending Limit Slider */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-bold text-slate-900">Daily Spending Limit</span>
          </div>
          <span className="text-xs font-extrabold font-mono text-slate-900">
            {formatCurrency(activeCard.spendingLimitDaily)}
          </span>
        </div>

        <input
          type="range"
          min="500"
          max="20000"
          step="500"
          value={activeCard.spendingLimitDaily}
          onChange={(e) => updateCardLimit(activeCard.id, Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Spent today: {formatCurrency(activeCard.currentSpentToday)}</span>
          <span>
            Remaining:{' '}
            <strong className="text-slate-800 font-mono-num">
              {formatCurrency(
                Math.max(0, activeCard.spendingLimitDaily - activeCard.currentSpentToday)
              )}
            </strong>
          </span>
        </div>
      </div>

      {/* Security & Feature Controls */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Card Security Permissions
        </h3>

        {/* Contactless */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Wifi className="w-4 h-4 text-slate-500" />
            <div>
              <div className="text-xs font-bold text-slate-900">Contactless NFC</div>
              <div className="text-[10px] text-slate-500">Tap to pay on POS terminals</div>
            </div>
          </div>
          <button
            onClick={() => toggleCardFeature(activeCard.id, 'contactless')}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              activeCard.contactlessEnabled ? 'bg-slate-900' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                activeCard.contactlessEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Online Purchases */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-slate-500" />
            <div>
              <div className="text-xs font-bold text-slate-900">Online E-Commerce</div>
              <div className="text-[10px] text-slate-500">Web purchases & recurring subscriptions</div>
            </div>
          </div>
          <button
            onClick={() => toggleCardFeature(activeCard.id, 'online')}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              activeCard.onlinePurchasesEnabled ? 'bg-slate-900' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                activeCard.onlinePurchasesEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* International */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-slate-500" />
            <div>
              <div className="text-xs font-bold text-slate-900">International Transactions</div>
              <div className="text-[10px] text-slate-500">Foreign currency & travel billing</div>
            </div>
          </div>
          <button
            onClick={() => toggleCardFeature(activeCard.id, 'international')}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              activeCard.internationalEnabled ? 'bg-slate-900' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                activeCard.internationalEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
