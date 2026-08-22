import React, { useState } from 'react';
import {
  Send,
  ArrowUpRight,
  UserPlus,
  QrCode,
  Building,
  Sparkles,
  Search,
  CheckCircle2,
  Users,
  Repeat,
  Plus,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { RecipientContact } from '../types';
import { MonogramAvatar } from './MonogramAvatar';

export const SendMoneyView: React.FC = () => {
  const {
    contacts,
    accounts,
    formatCurrency,
    setIsTransferModalOpen,
    setIsReceiveQROpen,
    setIsScanPayOpen,
  } = useBanking();

  const [search, setSearch] = useState<string>('');

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.handle.toLowerCase().includes(search.toLowerCase()) ||
      c.bankName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="send-money-view-content" className="space-y-4 p-4 pb-8 text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Transfers & Payments
          </h2>
          <p className="text-xs text-slate-500 font-medium">Instant UPI, IMPS & Bank Transfers</p>
        </div>
        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-2xs flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Transfer</span>
        </button>
      </div>

      {/* Transfer Methods Quick Grid */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center transition group shadow-2xs"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-1.5 group-hover:scale-110 transition">
            <Send className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900">Send Money</span>
          <span className="text-[10px] text-slate-500 font-medium">UPI & IMPS</span>
        </button>

        <button
          onClick={() => setIsReceiveQROpen(true)}
          className="p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center transition group shadow-2xs"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-1.5 group-hover:scale-110 transition">
            <QrCode className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900">Request Pay</span>
          <span className="text-[10px] text-slate-500 font-medium">QR / Link</span>
        </button>

        <button
          onClick={() => setIsScanPayOpen(true)}
          className="p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center transition group shadow-2xs"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-1.5 group-hover:scale-110 transition">
            <Building className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900">Merchant QR</span>
          <span className="text-[10px] text-slate-500 font-medium">POS Scan</span>
        </button>
      </div>

      {/* Frequent Contacts */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Favorite Recipients
          </h3>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Zero Transfer Fees
          </span>
        </div>

        {/* Search Contacts */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, handle, or bank..."
            className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
          />
        </div>

        {/* Contacts List */}
        <div className="space-y-2">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setIsTransferModalOpen(true)}
              className="p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition cursor-pointer flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <MonogramAvatar
                  name={contact.name}
                  size="md"
                  badge={
                    contact.isFavorite ? (
                      <span className="w-3.5 h-3.5 bg-amber-400 rounded-full ring-2 ring-white flex items-center justify-center text-[8px] text-slate-950 font-bold">
                        ★
                      </span>
                    ) : undefined
                  }
                />

                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {contact.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                    <span className="text-slate-700 font-mono font-semibold">{contact.handle}</span>
                    <span>•</span>
                    <span>{contact.bankName}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <button className="px-3 py-1 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 text-xs font-bold transition">
                  Send
                </button>
                {contact.recentSentAmount && (
                  <span className="block text-[9px] text-slate-400 mt-1 font-mono">
                    Last: {formatCurrency(contact.recentSentAmount)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
