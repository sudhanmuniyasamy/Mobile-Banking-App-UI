import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
  Calendar,
  Lock,
  Zap,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { FixedDepositItem } from '../types';

export const FixedDepositModal: React.FC = () => {
  const {
    isFdModalOpen,
    setIsFdModalOpen,
    selectedFd,
    isBookFdModalOpen,
    setIsBookFdModalOpen,
    accounts,
    bookFixedDeposit,
    formatCurrency,
  } = useBanking();

  // Booking states
  const [depositAmount, setDepositAmount] = useState<number>(100000);
  const [tenureMonths, setTenureMonths] = useState<number>(15);
  const [payoutType, setPayoutType] = useState<'Cumulative' | 'Monthly' | 'Quarterly'>('Cumulative');
  const [isTaxSaver, setIsTaxSaver] = useState<boolean>(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isOpen = isFdModalOpen || isBookFdModalOpen;
  if (!isOpen) return null;

  const isBookingMode = isBookFdModalOpen || !selectedFd;

  // Rate chart based on tenure
  const getInterestRate = (months: number, taxSaver: boolean) => {
    if (taxSaver) return 7.6;
    if (months <= 6) return 6.85;
    if (months <= 12) return 7.4;
    if (months <= 15) return 8.15; // Special 444-day tenure
    if (months <= 24) return 7.9;
    return 7.5;
  };

  const currentRate = getInterestRate(tenureMonths, isTaxSaver);
  const years = tenureMonths / 12;
  const estimatedMaturity = Math.round(depositAmount * Math.pow(1 + currentRate / 400, 4 * years));
  const estimatedInterest = estimatedMaturity - depositAmount;

  const selectedAcc = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const handleBookFD = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (depositAmount < 10000) {
      setErrorMessage('Minimum Fixed Deposit booking amount is ₹10,000.');
      return;
    }

    if (selectedAcc.balance < depositAmount) {
      setErrorMessage(
        `Insufficient funds in ${selectedAcc.name}. Available: ${formatCurrency(selectedAcc.balance)}`
      );
      return;
    }

    const ok = bookFixedDeposit({
      principalAmount: depositAmount,
      tenureMonths,
      interestRate: currentRate,
      payoutType,
      sourceAccountId: selectedAcc.id,
      taxSaving: isTaxSaver,
    });

    if (ok) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsBookFdModalOpen(false);
        setIsFdModalOpen(false);
      }, 2000);
    } else {
      setErrorMessage('Unable to process deposit. Please try again.');
    }
  };

  const closeModal = () => {
    setIsFdModalOpen(false);
    setIsBookFdModalOpen(false);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center p-0 bg-black/60 backdrop-blur-xs transition-opacity overflow-hidden">
      <div
        id="fixed-deposit-modal"
        className="w-full bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 overflow-hidden flex flex-col max-h-[90%] animate-in slide-in-from-bottom-5 duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shadow-md">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">
                {isBookingMode ? 'Book High-Yield Fixed Deposit' : selectedFd?.bankName}
              </h3>
              <p className="text-xs text-amber-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> DICGC Insured up to ₹5,00,000
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {isSuccess ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Fixed Deposit Created!
              </h4>
              <p className="text-xs text-slate-600">
                Your FD for ₹{depositAmount.toLocaleString('en-IN')} @ {currentRate}% p.a. has been booked successfully.
              </p>
            </div>
          ) : isBookingMode ? (
            /* Booking Form */
            <form onSubmit={handleBookFD} className="space-y-4">
              {/* Interest Highlight Banner */}
              <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block">
                    Highest Interest Rate
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-amber-900 font-mono-num truncate">
                    {currentRate}% <span className="text-xs font-normal">p.a.</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold bg-amber-200/90 text-amber-900 px-2.5 py-1 rounded-xl shrink-0 whitespace-nowrap">
                  {tenureMonths} Months
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Deposit Amount */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Principal Deposit Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="5000"
                    min="10000"
                    value={depositAmount || ''}
                    onChange={(e) => setDepositAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-base font-extrabold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 font-mono-num"
                    placeholder="100000"
                  />
                </div>
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {[25000, 50000, 100000, 200000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`py-1.5 px-2 text-xs font-bold rounded-lg transition text-center ${
                        depositAmount === amt
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      ₹{(amt / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenure Selection */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Choose Tenure
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: '6 Months', months: 6, rate: '6.85% p.a.' },
                    { label: '15 Months', sub: '444D', months: 15, rate: '8.15% 🔥' },
                    { label: '2 Years', months: 24, rate: '7.90% p.a.' },
                    { label: '3 Years', months: 36, rate: '7.50% p.a.' },
                    { label: '5 Yr Tax Saver', sub: '80C', months: 60, rate: '7.60% p.a.' },
                  ].map((t) => (
                    <button
                      key={t.months}
                      type="button"
                      onClick={() => {
                        setTenureMonths(t.months);
                        setIsTaxSaver(t.months === 60);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition ${
                        tenureMonths === t.months
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate">{t.label}</span>
                        {t.sub && (
                          <span className={`text-[9px] px-1 py-0.2 rounded font-bold shrink-0 ${
                            tenureMonths === t.months ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {t.sub}
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-[11px] font-extrabold font-mono-num mt-1 ${
                          tenureMonths === t.months ? 'text-amber-300' : 'text-emerald-600'
                        }`}
                      >
                        {t.rate}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Account */}
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
                      {acc.name} (₹{acc.balance.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Maturity Calculation Box */}
              <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 gap-2">
                  <span className="shrink-0">Maturity Amount:</span>
                  <span className="text-sm sm:text-base font-extrabold text-white font-mono-num truncate">
                    ₹{estimatedMaturity.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 gap-2">
                  <span className="shrink-0">Interest Earned:</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono-num truncate">
                    +₹{estimatedInterest.toLocaleString('en-IN')} ({currentRate}% p.a.)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white text-xs bg-amber-600 hover:bg-amber-700 shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>Instantly Book FD @ {currentRate}% p.a.</span>
              </button>
            </form>
          ) : (
            /* Active FD Details */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-bold text-amber-900 font-mono truncate">
                    {selectedFd.fdNumber}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
                    Active & Accruing
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/80">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Maturity Value
                    </span>
                    <div className="text-lg sm:text-xl font-black text-slate-900 font-mono-num truncate mt-0.5">
                      ₹{selectedFd.maturityAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-right min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Interest Rate</span>
                    <div className="text-lg sm:text-xl font-extrabold text-amber-700 font-mono-num truncate mt-0.5">
                      {selectedFd.interestRate}% p.a.
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between py-2 gap-2">
                  <span className="text-slate-500 shrink-0">Principal Deposit:</span>
                  <strong className="text-slate-900 font-mono-num truncate">
                    ₹{selectedFd.principalAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex items-center justify-between py-2 gap-2">
                  <span className="text-slate-500 shrink-0">Accrued Interest till date:</span>
                  <strong className="text-emerald-600 font-mono-num truncate">
                    +₹{selectedFd.accruedInterest.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex items-center justify-between py-2 gap-2">
                  <span className="text-slate-500 shrink-0">Booking Date:</span>
                  <span className="font-mono text-slate-700 shrink-0">{selectedFd.startDate}</span>
                </div>
                <div className="flex items-center justify-between py-2 gap-2">
                  <span className="text-slate-500 shrink-0">Maturity Date:</span>
                  <span className="font-mono text-slate-700 font-bold shrink-0">{selectedFd.maturityDate}</span>
                </div>
                <div className="flex items-center justify-between py-2 gap-2">
                  <span className="text-slate-500 shrink-0">Payout Mode:</span>
                  <span className="text-slate-800 font-semibold shrink-0">{selectedFd.payoutType}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsFdModalOpen(false);
                  setIsBookFdModalOpen(true);
                }}
                className="w-full py-3 rounded-xl font-bold text-slate-900 text-xs bg-slate-100 hover:bg-slate-200 transition text-center"
              >
                + Book Another Fixed Deposit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
