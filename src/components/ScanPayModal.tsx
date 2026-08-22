import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ScanLine,
  Camera,
  Flashlight,
  Sparkles,
  CheckCircle2,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const ScanPayModal: React.FC = () => {
  const { isScanPayOpen, setIsScanPayOpen, sendMoney, accounts, formatCurrency } = useBanking();
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [scannedMerchant, setScannedMerchant] = useState<{
    name: string;
    amount: number;
    category: any;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isScanPayOpen) return null;

  const demoMerchants = [
    { name: 'Starbucks Reserve BKC Mumbai', amount: 520.00, category: 'Dining & Drinks' as const },
    { name: 'Nature Basket Gourmet Juhu', amount: 1450.00, category: 'Groceries' as const },
    { name: 'Bombay Canteen Lower Parel', amount: 3200.00, category: 'Dining & Drinks' as const },
  ];

  const handleSimulateScan = (merchant: typeof demoMerchants[0]) => {
    setScannedMerchant(merchant);
  };

  const handleConfirmPayment = () => {
    if (!scannedMerchant) return;
    setIsProcessing(true);

    setTimeout(() => {
      sendMoney({
        recipientName: scannedMerchant.name,
        amount: scannedMerchant.amount,
        sourceAccountId: accounts[0].id,
        category: scannedMerchant.category,
        note: 'UPI QR POS Instant Checkout',
      });
      setIsProcessing(false);
      setIsScanPayOpen(false);
      setScannedMerchant(null);
    }, 1000);
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
                <ScanLine className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Scan & Pay
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">Point at merchant QR or invoice</p>
              </div>
            </div>
            <button
              onClick={() => setIsScanPayOpen(false)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!scannedMerchant ? (
            <div className="my-4 space-y-4">
              {/* Camera Viewfinder Box */}
              <div className="relative w-full aspect-square rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center">
                {/* Laser scan line animation */}
                <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scanline" />

                {/* Viewfinder Target Corners */}
                <div className="w-48 h-48 border-2 border-dashed border-emerald-500/40 rounded-2xl flex items-center justify-center relative">
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-emerald-400" />
                  <Camera className="w-8 h-8 text-slate-700 animate-pulse" />
                </div>

                {/* Flashlight toggle */}
                <button
                  onClick={() => setTorchOn(!torchOn)}
                  className={`absolute top-3 right-3 p-2 rounded-full border transition ${
                    torchOn
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-950/70 text-slate-400 border-slate-700'
                  }`}
                  title="Toggle Flash"
                >
                  <Flashlight className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Test QR Triggers */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Simulate QR Invoices:
                </span>
                <div className="space-y-1.5">
                  {demoMerchants.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => handleSimulateScan(m)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-left transition group shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-900 group-hover:text-blue-600">
                          {m.name}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {formatCurrency(m.amount)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Scanned Confirmation Panel */
            <div className="my-6 space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Merchant Invoice Detected
                </h4>
                <div className="text-2xl font-extrabold text-slate-900 font-mono-num my-1">
                  {formatCurrency(scannedMerchant.amount)}
                </div>
                <p className="text-sm font-bold text-emerald-700">{scannedMerchant.name}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">{scannedMerchant.category}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setScannedMerchant(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200"
                >
                  Rescan
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isProcessing ? 'Authorizing...' : 'Pay Now'}</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
