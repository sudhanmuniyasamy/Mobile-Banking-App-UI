import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Layers,
  Radio,
  Download,
  Calendar,
  Sparkles,
  Tag,
  SlidersHorizontal,
  ChevronDown,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { Transaction, TransactionCategory } from '../types';

export const TransactionsView: React.FC = () => {
  const {
    transactions,
    accounts,
    formatCurrency,
    setSelectedTransaction,
    isLiveSimulationActive,
    toggleLiveSimulation,
    triggerLiveSimulatedTransaction,
  } = useBanking();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const categories: (string | TransactionCategory)[] = [
    'All',
    'Salary & Income',
    'Dining & Drinks',
    'Shopping & Retail',
    'Groceries',
    'Travel & Transport',
    'Tech & Subscriptions',
    'Bills & Utilities',
    'Investments & Crypto',
    'Transfer',
  ];

  // Filtering transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(q);
        const matchesMerchant = tx.merchantName.toLowerCase().includes(q);
        const matchesNote = tx.receiptNote?.toLowerCase().includes(q);
        const matchesRef = tx.referenceCode.toLowerCase().includes(q);
        const matchesTag = tx.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesMerchant && !matchesNote && !matchesRef && !matchesTag) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && tx.merchantCategory !== selectedCategory) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }

      // Account filter
      if (accountFilter !== 'all' && tx.accountId !== accountFilter) {
        return false;
      }

      // Time filter
      if (timeRange !== 'all') {
        const txTime = new Date(tx.timestamp).getTime();
        const now = Date.now();
        if (timeRange === 'today' && now - txTime > 1000 * 60 * 60 * 24) return false;
        if (timeRange === 'week' && now - txTime > 1000 * 60 * 60 * 24 * 7) return false;
        if (timeRange === 'month' && now - txTime > 1000 * 60 * 60 * 24 * 30) return false;
      }

      return true;
    });
  }, [transactions, searchQuery, selectedCategory, typeFilter, accountFilter, timeRange]);

  // Aggregate statistics for filtered results
  const totalInflow = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div id="transactions-view-content" className="space-y-4 p-4 pb-8 text-slate-900">
      {/* Header with Live Ticker Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Transaction Activity</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
              {filteredTransactions.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Real-time ledger & instant receipts</p>
        </div>

        {/* Live Engine Controller */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={triggerLiveSimulatedTransaction}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
            title="Inject simulated live transaction"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>+ Simulate</span>
          </button>
        </div>
      </div>

      {/* Cashflow Summary Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <ArrowDownLeft className="w-3.5 h-3.5" /> Total Inflow
            </span>
          </div>
          <div className="text-lg font-extrabold text-emerald-700 font-mono-num">
            +{formatCurrency(totalInflow)}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="flex items-center gap-1 text-rose-600 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> Total Outflow
            </span>
          </div>
          <div className="text-lg font-extrabold text-slate-900 font-mono-num">
            -{formatCurrency(totalOutflow)}
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          id="transaction-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search merchant, notes, tags or ref #..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-800"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs: Inflow, Outflow, All, Transfer */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
        {(
          [
            { id: 'all', label: 'All Activity' },
            { id: 'income', label: 'Inflow (+)' },
            { id: 'expense', label: 'Outflow (-)' },
            { id: 'transfer', label: 'Transfers' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTypeFilter(tab.id)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
              typeFilter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Pills (Horizontal Scrollable) */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Secondary Filter: Account & Time Range */}
      <div className="flex items-center gap-2 text-xs">
        {/* Account Dropdown */}
        <select
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
          className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
        >
          <option value="all">All Vault Accounts</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.accountNumber})
            </option>
          ))}
        </select>

        {/* Time range */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:bg-white focus:border-slate-400 ml-auto font-medium"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Past 7 Days</option>
          <option value="month">Past 30 Days</option>
        </select>
      </div>

      {/* Live Transaction Ledger List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No transactions match filters</p>
            <p className="text-[11px] text-slate-500 mt-1">Try resetting the search keyword or category.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setTypeFilter('all');
                setAccountFilter('all');
                setTimeRange('all');
              }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-slate-900 text-xs text-white font-bold hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const isTransfer = tx.type === 'transfer';
            const isDisputed = tx.isDisputed;

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTransaction(tx)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer group shadow-2xs ${
                  isDisputed
                    ? 'bg-rose-50/60 border-rose-200'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      isDisputed
                        ? 'bg-rose-100 border-rose-200 text-rose-600'
                        : isIncome
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : isTransfer
                        ? 'bg-blue-50 border-blue-100 text-blue-600'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : isTransfer ? (
                      <Layers className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                        {tx.title}
                      </h4>
                      {isDisputed && (
                        <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
                          FLAGGED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-medium">
                      <span>{tx.merchantCategory}</span>
                      <span>•</span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {new Date(tx.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {tx.receiptNote && (
                      <p className="text-[10px] text-slate-500 truncate italic mt-0.5">
                        "{tx.receiptNote}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-extrabold font-mono-num ${
                      isIncome ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount, tx.currency)}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 font-medium">
                    {tx.referenceCode}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
