import React, { useState } from 'react';
import {
  X,
  Receipt,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const BillsModal: React.FC = () => {
  const {
    bills,
    isBillsModalOpen,
    setIsBillsModalOpen,
    payBill,
    formatCurrency,
  } = useBanking();

  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('all');

  if (!isBillsModalOpen) return null;

  const filteredBills = bills.filter((b) => {
    if (filter === 'unpaid') return !b.isPaid;
    if (filter === 'paid') return b.isPaid;
    return true;
  });

  const unpaidTotal = bills
    .filter((b) => !b.isPaid)
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-h-[90%] bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Utility & Bill Payments</h3>
              <p className="text-[10px] text-slate-500">BBPS Bharat BillPay Integrated</p>
            </div>
          </div>
          <button
            onClick={() => setIsBillsModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200/60">
          <div className="flex items-center gap-1.5">
            {(['all', 'unpaid', 'paid'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition capitalize ${
                  filter === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Due Total</span>
            <span className="text-xs font-bold text-slate-900 font-mono">
              {formatCurrency(unpaidTotal)}
            </span>
          </div>
        </div>

        {/* Bills List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredBills.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
              <p className="text-xs font-bold text-slate-700">All bills cleared!</p>
              <p className="text-[10px] text-slate-400">No pending payments in this view.</p>
            </div>
          ) : (
            filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      bill.isPaid
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{bill.name}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Due: {bill.dueDate}</span>
                      <span>•</span>
                      <span className="capitalize">{bill.frequency}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      {formatCurrency(bill.amount)}
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                        bill.isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {bill.isPaid ? 'PAID' : 'DUE'}
                    </span>
                  </div>

                  {!bill.isPaid && (
                    <button
                      onClick={() => payBill(bill.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs active:scale-95"
                    >
                      <span>Pay</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
