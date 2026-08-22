import React from 'react';
import {
  Bell,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { MonogramAvatar } from './MonogramAvatar';

export const StatusBar: React.FC = () => {
  const {
    user,
    isPrivacyMode,
    togglePrivacyMode,
    notifications,
    setIsNotificationsOpen,
    lockApp,
    triggerLiveSimulatedTransaction,
    isNotificationsOpen,
  } = useBanking();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 transition-all text-slate-900 shadow-2xs">
      <div className="flex items-center justify-between gap-2">
        {/* User Info Avatar & Sudhan Profile */}
        <div className="flex items-center gap-2.5 min-w-0">
          <MonogramAvatar
            name={user.name}
            size="sm"
            badge={
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white block" />
            }
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 truncate">{user.name}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                RBI Verified
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium truncate">Apex Private Banking • UPI</p>
          </div>
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Privacy Toggle (Hide Balances) */}
          <button
            id="privacy-toggle-btn"
            onClick={togglePrivacyMode}
            className={`p-2 rounded-xl border transition ${
              isPrivacyMode
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title={isPrivacyMode ? 'Disable Privacy Mode' : 'Hide Balances (Privacy Mode)'}
            aria-label="Toggle Privacy Mode"
          >
            {isPrivacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>

          {/* Simulate Live Transaction Trigger */}
          <button
            id="trigger-live-tx-btn"
            onClick={triggerLiveSimulatedTransaction}
            className="p-1.5 px-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 active:scale-95 transition flex items-center gap-1 text-[10px] font-bold"
            title="Simulate Live UPI Transaction"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Live</span>
          </button>

          {/* Notifications Center Bell */}
          <button
            id="notifications-btn"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Quick Lock Biometric Screen */}
          <button
            id="quick-lock-btn"
            onClick={lockApp}
            className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition"
            title="Lock Banking App"
            aria-label="Lock App"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
