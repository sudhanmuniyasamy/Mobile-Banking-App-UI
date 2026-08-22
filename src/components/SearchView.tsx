import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  User,
  Building,
  CalendarCheck2,
  Tag,
  TrendingUp,
  CreditCard,
  QrCode,
  Sparkles,
  ChevronRight,
  History,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { Transaction, RecipientContact, BillItem } from '../types';

export const SearchView: React.FC = () => {
  const {
    transactions,
    contacts,
    bills,
    accounts,
    formatCurrency,
    setSelectedTransaction,
    setIsTransferModalOpen,
    setIsAccountDetailsOpen,
  } = useBanking();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'transactions' | 'contacts' | 'bills' | 'accounts'
  >('all');

  const popularTags = ['Salary', 'Swiggy', 'UPI Transfer', 'Blinkit', 'SIP', 'Zomato', 'Interest'];

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions.slice(0, 6);
    const q = searchQuery.toLowerCase();
    return transactions.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.merchantName.toLowerCase().includes(q) ||
        t.merchantCategory.toLowerCase().includes(q) ||
        t.referenceCode.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [transactions, searchQuery]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts.slice(0, 4);
    const q = searchQuery.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.handle.toLowerCase().includes(q) ||
        c.bankName.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [contacts, searchQuery]);

  const filteredBills = useMemo(() => {
    if (!searchQuery.trim()) return bills;
    const q = searchQuery.toLowerCase();
    return bills.filter(
      (b) => b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
    );
  }, [bills, searchQuery]);

  const handleSelectContact = (contact: RecipientContact) => {
    setIsTransferModalOpen(true);
  };

  return (
    <div id="search-view-container" className="space-y-4 p-4 pb-20 text-slate-900 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Search className="w-5 h-5 text-blue-600" />
            <span>Search & Explore</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Search across UPI payees, transactions, bills & accounts
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          id="search-input-field"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by payee, UPI ID, merchant or ₹ amount..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-slate-200/90 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 shadow-2xs transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Suggested Quick Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('transactions')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            activeFilter === 'transactions'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Transactions ({filteredTransactions.length})
        </button>
        <button
          onClick={() => setActiveFilter('contacts')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            activeFilter === 'contacts'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          UPI Payees ({filteredContacts.length})
        </button>
        <button
          onClick={() => setActiveFilter('bills')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            activeFilter === 'bills'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Bills ({filteredBills.length})
        </button>
      </div>

      {/* Trending Search Chips */}
      {!searchQuery && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <History className="w-3 h-3" /> Recent & Popular Searches
          </span>
          <div className="flex flex-wrap gap-1.5">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200/80 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* UPI Contacts Section */}
      {(activeFilter === 'all' || activeFilter === 'contacts') && filteredContacts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              UPI Beneficiaries & Payees
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Instant Pay</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className="p-3 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200/80 transition cursor-pointer flex items-center gap-2.5 shadow-2xs group"
              >
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-blue-400 transition shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{contact.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{contact.handle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Section */}
      {(activeFilter === 'all' || activeFilter === 'transactions') && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Transactions & Receipts
            </h3>
            <span className="text-[11px] text-slate-500">Tap to inspect</span>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-semibold">No matching transactions found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try searching with a different term</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const isTransfer = tx.type === 'transfer';

                return (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTransaction(tx)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 transition cursor-pointer shadow-2xs group"
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
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <Tag className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                          {tx.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">{tx.merchantCategory}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-xs font-bold font-mono-num ${
                          isIncome ? 'text-emerald-700' : 'text-slate-900'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {tx.referenceCode.slice(-6)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
