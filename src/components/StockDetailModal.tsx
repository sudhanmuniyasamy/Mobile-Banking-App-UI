import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { StockHolding } from '../types';

export const StockDetailModal: React.FC = () => {
  const {
    isStockModalOpen,
    setIsStockModalOpen,
    selectedStock,
    accounts,
    buyStockShares,
    sellStockShares,
    formatCurrency,
  } = useBanking();

  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [shareQty, setShareQty] = useState<number>(10);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isStockModalOpen || !selectedStock) return null;

  const totalCost = shareQty * selectedStock.currentPrice;
  const isPositive = selectedStock.dayChangePercent >= 0;
  const selectedAcc = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (shareQty <= 0) {
      setErrorMessage('Please enter a valid quantity of shares.');
      return;
    }

    if (tradeType === 'buy') {
      if (selectedAcc.balance < totalCost) {
        setErrorMessage(
          `Insufficient balance in ${selectedAcc.name}. Available: ${formatCurrency(selectedAcc.balance)}`
        );
        return;
      }

      const ok = buyStockShares({
        symbol: selectedStock.symbol,
        shares: shareQty,
        price: selectedStock.currentPrice,
        sourceAccountId: selectedAcc.id,
      });

      if (ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsStockModalOpen(false);
        }, 1800);
      } else {
        setErrorMessage('Failed to execute buy order. Please try again.');
      }
    } else {
      if (selectedStock.shares < shareQty) {
        setErrorMessage(
          `You only hold ${selectedStock.shares} shares of ${selectedStock.symbol}.`
        );
        return;
      }

      const ok = sellStockShares({
        symbol: selectedStock.symbol,
        shares: shareQty,
        price: selectedStock.currentPrice,
        targetAccountId: selectedAcc.id,
      });

      if (ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsStockModalOpen(false);
        }, 1800);
      } else {
        setErrorMessage('Failed to execute sell order. Please try again.');
      }
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center p-0 bg-black/60 backdrop-blur-xs transition-opacity overflow-hidden">
      <div
        id="stock-detail-modal"
        className="w-full bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 overflow-hidden flex flex-col max-h-[90%] animate-in slide-in-from-bottom-5 duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${selectedStock.logoColor} flex items-center justify-center text-white font-black text-xs shadow-md`}
            >
              {selectedStock.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold tracking-tight text-white">
                  {selectedStock.symbol}
                </h3>
                <span className="text-[10px] font-bold bg-white/10 text-slate-300 px-1.5 py-0.5 rounded">
                  {selectedStock.exchange}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{selectedStock.name}</p>
            </div>
          </div>

          <button
            onClick={() => setIsStockModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {isSuccess ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Order Executed Successfully!
              </h4>
              <p className="text-xs text-slate-600">
                {tradeType === 'buy' ? 'Purchased' : 'Sold'} {shareQty} shares of {selectedStock.symbol} at ₹
                {selectedStock.currentPrice.toLocaleString('en-IN')}.
              </p>
            </div>
          ) : (
            <>
              {/* Live Price & Day Change */}
              <div className="flex items-end justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Live Market Price
                  </span>
                  <div className="text-2xl font-black text-slate-900 font-mono-num">
                    ₹{selectedStock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl border ${
                    isPositive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {selectedStock.dayChangePercent}% (₹{selectedStock.dayChangeAmount})
                  </span>
                </div>
              </div>

              {/* Holdings summary if owned */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-medium">Quantity</div>
                  <div className="text-xs font-bold text-slate-900 font-mono-num mt-0.5">
                    {selectedStock.shares} Shares
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-medium">Avg Buy</div>
                  <div className="text-xs font-bold text-slate-900 font-mono-num mt-0.5">
                    ₹{selectedStock.avgBuyPrice.toFixed(1)}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-medium">Overall P&L</div>
                  <div
                    className={`text-xs font-bold font-mono-num mt-0.5 ${
                      selectedStock.totalGainPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {selectedStock.totalGainPercent >= 0 ? '+' : ''}
                    {selectedStock.totalGainPercent.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Trade Action Tabs: BUY / SELL */}
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    tradeType === 'buy'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Buy Shares
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    tradeType === 'sell'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sell Shares
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleExecuteTrade} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Quantity of Shares
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={shareQty}
                      onChange={(e) => setShareQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 font-mono-num"
                    />
                    <div className="flex gap-1">
                      {[5, 10, 25, 50].map((qty) => (
                        <button
                          key={qty}
                          type="button"
                          onClick={() => setShareQty(qty)}
                          className="px-2.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          +{qty}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    {tradeType === 'buy' ? 'Pay From Account' : 'Credit To Account'}
                  </label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({formatCurrency(acc.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Total estimate */}
                <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Order Value:</span>
                  <span className="font-bold text-sm font-mono-num">
                    ₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-bold text-white text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-1.5 ${
                    tradeType === 'buy'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    Authorize & {tradeType === 'buy' ? 'Buy' : 'Sell'} {shareQty} Shares
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
