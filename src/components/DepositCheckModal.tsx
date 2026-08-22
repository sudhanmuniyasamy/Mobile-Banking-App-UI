import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  CheckCircle2,
  Scan,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const DepositCheckModal: React.FC = () => {
  const { isDepositCheckOpen, setIsDepositCheckOpen, accounts, depositCheck, formatCurrency } =
    useBanking();

  const [step, setStep] = useState<'front' | 'back' | 'review'>('front');
  const [frontCaptured, setFrontCaptured] = useState<boolean>(false);
  const [backCaptured, setBackCaptured] = useState<boolean>(false);
  const [checkAmount, setCheckAmount] = useState<string>('25000.00');
  const [targetAccount, setTargetAccount] = useState<string>(accounts[0]?.id || '');
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  if (!isDepositCheckOpen) return null;

  const handleCapture = () => {
    if (step === 'front') {
      setFrontCaptured(true);
      setTimeout(() => setStep('back'), 400);
    } else if (step === 'back') {
      setBackCaptured(true);
      setTimeout(() => setStep('review'), 400);
    }
  };

  const handleCompleteDeposit = () => {
    const num = parseFloat(checkAmount) || 0;
    if (num <= 0) return;

    setIsDepositing(true);

    setTimeout(() => {
      depositCheck({
        amount: num,
        targetAccountId: targetAccount,
        checkNumber: `${Math.floor(1000 + Math.random() * 9000)}`,
        memo: 'Remote mobile check deposit with instant AI clearance',
      });
      setIsDepositing(false);
      setIsDepositCheckOpen(false);
      // Reset
      setStep('front');
      setFrontCaptured(false);
      setBackCaptured(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-scrollbar">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 shadow-xl overflow-hidden my-auto max-h-[95%]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Mobile Check Deposit
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">Instant AI check reader & endorsement check</p>
              </div>
            </div>
            <button
              onClick={() => setIsDepositCheckOpen(false)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 my-4 text-xs font-semibold">
            <span
              className={`px-3 py-1 rounded-full border ${
                step === 'front'
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : frontCaptured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              1. Front Photo
            </span>
            <span className="text-slate-400">→</span>
            <span
              className={`px-3 py-1 rounded-full border ${
                step === 'back'
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : backCaptured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              2. Back Endorsement
            </span>
            <span className="text-slate-400">→</span>
            <span
              className={`px-3 py-1 rounded-full border ${
                step === 'review'
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              3. Credit
            </span>
          </div>

          {step !== 'review' ? (
            <div className="space-y-4">
              {/* Check Scanner Box */}
              <div className="relative w-full aspect-[2/1] rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-4 overflow-hidden">
                {/* Laser scanline */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_#f59e0b] animate-scanline" />

                <div className="w-full h-full border border-amber-500/30 rounded-xl flex flex-col items-center justify-center bg-slate-950/40 p-4 text-center">
                  <Scan className="w-8 h-8 text-amber-400 mb-1 animate-pulse" />
                  <span className="text-xs font-bold text-white">
                    {step === 'front' ? 'Align Front of Check' : 'Align Back (Signature & Endorsement)'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    {step === 'front'
                      ? 'Ensure all 4 corners and MICR numbers are visible'
                      : 'Sign and write "For Apex Mobile Deposit Only"'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCapture}
                className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition"
              >
                <Camera className="w-4 h-4" />
                <span>Capture {step === 'front' ? 'Front Side' : 'Back Side'}</span>
              </button>
            </div>
          ) : (
            /* Review & Confirm Deposit */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  OCR Verification Passed
                </span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono-num my-1">
                  ₹{Number(checkAmount).toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Detected Payee: <strong className="text-slate-900">Apex Account Holder</strong>
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Deposit Amount (₹)
                </label>
                <input
                  type="number"
                  value={checkAmount}
                  onChange={(e) => setCheckAmount(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Target Account
                </label>
                <select
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.accountNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setStep('front');
                    setFrontCaptured(false);
                    setBackCaptured(false);
                  }}
                  className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center justify-center gap-1 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>
                <button
                  onClick={handleCompleteDeposit}
                  disabled={isDepositing}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isDepositing ? 'Clearing Funds...' : 'Confirm Instant Deposit'}</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
