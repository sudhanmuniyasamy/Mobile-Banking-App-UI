import React, { useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Zap,
  Dumbbell,
  Wifi,
  Building2,
  Play,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Plus,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { BillItem } from '../types';

export const BillsView: React.FC = () => {
  const { bills, payBill, formatCurrency, accounts } = useBanking();
  const [payingBillId, setPayingBillId] = useState<string | null>(null);

  const totalMonthlyBills = bills.reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = bills.filter((b) => b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  const totalUpcoming = totalMonthlyBills - totalPaid;

  const handlePay = (billId: string) => {
    setPayingBillId(billId);
    setTimeout(() => {
      payBill(billId);
      setPayingBillId(null);
    }, 900);
  };

  const getIcon = (logo: string) => {
    switch (logo) {
      case 'dumbbell':
        return <Dumbbell className="w-5 h-5 text-emerald-400" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'wifi':
        return <Wifi className="w-5 h-5 text-cyan-400" />;
      case 'building-2':
        return <Building2 className="w-5 h-5 text-indigo-400" />;
      default:
        return <Play className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div id="bills-view-content" className="space-y-4 p-4 pb-8 text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Bills & Subscriptions
          </h2>
          <p className="text-xs text-slate-500 font-medium">Automated recurring bill pay & utilities</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
          {bills.length} Active
        </span>
      </div>

      {/* Monthly Scheduled Summary */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Total Monthly Recurring
          </span>
          <span className="text-xs font-bold font-mono text-blue-700">
            {bills.filter((b) => b.isAutoPay).length} on Auto-Pay
          </span>
        </div>

        <div className="text-2xl font-extrabold text-slate-900 font-mono-num">
          {formatCurrency(totalMonthlyBills)}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium mb-1">
            <span>Cleared: {formatCurrency(totalPaid)}</span>
            <span>Upcoming: {formatCurrency(totalUpcoming)}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-blue-200/60 overflow-hidden flex">
            <div
              className="bg-slate-900 h-full transition-all duration-500 rounded-full"
              style={{
                width: `${totalMonthlyBills ? (totalPaid / totalMonthlyBills) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Bill Items List */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          Upcoming Schedule
        </h3>

        {bills.map((bill) => (
          <div
            key={bill.id}
            className={`p-3.5 rounded-2xl border transition shadow-2xs ${
              bill.isPaid
                ? 'bg-slate-50/80 border-slate-200 opacity-80'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  {getIcon(bill.logo)}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{bill.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-0.5">
                    <span>{bill.category}</span>
                    <span>•</span>
                    <span className="font-mono">
                      Due{' '}
                      {new Date(bill.dueDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold font-mono-num text-slate-900">
                  {formatCurrency(bill.amount)}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">{bill.frequency}</div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 text-[11px]">
                {bill.isAutoPay ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Auto-Pay Enabled
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Manual Authorization
                  </span>
                )}
              </div>

              <div>
                {bill.isPaid ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Paid & Cleared
                  </span>
                ) : (
                  <button
                    onClick={() => handlePay(bill.id)}
                    disabled={payingBillId === bill.id}
                    className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-2xs active:scale-95 disabled:opacity-50"
                  >
                    {payingBillId === bill.id ? 'Paying...' : 'Pay Bill'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
