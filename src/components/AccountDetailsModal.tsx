import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Building,
  Copy,
  Check,
  Download,
  FileSpreadsheet,
  ShieldCheck,
  Layers,
  CreditCard,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const AccountDetailsModal: React.FC = () => {
  const { isAccountDetailsOpen, setIsAccountDetailsOpen, accounts, formatCurrency } = useBanking();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [downloadStatementSuccess, setDownloadStatementSuccess] = useState<boolean>(false);

  if (!isAccountDetailsOpen) return null;

  const currentAcc = accounts[0] || {
    id: 'acc_chk_01',
    name: 'Primary Salary & Savings A/C',
    accountNumber: '9840 1889 9214',
    routingNumber: 'APEX0001234',
    balance: 482950.50,
    currency: 'INR',
    type: 'checking',
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleDownloadStatement = () => {
    setDownloadStatementSuccess(true);
    setTimeout(() => setDownloadStatementSuccess(false), 3000);
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
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Account Details & IFSC
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">NEFT / RTGS / IMPS & UPI details</p>
              </div>
            </div>
            <button
              onClick={() => setIsAccountDetailsOpen(false)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Account Balance Summary Banner */}
          <div className="my-3.5 p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
                {currentAcc.name}
              </span>
              <span className="text-lg font-extrabold font-mono-num text-white">
                {formatCurrency(currentAcc.balance)}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-700/50">
              Active A/C
            </span>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Bank Name</span>
              <span className="font-bold text-slate-900">Apex Private Bank India</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Branch</span>
              <span className="font-bold text-slate-900">Chennai Main Branch (Adyar)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">IFSC Code (RTGS/NEFT)</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                <span>{currentAcc.routingNumber}</span>
                <button
                  onClick={() => handleCopy(currentAcc.routingNumber, 'routing')}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  {copiedItem === 'routing' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Account Number</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                <span>{currentAcc.accountNumber}</span>
                <button
                  onClick={() =>
                    handleCopy(currentAcc.accountNumber.replace(/\s+/g, ''), 'acc')
                  }
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  {copiedItem === 'acc' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">UPI VPA Handle</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                <span className="text-blue-600">sudhan@apexupi</span>
                <button
                  onClick={() => handleCopy('sudhan@apexupi', 'upi')}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  {copiedItem === 'upi' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Account Type</span>
              <span className="capitalize font-bold text-emerald-700">Resident Savings & Salary</span>
            </div>
          </div>

          {/* Download Statements */}
          <div className="mt-4 space-y-2">
            <button
              onClick={handleDownloadStatement}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-2xs"
            >
              {downloadStatementSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">eStatement PDF Ready</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download eStatement (PDF)</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
