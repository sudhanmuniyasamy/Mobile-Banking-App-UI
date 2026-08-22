import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bell,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Info,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { NotificationItem } from '../types';

export const NotificationsDrawer: React.FC = () => {
  const {
    notifications,
    isNotificationsOpen,
    setIsNotificationsOpen,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications,
    formatCurrency,
    setSelectedTransaction,
    transactions,
  } = useBanking();

  const [activeFilter, setActiveFilter] = useState<'all' | 'transaction' | 'security' | 'insight'>('all');
  const [selectedNotifId, setSelectedNotifId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isNotificationsOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);
    setSelectedNotifId((prev) => (prev === notif.id ? null : notif.id));
  };

  const handleCopyRef = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewReceipt = (notif: NotificationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNotificationsOpen(false);
    // Find matching or recent transaction
    const matchingTx = transactions.find((t) =>
      notif.message.toLowerCase().includes(t.merchantName.toLowerCase()) ||
      (notif.amount && Math.abs(t.amount - Math.abs(notif.amount)) < 1)
    ) || transactions[0];

    if (matchingTx) {
      setSelectedTransaction(matchingTx);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto"
        onClick={() => setIsNotificationsOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 text-slate-900 shadow-2xl overflow-hidden my-auto max-h-[90%] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Bell className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Notification Center
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {notifications.length > 0 && (
                <button
                  id="clear-all-notifs-btn"
                  onClick={clearAllNotifications}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition text-xs"
                  title="Clear All Notifications"
                  aria-label="Clear All"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                id="close-notifs-drawer-btn"
                onClick={() => setIsNotificationsOpen(false)}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar shrink-0">
            {(
              [
                { id: 'all', label: 'All Alerts' },
                { id: 'transaction', label: 'UPI & Txns' },
                { id: 'security', label: 'Security' },
                { id: 'insight', label: 'Insights' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications Scrollable List */}
          <div className="flex-1 overflow-y-auto pr-0.5 space-y-2.5 min-h-[220px] max-h-[440px]">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 my-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-xs font-bold text-slate-700">No alerts found</p>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  {activeFilter === 'all'
                    ? 'You have cleared all pending banking notifications.'
                    : `No notifications under ${activeFilter} category.`}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const isExpanded = selectedNotifId === notif.id;
                const refCode = `APX-NTF-${notif.id.replace('notif_', '').slice(-6)}`;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      notif.read
                        ? 'bg-slate-50/70 border-slate-200 text-slate-700'
                        : 'bg-white border-blue-200 shadow-xs ring-1 ring-blue-500/10'
                    } ${isExpanded ? 'ring-2 ring-blue-500/30' : ''}`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Icon */}
                      <div
                        className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          notif.type === 'transaction'
                            ? notif.amount && notif.amount > 0
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                            : notif.type === 'security'
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : notif.type === 'insight'
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {notif.type === 'transaction' ? (
                          notif.amount && notif.amount > 0 ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )
                        ) : notif.type === 'security' ? (
                          <ShieldCheck className="w-4 h-4" />
                        ) : notif.type === 'insight' ? (
                          <Sparkles className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {notif.title}
                            </h4>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 animate-pulse" />
                            )}
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                          {notif.message}
                        </p>

                        {/* Amount badge if present */}
                        {notif.amount !== undefined && (
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-lg inline-flex items-center gap-1 ${
                                notif.amount > 0
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-800 border border-slate-200'
                              }`}
                            >
                              {notif.amount > 0 ? '+' : ''}
                              {formatCurrency(Math.abs(notif.amount))}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              UPI 2.0 Instant
                            </span>
                          </div>
                        )}

                        {/* Expanded Interactive Tray */}
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-2.5 border-t border-slate-200 space-y-2.5"
                          >
                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl text-[11px] border border-slate-200/80">
                              <span className="text-slate-500 font-medium">
                                Reference ID
                              </span>
                              <div className="flex items-center gap-1.5 font-mono text-slate-700 font-semibold">
                                <span>{refCode}</span>
                                <button
                                  onClick={(e) => handleCopyRef(refCode, notif.id, e)}
                                  className="p-1 rounded hover:bg-slate-200 text-slate-500 transition"
                                  title="Copy Reference ID"
                                >
                                  {copiedId === notif.id ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              {notif.type === 'transaction' && (
                                <button
                                  onClick={(e) => handleViewReceipt(notif, e)}
                                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>View Receipt</span>
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notif.id);
                                }}
                                className="py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs font-semibold transition"
                              >
                                Delete
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium shrink-0">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              Click any notification to expand details
            </span>
            <span>256-bit Encrypted</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
