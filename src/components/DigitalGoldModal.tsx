import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Coins,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const DigitalGoldModal: React.FC = () => {
  const {
    isGoldModalOpen,
    setIsGoldModalOpen,
    digitalGold,
    accounts,
    buyDigitalGold,
    formatCurrency,
  } = useBanking();

  const [buyAmount, setBuyAmount] = useState<number>(5000);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isGoldModalOpen) return null;

  const gramsCalculated = Math.round((buyAmount / digitalGold.livePricePerGram) * 1000) / 1000;
  const selectedAcc = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const handleBuyGold = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (buyAmount < 100) {
      setErrorMessage('Minimum purchase amount is ₹100.');
      return;
    }

    if (selectedAcc.balance < buyAmount) {
      setErrorMessage(
        `Insufficient funds in ${selectedAcc.name}. Available: ${formatCurrency(selectedAcc.balance)}`
      );
      return;
    }

    const ok = buyDigitalGold({
      amount: buyAmount,
      sourceAccountId: selectedAcc.id,
    });

    if (ok) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsGoldModalOpen(false);
      }, 2000);
    } else {
      setErrorMessage('Failed to purchase gold. Please try again.');
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center p-0 bg-black/60 backdrop-blur-xs transition-opacity overflow-hidden">
      <div
        id="digital-gold-modal"
        className="w-full bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 overflow-hidden flex flex-col max-h-[90%] animate-in slide-in-from-bottom-5 duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-amber-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shadow-md">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">
                24K 99.99% Digital Gold
              </h3>
              <p className="text-xs text-amber-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> MMTC-PAMP Insured Locker
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGoldModalOpen(false)}
            className="w-8 h-8 rounded-full bg-amber-900 hover:bg-amber-800 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {isSuccess ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Gold Added to Vault!
              </h4>
              <p className="text-xs text-slate-600">
                {gramsCalculated}g of 24K Gold added to your locker.
              </p>
            </div>
          ) : (
            <>
              {/* Vault Overview */}
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                    Your Gold Locker
                  </span>
                  <div className="text-xl font-black text-amber-950 font-mono-num">
                    {digitalGold.grams} grams
                  </div>
                  <div className="text-xs text-amber-700 font-semibold font-mono-num">
                    ≈ {formatCurrency(digitalGold.totalValue)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500">Live Rate / gram</span>
                  <div className="text-sm font-extrabold text-amber-900 font-mono-num">
                    ₹{digitalGold.livePricePerGram.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleBuyGold} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Buy Gold Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="500"
                    min="100"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base font-extrabold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono-num"
                  />
                  <div className="flex gap-1.5 mt-2">
                    {[1000, 2500, 5000, 10000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setBuyAmount(amt)}
                        className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        ₹{(amt / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Debit From Account
                  </label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({formatCurrency(acc.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-amber-950 text-white rounded-xl flex items-center justify-between text-xs">
                  <span className="text-amber-300">You will receive:</span>
                  <span className="font-bold text-sm font-mono-num text-amber-200">
                    {gramsCalculated} grams (24K Pure)
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-white text-xs bg-amber-600 hover:bg-amber-700 shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-4 h-4" />
                  <span>Buy {gramsCalculated}g Gold Instantly</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
