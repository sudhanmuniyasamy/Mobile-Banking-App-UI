import React, { useState } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Zap,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

const FASTAG_BANKS = [
  'NHAI / IHMCL FASTag',
  'ICICI Bank FASTag',
  'HDFC Bank FASTag',
  'State Bank of India (SBI)',
  'Axis Bank FASTag',
  'Kotak Mahindra FASTag',
];

export const FastagModal: React.FC = () => {
  const {
    isFastagModalOpen,
    setIsFastagModalOpen,
    rechargeFastag,
    formatCurrency,
    accounts,
  } = useBanking();

  const [vehicleNumber, setVehicleNumber] = useState('TN-09-CB-4491');
  const [provider, setProvider] = useState('NHAI / IHMCL FASTag');
  const [amount, setAmount] = useState('1000');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isFastagModalOpen) return null;

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber || !amount || Number(amount) <= 0) return;

    const numAmount = parseFloat(amount);
    const success = rechargeFastag({
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      provider,
      amount: numAmount,
      sourceAccountId: accounts[0].id,
    });

    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsFastagModalOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-h-[90%] bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">FASTag Toll Recharge</h3>
              <p className="text-[10px] text-slate-500">NETC National Toll Plaza Instant Recharge</p>
            </div>
          </div>
          <button
            onClick={() => setIsFastagModalOpen(false)}
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
              <h4 className="text-base font-bold text-slate-900">FASTag Recharged!</h4>
              <p className="text-xs text-slate-500 mt-1">
                {formatCurrency(parseFloat(amount))} added to vehicle {vehicleNumber.toUpperCase()}
              </p>
              <div className="mt-3 text-[11px] font-mono bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg text-emerald-800">
                Toll Balance Active • Instant Plaza Sync
              </div>
            </div>
          ) : (
            <form onSubmit={handleRecharge} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vehicle Registration Number
                </label>
                <input
                  type="text"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. TN 09 CB 4491 / TN 01 AA 1234"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold font-mono tracking-wider focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  FASTag Issuing Bank / Provider
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                >
                  {FASTAG_BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recharge Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="100"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base font-bold font-mono focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                  />
                </div>

                {/* Quick denomination chips */}
                <div className="flex items-center gap-2 mt-2">
                  {[500, 1000, 2000, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition"
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <p className="text-[10px] text-amber-900 leading-tight">
                  Official NETC Bharat FASTag toll partner. Valid at all NHAI, State highways and airport parking plazas.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!vehicleNumber || !amount}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <Truck className="w-4 h-4" />
                  <span>Recharge {amount ? `₹${amount}` : 'FASTag'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
