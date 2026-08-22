import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  QrCode,
  Share2,
  Copy,
  Check,
  Download,
  Sparkles,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const ReceiveQRModal: React.FC = () => {
  const { isReceiveQROpen, setIsReceiveQROpen, user, accounts, formatCurrency } = useBanking();
  const [amount, setAmount] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isReceiveQROpen) return null;

  const primaryAccount = accounts[0];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `upi://pay?pa=${user.email.split('@')[0]}@okhdfcbank&pn=${encodeURIComponent(user.name)}&am=${amount || '0'}&cu=INR`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-scrollbar">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 shadow-xl overflow-hidden my-auto max-h-[95%] text-center"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Receive & Request
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">Apex Instant UPI 2.0 QR Code</p>
              </div>
            </div>
            <button
              onClick={() => setIsReceiveQROpen(false)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* QR Code Frame */}
          <div className="my-6 flex flex-col items-center">
            <div className="p-4 bg-slate-50 rounded-3xl shadow-2xs border-2 border-slate-200 inline-block relative">
              {/* Stylized QR placeholder SVG with dynamic grid look */}
              <div className="w-48 h-48 bg-slate-900 rounded-2xl p-3 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-12 h-12 border-4 border-emerald-400 rounded-lg p-1">
                    <div className="w-full h-full bg-emerald-400 rounded-xs" />
                  </div>
                  <div className="w-12 h-12 border-4 border-cyan-400 rounded-lg p-1">
                    <div className="w-full h-full bg-cyan-400 rounded-xs" />
                  </div>
                </div>

                <div className="flex items-center justify-center my-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
                    APX
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="w-12 h-12 border-4 border-emerald-400 rounded-lg p-1">
                    <div className="w-full h-full bg-emerald-400 rounded-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-1 w-12 h-12 p-1">
                    <div className="bg-slate-200 rounded-xs" />
                    <div className="bg-slate-400 rounded-xs" />
                    <div className="bg-emerald-400 rounded-xs" />
                    <div className="bg-slate-200 rounded-xs" />
                  </div>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-bold text-slate-900 mt-4">{user.name}</h4>
            <p className="text-xs text-blue-700 font-mono font-semibold">sudhan@okhdfcbank</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Deposits into: {primaryAccount.name} ({primaryAccount.accountNumber})
            </p>
          </div>

          {/* Optional Amount Input */}
          <div className="mb-4 text-left">
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
              Request Specific Amount (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Leave blank for any amount"
                className="w-full pl-8 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-700">Copied Link</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Copy Pay Link</span>
                </>
              )}
            </button>
            <button
              onClick={() => setIsReceiveQROpen(false)}
              className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
