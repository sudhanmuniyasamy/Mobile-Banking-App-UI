import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Building,
  ChevronRight,
  ShieldCheck,
  Zap,
  Phone,
  Truck,
  Smartphone,
  Receipt,
  Search,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  Layers,
  Send,
  BarChart2,
  PieChart,
  Plus,
  Coins,
  Percent,
  Sparkles,
  CreditCard,
  Wifi,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const DashboardView: React.FC = () => {
  const {
    accounts,
    cards,
    transactions,
    selectedAccountId,
    setSelectedAccountId,
    formatCurrency,
    totalNetWorth,
    setActiveTab,
    setSelectedTransaction,
    setIsTransferModalOpen,
    setIsContactsSearchOpen,
    setIsBankTransferOpen,
    setIsScanPayOpen,
    setIsFastagModalOpen,
    setIsElectricBillModalOpen,
    setIsMobileRechargeModalOpen,
    setIsBillsModalOpen,
    setIsAccountDetailsOpen,
    stocks,
    fixedDeposits,
    mutualFunds,
    digitalGold,
    setSelectedStock,
    setIsStockModalOpen,
    setSelectedFd,
    setIsFdModalOpen,
    setIsBookFdModalOpen,
    setIsGoldModalOpen,
    isPrivacyMode,
  } = useBanking();

  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [revealCardNumber, setRevealCardNumber] = useState<boolean>(false);

  // Single primary account & card
  const primaryAccount = accounts[0] || {
    id: 'acc_chk_01',
    name: 'Primary Salary & Savings A/C',
    accountNumber: '9840 1889 9214',
    routingNumber: 'APEX0001234',
    balance: 482950.50,
    currency: 'INR',
    apy: 7.25,
  };

  const primaryCard = cards[0] || {
    id: 'card_titanium_01',
    cardNumber: '4242 8824 9912 3456',
    maskedNumber: '4242 •••• •••• 3456',
    cardHolder: 'SUDHAN',
    expiry: '09/29',
    cvv: '882',
    network: 'visa',
    tier: 'black_titanium',
  };

  const recentTransactions = transactions.slice(0, 5);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Stock and FD total valuations
  const totalStockValue = stocks.reduce((sum, s) => sum + s.currentValue, 0);
  const totalStockInvested = stocks.reduce((sum, s) => sum + s.totalInvested, 0);
  const totalStockGainPercent =
    totalStockInvested > 0
      ? ((totalStockValue - totalStockInvested) / totalStockInvested) * 100
      : 0;

  const totalFdValue = fixedDeposits.reduce((sum, f) => sum + f.principalAmount, 0);

  return (
    <div id="dashboard-view-content" className="space-y-4 p-4 pb-14 text-slate-900 overflow-y-auto">
      {/* 1. SINGLE ACCOUNT & CARD HUB: Card Details, Card Number, Account Number, Balance */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white border border-slate-800 p-5 shadow-2xl">
        <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Details Bar: Card Details & Network */}
        <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-emerald-400 shadow-inner">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wider text-slate-100 uppercase">
                  Apex Titanium Visa
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 text-slate-400 rotate-90" /> Contactless Enabled
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> RBI Regulated
            </span>
          </div>
        </div>

        {/* Balance Section */}
        <div className="relative z-10 my-3.5">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Account Balance
              </span>
              <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" /> +{primaryAccount.apy || 7.25}%
              </span>
            </div>
            <button
              id="account-statement-btn"
              onClick={() => setIsAccountDetailsOpen(true)}
              className="text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 px-2.5 py-1 rounded-xl border border-slate-700/80 transition flex items-center gap-1 shrink-0 active:scale-95 shadow-xs"
            >
              <span>Statement</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          <div className="flex items-baseline">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono-num truncate">
              {isPrivacyMode ? '₹ ••••••••' : formatCurrency(primaryAccount.balance)}
            </h2>
          </div>
        </div>

        {/* Card Number & Account Number Details Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-800/80">
          {/* Card Number Container */}
          <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                Card Number
              </span>
              <span className="text-xs font-mono font-bold text-slate-100 tracking-wider">
                {revealCardNumber ? primaryCard.cardNumber : primaryCard.maskedNumber}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setRevealCardNumber(!revealCardNumber)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                title={revealCardNumber ? 'Hide' : 'Reveal'}
              >
                {revealCardNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleCopy(primaryCard.cardNumber.replace(/\s+/g, ''), 'card')}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                title="Copy Card Number"
              >
                {copiedItem === 'card' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Account Number & IFSC Container */}
          <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                Account No & IFSC
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-100">
                <span>{primaryAccount.accountNumber}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 text-[11px]">{primaryAccount.routingNumber}</span>
              </div>
            </div>
            <button
              onClick={() => handleCopy(primaryAccount.accountNumber.replace(/\s+/g, ''), 'account')}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition shrink-0"
              title="Copy Account Number"
            >
              {copiedItem === 'account' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Card Holder & Expiry Meta */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2.5 mt-2 border-t border-slate-800/50 font-mono">
          <div>
            <span className="text-slate-500 mr-1 text-[9px] uppercase">Cardholder:</span>
            <span className="font-bold text-slate-200">{primaryCard.cardHolder}</span>
          </div>
          <div>
            <span className="text-slate-500 mr-1 text-[9px] uppercase">Expires:</span>
            <span className="font-bold text-slate-200">{primaryCard.expiry}</span>
          </div>
          <div>
            <span className="text-slate-500 mr-1 text-[9px] uppercase">CVV:</span>
            <span className="font-bold text-slate-200">
              {revealCardNumber ? primaryCard.cvv : '•••'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Matrix: 1. Pay to anyone, 2. Search contacts, 3. UPI, 4. Bank transfer */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
          Instant Payments & Transfers
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {/* 1. Pay to anyone */}
          <button
            id="pay-to-anyone-btn"
            onClick={() => setIsTransferModalOpen(true)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 transition group shadow-2xs active:scale-95 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition duration-200 shadow-2xs">
              <Send className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 line-clamp-1">Pay Anyone</span>
          </button>

          {/* 2. Search option from mobile contacts */}
          <button
            id="search-contacts-btn"
            onClick={() => setIsContactsSearchOpen(true)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 transition group shadow-2xs active:scale-95 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition duration-200 shadow-2xs">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 line-clamp-1">Contacts</span>
          </button>

          {/* 3. UPI */}
          <button
            id="upi-btn"
            onClick={() => setIsScanPayOpen(true)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 transition group shadow-2xs active:scale-95 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition duration-200 shadow-2xs">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 line-clamp-1">UPI QR</span>
          </button>

          {/* 4. Bank transfer */}
          <button
            id="bank-transfer-btn"
            onClick={() => setIsBankTransferOpen(true)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 transition group shadow-2xs active:scale-95 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition duration-200 shadow-2xs">
              <Building className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 line-clamp-1">Bank A/C</span>
          </button>
        </div>
      </div>

      {/* 2. Scroll-down Section: Bills, FASTag, Electric bills, Mobile recharge */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recharge & Bill Payments
          </h3>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            BBPS Verified
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* 1. Bills */}
          <button
            id="service-bills-btn"
            onClick={() => setIsBillsModalOpen(true)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 transition group shadow-2xs active:scale-95 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition duration-200 shadow-2xs">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 line-clamp-1">Bills</span>
          </button>

          {/* 2. FASTag */}
          <button
            id="service-fastag-btn"
            onClick={() => setIsFastagModalOpen(true)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 transition group shadow-2xs active:scale-95 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-105 group-hover:bg-orange-600 group-hover:text-white transition duration-200 shadow-2xs">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 line-clamp-1">FASTag</span>
          </button>

          {/* 3. Electric bills */}
          <button
            id="service-electric-btn"
            onClick={() => setIsElectricBillModalOpen(true)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 transition group shadow-2xs active:scale-95 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition duration-200 shadow-2xs">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 line-clamp-1">Electric Bill</span>
          </button>

          {/* 4. Mobile recharge */}
          <button
            id="service-recharge-btn"
            onClick={() => setIsMobileRechargeModalOpen(true)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 transition group shadow-2xs active:scale-95 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-105 group-hover:bg-sky-600 group-hover:text-white transition duration-200 shadow-2xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 line-clamp-1">Recharge</span>
          </button>
        </div>
      </div>

      {/* 3. NEW REQUEST: STOCKS & EQUITIES PORTFOLIO */}
      <div id="stocks-section" className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <BarChart2 className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Indian Stocks & Equities (NSE/BSE)
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{totalStockGainPercent.toFixed(1)}% Overall</span>
          </div>
        </div>

        {/* Total Stock Net Worth Ribbon */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-medium text-slate-400 block">
              Demat Portfolio Value (Zerodha Linked)
            </span>
            <div className="text-lg font-black text-white font-mono-num mt-0.5">
              {formatCurrency(totalStockValue)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-medium text-slate-400 block">
              Invested: {formatCurrency(totalStockInvested)}
            </span>
            <span className="text-[11px] font-bold text-emerald-400 font-mono-num">
              +₹{(totalStockValue - totalStockInvested).toLocaleString('en-IN')} P&L
            </span>
          </div>
        </div>

        {/* Stocks Horizontal Scroll Carousel */}
        <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 pt-0.5 px-0.5 no-scrollbar">
          {stocks.map((stk) => {
            const isPos = stk.dayChangePercent >= 0;
            return (
              <div
                key={stk.id}
                onClick={() => {
                  setSelectedStock(stk);
                  setIsStockModalOpen(true);
                }}
                className="min-w-[170px] sm:min-w-[185px] p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 transition shadow-2xs cursor-pointer group flex flex-col justify-between shrink-0 snap-center active:scale-98"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${stk.logoColor} text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        {stk.symbol.slice(0, 3)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                          {stk.symbol}
                        </h4>
                        <span className="text-[9px] text-slate-400 truncate block">
                          {stk.sector}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-extrabold text-slate-900 font-mono-num mt-1">
                    ₹{stk.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div
                    className={`flex items-center gap-0.5 text-[10px] font-bold ${
                      isPos ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>
                      {isPos ? '+' : ''}
                      {stk.dayChangePercent}%
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                    {stk.shares} sh
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FIXED DEPOSITS (FD) & TERM DEPOSITS */}
      <div id="fd-section" className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Percent className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate">
              Fixed Deposits (FD)
            </h3>
          </div>
          <button
            onClick={() => {
              setSelectedFd(null);
              setIsBookFdModalOpen(true);
            }}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-xl border border-amber-200/80 transition flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book FD (8.15%)</span>
          </button>
        </div>

        {/* Active FD Cards List */}
        <div className="grid grid-cols-1 gap-2.5">
          {fixedDeposits.map((fd) => (
            <div
              key={fd.id}
              onClick={() => {
                setSelectedFd(fd);
                setIsFdModalOpen(true);
              }}
              className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 transition shadow-2xs cursor-pointer group active:scale-99"
            >
              {/* Header row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition truncate">
                    {fd.bankName}
                  </span>
                  {fd.taxSaving && (
                    <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
                      80C
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 font-mono-num shrink-0 whitespace-nowrap">
                  {fd.interestRate}% p.a.
                </span>
              </div>

              {/* Contained Numbers Matrix */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100/90">
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                    Principal
                  </span>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono-num truncate mt-0.5">
                    ₹{fd.principalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="min-w-0 text-right">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                    Maturity Value
                  </span>
                  <div className="text-xs sm:text-sm font-extrabold text-emerald-600 font-mono-num truncate mt-0.5">
                    ₹{fd.maturityAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 gap-2">
                <span className="font-mono text-slate-400 truncate">{fd.fdNumber}</span>
                <span className="font-medium text-slate-600 shrink-0">
                  Matures {new Date(fd.maturityDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Wealth Multi-Asset Quick Badges: Mutual Funds & Digital Gold */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Mutual Funds / SIP */}
        <div
          onClick={() => setActiveTab('insights')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 cursor-pointer hover:border-indigo-200 transition shadow-2xs"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <PieChart className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0">
              {mutualFunds.length} SIPs
            </span>
          </div>
          <div className="text-[10px] text-slate-600 font-medium truncate">Monthly SIPs (PPFAS & UTI)</div>
          <div className="text-sm sm:text-base font-extrabold text-indigo-950 font-mono-num mt-0.5 truncate">
            ₹25,000<span className="text-xs font-normal text-slate-500">/mo</span>
          </div>
        </div>

        {/* 24K Digital Gold */}
        <div
          onClick={() => setIsGoldModalOpen(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 cursor-pointer hover:border-amber-300 transition shadow-2xs"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
              24K 99.99%
            </span>
          </div>
          <div className="text-[10px] text-slate-600 font-medium truncate">Digital Gold Locker</div>
          <div className="text-sm sm:text-base font-extrabold text-amber-950 font-mono-num mt-0.5 truncate">
            {digitalGold.grams}g <span className="text-xs font-normal text-amber-800 font-mono-num">(₹{digitalGold.totalValue.toLocaleString('en-IN')})</span>
          </div>
        </div>
      </div>

      {/* 6. Tamil Nadu Local Transaction History */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recent Transactions
            </h3>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
          <button
            onClick={() => setActiveTab('activity')}
            className="text-[11px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-0.5"
          >
            <span>View All ({transactions.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Transactions List with Tamil Names */}
        <div className="space-y-2">
          {recentTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const isTransfer = tx.type === 'transfer';

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTransaction(tx)}
                className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 transition cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isIncome
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : isTransfer
                        ? 'bg-blue-50 border-blue-100 text-blue-600'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : isTransfer ? (
                      <Layers className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                      {tx.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span>{tx.merchantCategory}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">
                        {new Date(tx.timestamp).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-xs font-bold font-mono-num ${
                      isIncome ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium">
                    {tx.status === 'completed' ? (
                      <span className="text-emerald-600">Completed</span>
                    ) : (
                      <span className="text-amber-600">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
