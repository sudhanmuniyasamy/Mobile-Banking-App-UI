import React, { useState } from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

const ELECTRICITY_BOARDS = [
  'TANGEDCO (Tamil Nadu Electricity Board)',
  'BESCOM (Bengaluru Electricity)',
  'TSSPDCL (Telangana Southern)',
  'Tata Power - Mumbai',
  'Adani Electricity Mumbai',
  'MSEDCL (Maharashtra State)',
];

export const ElectricBillModal: React.FC = () => {
  const {
    isElectricBillModalOpen,
    setIsElectricBillModalOpen,
    payElectricBill,
    formatCurrency,
    accounts,
  } = useBanking();

  const [boardName, setBoardName] = useState('TANGEDCO (Tamil Nadu Electricity Board)');
  const [consumerNumber, setConsumerNumber] = useState('04-122-008-9921');
  const [amount, setAmount] = useState('2840');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isElectricBillModalOpen) return null;

  const handlePayBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerNumber || !amount || Number(amount) <= 0) return;

    const numAmount = parseFloat(amount);
    const success = payElectricBill({
      boardName,
      consumerNumber: consumerNumber.trim(),
      amount: numAmount,
      sourceAccountId: accounts[0].id,
    });

    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsElectricBillModalOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-h-[90%] bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Electricity Bill Payment</h3>
              <p className="text-[10px] text-slate-500">Bharat BillPay (BBPS) Instant Receipt</p>
            </div>
          </div>
          <button
            onClick={() => setIsElectricBillModalOpen(false)}
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
              <h4 className="text-base font-bold text-slate-900">Electricity Bill Paid!</h4>
              <p className="text-xs text-slate-500 mt-1">
                {formatCurrency(parseFloat(amount))} paid to {boardName}
              </p>
              <div className="mt-3 text-[11px] font-mono bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg text-emerald-800">
                BBPS Ref: BBPS-EB-{Math.floor(100000 + Math.random() * 900000)} • Paid
              </div>
            </div>
          ) : (
            <form onSubmit={handlePayBill} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Electricity Board
                </label>
                <select
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                >
                  {ELECTRICITY_BOARDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Consumer Number / Service Connection No.
                </label>
                <input
                  type="text"
                  required
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  placeholder="e.g. 04-122-008-9921"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold font-mono tracking-wider focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                />
              </div>

              {/* Bill Details Summary Card */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Consumer Name:</span>
                  <span className="font-bold text-slate-800">SUDHAN</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Bill Cycle:</span>
                  <span className="font-bold text-slate-800">Bi-Monthly Domestic</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Due Date:</span>
                  <span className="font-bold text-amber-700">28 Aug 2026</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bill Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base font-bold font-mono focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <p className="text-[10px] text-blue-900 leading-tight">
                  Authorized BBPS Bharat BillPay gateway. No extra convenience charge.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!consumerNumber || !amount}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <Zap className="w-4 h-4" />
                  <span>Pay Bill {amount ? `₹${amount}` : 'Now'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
