import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Wifi,
  Zap,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

const OPERATORS = ['Reliance Jio 5G', 'Airtel 5G Plus', 'Vodafone Idea (Vi)', 'BSNL 4G'];

const PLANS = [
  {
    amount: 299,
    validity: '28 Days',
    data: '1.5 GB/Day',
    voice: 'Unlimited Calls',
    details: '100 SMS/day + JioCinema/Airtel Xstream',
  },
  {
    amount: 749,
    validity: '84 Days',
    data: '2 GB/Day + Unlimited 5G',
    voice: 'Unlimited Calls',
    popular: true,
    details: 'True Unlimited 5G Data + 100 SMS/day',
  },
  {
    amount: 1029,
    validity: '84 Days',
    data: '2 GB/Day + Prime Video',
    voice: 'Unlimited Calls',
    details: 'Amazon Prime Lite Subscription Included',
  },
  {
    amount: 2999,
    validity: '365 Days',
    data: '2.5 GB/Day + Unlimited 5G',
    voice: 'Unlimited Calls',
    details: 'Annual Pack + True 5G data unlimited',
  },
];

export const MobileRechargeModal: React.FC = () => {
  const {
    isMobileRechargeModalOpen,
    setIsMobileRechargeModalOpen,
    rechargeMobile,
    formatCurrency,
    accounts,
  } = useBanking();

  const [mobileNumber, setMobileNumber] = useState('98401 88992');
  const [operator, setOperator] = useState('Reliance Jio 5G');
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [customAmount, setCustomAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isMobileRechargeModalOpen) return null;

  const currentAmount = customAmount ? parseFloat(customAmount) : selectedPlan.amount;

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || !currentAmount || currentAmount <= 0) return;

    const success = rechargeMobile({
      mobileNumber: mobileNumber.replace(/\s+/g, ''),
      operator,
      planDetails: customAmount
        ? `Custom Top-up ₹${customAmount}`
        : `${selectedPlan.validity} • ${selectedPlan.data}`,
      amount: currentAmount,
      sourceAccountId: accounts[0].id,
    });

    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsMobileRechargeModalOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-h-[92%] bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Prepaid Mobile Recharge</h3>
              <p className="text-[10px] text-slate-500">Instant 5G Packs & Validity Plans</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileRechargeModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {isSuccess ? (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Recharge Successful!</h4>
              <p className="text-xs text-slate-500 mt-1">
                {formatCurrency(currentAmount)} recharge applied to +91 {mobileNumber}
              </p>
              <div className="mt-3 text-[11px] font-mono bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg text-emerald-800">
                {operator} • Active Instant Benefit
              </div>
            </div>
          ) : (
            <form onSubmit={handleRecharge} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (10 Digits)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98401 88992"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold font-mono tracking-wide focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Operator & Circle
                </label>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                >
                  {OPERATORS.map((op) => (
                    <option key={op} value={op}>
                      {op} (Tamil Nadu & Chennai Circle)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">Recommended 5G Plans</label>
                  <span className="text-[10px] text-blue-600 font-bold">Unlimited 5G</span>
                </div>

                <div className="space-y-2">
                  {PLANS.map((plan) => {
                    const isSelected = selectedPlan.amount === plan.amount && !customAmount;
                    return (
                      <div
                        key={plan.amount}
                        onClick={() => {
                          setSelectedPlan(plan);
                          setCustomAmount('');
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-600/20 shadow-2xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-slate-900 font-mono">
                              ₹{plan.amount}
                            </span>
                            {plan.popular && (
                              <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-md">
                                Best Value
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-700 font-mono">
                            {plan.validity}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                          <span className="font-semibold">{plan.data}</span>
                          <span className="text-[10px] text-emerald-700 font-bold">
                            {plan.voice}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{plan.details}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Recharge ₹{currentAmount}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
