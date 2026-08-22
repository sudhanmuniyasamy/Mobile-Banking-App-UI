import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  User,
  Phone,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Send,
  Building,
  Star,
  Clock,
  UserPlus,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { RecipientContact } from '../types';
import { MonogramAvatar } from './MonogramAvatar';

export const ContactsSearchModal: React.FC = () => {
  const {
    contacts,
    isContactsSearchOpen,
    setIsContactsSearchOpen,
    sendMoney,
    formatCurrency,
    accounts,
  } = useBanking();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'favorites' | 'recent'>('all');
  const [selectedContact, setSelectedContact] = useState<RecipientContact | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isContactsSearchOpen) return null;

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bankName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === 'favorites') return c.isFavorite;
    if (filterTab === 'recent') return Boolean(c.recentSentAmount && c.recentSentAmount > 0);
    return true;
  });

  const handleSendPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !amount || Number(amount) <= 0) return;

    const numAmount = parseFloat(amount);
    const success = sendMoney({
      recipientName: selectedContact.name,
      recipientHandle: selectedContact.handle,
      amount: numAmount,
      sourceAccountId: accounts[0].id,
      category: 'Transfer',
      note: note || `UPI Payment to ${selectedContact.name}`,
    });

    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedContact(null);
        setAmount('');
        setNote('');
        setIsContactsSearchOpen(false);
      }, 1400);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-h-[90%] bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Mobile Contacts & UPI</h3>
              <p className="text-[10px] text-slate-500">Pay directly to any saved phone number</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedContact(null);
              setIsContactsSearchOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {isSuccess ? (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Payment Sent Successfully!</h4>
              <p className="text-xs text-slate-500 mt-1">
                {formatCurrency(parseFloat(amount))} sent to {selectedContact?.name}
              </p>
            </div>
          ) : selectedContact ? (
            /* Selected Contact Payment Form */
            <form onSubmit={handleSendPayment} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MonogramAvatar name={selectedContact.name} size="md" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{selectedContact.name}</h4>
                    <p className="text-xs text-slate-500 font-mono">{selectedContact.phone}</p>
                    <span className="text-[10px] font-mono text-blue-600 font-semibold">
                      {selectedContact.handle}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedContact(null)}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    autoFocus
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="500"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-lg font-bold font-mono focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                  />
                </div>

                {/* Quick amount chips */}
                <div className="flex items-center gap-2 mt-2">
                  {[200, 500, 1000, 2500].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Add a note (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Lunch split, shopping, rent"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!amount || Number(amount) <= 0}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Pay {amount ? `₹${amount}` : 'Now'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Contacts Search List */
            <>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, phone (+91), or UPI ID..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition ${
                    filterTab === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All ({contacts.length})
                </button>
                <button
                  onClick={() => setFilterTab('favorites')}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                    filterTab === 'favorites'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>Favorites</span>
                </button>
                <button
                  onClick={() => setFilterTab('recent')}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                    filterTab === 'recent'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Recent</span>
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Saved Contacts ({filteredContacts.length})
                </p>

                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 transition cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <MonogramAvatar
                        name={contact.name}
                        size="md"
                        badge={
                          contact.isFavorite ? (
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[8px] flex items-center justify-center ring-2 ring-white">
                              ★
                            </span>
                          ) : undefined
                        }
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                            {contact.name}
                          </h4>
                          {contact.recentSentAmount && (
                            <span className="text-[9px] text-slate-400 font-mono">
                              (Last: ₹{contact.recentSentAmount})
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">{contact.phone}</p>
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                          <span className="text-blue-600 font-semibold">{contact.handle}</span>
                          <span>•</span>
                          <span>{contact.bankName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition">
                      <span>Pay</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
