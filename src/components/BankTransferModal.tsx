import React, { useState } from 'react';
import {
  X,
  Building,
  CheckCircle2,
  Send,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const BankTransferModal: React.FC = () => {
  const {
    isBankTransferOpen,
    setIsBankTransferOpen,
    bankTransferIMPS,
    formatCurrency,
    accounts,
  } = useBanking();

  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isBankTransferOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (accountNumber !== confirmAccountNumber) {
      setError('Account numbers do not match. Please verify.');
      return;
    }

    if (ifscCode.trim().length < 8) {
      setError('Please enter a valid 11-character bank IFSC code.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }

    if (numAmount > accounts[0].balance) {
      setError(`Insufficient account balance. Available: ${formatCurrency(accounts[0].balance)}`);
      return;
    }

    const success = bankTransferIMPS({
      recipientName: recipientName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      amount: numAmount,
      sourceAccountId: accounts[0].id,
      note: note.trim() || undefined,
    });

    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setRecipientName('');
        setAccountNumber('');
        setConfirmAccountNumber('');
        setIfscCode('');
        setAmount('');
        setNote('');
        setIsBankTransferOpen(false);
      }, 1600);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-h-[92%] bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Direct Bank Transfer</h3>
              <p className="text-[10px] text-slate-500">24x7 IMPS / NEFT to Any Bank Account</p>
            </div>
          </div>
          <button
            onClick={() => setIsBankTransferOpen(false)}
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
              <h4 className="text-base font-bold text-slate-900">IMPS Transfer Completed!</h4>
              <p className="text-xs text-slate-500 mt-1">
                {formatCurrency(parseFloat(amount))} sent to {recipientName}
              </p>
              <div className="mt-3 text-[11px] font-mono bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-slate-600">
                IFSC: {ifscCode.toUpperCase()} • 24x7 IMPS
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Beneficiary Full Name
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Senthil Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="30998124401"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Re-enter Account No.
                  </label>
                  <input
                    type="text"
                    required
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(e.target.value)}
                    placeholder="30998124401"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Bank IFSC Code</label>
                  <button
                    type="button"
                    onClick={() => setIfscCode('SBIN0001423')}
                    className="text-[10px] text-blue-600 font-bold hover:underline"
                  >
                    Use Sample IFSC
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SBIN0001423 / HDFC0000124"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono uppercase focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Transfer Amount (₹ INR)
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Available: <strong className="text-slate-900 font-mono-num font-bold">{formatCurrency(accounts[0].balance)}</strong>
                  </span>
                </div>
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
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError('');
                    }}
                    placeholder="10000"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base font-bold font-mono focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Remarks / Purpose
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Advance, Rent, Medical"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!recipientName || !accountNumber || !ifscCode || !amount}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Transfer {amount ? `₹${amount}` : 'via IMPS'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
