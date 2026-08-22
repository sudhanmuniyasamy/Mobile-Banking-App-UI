import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Repeat,
  User,
  Users,
  CheckCircle2,
  ScanFace,
  ArrowRight,
  ShieldCheck,
  Building,
  Plus,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { RecipientContact, TransactionCategory } from '../types';
import { MonogramAvatar } from './MonogramAvatar';

export const TransferModal: React.FC = () => {
  const {
    isTransferModalOpen,
    setIsTransferModalOpen,
    accounts,
    contacts,
    sendMoney,
    transferBetweenAccounts,
    formatCurrency,
  } = useBanking();

  const [mode, setMode] = useState<'contact' | 'internal'>('contact');
  const [selectedContact, setSelectedContact] = useState<RecipientContact | null>(
    contacts[0] || null
  );
  const [customRecipient, setCustomRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('500');
  const [sourceAccountId, setSourceAccountId] = useState<string>(accounts[0]?.id || '');
  const [targetAccountId, setTargetAccountId] = useState<string>(accounts[1]?.id || '');
  const [category, setCategory] = useState<TransactionCategory>('Transfer');
  const [memo, setMemo] = useState<string>('');
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string | null>(null);

  if (!isTransferModalOpen) return null;

  const quickAmounts = ['500', '1000', '2000', '5000', '10000', '25000'];

  const sourceAccount = accounts.find((a) => a.id === sourceAccountId) || accounts[0];
  const numAmount = parseFloat(amount) || 0;
  const isInsufficient = numAmount > sourceAccount.balance;

  const handleAmountChange = (val: string) => {
    setAmount(val);
    setCustomError(null);
  };

  const handleExecuteTransfer = () => {
    setCustomError(null);
    if (numAmount <= 0) {
      setCustomError('Please enter a valid transfer amount.');
      return;
    }
    if (numAmount > sourceAccount.balance) {
      setCustomError(`Insufficient funds in ${sourceAccount.name}. Available: ${formatCurrency(sourceAccount.balance)}`);
      return;
    }

    setIsAuthorizing(true);

    setTimeout(() => {
      let success = false;
      if (mode === 'contact') {
        const recipientName = selectedContact ? selectedContact.name : customRecipient.trim() || 'Direct Recipient';
        success = sendMoney({
          recipientName,
          recipientHandle: selectedContact?.handle,
          amount: numAmount,
          sourceAccountId,
          category,
          note: memo,
        });
      } else {
        if (sourceAccountId === targetAccountId) {
          setCustomError('Source and destination accounts must be different.');
          setIsAuthorizing(false);
          return;
        }
        success = transferBetweenAccounts({
          fromAccountId: sourceAccountId,
          toAccountId: targetAccountId,
          amount: numAmount,
          note: memo,
        });
      }

      setIsAuthorizing(false);
      if (success) {
        setIsTransferModalOpen(false);
        setAmount('500');
        setMemo('');
      } else {
        setCustomError('Transfer failed. Please check account balances and try again.');
      }
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-scrollbar">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 shadow-xl overflow-hidden my-auto max-h-[95%]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Transfer & Send Money
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">Instant UPI & IMPS Settlement</p>
              </div>
            </div>
            <button
              onClick={() => setIsTransferModalOpen(false)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-xl my-4">
            <button
              onClick={() => setMode('contact')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                mode === 'contact'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Send to Contact</span>
            </button>
            <button
              onClick={() => setMode('internal')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                mode === 'internal'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Between My Accounts</span>
            </button>
          </div>

          {/* Contact Mode Selectors */}
          {mode === 'contact' ? (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Select Recipient
              </span>
              <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {contacts.map((contact) => {
                  const isSelected = selectedContact?.id === contact.id;
                  return (
                    <button
                      key={contact.id}
                      onClick={() => {
                        setSelectedContact(contact);
                        setCustomRecipient('');
                      }}
                      className={`flex flex-col items-center p-2 rounded-2xl border transition min-w-[70px] ${
                        isSelected
                          ? 'bg-blue-50 border-blue-300 text-blue-900 ring-1 ring-blue-200 shadow-2xs font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <MonogramAvatar name={contact.name} size="sm" className="mb-1" />
                      <span className="text-[10px] font-bold truncate max-w-[65px]">
                        {contact.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Or manual entry */}
              <input
                type="text"
                value={customRecipient}
                onChange={(e) => {
                  setCustomRecipient(e.target.value);
                  setSelectedContact(null);
                }}
                placeholder="Search name, mobile number, or UPI ID..."
                className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
              />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Internal from/to */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    From Vault
                  </label>
                  <select
                    value={sourceAccountId}
                    onChange={(e) => setSourceAccountId(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({formatCurrency(a.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    To Vault
                  </label>
                  <select
                    value={targetAccountId}
                    onChange={(e) => setTargetAccountId(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({formatCurrency(a.balance)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Amount input */}
          <div className="my-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Transfer Amount
              </span>
              <button
                type="button"
                onClick={() => handleAmountChange(sourceAccount.balance.toString())}
                className="text-xs text-slate-500 hover:text-blue-600 transition"
              >
                Available:{' '}
                <strong className={`font-mono-num font-bold ${isInsufficient ? 'text-rose-600' : 'text-slate-900'}`}>
                  {formatCurrency(sourceAccount.balance)}
                </strong>
                <span className="ml-1 text-[10px] text-blue-600 font-bold uppercase">(Use Max)</span>
              </button>
            </div>

            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold ${isInsufficient ? 'text-rose-500' : 'text-slate-400'}`}>
                ₹
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className={`w-full pl-9 pr-4 py-3 rounded-2xl text-2xl font-extrabold font-mono-num focus:outline-none transition ${
                  isInsufficient
                    ? 'bg-rose-50/70 border-2 border-rose-400 text-rose-900 focus:bg-white focus:border-rose-500'
                    : 'bg-slate-100 border border-slate-200 text-slate-900 focus:bg-white focus:border-slate-400'
                }`}
              />
            </div>

            {/* Live Insufficient warning message */}
            {isInsufficient && (
              <div className="mt-2 p-2 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-700 font-semibold">
                <span>⚠️ Exceeds balance by {formatCurrency(numAmount - sourceAccount.balance)}</span>
                <button
                  type="button"
                  onClick={() => handleAmountChange(sourceAccount.balance.toString())}
                  className="text-[11px] underline font-bold text-rose-800 hover:text-rose-950 ml-2"
                >
                  Set to Max Available
                </button>
              </div>
            )}

            {/* Quick amount chips */}
            <div className="flex gap-1.5 mt-2 overflow-x-auto no-scrollbar">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  onClick={() => handleAmountChange(q)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition border ${
                    amount === q
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ₹{Number(q).toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Source Account (if contact mode) */}
          {mode === 'contact' && (
            <div className="mb-3">
              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Pay With Account
              </label>
              <select
                value={sourceAccountId}
                onChange={(e) => {
                  setSourceAccountId(e.target.value);
                  setCustomError(null);
                }}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} • Available: {formatCurrency(a.balance)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Note / Memo */}
          <div className="mb-4">
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Add optional note or reference memo..."
              className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
            />
          </div>

          {customError && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl mb-3 font-semibold">
              {customError}
            </p>
          )}

          {/* Action Button */}
          <button
            onClick={handleExecuteTransfer}
            disabled={isAuthorizing || isInsufficient || numAmount <= 0}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-2xs transition active:scale-[0.98] flex items-center justify-center gap-2 ${
              isInsufficient
                ? 'bg-rose-100 text-rose-700 cursor-not-allowed border border-rose-200'
                : numAmount <= 0
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isAuthorizing ? (
              <>
                <ScanFace className="w-5 h-5 animate-pulse text-white" />
                <span>Biometric Hardware Verification...</span>
              </>
            ) : isInsufficient ? (
              <span>
                Insufficient Balance ({formatCurrency(sourceAccount.balance)})
              </span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-white" />
                <span>
                  Authorize Transfer of {formatCurrency(numAmount)}
                </span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
