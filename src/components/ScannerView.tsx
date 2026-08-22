import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  QrCode,
  ScanLine,
  Flashlight,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Building,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const ScannerView: React.FC = () => {
  const { sendMoney, accounts, formatCurrency } = useBanking();
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [customUpiId, setCustomUpiId] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('450.00');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [scannedMerchant, setScannedMerchant] = useState<{
    name: string;
    upiId: string;
    amount: number;
    category: any;
    location: string;
  } | null>(null);

  const demoQrMerchants = [
    {
      name: 'Starbucks Reserve BKC',
      upiId: 'starbucks.bkc@okhdfcbank',
      amount: 520.00,
      category: 'Dining & Drinks' as const,
      location: 'BKC, Mumbai',
    },
    {
      name: 'Nature Basket Supermarket',
      upiId: 'naturebasket@okaxis',
      amount: 1450.00,
      category: 'Groceries' as const,
      location: 'Juhu, Mumbai',
    },
    {
      name: 'Tata EV Supercharger',
      upiId: 'tataev.bandra@upi',
      amount: 380.00,
      category: 'Travel & Transport' as const,
      location: 'Bandra, Mumbai',
    },
    {
      name: 'Cult.fit Elite Studio',
      upiId: 'cultfit.pass@icici',
      amount: 1499.00,
      category: 'Healthcare' as const,
      location: 'Koramangala, Bengaluru',
    },
  ];

  const handleSimulateScan = (m: typeof demoQrMerchants[0]) => {
    setScannedMerchant(m);
    setScanSuccess(false);
  };

  const handlePayScanned = () => {
    if (!scannedMerchant) return;
    setIsProcessing(true);

    setTimeout(() => {
      sendMoney({
        recipientName: scannedMerchant.name,
        recipientHandle: scannedMerchant.upiId,
        amount: scannedMerchant.amount,
        sourceAccountId: accounts[0].id,
        category: scannedMerchant.category,
        note: `UPI QR Instant Payment at ${scannedMerchant.location}`,
      });
      setIsProcessing(false);
      setScanSuccess(true);
      setTimeout(() => {
        setScannedMerchant(null);
        setScanSuccess(false);
      }, 2000);
    }, 1000);
  };

  const handlePayCustomUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUpiId.trim()) return;
    const amt = parseFloat(customAmount) || 100;
    setIsProcessing(true);

    setTimeout(() => {
      sendMoney({
        recipientName: customUpiId.split('@')[0].toUpperCase(),
        recipientHandle: customUpiId,
        amount: amt,
        sourceAccountId: accounts[0].id,
        category: 'Transfer',
        note: 'UPI QR / ID Instant Transfer',
      });
      setIsProcessing(false);
      setCustomUpiId('');
      setScanSuccess(true);
      setTimeout(() => setScanSuccess(false), 2000);
    }, 900);
  };

  return (
    <div id="scanner-view-container" className="space-y-4 p-4 pb-20 text-slate-900 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <QrCode className="w-5 h-5 text-purple-600" />
            <span>Scan & Pay (UPI)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Scan any BharatQR / UPI QR code or pay via UPI ID
          </p>
        </div>

        <button
          onClick={() => setTorchOn(!torchOn)}
          className={`p-2 rounded-xl border transition ${
            torchOn
              ? 'bg-amber-100 border-amber-300 text-amber-800'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="Toggle Flashlight"
        >
          <Flashlight className="w-4 h-4" />
        </button>
      </div>

      {/* Main QR Viewfinder Simulated Camera Box */}
      <div className="relative w-full aspect-square max-w-xs mx-auto rounded-3xl bg-slate-950 overflow-hidden shadow-xl border-2 border-slate-800 flex flex-col items-center justify-center p-6">
        {/* Ambient Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Laser Scanner Bar Animation */}
        <div className="absolute inset-x-8 top-12 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse rounded-full" />

        {/* Viewfinder Target Brackets */}
        <div className="relative w-48 h-48 border border-white/20 rounded-2xl flex items-center justify-center p-4">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />

          {scannedMerchant ? (
            <div className="text-center text-white space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs font-bold truncate max-w-[140px]">{scannedMerchant.name}</p>
              <p className="text-[10px] text-cyan-300 font-mono-num">
                {formatCurrency(scannedMerchant.amount)}
              </p>
            </div>
          ) : (
            <div className="text-center text-slate-400 space-y-1">
              <ScanLine className="w-8 h-8 text-cyan-400/80 mx-auto animate-pulse" />
              <span className="text-[11px] text-slate-300 font-medium">Align QR in Box</span>
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            NPCI • UPI 2.0
          </span>
          <span className="text-slate-500 font-mono text-[10px]">60 FPS Camera</span>
        </div>
      </div>

      {/* Scanned Merchant Action Box or Quick Scan Pickers */}
      {scannedMerchant ? (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Merchant Verified
              </span>
              <h3 className="text-sm font-bold text-slate-900">{scannedMerchant.name}</h3>
              <p className="text-xs text-slate-500 font-mono">{scannedMerchant.upiId}</p>
            </div>
            <div className="text-right font-mono-num">
              <span className="text-[10px] text-slate-400 uppercase">Amount Due</span>
              <div className="text-lg font-bold text-slate-900">
                {formatCurrency(scannedMerchant.amount)}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setScannedMerchant(null)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePayScanned}
              disabled={isProcessing}
              className="flex-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Authorizing UPI...</span>
                </>
              ) : scanSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Payment Sent!</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Confirm & Pay {formatCurrency(scannedMerchant.amount)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Demo Instant Scan Targets */
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            Tap to Simulate QR Scan
          </span>
          <div className="grid grid-cols-2 gap-2">
            {demoQrMerchants.map((m) => (
              <button
                key={m.upiId}
                onClick={() => handleSimulateScan(m)}
                className="p-3 rounded-2xl bg-white hover:bg-purple-50/60 border border-slate-200 text-left transition shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 truncate">
                    {m.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{m.upiId}</div>
                </div>
                <div className="mt-2 text-xs font-bold font-mono-num text-slate-700">
                  {formatCurrency(m.amount)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manual UPI ID Input Option */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Or Enter UPI ID / Number
        </h3>
        <form onSubmit={handlePayCustomUpi} className="space-y-2.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={customUpiId}
              onChange={(e) => setCustomUpiId(e.target.value)}
              placeholder="e.g. priya@okhdfcbank"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="₹ Amount"
              className="w-24 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
          <button
            type="submit"
            disabled={!customUpiId.trim() || isProcessing}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
          >
            {isProcessing ? 'Verifying UPI Handle...' : 'Verify UPI & Pay'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
